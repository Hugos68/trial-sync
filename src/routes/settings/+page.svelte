<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import Layout from '$lib/components/layout.svelte';
	import { useForm } from '$lib/modules/hooks/use-form.js';
	import { OverlaySettingsSchema } from '$lib/modules/schemas/overlay-settings-schema';
	import { POSITIONS } from '$lib/modules/tauri/positions.js';
	import { overlaySettings } from '$lib/modules/ui/overlay-settings';
	import { toaster } from '$lib/modules/ui/toaster.js';
	import { LoaderCircleIcon } from '@lucide/svelte';
	import { valibot } from 'sveltekit-superforms/adapters';

	const { data } = $props();

	const { form, errors, enhance, submitting, isTainted, tainted } = useForm(
		data.form,
		{
			validators: valibot(OverlaySettingsSchema),
			resetForm: false,
			async onUpdate(event) {
				if (!event.form.valid) {
					return;
				}
				overlaySettings.current = event.form.data;
				toaster.success({
					title: 'Successfully updated settings',
				});
			},
		},
	);
</script>

<Layout title="Settings">
	<form
		class="flex h-full flex-col gap-4"
		method="post"
		autocomplete="off"
		use:enhance
	>
		<label class="grid gap-1">
			<span class="text-sm">Overlay Size</span>
			<input
				type="number"
				class="rounded bg-transparent"
				bind:value={$form.size}
			/>
			{#if $errors.size}
				<span class="text-sm text-red-500">{$errors.size.join(', ')}</span>
			{/if}
		</label>
		<label class="grid gap-1">
			<span class="text-sm">Overlay Opacity</span>
			<input
				type="number"
				class="rounded bg-transparent"
				bind:value={$form.opacity}
			/>
			{#if $errors.opacity}
				<span class="text-sm text-red-500">{$errors.opacity.join(', ')}</span>
			{/if}
		</label>
		<label class="grid gap-1">
			<span class="text-sm">Overlay Position</span>
			<select
				bind:value={$form.position}
				class="rounded bg-neutral-200 dark:bg-neutral-800"
			>
				{#each POSITIONS as position (position)}
					<option value={position} selected={$form.position === position}>
						{position}
					</option>
				{/each}
			</select>
			{#if $errors.position}
				<span class="text-sm text-red-500">{$errors.position.join(', ')}</span>
			{/if}
		</label>
		<Button
			class="mt-auto ml-auto"
			disabled={$submitting || !isTainted($tainted)}
		>
			{#if $submitting}
				<LoaderCircleIcon class="animate-spin" />
			{:else}
				Update Settings
			{/if}
		</Button>
	</form>
</Layout>
