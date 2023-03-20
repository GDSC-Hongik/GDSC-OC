import { z } from "zod"

export const tierSchema = z.enum(["UNRANKED", "I", "II", "III", "IV", "V"])

export type Tier = z.infer<typeof tierSchema>

export const defaultTier = tierSchema.enum.UNRANKED

export const devRating2Tier: { [key in keyof typeof tierSchema.Enum]: number } =
	{
		[tierSchema.enum.UNRANKED]: 0,
		[tierSchema.enum.I]: 20,
		[tierSchema.enum.II]: 250,
		[tierSchema.enum.III]: 500,
		[tierSchema.enum.IV]: 1000,
		[tierSchema.enum.V]: 2000,
	}
