<script lang="ts">
	interface ConcertProps {
		id: number;
		image: string;
		name: string;
		date: string;
		address: string;
	}
	let { id, image, name, date, address }: ConcertProps = $props();
</script>

<div class="concert">
	<img class="poster" src={image} alt={name} />
	<div>
		<div class="concert-title body accent">
			{name}
		</div>
		<div class="info caption">{date}</div>
		<div class="info caption">{address}</div>
	</div>
</div>

<style lang="scss">
	.poster {
		width: 175px;
		aspect-ratio: 3 / 4;
		border-radius: 4px;
		background-position: center;
		background-size: cover;
	}

	.concert {
		display: flex;
		width: 175px;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 4px;
		cursor: pointer;
		transition: transform 0.3s ease-in-out;

		&:hover {
			transform: translateY(-8px);
		}
	}

	.concert-title {
		color: $contents-default-primary;
	}

	.info {
		color: $contents-default-quaternary;
	}
</style>
