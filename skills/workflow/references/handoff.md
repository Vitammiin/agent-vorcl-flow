# Bounded handoff and verification

Read this reference when delegating a non-trivial implementation or checking its result. Use the host's current session and available tools. Do not install an agent runtime or tracker to use this format.

## Orchestrator → Executor

- **Outcome:** the requested behavior or artifact and why it matters.
- **Scope:** owned files or subsystem, allowed mutations, exclusions, concurrent owners.
- **Acceptance:** a short list of observable outcomes. Local labels such as AC1 are convenient references, never invented Task Master IDs.
- **Verification:** command, scenario, inspection or artifact that can establish each outcome; expected behavior and relevant failure case.
- **Context:** relevant source paths, existing conventions and non-obvious constraints. Read actual source before assuming the handoff is current.
- **Description:** whether `PROJECT_DESCRIPTION.md` exists and which statements may need an impact check.

Load the selected role and directly relevant task/domain references. The Executor does not reopen broad discovery or create a new orchestration cycle unless the assigned scope requires it. Report a genuine boundary conflict to the Orchestrator; continue independent authorized work.

## Executor → Checker

Provide changed paths, acceptance labels, performed checks with commands and results, and remaining uncertainties. State skipped checks and why. Include the description-impact result. Do not describe a test as passing if it was not run, did not finish, or ran against a different revision.

## Independent Checker

The Checker reads the actual change and relevant source, with the Executor's report treated as claims to verify. It does not modify implementation or acceptance tests.

1. **Requirement pass:** compare the result against every acceptance criterion. Look for missing or partial behavior, contradictions, and unrelated additions. Follow relevant execution paths before accepting the author's explanation.
2. **Quality pass:** assess failure handling, preservation of user data/configuration, compatibility, and meaningful regression coverage for the affected scope. Run the agreed `testStrategy`; reuse trustworthy same-revision results where appropriate, and state their provenance.
3. **Evidence:** return a compact table when it helps:

   | Criterion | Evidence | Result | Limitation |
   | --- | --- | --- | --- |
   | AC1: expected behavior | Actual command/scenario and observed result | PASS / FAIL / NOT_RUN | Missing environment/access, if any |

Do not equate a skipped test with success. A discovered blocker is a finding with evidence, not permission to change unrelated configuration. If no independent context is available, label the work as self-reviewed and disclose the limitation.

## Orchestrator decision

Only the Orchestrator accepts completion. Required criteria with FAIL or missing required evidence remain incomplete. Use `ГОТОВО` / `НЕ ГОТОВО` for the overall verdict and explain the remaining blocker. Do not invent success to satisfy a status format.

Keep this proportional: a short in-session checklist is sufficient for a small change. No mandatory document tree, per-task commit, extra approval, tracker write, or repeated full-suite run is implied by this template. Persist a report or task state only within the user's authorized scope.
