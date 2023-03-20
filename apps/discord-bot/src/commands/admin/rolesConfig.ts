import { EmbedBuilder, roleMention } from "@discordjs/builders"
import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import { APIRole, ChatInputCommandInteraction, Role } from "discord.js"

import { setRolePoint } from "../../lib/firebase"

enum OptionName {
	ACTION = "작업",
	ROLE = "역할",
	DEVRATING_POINT = "devrating-기여값",
}

enum ActionType {
	REGISTER = "등록/갱신",
	UNREGISTER = "등록 취소",
}

export class RolesConfigCommand extends Command {
	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName("역할-설정")
				.setDescription("멤버 역할 설정")
				.addStringOption((option) =>
					option
						.setName(OptionName.ACTION)
						.setDescription("수행할 작업")
						.setChoices(
							{ name: ActionType.REGISTER, value: ActionType.REGISTER },
							{ name: ActionType.UNREGISTER, value: ActionType.UNREGISTER }
						)
						.setRequired(true)
				)
				.addRoleOption((option) =>
					option
						.setName(OptionName.ROLE)
						.setDescription("역할")
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName(OptionName.DEVRATING_POINT)
						.setDescription("포인트")
						.setRequired(false)
				)
				.setDMPermission(false)
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		// get action type from command input
		const action = interaction.options.getString(OptionName.ACTION)
		if (!action) return this.replyError(interaction, "선택한 작업이 없습니다")

		// get role from command input
		const role = interaction.options.getRole(OptionName.ROLE)
		if (!role) return this.replyError(interaction, "선택한 역할이 없습니다")

		switch (action) {
			case ActionType.REGISTER: {
				this.registerRole(interaction, role)
				return
			}

			case ActionType.UNREGISTER: {
				this.unregisterRole(interaction, role)
				return
			}

			default: {
				this.replyError(interaction, "올바른 작업이 아닙니다.")
				return
			}
		}
	}

	async registerRole(
		interaction: ChatInputCommandInteraction,
		role: Role | APIRole
	) {
		// get point value from command input
		const ratingPoint = interaction.options.getInteger(
			OptionName.DEVRATING_POINT
		)
		if (!ratingPoint)
			return this.replyError(interaction, "포인트값을 전달하지 않으셨습니다")

		setRolePoint(role.id, ratingPoint)

		await this.replySuccess(
			interaction,
			`역할 ${roleMention(role.id)}이(가) 성공적으로 등록/갱신되었습니다.
(devRating 기여값: \`${ratingPoint}\`)`
		)
	}

	async unregisterRole(
		interaction: ChatInputCommandInteraction,
		role: Role | APIRole
	) {
		setRolePoint(role.id, 0)

		await this.replySuccess(
			interaction,
			`역할 ${roleMention(role.id)}이(가) 성공적으로 등록 취소되었습니다.`
		)
	}

	async replySuccess(interaction: ChatInputCommandInteraction, reason: string) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "역할 설정 성공",
					description: reason,
				}),
			],
		})
	}

	async replyError(interaction: ChatInputCommandInteraction, reason: string) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "역할 설정 실패",
					description: reason,
				}),
			],
		})
	}
}
