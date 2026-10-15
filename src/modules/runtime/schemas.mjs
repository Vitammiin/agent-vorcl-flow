import { z } from 'zod/v4'

export const actionClasses = ['read', 'workspace_write', 'destructive', 'external', 'publish', 'costly']
export const executionModes = ['external', 'autonomous']
export const operations = ['search', 'read', 'apply_patch']

export const ExecutionEnvelopeSchema = z.object({
  schemaVersion: z.literal(1),
  runId: z.string().min(1),
  sessionId: z.string().min(1),
  workspaceId: z.string().min(1),
  goal: z.string().min(1),
  ownerRole: z.string().min(1),
  supportingSkills: z.array(z.string()),
  checkerRole: z.string().min(1).default('testing'),
  taskIds: z.array(z.string()).min(1).refine((items) => new Set(items).size === items.length, 'taskIds must be unique'),
  mode: z.enum(executionModes),
  constraints: z.record(z.string(), z.unknown()).default({}),
})

export const ActionRequestSchema = z.object({
  actionId: z.string().min(1),
  runId: z.string().min(1),
  sessionId: z.string().min(1),
  actionClass: z.enum(actionClasses),
  operation: z.enum(operations),
  description: z.string().min(1),
  targets: z.array(z.string()).min(1),
  digest: z.string().length(64),
  reversible: z.boolean(),
  status: z.enum(['pending', 'approved', 'rejected', 'consumed', 'expired']),
  expiresAt: z.string().datetime(),
})

export const ToolReceiptSchema = z.object({
  schemaVersion: z.literal(1),
  receiptId: z.string().min(1),
  runId: z.string().min(1),
  taskId: z.string().optional(),
  tool: z.string().min(1),
  actionId: z.string().optional(),
  status: z.enum(['success', 'noop', 'failed', 'cancelled']),
  changedPaths: z.array(z.string()).default([]),
  externalMutations: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  error: z.string().optional(),
  recoveryHint: z.string().optional(),
  checkerVerdict: z.enum(['READY', 'NOT READY']).optional(),
  startedAt: z.string().datetime(),
  finishedAt: z.string().datetime(),
})

export const JobSchema = z.object({
  jobId: z.string().min(1),
  runId: z.string().min(1),
  kind: z.string().min(1),
  status: z.enum(['queued', 'running', 'waiting_approval', 'succeeded', 'failed', 'cancelled']),
  progress: z.number().min(0).max(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  terminalReceiptId: z.string().optional(),
  error: z.string().optional(),
})

export const RuntimeEventSchema = z.object({
  eventId: z.string().min(1),
  sequence: z.number().int().positive(),
  type: z.enum(['run.started', 'reasoning.delta', 'text.delta', 'tool.requested', 'tool.completed', 'approval.required', 'job.progress', 'run.completed', 'run.failed', 'run.cancelled']),
  runId: z.string().min(1),
  sessionId: z.string().optional(),
  timestamp: z.string().datetime(),
  data: z.record(z.string(), z.unknown()).default({}),
})

export const bindWorkspaceInput = { workspace: z.string().min(1), clientName: z.string().min(1).default('unknown') }
export const routeGoalInput = { goal: z.string().min(1) }
export const createRunInput = {
  goal: z.string().min(1), taskIds: z.array(z.string()).min(1), mode: z.enum(executionModes).default('external'), constraints: z.record(z.string(), z.unknown()).default({}),
}
export const runIdInput = { runId: z.string().min(1) }
export const taskClaimInput = { runId: z.string().min(1), taskId: z.string().min(1), leaseSeconds: z.number().int().min(30).max(3600).default(3600) }
export const completeTaskInput = { runId: z.string().min(1), taskId: z.string().min(1), checkerReceiptId: z.string().min(1) }
export const requestActionInput = {
  runId: z.string().min(1), actionClass: z.enum(actionClasses), operation: z.enum(operations), description: z.string().min(1), targets: z.array(z.string()).min(1), reversible: z.boolean().default(false), payload: z.record(z.string(), z.unknown()).default({}),
}
export const approveActionInput = { actionId: z.string().min(1), digest: z.string().length(64), approve: z.boolean() }
export const executeActionInput = { actionId: z.string().min(1), digest: z.string().length(64), operation: z.enum(operations), payload: z.record(z.string(), z.unknown()) }
export const receiptInput = { receipt: ToolReceiptSchema }
export const eventsInput = { runId: z.string().min(1), afterSequence: z.number().int().min(0).default(0) }
export const skillIdInput = { skillId: z.string().regex(/^[a-z0-9][a-z0-9-]*$/) }
export const autonomousStartInput = { runId: z.string().min(1), provider: z.enum(['openai', 'anthropic']), instructions: z.string().min(1).max(20_000) }
