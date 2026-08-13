# Principal architecture methodology

## Required lenses

Inspect client, edge, application, domain modules, data, asynchronous processing, AI, integrations, platform/deployment, security, observability, reliability, scaling, disaster recovery and delivery lifecycle. For every component establish responsibility, boundary, dependency, flow, state ownership, failure behavior and operational owner when evidence permits.

## Design discipline

- Prefer simple evolvable architecture over premature distribution.
- Define boundaries by domain capability, invariants, data ownership, scaling profile, SLA/security boundary and team ownership—not global technical folders.
- Distinguish CURRENT evidence, review findings, TARGET assumptions and MIGRATION phases.
- For significant technology choices evaluate purpose, current need, scale benefit, complexity, operations, cost, migration and lock-in.
- Create ADR-ready decisions with context, alternatives, consequences, migration and rollback.

## Data and consistency

Identify system-of-record candidates and flag ambiguous ownership. PostgreSQL suits relational/transactional domains; document stores suit heterogeneous evolving documents; Redis suits ephemeral coordination/cache; object storage suits files; vector storage only serves semantic retrieval. Do not introduce another store without a concrete workload.

For critical writes inspect transactions, constraints, idempotency, optimistic locking, isolation, outbox and reconciliation. Never imply `commit then publish` is reliable without a failure strategy. Treat async delivery as at-least-once and require idempotent consumers, retry/backoff and DLQ.

Use CQRS and Event Sourcing only where distinct read/write models or temporal reconstruction produce concrete value.

## AI systems

Separate agent runtime, context builder, model router/LLM, memory classes, RAG retriever/reranker, tools, MCP clients/servers/resources, skills, policies, planning/execution and observability. MCP is an access layer, not memory or reasoning. For multi-agent systems require a coordinator, task/result contracts, scoped permissions, handoff, timeout/retry and conflict resolution. Dangerous tools require policy and human approval.

## Platform, security and operations

Inspect DNS/CDN/WAF/TLS/gateway boundaries without assigning business logic to the gateway. Inspect CI lint/typecheck/tests/security/build, artifact registry, CD, migrations, staging/production, rollback, flags/canary/blue-green and IaC.

Check authn/authz, RBAC/ABAC, tenant isolation, secrets, TLS/encryption, network segmentation, service identity, audit, least privilege and rotation. AI adds prompt injection, exfiltration, sandbox, tool permissions and approval gates.

Observability requires logs, metrics, traces, events, alerts and dashboards with correlation IDs and OpenTelemetry-compatible propagation. Reliability review includes timeouts, retry policy, circuit breakers, duplicates, partial failures, stale cache, dependency/broker/database outage, corrupt jobs, graceful shutdown, health checks, backups, tested restore, RPO and RTO.

## Diagram set

Use C4-like L0 context, L1 system/container, L2 domain/component, L3 critical sequence/data flow and L4 physical deployment only when justified by repository size and evidence. Do not mix abstraction levels or draw meaningless arrows. Every connection has direction and an interaction kind; use a legend when multiple line semantics exist.
