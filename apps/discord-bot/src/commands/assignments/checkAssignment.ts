import { EmbedBuilder, userMention } from "@discordjs/builders"
import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import type { ChatInputCommandInteraction } from "discord.js"

import { getAssignment, getUser } from "../../lib/firebase"
import { fileExists, getGitHubUsername } from "../../lib/github"
import { Assignment } from "../../types/assignments"

interface Args {
	assignmentID: string
	assignment: Assignment
}

interface AssignmentState {
	[firebaseUID: string]: boolean
}

const Options = {
	id: "과제-id",
}

export class CheckAssignmentCommand extends Command {
	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName("과제-제출-확인")
				.setDescription("과제 제출 확인")
				.addStringOption((option) =>
					option
						.setName(Options.id)
						.setDescription("확인할 과제의 ID")
						.setRequired(true)
				)
				.setDMPermission(false)
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		await interaction.reply("과제 제출 확인중...")
		await interaction.channel?.sendTyping()

		const args = await this.parseArgs(interaction)
		if (!args) return

		const assignmentState = await this.checkAssignments(args)
		if (typeof assignmentState === "string")
			return await this.replyFail(interaction, assignmentState)

		await this.replySuccess(interaction, assignmentState)
	}

	async parseArgs(
		interaction: ChatInputCommandInteraction
	): Promise<void | Args> {
		const assignmentID = interaction.options.getString(Options.id)
		if (!assignmentID)
			return this.replyFail(interaction, "과제 ID가 누락되었습니다.")

		const assignment = await getAssignment(assignmentID)
		if (!assignment)
			return this.replyFail(interaction, "존재하지 않는 과제입니다.")

		return {
			assignmentID,
			assignment,
		}
	}

	/**
	 * Returns either the current assignment state or an error message
	 */
	async checkAssignments(args: Args): Promise<AssignmentState | string> {
		const result: AssignmentState = {}

		for (const uid of args.assignment.members) {
			const gitHubUsername = await getGitHubUsername(uid)
			if (!gitHubUsername)
				return `사용자 \`${uid}\`의 깃허브 이름을 불러오는데 실패했습니다.`

			const doesFileExist = await fileExists(
				gitHubUsername,
				args.assignment.repository,
				args.assignment.filePath
			)

			result[uid] = doesFileExist
		}

		return result
	}

	async replyFail(
		interaction: ChatInputCommandInteraction,
		reason: string
	): Promise<void> {
		await interaction.editReply({
			embeds: [
				new EmbedBuilder({
					title: "과제 체출 확인 실패!",
					description: reason,
				}),
			],
		})
	}

	/**
	 * Sends a paginated list of assignment submission status.
	 * Discord embed description has a character length of 4096.
	 */
	async replySuccess(
		interaction: ChatInputCommandInteraction,
		assignmentState: AssignmentState
	): Promise<void> {
		const descriptions: string[] = [""]

		let pageIndex = 0
		for (const [uid, userSubmitted] of Object.entries(assignmentState)) {
			const user = await getUser(uid)
			const str = `**사용자** - ${user ? userMention(user.discordID) : "???"}
**UID** - \`${uid}\`
**제출** - ${userSubmitted}

`

			if (descriptions[pageIndex].length + str.length >= 4096) {
				pageIndex += 1
				descriptions[pageIndex] = str
			} else {
				descriptions[pageIndex] += str
			}
		}

		await interaction.editReply("과제 제출 현황을 나열합니다.")
		for (const [i, description] of descriptions.entries())
			await interaction.channel?.send({
				embeds: [
					new EmbedBuilder({
						title: `과제 제출 현황 ${i + 1}/${descriptions.length}`,
						description,
					}),
				],
			})
	}
}
