<script>
	import { Heading } from "flowbite-svelte"
	import { page } from "$app/stores"
</script>

<Heading class="text-center">{$page.status} - {$page.error?.message}</Heading>
