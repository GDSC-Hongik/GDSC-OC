import fetch from "node-fetch"

import { getGitHubUID, githubCache } from "."

/**
 * Converts firebase user UID to GitHub username.
 */
export default async function (
	firebaseUID: string
): Promise<string | undefined> {
	if (githubCache.usernames[firebaseUID])
		return githubCache.usernames[firebaseUID]

	const githubUID = await getGitHubUID(firebaseUID)
	if (!githubUID) {
		console.error("Failed to ")
		return undefined
	}

	const response = await fetch(`https://api.github.com/user/${githubUID}`)
	const data = (await response.json()) as { login: string }

	return (githubCache.usernames[githubUID] = data.login)
}
