import { EmbedBuilder } from "@discordjs/builders"
import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import { ChatInputCommandInteraction } from "discord.js"

import { createAssignment, snowflake2UID } from "../../lib/firebase"
import getSnowflakesFromString from "../../lib/getSnowflakesFromString"
import removeDuplicates from "../../lib/removeDuplicates"
import { Assignment } from "../../types/assignments"

enum Options {
	assignmentName = "과제-이름",
	repoName = "repository-이름",
	filePath = "파일-경로",
	members = "과제-인원",
}

export class CreateAssignmentCommand extends Command {
	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName("과제-생성")
				.setDescription("새로운 과제 생성")
				.addStringOption((option) =>
					option
						.setName(Options.assignmentName)
						.setDescription("생성할 과제의 이름")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName(Options.repoName)
						.setDescription("과제 제출 확인시 확인할 github repository 이름")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName(Options.filePath)
						.setDescription("과제 제출 확인시 확인할 파일의 경로")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName(Options.members)
						.setDescription(
							"과제를 수행할 인원들의 @멘션. 등록된 사용자만 처리됩니다."
						)
						.setRequired(true)
				)
				.setDMPermission(false)
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		const assignmentName = interaction.options.getString(Options.assignmentName)
		if (!assignmentName)
			return this.replyFail(interaction, "과제 이름이 누락되었습니다.")

		const repoName = interaction.options.getString(Options.repoName)
		if (!repoName)
			return this.replyFail(interaction, "파일 경로가 누락되었습니다.")

		const filePath = interaction.options.getString(Options.filePath)
		if (!filePath)
			return this.replyFail(interaction, "repository 이름이 누락되었습니다.")

		const members = removeDuplicates<string>(
			getSnowflakesFromString(
				interaction.options.getString(Options.members)
			).map(snowflake2UID)
		)

		// create assignment
		const [assignmentID, assignmentData] = await createAssignment({
			name: assignmentName,
			repository: repoName,
			filePath,
			members,
			closed: false,
		})

		this.replySuccess(interaction, assignmentID, assignmentData)
	}

	async replyFail(
		interaction: ChatInputCommandInteraction,
		reason: string
	): Promise<void> {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "과제 생성 실패!",
					description: reason,
				}),
			],
		})
	}

	async replySuccess(
		interaction: ChatInputCommandInteraction,
		assignmentID: string,
		assignmentData: Assignment
	): Promise<void> {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "과제 생성 성공!",
					description: `**과제 이름** - ${assignmentData.name}
**repository 이름** - ${assignmentData.repository}
**파일 경로** - ${assignmentData.filePath}`,
				}).setFooter({ text: `ID: ${assignmentID}` }),
			],
		})
	}
}
