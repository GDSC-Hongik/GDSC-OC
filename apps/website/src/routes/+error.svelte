<script>
	import { Heading } from "flowbite-svelte"
	import { page } from "$app/stores"
</script>

<Heading>{$page.status} - {$page.error?.message}</Heading>
