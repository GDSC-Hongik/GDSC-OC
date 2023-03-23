import fetch from "node-fetch"

import { getGitHubUID, githubCache } from "."

/**
 * Converts firebase user UID to GitHub username.
 */
export default async function (
	firebaseUID: string
): Promise<
	{ success: true; data: string } | { success: false; reason: string }
> {
	if (githubCache.usernames[firebaseUID])
		return { success: true, data: githubCache.usernames[firebaseUID] }

	const githubUID = await getGitHubUID(firebaseUID)
	if (!githubUID)
		return {
			success: false,
			reason: "Failed to convert firebase auth user ID to github UID",
		}

	const response = await fetch(`https://api.github.com/user/${githubUID}`, {
		headers: { Authorization: process.env.GITHUB_PAT },
	})

	if (response.headers.get("x-ratelimit-remaining") === "0")
		return {
			success: false,
			reason: "Reached GitHub API limit. Try again later.",
		}

	const data = (await response.json()) as { login: string }

	return {
		success: true,
		data: (githubCache.usernames[githubUID] = data.login),
	}
}
