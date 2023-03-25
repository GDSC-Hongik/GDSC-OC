import { EmbedBuilder } from "@discordjs/builders"
import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import type { ChatInputCommandInteraction } from "discord.js"

import { CreateUserFailReason, createUser } from "../lib/firebase"

const optionName = "코드"

enum FailReason {
	InvalidUID,
	CannotGetMemberRoles,
	AlreadyRegistered,
}

export class RegisterCommand extends Command {
	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName("등록")
				.setDescription("본인 인증 코드로 등록")
				.addStringOption((option) =>
					option
						.setName(optionName)
						.setDescription("본인 인증 코드")
						.setRequired(true)
				)
				.setDMPermission(false)
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		// check if guild member data exists
		if (!interaction.member)
			return this.replyFail(interaction, FailReason.CannotGetMemberRoles)

		// get UID from command input
		const uid = interaction.options.getString(optionName)
		if (!uid) return this.replyFail(interaction, FailReason.InvalidUID)

		// create user

		let roles: string[] = []
		if (Array.isArray(interaction.member.roles))
			roles = interaction.member.roles
		else
			for (const [, role] of interaction.member.roles.cache)
				if (role.name !== "@everyone") roles.push(role.id)

		const createUserResult = await createUser(uid, {
			achievements: [],
			attendance: [],
			discordID: interaction.user.id,
			points: 0,
			roles,
			upvotesGiven: {},
			upvotesReceived: {},
		})
		if (!createUserResult.success)
			return createUserResult.reason ===
				CreateUserFailReason.USER_ALREADY_EXISTS
				? this.replyFail(interaction, FailReason.AlreadyRegistered)
				: this.replyFail(interaction, FailReason.InvalidUID)

		// return feedback
		this.replySuccess(interaction)
	}

	async replySuccess(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "등록 완료!",
					description: "`/프로필` 커맨드를 이용해보세요",
				}),
			],
			ephemeral: true,
		})
	}

	async replyFail(
		interaction: ChatInputCommandInteraction,
		reason: FailReason
	) {
		let description = "알 수 없는 에러"

		switch (reason) {
			case FailReason.CannotGetMemberRoles: {
				description = "사용자의 역할 정보를 불러들일 수 없습니다."
				break
			}

			case FailReason.InvalidUID: {
				description =
					"본인 인증 코드가 우효하지 않습니다. `/가입` 후 이용해주세요."
				break
			}

			case FailReason.AlreadyRegistered: {
				description =
					"인증이 이미 완료되었습니다. 재인증을 받기 위해선 관리자에게 연락하세요."
				break
			}
		}

		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "본인 인증 실패!",
					description,
				}),
			],
			ephemeral: true,
		})
	}
}
