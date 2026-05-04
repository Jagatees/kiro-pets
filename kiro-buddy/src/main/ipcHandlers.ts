import fs from 'fs'
import os from 'os'
import path from 'path'
import { app, ipcMain, screen } from 'electron'
import { overlayWindow } from './overlayWindow'
import { getConfig } from './configStore'

const manualClosePath = path.join(os.homedir(), '.kiro-buddy', 'manual-close.json')

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

function isMovePayload(payload: unknown): payload is { x: number; y: number } {
  if (payload === null || typeof payload !== 'object') {
    return false
  }

  const candidate = payload as Record<string, unknown>
  return Number.isFinite(candidate.x) && Number.isFinite(candidate.y)
}

export function registerIpcHandlers(): void {
  ipcMain.removeAllListeners('move-window')
  ipcMain.removeAllListeners('close-app')

  ipcMain.on('move-window', (_event, payload: unknown) => {
    if (!isMovePayload(payload)) {
      console.warn('[IPC] Rejected invalid move-window payload')
      return
    }

    const win = overlayWindow.getWindow()
    if (!win) {
      console.warn('[IPC] move-window received before overlay exists')
      return
    }

    const config = getConfig()
    const display = screen.getDisplayMatching(win.getBounds())
    const bounds = display.workArea
    const windowWidth = Math.max(config.window.width, 220)
    const windowHeight = Math.max(config.window.height, 220)
    const maxX = bounds.x + bounds.width - windowWidth
    const maxY = bounds.y + bounds.height - windowHeight
    const x = clamp(Math.round(payload.x), bounds.x, maxX)
    const y = clamp(Math.round(payload.y), bounds.y, maxY)

    overlayWindow.setPosition(x, y)
  })

  ipcMain.on('close-app', () => {
    fs.mkdirSync(path.dirname(manualClosePath), { recursive: true })
    fs.writeFileSync(manualClosePath, `${JSON.stringify({ timestamp: Date.now() })}\n`, 'utf8')
    app.quit()
  })
}
