# Kiro Buddy

Kiro Buddy is a floating desktop pet for Kiro agent activity. It reacts when Kiro starts working, asks for input, finishes, errors, or moves through spec-driven phases like Design, Requirements, and Task List.

## Demo

![Kiro Buddy demo](docs/assets/kiro-buddy-demo.gif)

![Kiro Buddy panel preview](docs/assets/kiro-buddy-panel.svg)

## Install In Any Kiro Project

Open a terminal in your Kiro project and run:

```bash
npx -y @jagatees/kiro-buddy install
npx -y @jagatees/kiro-buddy start
```

The install command adds Kiro Agent Hooks to your current project's `.kiro/hooks` folder, adds Buddy slash commands to `.kiro/agents`, and copies the small status runner to `.kiro/kiro-buddy`. Kiro Buddy currently supports Windows and macOS only.

After install, Kiro Buddy can start in two ways:

- Automatically when a Kiro Buddy agent hook runs, such as when you submit a prompt.
- Manually from Kiro's Agent Hooks panel by running `Kiro Buddy On`.

You can also turn it on from a terminal:

```bash
npx -y @jagatees/kiro-buddy on
```

Or from Kiro's input box:

```text
/buddy-open
/buddy-close
/buddy-test
```

Reload the Kiro window if newly installed slash commands do not show up immediately.

On macOS, the Buddy window is configured to stay visible across Spaces and fullscreen apps.

Buddy also has a small in-app panel. Click the round down button to see the current status, phase, `status.json` path, last update time, and last Buddy slash command. The panel includes a tiny reply box with `Text`, `Copy`, and `Reply` buttons. `Copy` always copies the text; on macOS, `Reply` also tries to paste and submit it into Kiro through Accessibility automation.

Use `/buddy-test` or `npx -y @jagatees/kiro-buddy test` to cycle through the visual states after an install.

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

## Kiro CLI

Kiro Buddy can also follow Kiro CLI sessions. Install the terminal agent config in your project:

```bash
npx -y @jagatees/kiro-buddy cli install
kiro-cli --agent kiro-buddy-cli
```

Terminal helpers:

```bash
npx -y @jagatees/kiro-buddy cli open
npx -y @jagatees/kiro-buddy cli close
npx -y @jagatees/kiro-buddy cli test
npx -y @jagatees/kiro-buddy cli status working
```

## Local Development

```bash
npm install
npm run build
npm test -- --runInBand
npm run hooks:install
npm start
```
