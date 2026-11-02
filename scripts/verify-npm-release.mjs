#!/usr/bin/env node
// Preflight for publishing the four forum-kb npm packages.
//
// Checks, in order:
//   1. the four package manifests are version-aligned (bundle depends on the exact impl versions);
//   2. every file listed in each package's `files` field exists;
//   3. the bundle declares dsh.bundle.patch and that patch file exists;
//   4. the repository root declares the same dsh.bundle (the dsh-plugin.org collector reads the root);
//   5. the target <name>@<version> is not published yet (npm is append-only: bump versions, never republish).
//
// Usage: node scripts/verify-npm-release.mjs
// Exit 0 = safe to publish; exit 1 = fix the reported problem first.

import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

const REGISTRY = process.env.NPM_REGISTRY ?? 'https://registry.npmjs.org'
const IMPL_DIRS = ['dsh/dsh-forum-kb', 'dsh/dsh-tool-forum-kb', 'dsh/dsh-client-ui-forum-kb']
const BUNDLE_DIR = 'dsh/dsh-forum'
const ALL_DIRS = [...IMPL_DIRS, BUNDLE_DIR]

const problems = []
const read = (dir) => JSON.parse(readFileSync(`${dir}/package.json`, 'utf8'))

const manifests = new Map(ALL_DIRS.map((dir) => [dir, read(dir)]))
const versions = new Set([...manifests.values()].map((m) => m.version))
if (versions.size !== 1) {
  problems.push(`package versions differ: ${[...manifests.values()].map((m) => `${m.name}@${m.version}`).join(', ')}`)
}
const version = [...versions][0]

for (const [dir, manifest] of manifests) {
  for (const file of manifest.files ?? []) {
    if (!existsSync(`${dir}/${file}`) && !file.includes('*')) {
      problems.push(`${dir}: files entry ${JSON.stringify(file)} does not exist`)
    }
  }
  if (manifest.license !== 'MIT') problems.push(`${dir}: expected license MIT, got ${JSON.stringify(manifest.license)}`)
  if (!manifest.repository?.url?.includes('chaosen315/dsh-forum')) {
    problems.push(`${dir}: repository.url does not point at chaosen315/dsh-forum`)
  }
}

const bundle = manifests.get(BUNDLE_DIR)
const patch = bundle?.dsh?.bundle?.patch
if (typeof patch !== 'string') problems.push(`${BUNDLE_DIR}: dsh.bundle.patch is missing`)
else if (!existsSync(`${BUNDLE_DIR}/${patch}`)) problems.push(`${BUNDLE_DIR}: bundle patch ${patch} does not exist`)

// The dsh-plugin.org collector only reads the repository root package.json:
// it expects name/version + dsh.bundle.patch there, pointing at a patch file that
// matches the published bundle. Keep the root and the bundle package in sync.
const rootManifest = JSON.parse(readFileSync('package.json', 'utf8'))
const rootPatch = rootManifest?.dsh?.bundle?.patch
if (typeof rootPatch !== 'string') {
  problems.push('root package.json: dsh.bundle.patch is missing (the plugin catalog collector reads the repo root)')
} else if (!existsSync(rootPatch)) {
  problems.push(`root package.json: bundle patch ${rootPatch} does not exist`)
} else if (patch !== undefined && existsSync(`${BUNDLE_DIR}/${patch}`)) {
  const rootText = readFileSync(rootPatch, 'utf8').trim()
  const bundleText = readFileSync(`${BUNDLE_DIR}/${patch}`, 'utf8').trim()
  if (rootText !== bundleText) problems.push(`root ${rootPatch} and ${BUNDLE_DIR}/${patch} differ; keep them identical`)
}
if (rootManifest.name !== bundle?.name) {
  problems.push(`root package.json name ${JSON.stringify(rootManifest.name)} must match bundle name ${JSON.stringify(bundle?.name)}`)
}
if (rootManifest.version !== version) {
  problems.push(`root package.json version ${JSON.stringify(rootManifest.version)} must match the package version ${version}`)
}

const ui = manifests.get('dsh/dsh-client-ui-forum-kb')
if (ui?.dsh?.client === undefined) problems.push('dsh-forum-ui: dsh.client manifest is missing')

for (const dir of IMPL_DIRS) {
  const manifest = manifests.get(dir)
  if (bundle?.dependencies?.[manifest.name] !== version) {
    problems.push(`${BUNDLE_DIR}: dependency ${manifest.name} must be pinned to ${version}, got ${JSON.stringify(bundle?.dependencies?.[manifest.name])}`)
  }
}

const published = []
for (const manifest of manifests.values()) {
  const target = `${manifest.name}@${version}`
  const result = spawnSync('npm', ['view', target, 'version', '--registry', REGISTRY, '--json'], {
    encoding: 'utf8',
    env: { ...process.env, npm_config_registry: REGISTRY },
  })
  if (result.status === 0) published.push(target)
  else if (!/E404|404 Not Found|is not in this registry/.test(`${result.stdout}${result.stderr}`)) {
    problems.push(`cannot check registry for ${target}: ${(result.stderr || result.stdout).trim().split('\n').slice(-3).join(' ')}`)
  }
}

if (published.length > 0) {
  problems.push(`already published (npm versions are immutable; bump all four versions): ${published.join(', ')}`)
}

const dshPeers = [...manifests.values()].flatMap((m) =>
  Object.entries(m.peerDependencies ?? {})
    .filter(([name]) => name === '@deepseek-ai/dsh' || name.startsWith('@deepseek-ai/dsh-'))
    .map(([name, range]) => `${m.name} -> ${name}@${range}`),
)
if (dshPeers.length === 0) problems.push('no @deepseek-ai/dsh* peerDependencies found; DSH compatibility gate would not run')

if (problems.length > 0) {
  console.error('npm release preflight FAILED:')
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log(`npm release preflight OK: ${[...manifests.values()].map((m) => m.name).join(', ')} @ ${version}`)
console.log(`registry: ${REGISTRY} (none of the four versions is published yet)`)
