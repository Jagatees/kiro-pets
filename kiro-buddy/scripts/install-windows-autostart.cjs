#!/usr/bin/env node

const fs = require('fs')
const os = require('os')
const path = require('path')
const { execFileSync, spawn } = require('child_process')

const packageRoot = path.resolve(__dirname, '..')
const runKey = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
const valueName = 'KiroBuddyAutostart'
const watcherPath = path.join(packageRoot, 'scripts', 'kiro-buddy-autostart.cjs')
const nodePath = process.execPath

function quotePowerShellString(value) {
  return `'${String(value).replace(/'/g, "''")}'`
}

function watcherCommand() {
  return [
    'powershell.exe',
    '-NoProfile',
    '-ExecutionPolicy Bypass',
    '-WindowStyle Hidden',
    '-Command',
    `"Start-Process -WindowStyle Hidden -FilePath ${quotePowerShellString(nodePath)} -ArgumentList ${quotePowerShellString(watcherPath)}"`,
  ].join(' ')
}

function isWatcherRunning() {
  try {
    const command = 'Get-CimInstance Win32_Process | Select-Object -ExpandProperty CommandLine'
    const stdout = execFileSync('powershell.exe', ['-NoProfile', '-Command', command], {
      encoding: 'utf8',
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
    return stdout.toLowerCase().includes(watcherPath.toLowerCase())
  } catch {
    return false
  }
}

function startWatcherNow() {
  if (isWatcherRunning()) {
    return
  }

  const child = spawn(nodePath, [watcherPath], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
  })
  child.unref()
}

if (process.platform !== 'win32') {
  console.error('Windows autostart installation is only supported on Windows.')
  process.exit(1)
}

if (!fs.existsSync(watcherPath)) {
  console.error(`Missing autostart watcher: ${watcherPath}`)
  process.exit(1)
}

execFileSync(
  'reg.exe',
  ['add', runKey, '/v', valueName, '/t', 'REG_SZ', '/d', watcherCommand(), '/f'],
  { stdio: 'ignore', windowsHide: true },
)

startWatcherNow()

console.log(`Installed Kiro Buddy Windows autostart watcher for ${os.userInfo().username}.`)
