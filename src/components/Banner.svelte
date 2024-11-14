<script lang="ts">
	import { onMount } from 'svelte';
	import 'swiper/css';
	import { register } from 'swiper/element/bundle';

	onMount(() => {
		register(); // 컴포넌트가 로드된 후 Swiper 등록
	});
</script>

<swiper-container
	class="mySwiper"
	space-between="30"
	slides-per-view="4"
	navigation="true"
	loop="true"
	autoplay="true"
	autoplay-delay="4000"
	speed="400"
>
	<swiper-slide>
		<div class="poster" style="background-image:url('images/poster-1.png')"></div>
	</swiper-slide>
	<swiper-slide>
		<div class="poster" style="background-image:url('images/poster-2.png')"></div>
	</swiper-slide>
	<swiper-slide>
		<div class="poster" style="background-image:url('images/poster-3.png')"></div>
	</swiper-slide>
	<swiper-slide>
		<div class="poster" style="background-image:url('images/poster-4.png')"></div>
	</swiper-slide>
	<swiper-slide>
		<div class="poster" style="background-image:url('images/poster-5.png')"></div>
	</swiper-slide>
	<swiper-slide>
		<div class="poster" style="background-image:url('images/poster-6.png')"></div>
	</swiper-slide>
	<swiper-slide>
		<div class="poster"></div>
	</swiper-slide>
	<swiper-slide>
		<div class="poster"></div>
	</swiper-slide>
	<swiper-slide>
		<div class="poster"></div>
	</swiper-slide>
</swiper-container>

<style>
	.mySwiper {
		display: flex;
		padding: 0px 16px;
		align-items: center;
		align-content: center;
		gap: 18px;
		align-self: stretch;
		flex-wrap: wrap;
	}
	.poster {
		width: 270px;
		aspect-ratio: 3 / 4;
		border-radius: 4px;
		background-position: center;
		background-size: cover;
		background-color: yellow;
		object-fit: cover;
	}
	.swiper-button-prev,
	.swiper-button-next {
		display: flex !important;
		width: 60px !important;
		height: 60px !important;
		justify-content: center !important;
		align-items: center;
		border-radius: 999px;
		background: var(--Fixed-Contents-Alternative, rgba(0, 0, 0, 0.45)) !important;
	}

	.swiper-button-prev:after,
	.swiper-button-next:after {
		font-size: 1.1rem !important;
		font-weight: 600 !important;
	}
</style>
