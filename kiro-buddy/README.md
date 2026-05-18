# Kiro Buddy

Kiro Buddy is a floating desktop pet for Kiro agent activity. It reacts when Kiro starts working, asks for input, finishes, errors, or moves through spec-driven phases like Design, Requirements, and Task List.

## Release Progress

Current package target: `@jagatees/kiro-buddy@0.1.20`.

| Surface | Status | Notes |
|---|---:|---|
| Windows Kiro IDE | Ready | Kiro desktop IDE setup is ready for Windows users. See the Windows Kiro IDE setup section below. |
| Windows Terminal Kiro CLI | Ready | Kiro CLI terminal setup is ready for Windows users. See the Windows Terminal Kiro CLI setup section below. |
| macOS Kiro IDE | Coming soon | Needs real Mac validation for install hooks, overlay behavior, permissions, and app lifecycle. |
| macOS Terminal Kiro CLI | Coming soon | Needs real Mac CLI validation for agent config discovery, hook events, and Electron launch behavior. |
| npm publish | Prepared, auth blocked | Build, tests, and `npm pack` passed for `0.1.20`; publishing needs `npm login` as the `jagatees` npm owner. |

Release verification already run for `0.1.20`:

```bash
npm run build
npm test
npm pack
```

Before publishing, confirm:

```bash
npm whoami
```

It must print `jagatees`, then publish with:

```bash
npm publish --access public
```

## Demo

![Kiro Buddy demo](docs/assets/kiro-buddy-demo.gif)

![Kiro Buddy panel preview](docs/assets/kiro-buddy-panel.svg)

## Install In Any Kiro Project

Kiro Buddy has two ready Windows setup paths: Kiro IDE and Kiro CLI. macOS support is coming soon after real Mac validation.

## Windows Kiro IDE

Status: ready.

Use this when you run Kiro as the desktop IDE and want Buddy to react to IDE agent activity.

Open PowerShell in your Kiro project folder and run:

```powershell
npx -y @jagatees/kiro-buddy install
npx -y @jagatees/kiro-buddy start
```

The install command adds Kiro Agent Hooks to your current project's `.kiro/hooks` folder, adds Buddy slash commands to `.kiro/agents`, and copies the small status runner to `.kiro/kiro-buddy`.

After install, Kiro Buddy can start in two ways:

- Automatically when a Kiro Buddy agent hook runs, such as when you submit a prompt.
- Manually from Kiro's Agent Hooks panel by running `Kiro Buddy On`.

You can also turn it on from PowerShell:

```powershell
npx -y @jagatees/kiro-buddy on
```

Or from Kiro's input box:

```text
/buddy-open
/buddy-close
/buddy-test
```

Reload the Kiro window if newly installed slash commands do not show up immediately.

Use `/buddy-test` or this command to cycle through the visual states after an install:

```powershell
npx -y @jagatees/kiro-buddy test
```

## Windows Terminal Kiro CLI

Status: ready.

Use this when you run Kiro from the terminal and want Buddy to react to Kiro CLI agent activity.

Open PowerShell in your project folder and run:

```powershell
npx -y @jagatees/kiro-buddy cli install
npx -y @jagatees/kiro-buddy cli open
kiro-cli chat --agent kiro-buddy-cli
```

If your Kiro CLI version opens chat by default, this may also work:

```powershell
kiro-cli --agent kiro-buddy-cli
```

Terminal helpers:

```powershell
npx -y @jagatees/kiro-buddy cli open
npx -y @jagatees/kiro-buddy cli close
npx -y @jagatees/kiro-buddy cli test
npx -y @jagatees/kiro-buddy cli status working
```

The CLI install command writes the `kiro-buddy-cli` agent config for Kiro CLI. Buddy switches to working when you submit a prompt, asking when Kiro CLI waits for tool approval or user input, and done when the agent stops.

## macOS Kiro IDE

Coming soon.

The code has macOS support, but this path still needs real Mac validation for install hooks, overlay behavior, permissions, and app lifecycle.

## macOS Terminal Kiro CLI

Coming soon.

The non-Windows command shape is simpler, but this path still needs a real Mac CLI run to verify agent config discovery, hook events, and Electron launch behavior.

Buddy also has a small in-app panel. Click the round down button to see the current status, phase, `status.json` path, last update time, and last Buddy slash command. The panel includes a tiny reply box with `Text`, `Copy`, and `Reply` buttons. `Copy` always copies the text; on macOS, `Reply` also tries to paste and submit it into Kiro through Accessibility automation.

Open/close paths are intentionally paired: `/buddy-open`, `kiro-buddy open`, and `kiro-buddy on` all clear the manual close marker before launching Buddy again. `/buddy-close`, `kiro-buddy close`, and `kiro-buddy off` all record the close marker.

## What It Shows

- `Kiro Working` when you send a prompt
- `Kiro Asking` when Kiro is waiting for your decision or confirmation
- `Kiro Done` when the agent stops
- `Kiro Error` when an error hook runs
- `Design Working`, `Requirements Working`, or `Task List Working` for spec-driven work when phase context is detected
- A hidden debug/reply panel with the live status source and quick reply controls

## Manual Test

```bash
npx -y @jagatees/kiro-buddy status working design
npx -y @jagatees/kiro-buddy status asking
npx -y @jagatees/kiro-buddy status done
```

## Commands

```bash
npx -y @jagatees/kiro-buddy install
npx -y @jagatees/kiro-buddy cli install
npx -y @jagatees/kiro-buddy start
npx -y @jagatees/kiro-buddy open
npx -y @jagatees/kiro-buddy close
npx -y @jagatees/kiro-buddy status working
```

## Local Development

```bash
npm install
npm run build
npm test -- --runInBand
npm run hooks:install
npm start
```
