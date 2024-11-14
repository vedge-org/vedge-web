<script lang="ts">
	import { seleniumGuard } from '../../lib/seleniumGuard';
	import { onMount } from 'svelte';
	import opentype from 'opentype.js';

	export let text = 'Hello';
	export let fontSize = 72;
	export let x = 0;
	export let y = 150;

	let pathData = '';
	let fontLoaded = false;
	let error: string | null = null;
	let viewBox = {
		x: 0,
		y: 0,
		width: 800,
		height: 300
	};

	async function loadFontAndConvert() {
		try {
			const response = await fetch('/Pretendard-Medium.ttf');
			if (!response.ok) {
				throw new Error(`폰트 로딩 실패: ${response.statusText}`);
			}
			const arrayBuffer = await response.arrayBuffer();
			const font = opentype.parse(arrayBuffer);

			const path = font.getPath(text, x, y, fontSize);
			pathData = path.toPathData(2);

			const bbox = path.getBoundingBox();
			const padding = fontSize / 2;

			// viewBox 계산 수정
			viewBox = {
				x: bbox.x1 - padding,
				y: bbox.y1 - padding,
				width: bbox.x2 - bbox.x1 + padding * 2,
				height: bbox.y2 - bbox.y1 + padding * 2
			};

			// path의 위치를 viewBox에 맞게 조정
			y = bbox.y1 + (bbox.y2 - bbox.y1) / 2;
			const adjustedPath = font.getPath(text, x, y, fontSize);
			pathData = adjustedPath.toPathData(2);

			fontLoaded = true;
		} catch (e: any) {
			error = e.message;
			console.error('Font loading error:', e);
		}
	}

	$: {
		if (text || fontSize) {
			loadFontAndConvert();
		}
	}

	onMount(() => {
		loadFontAndConvert();
	});
</script>

{#if error}
	<div class="error">폰트로딩실패</div>
{:else if !fontLoaded}
	<div class="loading">폰트로딩중</div>
{:else}
	<div
		use:seleniumGuard={{
			minLayers: 10,
			maxLayers: 20,
			addClasses: true,
			addAttributes: true
		}}
	>
		{@html `<${'svg'} 
			width="${viewBox.width}" 
			height="${viewBox.height}" 
			viewBox="${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}"
		>
			<${'path'} d="${pathData}" fill="black" />
		</${'svg'}>`}
	</div>
{/if}

<style>
	.error {
		color: red;
		padding: 1em;
	}

	.loading {
		color: #666;
		padding: 1em;
	}

	:global(svg) {
		border: 1px solid #ccc;
		display: block;
	}
</style>
