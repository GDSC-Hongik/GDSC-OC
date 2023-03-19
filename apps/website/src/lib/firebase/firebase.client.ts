import { dev } from "$app/environment"
import {
	PUBLIC_FB_API_KEY,
	PUBLIC_FB_APP_ID,
	PUBLIC_FB_AUTH_DOMAIN,
	PUBLIC_FB_MESSAGING_SENDER_ID,
	PUBLIC_FB_PROJECT_ID,
	PUBLIC_FB_STORAGE_BUCKET,
} from "$env/static/public"
import { initializeApp } from "firebase/app"
import type { FirebaseOptions } from "firebase/app"
import { connectAuthEmulator, getAuth } from "firebase/auth"

// Initialize Firebase

const firebaseClientConfig: FirebaseOptions = {
	apiKey: PUBLIC_FB_API_KEY,
	authDomain: PUBLIC_FB_AUTH_DOMAIN,
	projectId: PUBLIC_FB_PROJECT_ID,
	storageBucket: PUBLIC_FB_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FB_MESSAGING_SENDER_ID,
	appId: PUBLIC_FB_APP_ID,
}

const app = initializeApp(firebaseClientConfig)
const auth = getAuth(app)

if (dev) connectAuthEmulator(auth, "http://localhost:9099")

export { auth }
