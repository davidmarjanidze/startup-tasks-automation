# startup-tasks-automation

<p>
  <a href="https://www.npmjs.com/package/startup-tasks-automation"><img src="https://img.shields.io/npm/v/startup-tasks-automation.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/startup-tasks-automation"><img src="https://img.shields.io/npm/l/startup-tasks-automation.svg" alt="Package License" /></a>
</p>

Run a list of commands when your computer starts, for example open Chrome,
Slack and a project in VS Code. Each command can have a delay so the apps
don't all start at the same time.

## Installation

```console
npm i startup-tasks-automation
```

Node.js 20 or newer is required.

## Usage

```js
import { runTasks } from 'startup-tasks-automation'

await runTasks([
  {
    command: 'C:/"Program Files"/Google/Chrome/Application/chrome.exe',
    delay: 5_000
  },
  { command: 'C:/Users/me/AppData/Local/slack/slack.exe', delay: 10_000 },
  { command: 'code .', cwd: 'C:/Users/me/projects/my-app', delay: 15_000 }
])
```

A task can also be a plain string if it doesn't need a delay:

```js
await runTasks(['code C:/Users/me/projects/my-app'])
```

CommonJS works too:

```js
const { runTasks } = require('startup-tasks-automation')
```

The started apps are not tied to the script, so they keep running after
it exits. The script exits by itself once the last task has started.

## API

### `runTasks(tasks, options?)`

Starts every task after its delay. Returns a promise that resolves when all
tasks have been started. The value is a list of tasks that failed to start
(empty if all went fine).

`tasks` is an array of strings or objects with these fields:

| Field     | Type     | Description                                                                         |
| --------- | -------- | ----------------------------------------------------------------------------------- |
| `command` | `string` | Command to run. It runs through the system shell, so arguments and quotes work.     |
| `delay`   | `number` | Milliseconds to wait before running the command, counted from the start. Default 0. |
| `cwd`     | `string` | Folder to run the command in. Default is the current folder.                        |

Delays are counted from the moment `runTasks` is called, not from the
previous task. In the example above Chrome starts after 5 seconds, Slack
after 10 and VS Code after 15.

`options`:

| Field     | Type                    | Description                                                                         |
| --------- | ----------------------- | ----------------------------------------------------------------------------------- |
| `onStart` | `(task) => void`        | Called after a task has started.                                                    |
| `onError` | `(error, task) => void` | Called when a task fails to start. If not set, the error is printed to the console. |

Note that "failed to start" means the shell itself couldn't be started (for
example, `cwd` doesn't exist). If the shell starts but the command inside it
fails, for example because of a wrong path, it's not reported.

TypeScript types (`Task`, `RunTasksOptions`, `TaskFailure`) are included.

## Running the script on startup

Put the code in a file, for example `startup.js`, and make your system run
it when you log in:

- **Windows**: create a shortcut or a `.bat` file with `node C:\path\to\startup.js`
  and put it in `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup`.
- **macOS**: add it as a Login Item, or create a launchd agent in
  `~/Library/LaunchAgents`.
- **Linux**: add a `.desktop` file to `~/.config/autostart`.

## Upgrading from 1.x

```js
// 1.x
new StartupTasksAutomation([
  { executable: 'slack', delay: 5_000 }
]).initiateBootSequence()

// 2.x
await runTasks([{ command: 'slack', delay: 5_000 }])
```

- The `StartupTasksAutomation` class was replaced by the `runTasks` function.
- `executable` was renamed to `command`, and `delay` is now optional.
- The script no longer calls `process.exit()` 10 seconds after the last task.
  It exits on its own, and the apps keep running.

## License

ISC
