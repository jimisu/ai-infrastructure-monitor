import { createServer, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

export default defineConfig(({ isSsrBuild }) => ({
  base: '/ai-infrastructure-monitor/',
  plugins: [react(), ...(!isSsrBuild ? [{
    name: 'latest-snapshot',
    apply: 'build' as const,
    async closeBundle() {
      const server = await createServer({ configFile: false, server: { middlewareMode: true, watch: null }, plugins: [react()] })
      try {
        const { latestSnapshot } = await server.ssrLoadModule('/src/App.tsx')
        const json = JSON.stringify(latestSnapshot, null, 2) + '\n'
        await writeFile(path.resolve('public/latest.json'), json)
        await writeFile(path.resolve('dist/latest.json'), json)
      } finally {
        await server.close()
      }
    },
  }] : [])],
}))
