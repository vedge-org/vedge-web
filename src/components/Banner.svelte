<script lang="ts">
	import { onMount } from 'svelte';
	import 'swiper/css';
	import { register } from 'swiper/element/bundle';

	let swiperEl: any;

	onMount(() => {
		register();

		// Swiper 요소 가져오기
		swiperEl = document.querySelector('swiper-container');

		// 커스텀 네비게이션 연결
		const prevBtn = document.querySelector('.custom-prev');
		const nextBtn = document.querySelector('.custom-next');

		prevBtn?.addEventListener('click', () => {
			swiperEl.swiper.slidePrev();
		});

		nextBtn?.addEventListener('click', () => {
			swiperEl.swiper.slideNext();
		});
	});

	const bannerInfos: { image: string; color: string }[] = [
		{ image: 'images/banner1.png', color: '#C20F0F' },
		{ image: 'images/banner2.png', color: '#EDDDDD' },
		{ image: 'images/banner3.png', color: '#0C0C0C' }
	];
</script>

<div class="banner-container">
	<div class="content-wrapper">
		<swiper-container
			class="mySwiper"
			slides-per-view="1"
			loop="true"
			autoplay="true"
			autoplay-delay="4000"
			speed="400"
			navigation="false"
		>
			{#each bannerInfos as v, i}
				<swiper-slide style={`background-color: ${v.color}`}>
					<div class="poster" style="background-image:url({v.image})"></div>
				</swiper-slide>
			{/each}
		</swiper-container>

		<div class="custom-navigation">
			<button class="custom-button custom-prev">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<mask
						id="mask0_2646_8142"
						style="mask-type:alpha"
						maskUnits="userSpaceOnUse"
						x="0"
						y="0"
						width="24"
						height="24"
					>
						<rect width="24" height="24" fill="#D9D9D9" />
					</mask>
					<g mask="url(#mask0_2646_8142)">
						<path d="M16 22L6 12L16 2L17.775 3.775L9.55 12L17.775 20.225L16 22Z" fill="white" />
					</g>
				</svg>
			</button>
			<button class="custom-button custom-next">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<mask
						id="mask0_2646_8152"
						style="mask-type:alpha"
						maskUnits="userSpaceOnUse"
						x="0"
						y="0"
						width="24"
						height="24"
					>
						<rect width="24" height="24" fill="#D9D9D9" />
					</mask>
					<g mask="url(#mask0_2646_8152)">
						<path
							d="M8.025 22L6.25 20.225L14.475 12L6.25 3.775L8.025 2L18.025 12L8.025 22Z"
							fill="white"
						/>
					</g>
				</svg>
			</button>
		</div>
	</div>
</div>

<style>
	.banner-container {
		width: 100%;
		background: #f1f1f1;
		position: relative;
		overflow: hidden;
	}

	.content-wrapper {
		position: relative;
	}

	.mySwiper {
		width: 100%;
		height: 400px;
	}

	swiper-slide {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.poster,
	swiper-slide img {
		width: 100%;
		height: 100%;
		max-width: 1100px;
		object-fit: contain;
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
	}

	.custom-navigation {
		position: absolute;
		top: 50%;
		width: 100%;
		transform: translateY(-50%);
		z-index: 10;
		pointer-events: none;
	}

	.custom-button {
		position: absolute;
		width: 50px;
		height: 50px;
		background: rgba(0, 0, 0, 0.84);
		border: none;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: auto;
		transition:
			background 0.3s,
			transform 0.3s;
	}

	.custom-button:hover {
		background: rgba(0, 0, 0, 0.9);
	}

	.custom-button:active {
		transform: scale(0.95);
	}

	.custom-prev {
		left: -60px;
	}

	.custom-next {
		right: -60px;
	}

	.arrow {
		width: 20px;
		height: 20px;
		border: solid #333;
		border-width: 0 3px 3px 0;
		display: inline-block;
	}

	.arrow-left {
		transform: rotate(135deg);
	}

	.arrow-right {
		transform: rotate(-45deg);
	}
</style>
