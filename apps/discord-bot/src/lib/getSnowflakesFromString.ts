/**
 * Takes a string as input and returns an array of user snowflake strings.
 *
 * @param str - An arbitrary string
 * @returns - A string array of user snowflakes
 */
export default function (str: string | undefined | null): string[] {
	if (!str) return []

	// match all strings that look like "<@XXXXXXXXXXXXXXXXXXX>"
	return (str.match(/<@\d+>/g) || []).map((matchingStr) =>
		// remove "<@" and ">"
		matchingStr.slice(2, -1)
	)
}
