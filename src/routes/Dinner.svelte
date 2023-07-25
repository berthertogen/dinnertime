<script lang="ts">
	import Paper, { Title, Content } from '@smui/paper';
	import IconButton from '@smui/icon-button';
	import { last3Dinners, dinnersToday, lastDinnerAt, timeFromLastDinner } from './stores';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function deleteDinner(dinner: any) {
		dispatch('deleteDinner', dinner);
	}
</script>

<Paper>
	<Title>Dinners</Title>
	<Content>
		Last dinner was at <strong>{$lastDinnerAt}</strong><br />
		which was <strong>{$timeFromLastDinner}</strong> hours ago<br />
		Had <strong>{$dinnersToday}</strong> dinner(s) today<br />
		<p>Last 3 dinners:</p>
		<div class="list">
			{#each $last3Dinners as dinner}
				<div class="row">
					{dinner.display}
					<IconButton class="material-icons" on:click={() => deleteDinner(dinner.dinner)}
						>delete</IconButton
					>
				</div>
			{/each}
		</div>
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
