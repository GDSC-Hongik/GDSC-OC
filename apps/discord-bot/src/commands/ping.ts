import { isMessageInstance } from "@sapphire/discord.js-utilities"
import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import type { ChatInputCommandInteraction } from "discord.js"

export class PingCommand extends Command {
	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName("핑")
				.setDescription(
					"봇의 지연 시간을 1000분의 1초 (millisecond, ms) 단위로 측정합니다."
				)
				.setDMPermission(false)
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		const msg = await interaction.reply({
			content: `핑`,
			fetchReply: true,
		})

		if (isMessageInstance(msg)) {
			const diff = msg.createdTimestamp - interaction.createdTimestamp
			const ping = Math.round(this.container.client.ws.ping)

			return interaction.editReply(
				`퐁 🏓!
왕복: ${diff}ms
봇: ${ping}ms`
			)
		}

		return interaction.editReply("핑 계산에 실패하였습니다 :(")
	}
}
