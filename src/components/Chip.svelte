<script lang="ts">
	type ChipProps = {
		selected?: boolean;
		onClick?: () => void;
		children?: any;
	};

	const { selected, onClick, children }: ChipProps = $props();
</script>

<button class="chip label" class:selected onclick={onClick}>
	{@render children()}
</button>

<style lang="scss">
	.chip {
		display: flex;
		padding: 12px 25px;
		justify-content: center;
		align-items: center;
		border-radius: 999px;
		background: var(--fixed-background-white, #fff);
		color: var(--fixed-background-white, #000);
		border: 1px solid var(--background-gray-Border, #e7e7e9);
		color: $contents-default-primary;
		&.selected {
			background: var(--fixed-contents-accent, #000);
			color: var(--fixed-contents-accent, #fff);
			border: none;
		}
		cursor: pointer;
		&:hover {
			opacity: 0.7;
		}
		&:active {
			transform: scale(0.98);
		}
		transition:
			opacity 0.2s ease,
			transform 0.2s ease,
			background 0.2s ease,
			color 0.2s ease,
			border 0.2s ease;
	}
</style>
