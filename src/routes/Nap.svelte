<script lang="ts">
	import Paper, { Title, Content } from '@smui/paper';
	import IconButton from '@smui/icon-button';
	import { last3Naps, lastNap, napsToday, lastNapElapsed, timeFromLastNap } from './stores';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function deleteNap(dinner: any) {
		dispatch('deleteNap', dinner);
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
				<IconButton class="material-icons" on:click={() => deleteNap(nap)}>delete</IconButton>
			</div>
		{/each}
	</Content>
</Paper>

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
</style>
