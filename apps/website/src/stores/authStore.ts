import { auth } from "../lib/firebase/firebase.client"
import {
	GithubAuthProvider,
	type User,
	signInWithRedirect,
	signOut,
} from "firebase/auth"
import { type Writable, writable } from "svelte/store"

export interface AuthStore {
	isLoading: boolean
	currentUser: User | null
}

export const authStore: Writable<AuthStore> = writable({
	isLoading: true,
	currentUser: null,
})

const provider = new GithubAuthProvider()

export async function login() {
	// https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps#available-scopes
	provider.addScope("user:email")

	await signInWithRedirect(auth, provider)
}

export async function logout() {
	await signOut(auth)
}
