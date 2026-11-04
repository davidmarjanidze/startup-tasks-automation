import { rmSync } from 'node:fs'
import { build } from 'esbuild'

rmSync('dist', { recursive: true, force: true })

const options = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20'
}

await Promise.all([
  build({ ...options, format: 'esm', outfile: 'dist/index.js' }),
  build({ ...options, format: 'cjs', outfile: 'dist/index.cjs' })
])
