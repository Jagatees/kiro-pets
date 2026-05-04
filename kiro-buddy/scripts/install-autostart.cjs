#!/usr/bin/env node

const path = require('path')
const { spawnSync } = require('child_process')

const script =
  process.platform === 'win32'
    ? 'install-windows-autostart.cjs'
    : process.platform === 'darwin'
      ? 'install-macos-autostart.cjs'
      : null

if (!script) {
  console.error('Kiro Buddy autostart install is currently supported on macOS and Windows.')
  process.exit(1)
}

const result = spawnSync(process.execPath, [path.join(__dirname, script)], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: process.env,
})

process.exit(result.status ?? 1)
