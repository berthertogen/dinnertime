<script lang="ts">
	import Paper, { Title, Content } from '@smui/paper';
	import IconButton from '@smui/icon-button';
	import { last3Dinners, dinnersToday, lastDinnerAt, timeFromLastDinner } from './stores';
	import { invalidateAll } from '$app/navigation';

	async function deleteDinner(dinner: any) {
		await fetch('/api/deletedinner', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(dinner)
		});
		invalidateAll();
	}
</script>

<Paper variant="unelevated">
	<Title>Dinners</Title>
	<Content>
		Last dinner was at <strong>{$lastDinnerAt}</strong><br />
		which was <strong>{$timeFromLastDinner}</strong> hours ago<br />
		Had <strong>{$dinnersToday}</strong> dinner(s) today<br />
		<p>Last 3 dinners:</p>
		{#each $last3Dinners as dinner}
			<div class="row">
				{dinner.display}
				<IconButton class="material-icons" on:click={() => deleteDinner(dinner.dinner)}>delete</IconButton>
			</div>
		{/each}
	</Content>
</Paper>

<style>
	.row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
</style>
