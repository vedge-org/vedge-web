<script lang="ts">
	import '../styles/theme.scss';
	import '../styles/typography.scss';
	import { page } from '$app/stores';

	// 현재 페이지 URL을 구독하여 트랜지션 적용
	$: key = $page.url.pathname;

	import { sessionStore } from '../stores/sessionStore';
	import { onMount, onDestroy } from 'svelte';

	onMount(() => {
		sessionStore.fetchSession();
	});

	onDestroy(() => {
		sessionStore.reset();
	});
</script>

<slot />

<style lang="scss">
	@import '../styles/theme.scss';
</style>
