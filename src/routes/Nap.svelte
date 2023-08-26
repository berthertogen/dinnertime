<script lang="ts">
	import Paper, { Title, Content } from '@smui/paper';
	import IconButton from '@smui/icon-button';
	import { last3Naps, lastNap, napsToday, lastNapElapsed, timeFromLastNap } from './stores';
	import { createEventDispatcher } from 'svelte';
	import Dialog, { Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import { invalidateAll } from '$app/navigation';
	import Textfield from '@smui/textfield';

	$: open = false;
	let timeFrom = '';
	let timeTill = '';
	let editingNap: any = null;

	const dispatch = createEventDispatcher();

	function deleteNap(nap: any) {
		dispatch('deleteNap', nap);
	}
	async function openNapUpdater(nap: any) { 
		open = true;
		timeFrom = nap.nap.from.toFormat('HH:mm');
		timeTill = nap.sleeping ? '' : nap.nap.till.toFormat('HH:mm');
		editingNap = nap;
	}

	async function updateNap() {
		dispatch('editNap', {
			nap: {...editingNap},
			timeFrom,
			timeTill
		});
		invalidateAll().then(() => {
			open = false;
			timeFrom = '';
			timeTill = '';
			editingNap = null;
		});
	}
</script>

<Paper class="nap">
	<Title>Naps</Title>
	<Content>
		{#if $lastNap?.sleeping}
			Been sleeping for <strong>{$lastNapElapsed}</strong> hours<br />
		{:else}
			Slept for <strong>{$lastNapElapsed}</strong> hours<br />
			which was <strong>{$timeFromLastNap}</strong> hours ago<br />
		{/if}
		Had <strong>{$napsToday}</strong> nap(s) today
		<p>Last 3 naps:</p>
		{#each $last3Naps as nap}
			<div class="row">
				{nap.from} - {nap.till} ({nap.elapsed || $lastNapElapsed} hours)
				<IconButton class="material-icons" on:click={() => openNapUpdater(nap)}>edit</IconButton>
				<IconButton class="material-icons" on:click={() => deleteNap(nap)}>delete</IconButton>
			</div>
		{/each}
	</Content>
</Paper>

<Dialog bind:open>
	<div class="timefields">
	<Textfield type="time" bind:value={timeFrom} label="From"/>
	<Textfield type="time" bind:value={timeTill} label="To"/>
	</div>
	<Actions>
		<Button on:click={() => (open = false)}>
			<Label>Cancel</Label>
		</Button>
		<Button
			on:click={async () => {
				await updateNap();
			}}
		>
			<Label>Save</Label>
		</Button>
	</Actions>
</Dialog>

<style>
	.row:last-child {
		border-bottom: none;
	}
	.row {
		border-bottom: 1px solid #676778;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.timefields {
		margin: 1em;
		display: flex;
    flex-direction: column;
	}
</style>
