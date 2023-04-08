import { type Auth } from "firebase-admin/auth"

export let auth: Auth

export function setAuth(newAuth: Auth) {
	auth = newAuth
}
