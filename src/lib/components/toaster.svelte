<script lang="ts">
	import { toaster } from '$lib/modules/ui/toaster';
	import { normalizeProps, useMachine } from '@zag-js/svelte';
	import * as toast from '@zag-js/toast';
	import Toast from './toast.svelte';

	const id = $props.id();
	const service = useMachine(toast.group.machine, () => ({
		id: id,
		store: toaster,
	}));
	const api = $derived(toast.group.connect(service, normalizeProps));
</script>

<div {...api.getGroupProps()}>
	{#each api.getToasts() as toast, index (toast.id)}
		<Toast {toast} {index} {service}></Toast>
	{/each}
</div>
