#!/usr/bin/env npx tsx
/**
 * Interactive setup script for Decoupled Components
 * Walks users through creating a space, configuring environment, and importing content
 */

import { execSync, spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof COLORS = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`)
}

function logStep(step: number, total: number, message: string) {
  console.log(`\n${COLORS.cyan}[${step}/${total}]${COLORS.reset} ${COLORS.bright}${message}${COLORS.reset}`)
}

function logSuccess(message: string) {
  console.log(`${COLORS.green}✓${COLORS.reset} ${message}`)
}

function logError(message: string) {
  console.log(`${COLORS.red}✗${COLORS.reset} ${message}`)
}

function logInfo(message: string) {
  console.log(`${COLORS.dim}${message}${COLORS.reset}`)
}

async function prompt(question: string, defaultValue?: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const defaultHint = defaultValue ? ` (${defaultValue})` : ''

  return new Promise((resolve) => {
    rl.question(`${question}${defaultHint}: `, (answer) => {
      rl.close()
      resolve(answer.trim() || defaultValue || '')
    })
  })
}

async function confirm(question: string, defaultYes = true): Promise<boolean> {
  const hint = defaultYes ? '[Y/n]' : '[y/N]'
  const answer = await prompt(`${question} ${hint}`)

  if (!answer) return defaultYes
  return answer.toLowerCase().startsWith('y')
}

function runCommand(command: string, args: string[], options: { silent?: boolean } = {}): Promise<{ success: boolean; output: string }> {
  return new Promise((resolve) => {
    const fullCommand = [command, ...args].join(' ')
    const child = spawn(fullCommand, [], {
      stdio: options.silent ? 'pipe' : 'inherit',
      shell: true,
    })

    let output = ''

    if (options.silent) {
      child.stdout?.on('data', (data) => {
        output += data.toString()
      })
      child.stderr?.on('data', (data) => {
        output += data.toString()
      })
    }

    child.on('close', (code) => {
      resolve({ success: code === 0, output })
    })
  })
}

function runCommandSync(command: string): { success: boolean; output: string } {
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' })
    return { success: true, output }
  } catch (error: any) {
    return { success: false, output: error.message }
  }
}

async function checkAuth(): Promise<boolean> {
  const result = runCommandSync('npx decoupled-cli@latest auth status 2>&1')
  return result.success && !result.output.includes('not authenticated')
}

async function waitForSpace(spaceId: number, maxWaitSeconds = 200): Promise<boolean> {
  const startTime = Date.now()
  const spinnerChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  let spinnerIdx = 0

  process.stdout.write('\n')

  while ((Date.now() - startTime) / 1000 < maxWaitSeconds) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const spinner = spinnerChars[spinnerIdx % spinnerChars.length]
    process.stdout.write(`\r${COLORS.cyan}${spinner}${COLORS.reset} Waiting for space to be ready... (${elapsed}s / ${maxWaitSeconds}s)`)
    spinnerIdx++

    const result = runCommandSync(`npx decoupled-cli@latest spaces status ${spaceId} 2>/dev/null`)

    if (result.success && result.output.includes('Ready: Yes')) {
      process.stdout.write(`\r${COLORS.green}✓${COLORS.reset} Space is ready!                                    \n`)
      return true
    }

    await new Promise((resolve) => setTimeout(resolve, 5000))
  }

  process.stdout.write(`\r${COLORS.red}✗${COLORS.reset} Timeout waiting for space (${maxWaitSeconds}s)              \n`)
  return false
}

async function main() {
  console.log(`
${COLORS.magenta}╔════════════════════════════════════════════════════════╗
║                                                        ║
║      ${COLORS.bright}Decoupled Components - Interactive Setup${COLORS.reset}${COLORS.magenta}        ║
║                                                        ║
║   Component showcase with 10 paragraph types:          ║
║   Hero, Cards, Sidebyside, Pricing, Testimonials,      ║
║   Stats, FAQ/Accordion, Newsletter, Logos, Text        ║
║                                                        ║
╚════════════════════════════════════════════════════════╝${COLORS.reset}
`)

  const totalSteps = 5
  let currentStep = 1

  // Step 1: Check/Setup Authentication
  logStep(currentStep++, totalSteps, 'Checking authentication')

  const isAuthenticated = await checkAuth()

  if (!isAuthenticated) {
    log('You need to authenticate with Decoupled.io first.', 'yellow')
    const shouldAuth = await confirm('Open browser to authenticate?')

    if (shouldAuth) {
      log('\nOpening browser for authentication...', 'dim')
      await runCommand('npx', ['decoupled-cli@latest', 'auth', 'login'])

      if (!(await checkAuth())) {
        logError('Authentication failed. Please try again.')
        process.exit(1)
      }
    } else {
      logError('Authentication required to continue.')
      process.exit(1)
    }
  }

  logSuccess('Authenticated with Decoupled.io')

  // Step 2: Create Space
  logStep(currentStep++, totalSteps, 'Creating Drupal space')

  const spaceName = await prompt('Enter a name for your components site', 'My Components Demo')

  log(`\nCreating space "${spaceName}"...`, 'dim')

  const createResult = runCommandSync(`npx decoupled-cli@latest spaces create "${spaceName}" 2>&1`)

  let spaceId: number | null = null
  let spaceUrl: string | null = null

  // Parse the output for Space ID and Machine Name
  const idMatch = createResult.output.match(/Space ID:\s*(\d+)/i) || createResult.output.match(/ID:\s*(\d+)/i)
  if (idMatch) {
    spaceId = parseInt(idMatch[1], 10)
  }

  const machineMatch = createResult.output.match(/Machine Name:\s*(\w+)/i)
  if (machineMatch) {
    spaceUrl = `https://${machineMatch[1]}.decoupled.website`
  }

  if (!spaceId) {
    logError('Failed to create space. Output:')
    console.log(createResult.output)

    const manualId = await prompt('Enter space ID manually (or press Enter to exit)')
    if (manualId && !isNaN(parseInt(manualId, 10))) {
      spaceId = parseInt(manualId, 10)
    } else {
      process.exit(1)
    }
  }

  logSuccess(`Space created with ID: ${spaceId}`)
  if (spaceUrl) {
    logInfo(`URL: ${spaceUrl}`)
  }

  // Step 3: Wait for space to be ready
  logStep(currentStep++, totalSteps, 'Waiting for space provisioning')

  logInfo('New spaces take ~90 seconds to provision...')

  const isReady = await waitForSpace(spaceId)

  if (!isReady) {
    logError('Space provisioning timed out.')
    log('You can check status later with: npx decoupled-cli@latest spaces show ' + spaceId, 'yellow')

    const shouldContinue = await confirm('Continue anyway?', false)
    if (!shouldContinue) {
      process.exit(1)
    }
  }

  // Step 4: Configure environment
  logStep(currentStep++, totalSteps, 'Configuring environment')

  const envPath = path.join(process.cwd(), '.env.local')
  const envExists = fs.existsSync(envPath)

  if (envExists) {
    const shouldOverwrite = await confirm('.env.local already exists. Overwrite?', false)
    if (!shouldOverwrite) {
      logInfo('Skipping environment configuration')
    } else {
      await runCommand('npx', ['decoupled-cli@latest', 'spaces', 'env', String(spaceId), '--write', '.env.local'])
      logSuccess('Environment configured in .env.local')
    }
  } else {
    await runCommand('npx', ['decoupled-cli@latest', 'spaces', 'env', String(spaceId), '--write', '.env.local'])
    logSuccess('Environment configured in .env.local')
  }

  // Step 5: Import content
  logStep(currentStep++, totalSteps, 'Importing content')

  const shouldImport = await confirm('Import component sample content?')

  if (shouldImport) {
    log('\nImporting paragraph types and sample data...', 'dim')
    log('This creates 10 paragraph types and 2 landing pages...', 'dim')
    const importResult = await runCommand('npx', ['decoupled-cli@latest', 'content', 'import', '--file', 'data/components-content.json'])

    if (importResult.success) {
      logSuccess('Content imported successfully')
    } else {
      logError('Content import had issues. You can retry with:')
      log('  npm run setup-content', 'yellow')
    }
  } else {
    logInfo('Skipping content import')
  }

  // Done!
  console.log(`
${COLORS.green}╔════════════════════════════════════════════════════════╗
║                                                        ║
║                   Setup Complete!                      ║
║                                                        ║
╚════════════════════════════════════════════════════════╝${COLORS.reset}

${COLORS.bright}Next steps:${COLORS.reset}

  1. Start the development server:
     ${COLORS.cyan}npm run dev${COLORS.reset}

  2. Open ${COLORS.cyan}http://localhost:3000${COLORS.reset} in your browser

  3. Visit the component showcase:
     ${COLORS.cyan}http://localhost:3000/showcase${COLORS.reset}

  4. Access Drupal admin:
     ${COLORS.cyan}npx decoupled-cli@latest spaces login ${spaceId}${COLORS.reset}

${COLORS.bright}Useful commands:${COLORS.reset}
  ${COLORS.dim}npm run dev${COLORS.reset}                Start development server
  ${COLORS.dim}npm run setup-content${COLORS.reset}      Re-import sample content
  ${COLORS.dim}npm run build${COLORS.reset}              Build for production

${COLORS.dim}Space ID: ${spaceId}${COLORS.reset}
${spaceUrl ? `${COLORS.dim}Drupal URL: ${spaceUrl}${COLORS.reset}` : ''}

${COLORS.magenta}Happy building! 🚀${COLORS.reset}
`)
}

main().catch((error) => {
  logError(`Setup failed: ${error.message}`)
  process.exit(1)
})
