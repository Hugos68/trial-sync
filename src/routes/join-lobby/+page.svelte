<script lang="ts">
	import { valibot } from 'sveltekit-superforms/adapters';
	import Button from '$lib/components/button.svelte';
	import { supabase } from '$lib/modules/supabase/client.js';
	import { toaster } from '$lib/modules/ui/toaster.js';
	import { JoinLobbySchema } from '$lib/modules/schemas/join-lobby-schema.js';
	import { useForm } from '$lib/modules/hooks/use-form.js';
	import Layout from '$lib/components/layout.svelte';
	import { LoaderCircleIcon } from '@lucide/svelte';

	const { data } = $props();

	const { form, errors, enhance, submitting } = useForm(data.form, {
		validators: valibot(JoinLobbySchema),
		async onUpdate(event) {
			if (!event.form.valid) {
				return;
			}
			const joinLobbyResponse = await supabase
				.from('lobby_member')
				.insert(event.form.data);
			if (joinLobbyResponse.error) {
				event.form.valid = false;
				toaster.error({
					title: 'Failed to join lobby',
					description: joinLobbyResponse.error.details,
				});
				return;
			}
			toaster.success({
				title: 'Successfully joined lobby',
			});
		},
	});
</script>

<Layout title="Join Lobby">
	<form
		class="flex h-full flex-col gap-4"
		method="post"
		autocomplete="off"
		use:enhance
	>
		<label class="grid gap-1">
			<span class="text-sm">Lobby ID</span>
			<input
				name="lobby-id"
				class="rounded bg-transparent"
				placeholder="Lobby ID"
				bind:value={$form.lobby_id}
			/>
			{#if $errors.lobby_id}
				<span class="text-sm text-red-500">{$errors.lobby_id.join(', ')}</span>
			{/if}
		</label>
		<Button class="mt-auto ml-auto" disabled={$submitting}>
			{#if $submitting}
				<LoaderCircleIcon class="animate-spin" />
			{:else}
				Join Lobby
			{/if}
		</Button>
	</form>
</Layout>
