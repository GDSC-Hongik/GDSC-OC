import {
	ApplicationCommandRegistries,
	RegisterBehavior,
	SapphireClient,
} from "@sapphire/framework"
import { GatewayIntentBits, Partials } from "discord.js"
import dotenv from "dotenv"

import { initializeFirebase } from "./lib/firebase"

dotenv.config()
initializeFirebase()

const client = new SapphireClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
	],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
})

// remove unused slash commands and stuff
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
	RegisterBehavior.BulkOverwrite
)

client.login(process.env.DISCORD_BOT_TOKEN)
