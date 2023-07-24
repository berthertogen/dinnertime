<script lang="ts">
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
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
	import SveltyPicker from 'svelty-picker';

	let bottomAppBar: BottomAppBar;

	$: naps.set($page.data.naps);
	$: dinners.set($page.data.dinners);
	$: loading = false;
	$: open = false;
	$: myTime = DateTime.now().toFormat('HH:mm');

	async function openTimePicker() {
		open = true;
	}

	async function addDinner() {
		loading = true;
		const datetime = DateTime.fromFormat(myTime, 'HH:mm');
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
			open = false;
			myTime = DateTime.now().toFormat('HH:mm');
		});
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
		});
	}
</script>

<LinearProgress indeterminate closed={!loading} />

<AutoAdjust {bottomAppBar}>
	<Dinner />
	<Nap />
	<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
		<SveltyPicker
			pickerOnly={true}
			mode="time"
			format="hh:ii"
			clearBtn={false}
			bind:value={myTime}
		/>
		<Actions>
			<Button on:click={() => (open = false)}>
				<Label>Cancel</Label>
			</Button>
			<Button
				on:click={async () => {
					await addDinner();
				}}
			>
				<Label>Save</Label>
			</Button>
		</Actions>
	</Dialog>
</AutoAdjust>

<BottomAppBar bind:this={bottomAppBar}>
	<Section>
		<IconButton class="material-icons" aria-label="Home" href="/">home</IconButton>
	</Section>
	<Section>
		<Fab aria-label="Add dinner">
			<Icon class="material-icons" on:click={() => openTimePicker()}>restaurant</Icon>
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
