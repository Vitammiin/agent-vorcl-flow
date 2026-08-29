#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(root, rel));
const list = (rel, suffix) => fs.readdirSync(path.join(root, rel)).filter((x) => x.endsWith(suffix)).map((x) => x.slice(0, -suffix.length)).sort();
const registry = JSON.parse(read("scripts/roles.json"));
const errors = [];
const ids = registry.roles.map((role) => role.id);
const unique = new Set(ids);

const plugin = JSON.parse(read(".codex-plugin/plugin.json"));
const pluginKeys = new Set(["id", "name", "version", "description", "skills", "apps", "mcpServers", "interface", "author", "homepage", "repository", "license", "keywords"]);
for (const key of Object.keys(plugin)) if (!pluginKeys.has(key)) errors.push(`unsupported .codex-plugin/plugin.json field: ${key}`);
for (const key of ["name", "version", "description"]) if (typeof plugin[key] !== "string" || !plugin[key].trim()) errors.push(`.codex-plugin/plugin.json missing ${key}`);
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(plugin.version || "")) errors.push(".codex-plugin/plugin.json version is not semver");
if ((plugin.skills || "").replace(/^\.\//, "").replace(/\/$/, "") !== "skills") errors.push(".codex-plugin/plugin.json skills must resolve to skills/");
if (!plugin.interface || typeof plugin.interface !== "object" || Array.isArray(plugin.interface)) errors.push(".codex-plugin/plugin.json interface must be an object");
else {
  for (const key of ["displayName", "shortDescription", "longDescription", "developerName", "category"]) if (typeof plugin.interface[key] !== "string" || !plugin.interface[key].trim()) errors.push(`plugin interface missing ${key}`);
  if (!Array.isArray(plugin.interface.capabilities) || !plugin.interface.capabilities.every((value) => typeof value === "string" && value.trim())) errors.push("plugin interface capabilities must be strings");
  if (plugin.interface.defaultPrompt == null && plugin.interface.default_prompt == null) errors.push("plugin interface defaultPrompt is required");
}

if (registry.schemaVersion !== 1) errors.push("unsupported roles registry schema");
if (unique.size !== ids.length) errors.push("duplicate role id in scripts/roles.json");
if (JSON.stringify([...ids].sort()) !== JSON.stringify(list("agents", ".md"))) {
  errors.push("scripts/roles.json roles do not exactly match agents/*.md");
}

const config = read("codex/config.toml");
const claudeRouter = read("commands/vorcl.md");
const codexRouter = read("codex/skills/vorcl/SKILL.md");
for (const role of registry.roles) {
  for (const key of ["route", "owns", "notFor"]) {
    if (typeof role[key] !== "string" || !role[key].trim()) errors.push(`${role.id}: missing ${key}`);
  }
  const required = [
    `agents/${role.id}.md`,
    `skills/${role.id}/SKILL.md`,
    `codex/skills/${role.id}/SKILL.md`,
    `commands/${role.id}`,
    `commands/${role.id}/vorcl.md`,
    `codex/skills/${role.id}-vorcl/SKILL.md`,
  ];
  for (const rel of required) if (!exists(rel)) errors.push(`${role.id}: missing ${rel}`);
  const agentSource = read(`agents/${role.id}.md`);
  const attachedSkills = (agentSource.match(/^skills:\s*\[([^\]]*)\]\s*$/m)?.[1] ?? '').split(',').map((value) => value.trim()).filter(Boolean);
  for (const skill of attachedSkills) if (!exists(`skills/${skill}/SKILL.md`)) errors.push(`${role.id}: attached skill does not exist: ${skill}`);
  if (!config.includes(`[profiles.${role.id}]`)) errors.push(`${role.id}: missing Codex profile`);
  if (!claudeRouter.includes(`\`${role.id}\``)) errors.push(`${role.id}: missing commands/vorcl.md route`);
  if (!codexRouter.includes(`\`$${role.id}\``)) errors.push(`${role.id}: missing Codex vorcl route`);
}

for (const base of ["skills", "codex/skills"]) {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".md")) files.push(full);
    }
  };
  walk(path.join(root, base));
  for (const file of files) {
    if (!file.endsWith("SKILL.md")) continue;
    const source = fs.readFileSync(file, "utf8");
    if (!source.startsWith("---\n")) continue;
    const end = source.indexOf("\n---", 4);
    if (end < 0) { errors.push(`${path.relative(root, file)}: unterminated frontmatter`); continue; }
    const meta = Object.create(null);
    for (const [index, line] of source.slice(4, end).split("\n").entries()) {
      if (!line.trim() || /^\s/.test(line)) continue;
      const match = line.match(/^([A-Za-z][\w-]*):(?:\s+(.*))?$/);
      if (!match) { errors.push(`${path.relative(root, file)}:${index + 2}: invalid frontmatter line`); continue; }
      const value = match[2] ?? "";
      if (value === ">" || value === ">-" || value === "|" || value === "|-") {
        meta[match[1]] = value;
      } else if (value.startsWith('"')) {
        try { meta[match[1]] = JSON.parse(value); } catch { errors.push(`${path.relative(root, file)}:${index + 2}: invalid quoted scalar`); }
      } else {
        if (/[:]\s/.test(value) || /[<>]/.test(value)) errors.push(`${path.relative(root, file)}:${index + 2}: unsafe plain scalar; quote it`);
        meta[match[1]] = value;
      }
    }
    if (!meta.name) errors.push(`${path.relative(root, file)}: missing frontmatter name`);
    if (!meta.description) errors.push(`${path.relative(root, file)}: missing frontmatter description`);
  }
}

if (errors.length) {
  for (const error of errors) process.stderr.write(`FAIL: ${error}\n`);
  process.exit(1);
}
process.stdout.write(`Registry/frontmatter OK: ${ids.length} roles\n`);
