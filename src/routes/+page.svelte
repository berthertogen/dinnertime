<script lang="ts">
	import LinearProgress from '@smui/linear-progress';
	import BottomAppBar, { Section, AutoAdjust } from '@smui-extra/bottom-app-bar';
	import IconButton from '@smui/icon-button';
	import { page } from '$app/stores';
	import Fab, { Icon } from '@smui/fab';
	import Dinner from './Dinner.svelte';
	import Nap from './Nap.svelte';
	import { DateTime } from 'luxon';
	import { invalidateAll } from '$app/navigation';
	import { dinners, lastNap, naps } from './stores';

	let bottomAppBar: BottomAppBar;

	$: naps.set($page.data.naps);
	$: dinners.set($page.data.dinners);
	$: loading = false


	async function addDinner() {
		loading = true;
		const time = DateTime.now().toFormat('HH:mm');
		const datetime = DateTime.fromFormat(time, 'HH:mm');
		await fetch(`/api/postdinner`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(datetime.toISO())
		});
		invalidateAll().then(() => {
			loading = false;
		})
	}
	async function toggleNap(sleeping: boolean) {
		loading = true;
		const time = DateTime.now().toFormat('HH:mm');
		const datetime = DateTime.fromFormat(time, 'HH:mm');
		const startStop = sleeping ? 'stop' : 'start';
		await fetch(`/api/postnap${startStop}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(datetime.toISO())
		});
		invalidateAll().then(() => {
			loading = false;
		})
	}
</script>

<LinearProgress indeterminate closed={!loading} />

<AutoAdjust {bottomAppBar}>
	<Dinner />
	<Nap />
</AutoAdjust>

<BottomAppBar bind:this={bottomAppBar}>
	<Section>
		<IconButton class="material-icons" aria-label="Home" href="/">home</IconButton>
	</Section>
	<Section>
		<Fab aria-label="Add dinner">
			<Icon class="material-icons" on:click={() => addDinner()}>restaurant</Icon>
		</Fab>
		<Fab aria-label="Start/Stop nap">
			<Icon class="material-icons" on:click={() => toggleNap($lastNap?.sleeping)}>
				{$lastNap?.sleeping ? 'stop' : 'play_arrow'}
			</Icon>
		</Fab>
	</Section>
</BottomAppBar>

<style>
</style>
