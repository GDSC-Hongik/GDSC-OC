/**
 * Converts a discord snowflake ID string into a JS Date object.
 * Check https://discord.com/developers/docs/reference#snowflakes for more information.
 */
export default function (snowflake: string) {
	return new Date(Number(BigInt(snowflake) >> 22n) + 1420070400000)
}
