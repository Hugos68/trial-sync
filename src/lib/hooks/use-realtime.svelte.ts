import { supabase } from "$lib/supabase/client";
import { nanoid } from "nanoid";

interface UseRealtimeOptions<T> {
	init: T;
	table: string;
	transform?: (data: NonNullable<T>) => Promise<T> | T;
}

export function useRealtime<T extends { id: string } | undefined>(
	options: UseRealtimeOptions<T>,
) {
	const value = $state({ current: options.init });
	$effect(() => {
		if (!value.current) {
			return;
		}
		const channel = supabase.channel(nanoid());
		channel
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: options.table,
					filter: `id=eq.${value.current.id}`,
				},
				async (payload) => {
					const updated = payload.new as NonNullable<T>;
					value.current = options.transform
						? await options.transform(updated)
						: updated;
				},
			)
			.subscribe();
		return () => channel.unsubscribe();
	});
	return value;
}
