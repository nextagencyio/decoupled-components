#!/usr/bin/env node
/**
 * Verifies this starter's Canvas component definitions match the sibling
 * starter's (decoupled-components <-> decoupled-components-astro).
 *
 * Drupal Canvas only lets two frontends share a component machine name when
 * their component.yml metadata is identical; a site that serves both
 * starters refuses to sync components that differ. The index.* files are
 * framework-specific and are not compared.
 *
 * Usage: node scripts/check-canvas-components.mjs <sibling canvas dir>
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const config = JSON.parse(readFileSync('canvas.config.json', 'utf8'))
const ownDir = resolve(config.componentDir)
const siblingDir = process.argv[2] && resolve(process.argv[2])

if (!siblingDir) {
  console.error('Usage: node scripts/check-canvas-components.mjs <sibling canvas dir>')
  process.exit(2)
}
if (!existsSync(siblingDir)) {
  console.log(`Sibling has no Canvas components at ${siblingDir}; nothing to compare.`)
  process.exit(0)
}

const definitions = (dir) =>
  new Map(
    readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && existsSync(join(dir, entry.name, 'component.yml')))
      .map((entry) => [entry.name, readFileSync(join(dir, entry.name, 'component.yml'), 'utf8')]),
  )

const own = definitions(ownDir)
const sibling = definitions(siblingDir)
const problems = []

for (const name of new Set([...own.keys(), ...sibling.keys()])) {
  if (!own.has(name)) problems.push(`${name}: missing here (only in ${siblingDir})`)
  else if (!sibling.has(name)) problems.push(`${name}: missing in sibling (only in ${ownDir})`)
  else if (own.get(name) !== sibling.get(name)) problems.push(`${name}: component.yml differs`)
}

if (problems.length) {
  console.error(`Canvas component definitions have drifted from the sibling starter:\n  - ${problems.join('\n  - ')}`)
  console.error('Copy the component.yml change to both starters so they stay identical.')
  process.exit(1)
}
console.log(`${own.size} Canvas component definitions match the sibling starter.`)
