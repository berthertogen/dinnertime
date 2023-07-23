<script lang="ts">
	import Paper, { Title, Content } from '@smui/paper';
	import { last3Naps, lastNap, napsToday, lastNapElapsed } from './stores';
</script>

<Paper variant="unelevated">
	<Title>Naps</Title>
	<Content>
		{#if $lastNap?.sleeping}
			Been sleeping for <strong>{$lastNapElapsed}</strong> hours
		{:else}
			Slept for <strong>{$lastNapElapsed}</strong> hours
		{/if}<br />
		Had <strong>{$napsToday}</strong> nap(s) today
		<p>Last 3 naps:</p>
		<ul>
			{#each $last3Naps as nap}
				<li>
					{nap.from} till {nap.till} ({nap.elapsed || $lastNapElapsed} hours)
				</li>
			{/each}
		</ul>
	</Content>
</Paper>
