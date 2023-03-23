import fetch from "node-fetch"

/**
 * Checks if a file exists in a GitHub repository.
 * If `success` is set to `true`, it means that we know whether the file exists or not for sure.
 * If it's set to `false`, it means that we can't tell for certain whether the file exists or not.
 */
export default async function (
	username: string,
	repo: string,
	filePath: string
): Promise<
	{ success: true; data: boolean } | { success: false; reason: string }
> {
	const response = await fetch(
		`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`,
		{ headers: { Authorization: process.env.GITHUB_PAT } }
	)

	if (response.headers.get("x-ratelimit-remaining") === "0")
		return {
			success: false,
			reason: "Reached GitHub API limit. Try again later.",
		}

	if (response.ok) return { success: true, data: true }
	if (response.status === 404) return { success: true, data: false }

	return {
		success: false,
		reason: `Unknown server error. GitHub API server returned ${response.status}`,
	}
}
