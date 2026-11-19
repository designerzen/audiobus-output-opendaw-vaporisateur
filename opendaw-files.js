import { readFileSync } from "node:fs"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const fileName = "opendaw/processors.js"
const processorsPath = require.resolve("@opendaw/studio-core/processors.js")

/**
 * Vite plugin that serves and emits openDAW's prebundled processors.js unchanged; its internal
 * URLs are worklet-relative. The page must also be cross-origin isolated.
 */
export function opendawFilesPlugin() {
	let config
	const serve = (server) => {
		const prefix = config.base === "./" ? "/" : config.base
		server.middlewares.use((request, response, next) => {
			if (new URL(request.url, "http://localhost").pathname !== `${prefix}${fileName}`) {
				return next()
			}
			response.setHeader("Content-Type", "text/javascript")
			response.setHeader("Cache-Control", "no-cache")
			response.end(request.method === "HEAD" ? undefined : readFileSync(processorsPath))
		})
	}
	return {
		name: "opendaw-files",
		configResolved(resolved) {
			config = resolved
		},
		configureServer: serve,
		configurePreviewServer: serve,
		generateBundle() {
			this.emitFile({ type: "asset", fileName, source: readFileSync(processorsPath) })
		}
	}
}