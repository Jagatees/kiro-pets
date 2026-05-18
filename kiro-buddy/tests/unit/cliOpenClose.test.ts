import fs from 'fs'
import os from 'os'
import path from 'path'
import { spawnSync } from 'child_process'

const projectRoot = path.resolve(__dirname, '..', '..')
const cliPath = path.join(projectRoot, 'bin', 'kiro-buddy.cjs')

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'kiro-buddy-cli-'))
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
}

function runCli(homeDir: string, args: string[]): ReturnType<typeof spawnSync> {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: projectRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      HOME: homeDir,
      USERPROFILE: homeDir,
      KIRO_BUDDY_DRY_RUN: '1',
      KIRO_BUDDY_STATUS_FILE: path.join(homeDir, '.kiro', 'status.json'),
    },
  })
}

describe('kiro-buddy CLI open/close controls', () => {
  let tempDir: string
  let manualClosePath: string
  let lastCommandPath: string
  let launchRequestPath: string
  let statusFilePath: string

  beforeEach(() => {
    tempDir = makeTempDir()
    manualClosePath = path.join(tempDir, '.kiro-buddy', 'manual-close.json')
    lastCommandPath = path.join(tempDir, '.kiro-buddy', 'last-command.json')
    launchRequestPath = path.join(tempDir, '.kiro-buddy', 'last-launch.json')
    statusFilePath = path.join(tempDir, '.kiro', 'status.json')
  })

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true })
  })

  it.each(['close', 'off'])('%s records manual close state', (command) => {
    const result = runCli(tempDir, [command])

    expect(result.status).toBe(0)
    expect(fs.existsSync(manualClosePath)).toBe(true)
    expect(readJson<{ command: string }>(lastCommandPath)).toMatchObject({
      command: 'buddy-close',
    })
  })

  it.each([
    ['open', 'buddy-open'],
    ['on', 'buddy-open'],
  ])('%s clears manual close state and writes idle status', (command, lastCommand) => {
    fs.mkdirSync(path.dirname(manualClosePath), { recursive: true })
    fs.writeFileSync(manualClosePath, '{"timestamp":1}\n', 'utf8')

    const result = runCli(tempDir, [command])

    expect(result.status).toBe(0)
    expect(fs.existsSync(manualClosePath)).toBe(false)
    expect(readJson<{ command: string }>(lastCommandPath)).toMatchObject({
      command: lastCommand,
    })
    expect(readJson<{ command: string }>(launchRequestPath)).toMatchObject({
      command: lastCommand,
    })
    expect(readJson<{ status: string }>(statusFilePath)).toMatchObject({
      status: 'idle',
    })
  })

  it('test opens Buddy through the visual test command path', () => {
    fs.mkdirSync(path.dirname(manualClosePath), { recursive: true })
    fs.writeFileSync(manualClosePath, '{"timestamp":1}\n', 'utf8')

    const result = runCli(tempDir, ['test'])

    expect(result.status).toBe(0)
    expect(fs.existsSync(manualClosePath)).toBe(false)
    expect(readJson<{ command: string }>(lastCommandPath)).toMatchObject({
      command: 'buddy-test',
    })
    expect(readJson<{ command: string }>(launchRequestPath)).toMatchObject({
      command: 'buddy-test',
    })
  })

  it('cli open clears manual close state and writes idle status', () => {
    fs.mkdirSync(path.dirname(manualClosePath), { recursive: true })
    fs.writeFileSync(manualClosePath, '{"timestamp":1}\n', 'utf8')

    const result = runCli(tempDir, ['cli', 'open'])

    expect(result.status).toBe(0)
    expect(fs.existsSync(manualClosePath)).toBe(false)
    expect(readJson<{ command: string }>(lastCommandPath)).toMatchObject({
      command: 'buddy-cli-open',
    })
    expect(readJson<{ status: string }>(statusFilePath)).toMatchObject({
      status: 'idle',
    })
  })

  it('cli install writes the Kiro CLI agent config', () => {
    const result = spawnSync(process.execPath, [cliPath, 'cli', 'install'], {
      cwd: projectRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        HOME: tempDir,
        USERPROFILE: tempDir,
        KIRO_BUDDY_WORKSPACE: tempDir,
      },
    })

    expect(result.status).toBe(0)
    expect(fs.existsSync(path.join(tempDir, '.kiro', 'agents', 'kiro-buddy-cli.json'))).toBe(true)
  })
})
