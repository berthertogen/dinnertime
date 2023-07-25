<script lang="ts">
	import LinearProgress from '@smui/linear-progress';
	import Dialog, { Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import BottomAppBar, { Section, AutoAdjust } from '@smui-extra/bottom-app-bar';
	import { DateTime } from 'luxon';
	import IconButton from '@smui/icon-button';
	import Fab, { Icon } from '@smui/fab';
	import SveltyPicker from 'svelty-picker';

	import { lastNap, loader } from './stores';
	import { invalidateAll } from '$app/navigation';

	let bottomAppBar: BottomAppBar;

	$: myTime = DateTime.now().toFormat('HH:mm');
	$: open = false;

	async function openTimePicker() {
		myTime = DateTime.now().toFormat('HH:mm');
		open = true;
	}
	async function addDinner() {
		loader.set(true);
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
			loader.set(false);
			open = false;
			myTime = DateTime.now().toFormat('HH:mm');
		});
	}
	async function toggleNap(sleeping: boolean) {
		loader.set(true);
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
			loader.set(false);
		});
	}
</script>

<LinearProgress indeterminate closed={!$loader} />

<AutoAdjust {bottomAppBar}>
	<slot></slot>
	<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
		{#key myTime}
			<SveltyPicker
				pickerOnly={true}
				mode="time"
				format="hh:ii"
				clearBtn={false}
				bind:value={myTime}
			/>
		{/key}
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
		<IconButton class="material-icons" aria-label="Stats" href="/stats">query_stats</IconButton>
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
