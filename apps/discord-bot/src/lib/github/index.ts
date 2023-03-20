import fileExists from "./fileExists"
import getGitHubUID from "./getGitHubUID"
import getGitHubUsername from "./getGitHubUsername"

interface GithubCache {
	// maps firebase UID -> github UID
	ids: { [firebaseUID: string]: string }

	// maps firebase UID -> GitHub usernames
	usernames: { [firebaseUID: string]: string }
}

export const githubCache: GithubCache = {
	ids: {},
	usernames: {},
}

export { fileExists, getGitHubUID, getGitHubUsername }
