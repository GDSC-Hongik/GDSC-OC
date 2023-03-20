declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DISCORD_BOT_TOKEN: string
			SIGN_UP_URL: string
		}
	}
}

export {}
