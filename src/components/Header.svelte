<script>
	import { clickOutside } from '$lib/clickOutside';
	import Logo from '../images/Logo.svelte';
	let selected = $state(0);
	let segPosition = $derived(selected * (90 + 12));
	const categories = ['콘서트', '뮤지컬', '전시', '행사'];
	let menuVisible = $state(false);
	let login = $state(false);
	import { fly } from 'svelte/transition';

	function closeMenu() {
		menuVisible = false;
	}
</script>

<nav class="nav">
	<div class="container">
		<div class="left">
			<Logo />
		</div>
		<div class="center">
			<div class="seg-active" style="transform: translateX({segPosition}px)"></div>
			{#each categories as category, index}
				<button
					type="button"
					class="category label"
					class:selected={selected === index}
					onclick={() => (selected = index)}
				>
					{category}
				</button>
			{/each}
		</div>
		<div class="right">
			{#if login}
				<button class="profile" onclick={() => (menuVisible = true)} />
			{:else}
				<a href="/login" class="login label" onclick={() => (login = true)}> 로그인 </a>
			{/if}

			{#if menuVisible}
				<div
					class="modal"
					transition:fly={{ y: -10, duration: 200 }}
					use:clickOutside={{ enabled: menuVisible, callback: closeMenu }}
				>
					<button
						class="label menuItem"
						onclick={() => {
							// 로그인 처리
							menuVisible = false;
						}}
					>
						티켓내역
					</button>
					<button
						class="label menuItem"
						onclick={() => {
							// 로그인 처리
							menuVisible = false;
						}}
					>
						로그아웃
					</button>
				</div>
			{/if}
		</div>
	</div>
</nav>

<style lang="scss">
	.menuItem {
		background: none;
		border: none;
		display: flex;
		padding: 8px 0px;
		justify-content: flex-start;
		align-items: center;
		gap: 10px;
		border-radius: 4px;
		align-self: stretch;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			color 0.2s ease,
			transform 0.2s ease;
		color: $contents-default-primary;
		&:hover {
			color: $contents-default-quaternary;
		}
		&:active {
			transform: scale(0.98);
		}
	}
	.profile {
		width: 26px;
		height: 26px;
		border-radius: 999px;
		background: var(--Variable-Background-Component, rgba(0, 0, 0, 0.2));
		border: none;
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
		cursor: pointer;
		&:hover {
			opacity: 0.9;
		}
		&:active {
			transform: scale(0.98);
		}
	}
	.login {
		background: none;
		border: none;
		color: $contents-default-tertiary;
		cursor: pointer;
		&:hover {
			color: $contents-default-quaternary;
		}
	}
	.nav {
		position: fixed;
		top: 0;
		z-index: 999;
		background-color: $background-gray-default;
		width: 100%;
		height: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
		align-self: stretch;
	}
	.container {
		display: flex;
		max-width: 1171px;
		padding: 0px 16px;
		align-items: center;
		flex: 1 0 0;
	}
	.left {
		display: flex;
		padding: 16px 0px;
		align-items: center;
		flex: 1 0 0;
	}
	.center {
		position: relative;
		display: flex;
		padding: 16px 0px;
		align-items: center;
		gap: 12px;
	}
	.right {
		position: relative;
		display: flex;
		padding: 16px 0px;
		justify-content: flex-end;
		align-items: center;
		gap: 16px;
		flex: 1 0 0;
	}
	.category {
		z-index: 1;
		border: none;
		background: none;
		width: 90px;
		display: flex;
		padding: 12px 0;
		justify-content: center;
		align-items: center;
		gap: 10px;
		transition:
			transform 0.2s ease-in-out,
			background-color 0.2s ease-in-out,
			color 0.2s ease-in-out;
		border-radius: 999px;
		cursor: pointer;
		color: #000;
		&:active {
			transform: scale(0.98);
		}
		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
			color: rgba(0, 0, 0, 0.6);
		}
	}

	.seg-active {
		width: 90px;
		height: 48px;
		z-index: 2;
		position: absolute;
		transition: transform 0.3s ease;
		border-radius: 999px;
		background: transparent;
		padding: 12px 0;
		backdrop-filter: invert(1);
	}

	.modal {
		border-radius: 8px;
		background: var(--background-gray-Elevated, #fff);
		box-shadow: 0px 4px 10px 0px rgba(27, 27, 41, 0.03);
		display: flex;
		width: 170px;
		padding: 12px 16px;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		position: absolute;
		right: 0;
		top: 48px;
	}
</style>
