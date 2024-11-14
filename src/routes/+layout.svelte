<script lang="ts">
	import '../styles/theme.scss';
	import '../styles/typography.scss';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { page } from '$app/stores';

	// 현재 페이지 URL을 구독하여 트랜지션 적용
	$: key = $page.url.pathname;
</script>

{#key key}
	<div
		class="wrapper"
		in:fly={{
			x: 20,
			duration: 300,
			delay: 300,
			easing: quintOut
		}}
		out:fly={{
			x: -20,
			duration: 300,
			easing: quintOut
		}}
	>
		<slot />
	</div>
{/key}

<style lang="scss">
	@import '../styles/theme.scss';
	.wrapper {
		position: relative;
		width: 100%;
		height: 100%;
	}
</style>
