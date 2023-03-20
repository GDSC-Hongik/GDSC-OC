import { EmbedBuilder } from "@discordjs/builders"
import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import type { ChatInputCommandInteraction } from "discord.js"

import { refs } from "../../lib/firebase"

enum OptionName {
	upvoteEmoji = "upvote-이모지",
}

export class SetUpvoteReactionCommand extends Command {
	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName("upvote-이모지-설정")
				.setDescription("upvote 이모지 업데이트")
				.addStringOption((option) =>
					option
						.setName(OptionName.upvoteEmoji)
						.setDescription("upvote로 사용할 이모지")
						.setRequired(true)
				)
				.setDMPermission(false)
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		const upvoteEmoji = interaction.options.getString(OptionName.upvoteEmoji)
		if (!upvoteEmoji)
			return await this.replyFail(
				interaction,
				"새 upvote 이모지를 선택하지 않으셨습니다."
			)

		refs.emojis.set({ upvote: upvoteEmoji }, { merge: true })

		return await this.replySuccess(interaction, upvoteEmoji)
	}

	async replySuccess(
		interaction: ChatInputCommandInteraction,
		newUpvoteEmoji: string
	): Promise<void> {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "upvote 이모지 설정 성공!",
					description: `새 upvote 이모지: ${newUpvoteEmoji}`,
				}),
			],
		})
	}

	async replyFail(
		interaction: ChatInputCommandInteraction,
		reason: string
	): Promise<void> {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "upvote 이모지 설정 실패!",
					description: reason,
				}),
			],
		})
	}
}
