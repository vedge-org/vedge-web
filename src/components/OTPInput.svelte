<script lang="ts">
	import { onMount } from 'svelte';

	let { otp = $bindable(['', '', '', '', '']) } = $props();
	let inputRefs: HTMLInputElement[] = [];

	onMount(() => {
		inputRefs[0]?.focus();
	});
</script>

<div class="container">
	{#each Array.from({ length: 5 }) as _, index}
		<input
			type="text"
			class="input"
			bind:value={otp[index]}
			oninput={(e) => {
				const target = e.target as HTMLInputElement;
				if (target.value.length > 1) {
					target.value = target.value.slice(0, 1);
				}
				if (target.value && index < 5) {
					inputRefs[index + 1]?.focus();
				}
			}}
			onkeydown={(e) => {
				if (e.key === 'Backspace' && !otp[index] && index > 0) {
					inputRefs[index - 1]?.focus();
				}
			}}
			bind:this={inputRefs[index]}
			class:notempty={otp[index] !== ''}
		/>
	{/each}
</div>

<style lang="scss">
	.container {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		align-self: stretch;
	}

	.input {
		caret-color: transparent; /* 깜빡이는 커서 없애기 */
		outline: none;
		width: 64px;
		height: 64px;
		border-radius: 50%;
		color: var(--Fixed-Backgound-White, #fff);
		text-align: center;
		font-family: Interop;
		font-size: 20px;
		font-style: normal;
		border: none;
		background: none;
		font-weight: 600;
		user-select: none; /* 텍스트 선택 방지 */
		line-height: 28px;
		letter-spacing: -0.8px;
		transition:
			box-shadow 0.2s ease,
			background 0.2s ease,
			color 0.2s ease;
		box-shadow: inset 0 0 0 1px $background-gray-border;
		&.notempty {
			background: #000;
			box-shadow: none;
			&:focus {
				box-shadow: none;
			}
		}
		&:focus {
			box-shadow: inset 0 0 0 2px $fixed-contents-accent;
		}
	}
</style>
