<script lang="ts">
	import { seleniumGuard } from '$lib/seleniumGuard';
	import Back from '../../images/Back.svelte';
	import Refresh from '../../images/Refresh.svelte';
	let step = $state(1);
	import axios from 'axios';
	import { onMount } from 'svelte';

	let clockImages = $state([]);
	let correctImageIndex = null;

	async function fetchClockImages() {
		try {
			const responses = await Promise.all([
				axios.post(
					'https://vedgeai.apne2a.algorix.cloud/clock_captcha_color/',
					{
						hour: Math.floor(Math.random() * 12),
						minute: Math.floor((Math.random() * 60) / 5) * 5
					},
					{
						headers: {
							'Content-Type': 'application/json',
							Accept: 'application/json'
						},
						responseType: 'arraybuffer'
					}
				),
				axios.post(
					'https://vedgeai.apne2a.algorix.cloud/clock_captcha_mono/',
					{
						hour: Math.floor(Math.random() * 12),
						minute: Math.floor((Math.random() * 60) / 5) * 5
					},
					{
						headers: {
							'Content-Type': 'application/json',
							Accept: 'application/json'
						},
						responseType: 'arraybuffer'
					}
				),
				axios.post(
					'https://vedgeai.apne2a.algorix.cloud/clock_captcha_mono/',
					{
						hour: Math.floor(Math.random() * 12),
						minute: Math.floor((Math.random() * 60) / 5) * 5
					},
					{
						headers: {
							'Content-Type': 'application/json',
							Accept: 'application/json'
						},
						responseType: 'arraybuffer'
					}
				)
			]);

			// Process the responses
			clockImages = responses.map((response) => {
				const imageData = btoa(
					new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
				);
				return {
					src: `data:image/png;base64,${imageData}`,
					isCorrect: false // 기본값으로 false 설정
				};
			});

			// 랜덤하게 하나를 정답으로 설정
			const randomIndex = Math.floor(Math.random() * clockImages.length);
			clockImages[randomIndex].isCorrect = true;
			correctImageIndex = randomIndex;

			// 배열 순서 랜덤화
			clockImages = clockImages.sort(() => Math.random() - 0.5);
		} catch (error) {
			console.error('Error fetching images:', error);
			clockImages = [];
			correctImageIndex = null;
		}
	}

	onMount(fetchClockImages);
</script>

<main>
	<div class="header">
		<div class="headerLeft">
			<Back />
			<div class="headline accent">
				예매하기 ({step}/3)
			</div>
		</div>
		<div class="headerRight">
			<Refresh />
			<div class="label">새로고침</div>
		</div>
	</div>
	<div class="container">
		<div class="containerTop">
			<span class="title accent">
				<span style="color: red">3시 40분</span>에 가장 가까운 시간을 선택해 주세요
			</span>
		</div>
		<div
			use:seleniumGuard={{
				minLayers: 5,
				maxLayers: 10,
				addClasses: true,
				addAttributes: true
			}}
			class="clockList"
		>
			{#if clockImages.length > 0}
				{#each clockImages as image, index}
					<div class="clockContainer">
						<img src={image.src} class="clock" />
					</div>
				{/each}
			{:else}
				<p>Loading images...</p>
			{/if}
		</div>
		<div class="buttonGroup">
			<div class="button">새로고침</div>
			<div disabled class="button" style="background-color: red;">다음</div>
		</div>
	</div>
</main>

<style lang="scss">
	.clock {
		width: 200px;
		height: 200px;
		border-radius: 4px;
		&.selected {
			box-shadow: inset 0 0 0 2px red;
		}
	}
	.button {
		cursor: pointer;
		display: flex;
		padding: 16px 28px;
		justify-content: center;
		align-items: center;
		gap: 10px;
		border-radius: 50px;
		background: #000;
		color: $fixed-backgound-white;
		&:hover {
			opacity: 0.9;
		}
		&[disabled] {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
	.buttonGroup {
		display: flex;
		padding: 28px 0px;
		justify-content: center;
		align-items: flex-start;
		gap: var(--spacing-12, 12px);
	}
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		max-width: 1171px;
		flex: 1;
	}
	.clockList {
		display: flex;
		align-items: flex-start;
		gap: 16px;
	}
	.clockContainer {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}
	.containerTop {
		display: flex;
		padding: 48px 0px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 16px;
	}
	main {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.header {
		width: 100%;
		max-width: 1171px;
		height: 80px;
		display: flex;
		justify-content: space-between;
	}

	.headerLeft {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.headerRight {
		cursor: pointer;
		display: flex;
		color: $contents-default-secondary;
		align-items: center;
		gap: 4px;
		transition:
			filter 0.3s,
			transform 0.3s;
		&:hover {
			filter: brightness(0.8);
		}
		&:active {
			transform: scale(0.98);
		}
	}
</style>
