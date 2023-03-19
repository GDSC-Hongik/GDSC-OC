<script>
	import "../app.css"

	import { onMount } from "svelte"
	import { browser } from "$app/environment"

	import { auth } from "$lib/firebase/firebase.client"
	import { authStore } from "../stores/authStore"

	import { SvelteToast } from "@zerodevx/svelte-toast"
	import { browserSessionPersistence, setPersistence } from "firebase/auth"

	onMount(async () => {
		await setPersistence(auth, browserSessionPersistence)

		const unsubscribe = auth.onAuthStateChanged((user) => {
			authStore.update((curr) => {
				return {
					...curr,
					isLoading: false,
					currentUser: user,
				}
			})

			if (
				browser &&
				!$authStore.currentUser &&
				!$authStore.isLoading &&
				window.location.pathname !== "/"
			)
				window.location.href = "/"
		})

		return unsubscribe
	})
</script>

<slot />
<SvelteToast />
