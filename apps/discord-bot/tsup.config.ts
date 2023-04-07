import { defineConfig } from "tsup"

const isProduction = process.env.NODE_ENV === "production"

export default defineConfig({
	clean: true,
	dts: false,
	outDir: "build",
	entry: [
		// without this, only index.js gets generated
		"src/**/*.ts",
		// but prevent .d.ts files from generating anything
		"!src/**/*.d.ts",
	],
	minify: isProduction,
})
