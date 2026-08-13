# Evidence model

## Source hierarchy

1. Executable source AST: highest confidence.
2. Database schemas, API specs, manifests, CI/CD and IaC parsers: high confidence for declared resources.
3. Deterministic lexical match in source/config: medium confidence.
4. Human annotation or prose: unverified; never CURRENT topology.

Every node and edge has a stable ID and at least one repository-relative `file:line` source. Validation rejects missing files, invalid lines, duplicate IDs, and dangling edges. The model never stores environment values, credentials, DSNs, tokens, or source snippets.

## Model sections

- `repository`, `evidencePolicy`, `parsers`, `files`
- `nodes`: module, type, function, route, data-store, event, environment, technology, external-dependency
- `edges`: contains, imports, defines, uses, reads-env, publishes
- `cycles`, `findings`, `stats`, `modelHash`

The model hash excludes timestamps and is reproducible for unchanged inputs. Rendering must not add nodes or edges.

## Update safety

Full rescan is authoritative. Generate in a staging directory, validate, then replace only manifest-owned paths. Preserve unmanaged files. Human notes remain in `architecture.annotations.json`; proposals do not become facts without code evidence.
