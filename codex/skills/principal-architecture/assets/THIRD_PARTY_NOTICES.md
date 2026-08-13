# Third-party notices

## Diagram rendering design sources

The renderer implementation in this skill remains purpose-built for the evidence model. The following upstream projects informed or were adapted into its visual and validation rules:

| Project | Revision reviewed | License | Adapted concepts |
| --- | --- | --- | --- |
| [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) | `f3622cf66a3c557cb2ead57b687a3c1ff63f5a2b` | MIT | Editorial hierarchy, adaptive complexity budgets, zones, semantic connector styling, accessibility checks |
| [DayuanJiang/next-ai-draw-io](https://github.com/DayuanJiang/next-ai-draw-io) | `96bca2b37b7c02e03e33343ace7f1af3cdf355d9` | Apache-2.0 | Multi-page draw.io rules, page-scoped IDs, dangling/nested cell validation, structural edit safety concepts |

The corresponding license texts are preserved in `assets/licenses/diagram-design-MIT.txt` and `assets/licenses/next-ai-draw-io-Apache-2.0.txt`. Modified renderer and validator files carry comments identifying the adaptation.

## Parser runtime

The bundled parser runtime is used offline and never executes code from the analyzed repository. All packages below are distributed under the MIT license; license texts are preserved in `assets/licenses/`.

| Component | Version | Bundled artifact |
| --- | --- | --- |
| web-tree-sitter | 0.26.12 | `web-tree-sitter.mjs`, `web-tree-sitter.wasm` |
| tree-sitter-javascript | 0.23.1 | `tree-sitter-javascript.wasm` |
| tree-sitter-typescript | 0.23.2 | TypeScript and TSX WASM |
| tree-sitter-python | 0.25.0 | Python WASM |
| tree-sitter-go | 0.25.0 | Go WASM |
| tree-sitter-java | 0.23.5 | Java WASM |
| tree-sitter-c-sharp | 0.23.5 | C# WASM |
| tree-sitter-rust | 0.24.0 | Rust WASM |
| tree-sitter-php | 0.24.2 | PHP WASM |
| tree-sitter-ruby | 0.23.1 | Ruby WASM |
| tree-sitter-kotlin | 0.3.8 | Kotlin WASM built with tree-sitter CLI 0.26.6 |
| tree-sitter-swift | 0.7.1 | Swift WASM built with tree-sitter CLI 0.26.6 |

## SHA-256

```text
6f69e1cae44e1c32c1eccc170dc5a9778fb94ff716f71113fe1f8c4299aa2f40  tree-sitter-c_sharp.wasm
9504573f352b20be7f2f1911754d710622aedc15afff16d5ed8fb5645681aee7  tree-sitter-go.wasm
4fdeac4ca6ca089f06c6f7e562abcac1733cd465728cc7031ebb73c2019122c4  tree-sitter-java.wasm
4a378293fe7853cbee2836023be072dafa0e53b3b5edb245920838ca834ed121  tree-sitter-javascript.wasm
e08447e36ad5d86f39f91f13defce0636aea1490b8d65dafde6fa72649422061  tree-sitter-kotlin.wasm
d4df6a6ff08c87c3ec4f9cbb785fe09998a0cb570e03f57d7b19b3acfb146aa7  tree-sitter-php.wasm
16108b50df4ee9a30168794252ab55e7c93bfc5765d7fa0aa3e335752c515f47  tree-sitter-python.wasm
09a96427d7c72f0613ed470cd9812223fc4a91d6a9c025c0235cc6bd59ff96f4  tree-sitter-ruby.wasm
f65f354215611fd94ad34134b3427eb3d58cbb745df7b6509ba722184db73d57  tree-sitter-rust.wasm
be600469cbb9932a1fc37dd4155b9100555d0949a9c067b4abe5d11fe846d32e  tree-sitter-swift.wasm
79e5da75ea62855a0cd67177685f0164eac87d5f630b3cbe1e0a099751ad30f8  tree-sitter-tsx.wasm
778025db5a8be0e70f8ccc3671e486dfeddd048c25d9e8a70c26de2e1bf6f97d  tree-sitter-typescript.wasm
0c868236a47296b4ff3c1570f20e0899e4a784ff6e5cd7bfc9c3a55225463e4a  web-tree-sitter.mjs
ba5c7a539603f251f380e4d6ce26ee954ffca7bda8b2e13744dc4c87d6ce6041  web-tree-sitter.wasm
```
