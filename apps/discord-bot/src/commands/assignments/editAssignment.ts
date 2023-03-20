// 과제-편집 `assignment ID` `name?` `updated` `삭제?`

import { EmbedBuilder } from "@discordjs/builders"
import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import { ChatInputCommandInteraction } from "discord.js"

import {
	deleteAssignment,
	getAssignment,
	setAssignment,
	snowflake2UID,
} from "../../lib/firebase"
import getSnowflakesFromString from "../../lib/getSnowflakesFromString"
import removeDuplicates from "../../lib/removeDuplicates"
import { Assignment } from "../../types/assignments"

interface Args {
	id: string
	name: string | null
	repository: string | null
	filePath: string | null
	memberOperation: MemberOperation | null
	members: string[]
	closed: boolean | null
	deleteAssignment: boolean | null
}

enum Options {
	id = "과제-id",
	name = "과제-이름",
	repository = "repository-이름",
	filePath = "파일-경로",
	memberOperation = "멤버-작업",
	members = "과제-인원",
	closed = "마감",
	deleteAssignment = "삭제",
}

enum MemberOperation {
	add = "추가",
	remove = "제거",
}

export class EditAssignmentCommand extends Command {
	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName("과제-편집")
				.setDescription("존재하는 과제 편집")
				.addStringOption((option) =>
					option
						.setName(Options.id)
						.setDescription("편집할 과제의 ID")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option.setName(Options.name).setDescription("과제의 이름")
				)
				.addStringOption((option) =>
					option
						.setName(Options.repository)
						.setDescription("과제 제출 확인시 확인할 github repository 이름")
				)
				.addStringOption((option) =>
					option
						.setName(Options.filePath)
						.setDescription("과제 제출 확인시 확인할 파일의 경로")
				)
				.addStringOption((option) =>
					option
						.setName(Options.memberOperation)
						.setDescription("과제를 수행할 인원 추가/제거")
						.setChoices(
							{
								name: MemberOperation.add,
								value: MemberOperation.add,
							},
							{
								name: MemberOperation.remove,
								value: MemberOperation.remove,
							}
						)
				)
				.addStringOption((option) =>
					option
						.setName(Options.members)
						.setDescription("추가/제거할 인원의 멘션")
				)
				.addBooleanOption((option) =>
					option.setName(Options.closed).setDescription("과제 마감 상태")
				)
				.addBooleanOption((option) =>
					option
						.setName(Options.deleteAssignment)
						.setDescription("과제 삭제 (주의: 되돌릴 수 없습니다)")
				)
				.setDMPermission(false)
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		const args = await this.parseArguments(interaction)
		if (!args) return

		const assignment = await getAssignment(args.id)
		if (!assignment)
			return await this.replyFail(interaction, "존재하지 않는 과제입니다.")

		if (args.deleteAssignment) {
			return await this.deleteAssignment(interaction, args)
		} else {
			return await this.editAssignment(interaction, args, assignment)
		}
	}

	async editAssignment(
		interaction: ChatInputCommandInteraction,
		args: Args,
		assignment: Assignment
	): Promise<void> {
		let members = assignment.members

		switch (args.memberOperation) {
			case MemberOperation.add: {
				members = removeDuplicates([...assignment.members, ...args.members])
				break
			}

			case MemberOperation.remove: {
				members = assignment.members.filter((item) => item in args.members)
				break
			}
		}

		await setAssignment(
			{
				name: args.name || undefined,
				repository: args.repository || undefined,
				members,
				filePath: args.filePath || undefined,
				closed: args.closed === null ? undefined : args.closed,
			},
			args.id
		)

		this.replySuccess(interaction, args)
	}

	async deleteAssignment(
		interaction: ChatInputCommandInteraction,
		args: Args
	): Promise<void> {
		const deleteAssignmentSuccess = await deleteAssignment(args.id)

		if (deleteAssignmentSuccess)
			return await this.replySuccess(interaction, args)
		else
			return await this.replyFail(
				interaction,
				"과제 삭제 과정에서 문제가 발생했습니다."
			)
	}

	async parseArguments(
		interaction: ChatInputCommandInteraction
	): Promise<void | Args> {
		const id = interaction.options.getString(Options.id)
		if (!id)
			return await this.replyFail(interaction, "과제 ID가 누락되었습니다.")

		const name = interaction.options.getString(Options.name)
		const repository = interaction.options.getString(Options.repository)
		const filePath = interaction.options.getString(Options.filePath)
		const memberOperation = interaction.options.getString(
			Options.memberOperation
		) as MemberOperation | null
		const members = removeDuplicates<string>(
			getSnowflakesFromString(
				interaction.options.getString(Options.members)
			).map(snowflake2UID)
		)
		const closed = interaction.options.getBoolean(Options.closed)
		const deleteAssignment = interaction.options.getBoolean(
			Options.deleteAssignment
		)

		if (members.length && !memberOperation)
			return await this.replyFail(
				interaction,
				"멤버 작업을 선택하지 않으셨습니다."
			)

		return {
			id,
			name,
			repository,
			filePath,
			memberOperation,
			members,
			closed,
			deleteAssignment,
		}
	}

	async replyFail(
		interaction: ChatInputCommandInteraction,
		reason: string
	): Promise<void> {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "과제 편집 실패!",
					description: reason,
				}),
			],
		})
	}

	async replySuccess(
		interaction: ChatInputCommandInteraction,
		args: Args
	): Promise<void> {
		// todo: 변경 사항 보여주기
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: args.deleteAssignment ? "과제 삭제 성공!" : "과제 편집 성공!",
					description: args.deleteAssignment
						? `과제 \`${args.id}\`을(를) 성공적으로 삭제했습니다.`
						: `과제 \`${args.id}\`을(를) 성공적으로 편집했습니다.`,
				}),
			],
		})
	}
}
