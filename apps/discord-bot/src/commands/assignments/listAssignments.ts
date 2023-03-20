import { EmbedBuilder } from "@discordjs/builders"
import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import { ChatInputCommandInteraction } from "discord.js"

import { getAssignment, listAssignments } from "../../lib/firebase"
import { Assignment } from "../../types/assignments"

enum Options {
	assignmentID = "과제-id",
	showClosed = "마감된-과제-보이기",
}

interface Args {
	assignmentID?: string
	showClosed: boolean
}

export class ListAssignmentsCommand extends Command {
	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName("과제-열람")
				.setDescription("등록된 과제 나열 / 특정 과제 열람")
				.addStringOption((option) =>
					option.setName(Options.assignmentID).setDescription("특정 과제 ID")
				)
				.addBooleanOption((option) =>
					option
						.setName(Options.showClosed)
						.setDescription("마감된 과제 보이기 (기본: 보이지 않기)")
				)
				.setDMPermission(false)
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		const args = this.parseArgs(interaction)

		await this.replySuccess(interaction, args)
	}

	parseArgs(interaction: ChatInputCommandInteraction): Args {
		return {
			showClosed: !!interaction.options.getBoolean(Options.showClosed),
			assignmentID:
				interaction.options.getString(Options.assignmentID) ?? undefined,
		}
	}

	formatAssignment(assignmentID: string, assignment: Assignment): string {
		return `**이름** - ${assignment.name}
**ID** - ${assignmentID}
**GitHub 레포 이름** - ${assignment.repository}
**파일 경로** - ${assignment.filePath}
**인원** - ${assignment.members.length}명 (\`/과제-제출-확인\`으로 확인)
**마감** - ${assignment.closed}
`
	}

	/**
	 * Returns a paginated list of assignment descriptions.
	 * Discord embed description has a character length of 4096.
	 */
	formatAssignments(assignments: {
		[assignmentID: string]: Assignment
	}): string[] {
		const result: string[] = [""]

		let index = 0
		for (const assignmentID in assignments) {
			const assignment = assignments[assignmentID]
			const str = `${this.formatAssignment(assignmentID, assignment)}

`

			if (result[index].length + str.length >= 4096) {
				index += 1
				result[index] = str
			} else {
				result[index] += str
			}
		}

		return result
	}

	async replyAssignmentInfo(
		interaction: ChatInputCommandInteraction,
		args: Args
	): Promise<void> {
		if (!args.assignmentID)
			return this.replyFail(interaction, "유효하지 않은 과제 ID입니다.")

		const assignment = await getAssignment(args.assignmentID)
		if (!assignment)
			return this.replyFail(interaction, "유효하지 않은 과제 ID입니다.")

		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "과제 정보",
					description: this.formatAssignment(args.assignmentID, assignment),
				}),
			],
		})
	}

	async replyAssignmentList(
		interaction: ChatInputCommandInteraction,
		args: Args
	): Promise<void> {
		const assignments = await listAssignments(args.showClosed)
		const assignmentDescriptions = this.formatAssignments(assignments)

		await interaction.reply("등록된 과제를 나열합니다")

		for (const [i, assignmentDescription] of assignmentDescriptions.entries())
			await interaction.channel?.send({
				embeds: [
					new EmbedBuilder({
						title: `등록된 과제 리스트 ${i + 1}/${
							assignmentDescriptions.length
						}`,
						description: assignmentDescription,
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
					title: "과제 정보 열람 실패!",
					description: reason,
				}),
			],
			ephemeral: true,
		})
	}

	async replySuccess(
		interaction: ChatInputCommandInteraction,
		args: Args
	): Promise<void> {
		if (args.assignmentID) {
			this.replyAssignmentInfo(interaction, args)
			return
		}

		this.replyAssignmentList(interaction, args)
	}
}
