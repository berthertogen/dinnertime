<script lang="ts">
	import { page } from '$app/stores';
	import Dinner from './Dinner.svelte';
	import Nap from './Nap.svelte';
	import { invalidateAll } from '$app/navigation';
	import { dinners, naps, loader } from './stores';

	$: naps.set($page.data.naps);
	$: dinners.set($page.data.dinners);

	async function handleDeleteDinner(event: any) {
		await deleteDinner(event.detail);
	}
	async function handleDeleteNap(event: any) {
		await deleteNap(event.detail);
	}

	async function deleteDinner(dinner: any) {
		loader.set(true);
		await fetch('/api/deletedinner', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(dinner)
		});
		invalidateAll().then(() => {
			loader.set(false);
		});
	}
	async function deleteNap(nap: any) {
		loader.set(true);
		await fetch('/api/deletenap', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(nap.from_date)
		});
		invalidateAll().then(() => {
			loader.set(false);
		});
	}
</script>

<slot name="main">
	<Dinner on:deleteDinner={handleDeleteDinner} />
	<Nap on:deleteNap={handleDeleteNap} />
</slot>
