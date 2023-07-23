<script lang="ts">
	import Paper, { Title, Content } from '@smui/paper';
	import { last3Dinners, dinnersToday, lastDinnerAt, timeFromLastDinner } from './stores';

</script>

<Paper variant="unelevated">
	<Title>Dinners</Title>
	<Content>
		Last dinner was at <strong>{$lastDinnerAt}</strong><br />
		which was <strong>{$timeFromLastDinner}</strong> hours ago<br />
		Had <strong>{$dinnersToday}</strong> dinner(s) today<br />
    <p>Last 3 dinners:</p>
    <ul>
      {#each $last3Dinners as dinner}
      <li>{dinner}</li>
      {/each}
    </ul>
	</Content>
</Paper>
