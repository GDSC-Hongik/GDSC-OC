import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js"

import { initializeDB } from "../../lib/firebase"

export class SyncDBCommand extends Command {
	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName("db-동기화")
				.setDescription(
					"봇의 DB 캐시를 강제로 Firestore DB와 동기화합니다. DB를 수동으로 조작 후 사용하세요."
				)
				.setDMPermission(false)
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		await initializeDB()

		return interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "DB 동기화 완료!",
				}),
			],
		})
	}
}
