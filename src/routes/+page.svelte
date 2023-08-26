<script lang="ts">
	import { page } from '$app/stores';
	import Dinner from './Dinner.svelte';
	import Nap from './Nap.svelte';
	import { invalidateAll } from '$app/navigation';
	import { dinners, naps, loader } from './stores';
	import { DateTime } from 'luxon';

	$: naps.set($page.data.naps);
	$: dinners.set($page.data.dinners);

	async function handleDeleteDinner(event: any) {
		await deleteDinner(event.detail);
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

	async function handleDeleteNap(event: any) {
		await deleteNap(event.detail);
	}
	async function deleteNap(nap: any) {
		loader.set(true);
		await fetch('/api/deletenap', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				from: nap.nap.from,
				till: nap.nap.till,
			})
		});
		invalidateAll().then(() => {
			loader.set(false);
		});
	}
	
	async function handleEditNap(event: any) {
		await deleteNap(event.detail.nap);
		await editNap(event);
	}
	async function editNap(event: any) {
		loader.set(true);
		await fetch('/api/postnap', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				from: DateTime.fromFormat(event.detail.timeFrom, 'HH:mm').toISO(),
				till: event.detail.timeTill ? DateTime.fromFormat(event.detail.timeTill, 'HH:mm').toISO() : undefined
			})
		});
		invalidateAll().then(() => {
			loader.set(false);
		});
	}
</script>

<slot name="main">
	<Dinner on:deleteDinner={handleDeleteDinner} />
	<Nap on:deleteNap={handleDeleteNap} on:editNap={handleEditNap} />
</slot>
