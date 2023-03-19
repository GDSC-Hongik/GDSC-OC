<script lang="ts">
	import { authStore, login, logout } from "../stores/authStore"
	import { toast } from "@zerodevx/svelte-toast"
	import { Button, P } from "flowbite-svelte"

	/**
	 * AuthState가 signedIn일 시에만 작동
	 */
	async function copyUIDToClipboard() {
		if (!$authStore.currentUser)
			return toast.push("사용자 정보를 불러올 수 없습니다.", {
				theme: {
					"--toastBackground": "darkred",
					"--toastBarBackground": "tomato",
				},
			})

		await navigator.clipboard.writeText($authStore.currentUser.uid)
		toast.push("코드가 복사되었습니다!")
	}
</script>

<svelte:head>
	<title>GDSC Open Community</title>
</svelte:head>

<div class="m-5 flex flex-col gap-3">
	{#if $authStore.isLoading}
		<P>로딩중</P>
	{:else if $authStore.currentUser}
		<P size="2xl">
			가입 완료. 디스코드 서버에서 "/등록" 명령어를 이용해 본인 인증 코드를
			등록하세요.
		</P>
		<Button on:click={copyUIDToClipboard}>코드 복사</Button>
		<Button on:click={logout}>로그아웃</Button>
	{:else}
		<Button on:click={login}>GitHub 계정으로 등록</Button>
	{/if}
</div>
