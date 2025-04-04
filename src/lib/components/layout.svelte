<script lang="ts">
	import {
		HomeIcon,
		MapIcon,
		MergeIcon,
		MinusIcon,
		PlusCircleIcon,
		SettingsIcon,
		XIcon,
	} from '@lucide/svelte';
	import { page } from '$app/state';
	import { copyToClipboard } from '$lib/modules/ui/copy-to-clipboard';
	import { toaster } from '$lib/modules/ui/toaster';
	import { invalidateAll } from '$app/navigation';
	import { useRealtime } from '$lib/modules/hooks/use-realtime.svelte';
	import { minimizeWindow } from '$lib/modules/tauri/minimize-window';
	import { exitApplication } from '$lib/modules/tauri/exit-application';
	import { showWindow } from '$lib/modules/tauri/show-window';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children?: Snippet;
	}

	const { title, children }: Props = $props();

	const navigationItems = $derived.by(() => {
		const items = [
			{
				label: 'Home',
				Icon: HomeIcon,
				attributes: {
					href: '/',
				},
			},
		];
		if (page.data.lobby) {
			items.push({
				label: 'Lobby',
				Icon: MapIcon,
				attributes: {
					href: '/lobby',
				},
			});
		} else {
			items.push({
				label: 'Join Lobby',
				Icon: MergeIcon,
				attributes: {
					href: '/join-lobby',
				},
			});
			items.push({
				label: 'Create Lobby',
				Icon: PlusCircleIcon,
				attributes: {
					href: '/create-lobby',
				},
			});
		}
		items.push({
			label: 'Settings',
			Icon: SettingsIcon,
			attributes: {
				href: '/settings',
			},
		});
		return items;
	});

	async function copyUserId() {
		await copyToClipboard(page.data.user.id);
		toaster.info({
			title: 'User ID copied to clipboard',
		});
	}

	useRealtime('lobby', async (event) => {
		if (event.eventType === 'INSERT') {
			await invalidateAll();
		}
		if (event.eventType === 'UPDATE' && event.old.id === page.data.lobby.id) {
			await invalidateAll();
		}
		if (event.eventType === 'DELETE' && event.old.id === page.data.lobby.id) {
			await invalidateAll();
		}
	});

	// @ts-expect-error - Svelte dislikes promises, we know better
	$effect(showWindow);
</script>

<div class="flex grow flex-col">
	<header
		data-tauri-drag-region
		class="flex items-center justify-between rounded p-4"
	>
		<div class="flex items-center gap-4">
			<MapIcon />
			<div class="grid">
				<span class="font-bold">Trial Sync</span>
				<button
					class="text-xs text-neutral-500 hover:underline"
					onclick={copyUserId}>User ID: {page.data.user.id}</button
				>
			</div>
		</div>
		<div class="flex gap-2">
			<button
				class="rounded p-2 transition-colors hover:bg-neutral-500/50"
				onclick={minimizeWindow}><MinusIcon /></button
			>
			<button
				class="rounded p-2 transition-colors hover:bg-red-500/50"
				onclick={exitApplication}><XIcon /></button
			>
		</div>
	</header>
	<div class="flex grow gap-4 px-4 pb-4">
		<aside
			class="flex w-full max-w-64 flex-col justify-between rounded bg-neutral-100 p-4 dark:bg-neutral-900"
		>
			<nav class="flex grow flex-col gap-2">
				{#each navigationItems as navigation (navigation)}
					{@const active = navigation.attributes.href === page.url.pathname}
					<a
						class="flex items-center justify-between gap-8 rounded px-4 py-2 whitespace-nowrap transition-colors last:mt-auto {active
							? 'bg-neutral-500/50'
							: ''} hover:bg-neutral-500/50"
						{...navigation.attributes}
					>
						<span class={active ? 'font-bold' : 'font-semibold'}
							>{navigation.label}</span
						>
						<navigation.Icon class="size-5" />
					</a>
				{/each}
			</nav>
		</aside>
		<main
			class="flex grow flex-col gap-2 rounded bg-neutral-200 p-4 dark:bg-neutral-800"
		>
			<h1 class="text-2xl font-semibold">{title}</h1>
			<hr />
			<div class="grow">
				{@render children?.()}
			</div>
		</main>
	</div>
</div>

<style>
	:global(html),
	:global(body) {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
</style>
