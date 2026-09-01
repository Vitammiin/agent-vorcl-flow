const RETRYABLE = new Set([429, 500, 502, 503, 504])

function withTimeout(signal, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(new Error('Provider run timed out')), timeoutMs)
  timer.unref?.()
  if (signal) {
    if (signal.aborted) controller.abort(signal.reason)
    else signal.addEventListener('abort', () => controller.abort(signal.reason), { once: true })
  }
  return controller.signal
}

const sleep = (ms, signal) => new Promise((resolve, reject) => {
  const timer = setTimeout(resolve, ms)
  signal?.addEventListener('abort', () => { clearTimeout(timer); reject(new Error('Provider run cancelled')) }, { once: true })
})

async function requestJson(url, init, { retries = 2, signal } = {}) {
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(url, { ...init, signal })
    if (response.ok) return response.json()
    const body = await response.text()
    if (attempt >= retries || !RETRYABLE.has(response.status)) throw new Error(`Provider HTTP ${response.status}: ${body.slice(0, 500)}`)
    await sleep(250 * 2 ** attempt + Math.floor(Math.random() * 100), signal)
  }
}

export function normalizeOpenAIEvent(event) {
  if (event.type === 'response.output_text.delta') return { type: 'text.delta', data: { delta: event.delta ?? '' } }
  if (event.type === 'response.reasoning_text.delta') return { type: 'reasoning.delta', data: { delta: event.delta ?? '' } }
  if (event.type === 'response.function_call_arguments.done') return { type: 'tool.requested', data: { callId: event.item_id, name: event.name, arguments: event.arguments } }
  if (event.type === 'response.completed') return { type: 'run.completed', data: { responseId: event.response?.id } }
  if (event.type === 'error' || event.type === 'response.failed') return { type: 'run.failed', data: { error: event.error?.message ?? 'Provider failed' } }
  return null
}

export function normalizeAnthropicEvent(event) {
  if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') return { type: 'text.delta', data: { delta: event.delta.text } }
  if (event.type === 'content_block_delta' && event.delta?.type === 'thinking_delta') return { type: 'reasoning.delta', data: { delta: event.delta.thinking } }
  if (event.type === 'content_block_start' && event.content_block?.type === 'tool_use') return { type: 'tool.requested', data: { callId: event.content_block.id, name: event.content_block.name } }
  if (event.type === 'message_stop') return { type: 'run.completed', data: {} }
  if (event.type === 'error') return { type: 'run.failed', data: { error: event.error?.message ?? 'Provider failed' } }
  return null
}

export class OpenAIResponsesAdapter {
  constructor({ apiKey = process.env.OPENAI_API_KEY, model = process.env.AVF_OPENAI_MODEL || 'gpt-5.1' } = {}) { this.apiKey = apiKey; this.model = model }
  async complete({ input, tools = [], previousResponseId, signal }) {
    if (!this.apiKey) throw new Error('OPENAI_API_KEY is required')
    return requestJson('https://api.openai.com/v1/responses', {
      method: 'POST', headers: { authorization: `Bearer ${this.apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({ model: this.model, input, tools, previous_response_id: previousResponseId }),
    }, { signal })
  }
  toolCalls(response) { return (response.output ?? []).filter((item) => item.type === 'function_call').map((item) => ({ callId: item.call_id, name: item.name, arguments: JSON.parse(item.arguments || '{}') })) }
}

export class AnthropicMessagesAdapter {
  constructor({ apiKey = process.env.ANTHROPIC_API_KEY, model = process.env.AVF_ANTHROPIC_MODEL || 'claude-sonnet-4-5' } = {}) { this.apiKey = apiKey; this.model = model }
  async complete({ messages, tools = [], signal }) {
    if (!this.apiKey) throw new Error('ANTHROPIC_API_KEY is required')
    return requestJson('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'x-api-key': this.apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: this.model, max_tokens: 8192, messages, tools }),
    }, { signal })
  }
  toolCalls(response) { return (response.content ?? []).filter((item) => item.type === 'tool_use').map((item) => ({ callId: item.id, name: item.name, arguments: item.input ?? {} })) }
}

export class ExternalClientAdapter {
  createEnvelope(envelope) { return { mode: 'external', envelope, instructions: 'Execute only the allowlisted tasks and return ToolReceipt@1 records.' } }
}

export class AutonomousRunner {
  constructor({ maxToolSteps = 64, timeoutMs = 60 * 60 * 1000 } = {}) { this.maxToolSteps = maxToolSteps; this.timeoutMs = timeoutMs }
  async runOpenAI(adapter, { goal, tools, executeTool, signal }) {
    const combined = withTimeout(signal, this.timeoutMs)
    let input = goal, previousResponseId
    for (let step = 0; step < this.maxToolSteps; step++) {
      const response = await adapter.complete({ input, tools, previousResponseId, signal: combined })
      const calls = adapter.toolCalls(response)
      if (!calls.length) return response
      input = []
      for (const call of calls) input.push({ type: 'function_call_output', call_id: call.callId, output: JSON.stringify(await executeTool(call)) })
      previousResponseId = response.id
    }
    throw new Error(`Autonomous run exceeded ${this.maxToolSteps} tool steps`)
  }
  async runAnthropic(adapter, { goal, tools, executeTool, signal }) {
    const combined = withTimeout(signal, this.timeoutMs)
    const messages = [{ role: 'user', content: goal }]
    for (let step = 0; step < this.maxToolSteps; step++) {
      const response = await adapter.complete({ messages, tools, signal: combined })
      const calls = adapter.toolCalls(response)
      messages.push({ role: 'assistant', content: response.content ?? [] })
      if (!calls.length) return response
      messages.push({ role: 'user', content: await Promise.all(calls.map(async (call) => ({ type: 'tool_result', tool_use_id: call.callId, content: JSON.stringify(await executeTool(call)) }))) })
    }
    throw new Error(`Autonomous run exceeded ${this.maxToolSteps} tool steps`)
  }
}
