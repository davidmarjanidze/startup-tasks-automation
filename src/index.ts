import { spawn } from 'node:child_process'

export interface Task {
  /** Command to run. It goes through the system shell, so arguments and quotes work as usual. */
  command: string
  /** Milliseconds to wait, counted from the call to `runTasks`, before running the command. Defaults to 0. */
  delay?: number
  /** Working directory for the command. Defaults to the current one. */
  cwd?: string
}

export interface RunTasksOptions {
  /** Called after a task was started. */
  onStart?: (task: Task) => void
  /** Called when a task could not be started. If not set, the error is printed with `console.error`. */
  onError?: (error: Error, task: Task) => void
}

export interface TaskFailure {
  task: Task
  error: Error
}

/**
 * Runs each task after its delay. Every command is started as a detached
 * process, so it keeps running after the script exits.
 *
 * The returned promise resolves once every task was started (or failed to
 * start) and contains the list of failures.
 */
export async function runTasks(
  tasks: Array<Task | string>,
  options: RunTasksOptions = {}
): Promise<TaskFailure[]> {
  const failures: TaskFailure[] = []

  await Promise.all(
    tasks.map(normalizeTask).map(async (task) => {
      await sleep(task.delay ?? 0)

      try {
        await start(task)
        options.onStart?.(task)
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        failures.push({ task, error: err })

        if (options.onError) options.onError(err, task)
        else console.error(`Failed to run "${task.command}":`, err.message)
      }
    })
  )

  return failures
}

function normalizeTask(task: Task | string): Task {
  return typeof task === 'string' ? { command: task } : task
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function start(task: Task): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(task.command, {
      cwd: task.cwd,
      shell: true,
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    })

    child.once('error', reject)
    child.once('spawn', () => {
      child.unref()
      resolve()
    })
  })
}
