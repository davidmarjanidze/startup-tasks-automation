# 2.0.0 (2026-11-04)

- Replace the `StartupTasksAutomation` class with a `runTasks` function that returns a promise
- Rename `executable` to `command` and make `delay` optional
- Add `cwd` task option and `onStart` / `onError` callbacks
- Accept plain strings as tasks
- Start commands as detached processes so they keep running after the script exits; remove the forced `process.exit()`
- Switch the build from Rollup to esbuild and add the `exports` field
- Require Node.js 20 or newer
- Move to ESLint flat config and add `lint`, `format` and `npm-publish` scripts

# 1.4.1 (2023-10-27)

Fix `README.md` heading.

# 1.4.0 (2023-06-10)

Remove the downloads tag from `README.md`.

# 1.3.1 (2023-04-30)

Fix `rollup.config.ts`.

# 1.3.0 (2023-04-30)

Correct `README.md`.

# 1.2.0 (2023-04-30)

Correct `README.md`.

# 1.1.0 (2023-04-30)

- Convert source to TypeScript
- Add Rollup config
- Add ESLint
- Add the support for ESM
- Add TypeScript definition file
- Change the documentation
