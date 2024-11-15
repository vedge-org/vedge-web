<script lang="ts">
	import Header from '../../components/Header.svelte';
	import TicketItem from '../../components/TicketItem.svelte';
</script>

<Header />
<main>
	<div class="wrapper">
		{#each Array(3) as _}
			<TicketItem
				id={1}
				image="images/poster-1.png"
				name="2024 2NE1 CONCERT [WELCOME BACK] IN SEOUL"
				date="2024.12.31"
				address="올림픽공원 올림픽홀"
				count={2}
				amount={10000}
			/>
			<div class="divider"></div>
		{/each}
	</div>
</main>

<style lang="scss">
	.divider {
		width: 100%;
		height: 1px;
		background-color: $background-gray-border;
	}
	main {
		margin-top: 84px;
		width: 100vw;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.wrapper {
		display: flex;
		max-width: 1172px;
		min-height: 816px;
		padding: 48px 0px;
		flex-direction: column;
		align-items: flex-start;
		gap: 24px;
		width: 100%;
		align-self: stretch;
	}
</style>
