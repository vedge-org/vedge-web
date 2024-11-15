<script lang="ts">
	import Kebab from '../images/Kebab.svelte';
	import { clickOutside } from '$lib/clickOutside';
	import { fly } from 'svelte/transition';
	let menuVisible = $state(false);
	function closeMenu() {
		menuVisible = false;
	}
	let {
		id,
		image,
		name,
		date,
		address,
		count,
		amount
	}: {
		id: number;
		image: string;
		name: string;
		date: string;
		address: string;
		count: number;
		amount: number;
	} = $props();
</script>

<div class="container">
	<img src={image} alt="ticket poster" class="poster" />
	<div class="contents">
		<div class="headline accent">
			{name}
		</div>
		<div class="headline accent">
			총 {count}매, {count * amount}원
		</div>
		<div class="subinfo label">
			예매 번호 : {id}
		</div>
		<div class="subinfo label">공연 일시 : 10월 4일 금요일 16시 (D:4, D:5)</div>
		<div class="contentStatus">
			<div class="subinfo label">예매 상태 :</div>
		</div>
	</div>
	<button class="right" onclick={() => (menuVisible = true)}>
		<Kebab />
	</button>
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
				취소하기
			</button>
		</div>
	{/if}
</div>

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
		color: $contents-status-negative;
		&:active {
			transform: scale(0.98);
		}
	}
	.right {
		position: relative;
		background: none;
		border: none;
		width: 28px;
		height: 28px;
		display: flex;
		justify-content: center;
		align-items: center;
		transition:
			transform 0.3s ease-in-out,
			opacity 0.3s ease-in-out;
		cursor: pointer;
		&:hover {
			opacity: 0.9;
		}
		&:active {
			transform: scale(0.98);
		}
	}
	.contentStatus {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}
	.subinfo {
		color: $contents-default-secondary;
	}
	.container {
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 16px;
		align-self: stretch;
	}
	.poster {
		display: flex;
		width: 135.294px;
		height: 184px;
		background-size: cover;
		background-position: center;
		border-radius: 4px;
	}
	.contents {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		flex: 1 0 0;
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
