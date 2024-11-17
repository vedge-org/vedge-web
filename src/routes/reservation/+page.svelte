<script lang="ts">
	import { seleniumGuard } from '$lib/seleniumGuard';
	import Back from '../../images/Back.svelte';
	import Refresh from '../../images/Refresh.svelte';
	let step = $state(1);
	import axios from 'axios';
	let selectedCell = $state([]);
	import { onMount } from 'svelte';

	let clockImages = $state([]);
	let correctImageIndex;
	let correctTime = $state({ hour: 0, minute: 0 });

	let selectedImageIndex = $state();

	function generateRandomTime() {
		return {
			hour: Math.floor(Math.random() * 12),
			minute: Math.floor((Math.random() * 60) / 5) * 5
		};
	}

	interface CellState {
		type: 'A' | 'B' | 'C';
		id: string;
		row: number;
		col: number;
	}

	function initSeatMap(rows: number, cols: number): CellState[][] {
		const map: CellState[][] = [];

		for (let i = 0; i < rows; i++) {
			const row: CellState[] = [];
			for (let j = 0; j < cols; j++) {
				row.push({
					type: Math.random() > 0.3 ? 'A' : 'B', // 70% 확률로 선택 가능
					id: `seat-${i}-${j}`,
					row: i,
					col: j
				});
			}
			map.push(row);
		}
		return map;
	}

	let seatMap = $state(initSeatMap(6, 16));

	const LEFT_COLUMNS = Array(2)
		.fill(null)
		.map((_, i) => i);
	const MIDDLE_COLUMNS = Array(11)
		.fill(null)
		.map((_, i) => i + 3);
	const RIGHT_COLUMNS = Array(2)
		.fill(null)
		.map((_, i) => i + 15);

	function handleSelect(cell: CellState) {
		if (cell.type === 'A') {
			seatMap[cell.row][cell.col].type = 'C';
		} else if (cell.type === 'C') {
			seatMap[cell.row][cell.col].type = 'A';
		}
	}
	let selectedSeats = $derived(seatMap.flat().filter((cell) => cell.type === 'C').length);

	async function fetchClockImages() {
		try {
			// 랜덤 정답 시간 생성
			correctTime = generateRandomTime();

			// 오답 시간 생성 (정답과 최소 3시간 이상 차이나도록)
			const wrongTime1 = (() => {
				let time;
				do {
					time = generateRandomTime();
				} while (
					Math.abs(time.hour - correctTime.hour) < 3 ||
					(time.hour === correctTime.hour && Math.abs(time.minute - correctTime.minute) < 15)
				);
				return time;
			})();

			const wrongTime2 = (() => {
				let time;
				do {
					time = generateRandomTime();
				} while (
					Math.abs(time.hour - correctTime.hour) < 3 ||
					Math.abs(time.hour - wrongTime1.hour) < 3 ||
					(time.hour === correctTime.hour && Math.abs(time.minute - correctTime.minute) < 15) ||
					(time.hour === wrongTime1.hour && Math.abs(time.minute - wrongTime1.minute) < 15)
				);
				return time;
			})();

			const responses = await Promise.all([
				axios.post('https://vedgeai.apne2a.algorix.cloud/clock_captcha_mono/', correctTime, {
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json'
					},
					responseType: 'arraybuffer'
				}),
				axios.post('https://vedgeai.apne2a.algorix.cloud/clock_captcha_mono/', wrongTime1, {
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json'
					},
					responseType: 'arraybuffer'
				}),
				axios.post('https://vedgeai.apne2a.algorix.cloud/clock_captcha_mono/', wrongTime2, {
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json'
					},
					responseType: 'arraybuffer'
				})
			]);

			clockImages = responses.map((response, index) => {
				const imageData = btoa(
					new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
				);
				return {
					src: `data:image/png;base64,${imageData}`,
					isCorrect: index === 0,
					time: index === 0 ? correctTime : index === 1 ? wrongTime1 : wrongTime2
				};
			});

			correctImageIndex = clockImages.findIndex((image) => image.isCorrect);
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
		{#if step === 1}
			<div class="containerTop">
				<span class="title accent">
					<span style="color: red">{correctTime.hour}시 {correctTime.minute}분</span>에 가장 가까운
					시간을 선택해 주세요
				</span>
			</div>
			<div class="clockList">
				{#if clockImages.length > 0}
					{#each clockImages as image, index}
						<div class="clockContainer">
							<img
								onclick={(e) => {
									selectedImageIndex = index;
								}}
								class:selected={selectedImageIndex === index}
								src={image.src}
								class="clock"
							/>
						</div>
					{/each}
				{:else}
					<p>Loading images...</p>
				{/if}
			</div>
			<div class="buttonGroup">
				<div class="button">새로고침</div>
				<div
					onclick={() => {
						if (selectedImageIndex === correctImageIndex) {
							step = 2;
						}
					}}
					aria-disabled={selectedImageIndex === null}
					class="button"
					style="background-color: red;"
				>
					다음
				</div>
			</div>
		{:else if step === 2}
			<div class="containerTop">
				<div class="title accent">원하는 좌석을 선택해 주세요</div>
				<div class="body">48개 좌석 남았어요</div>
			</div>
			<svg
				width="1172"
				height="415"
				viewBox="0 0 1172 415"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect width="1172" height="414.5" fill="#F4F4F6" />
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(352.12 24.3142)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(382.223 24.3142)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(352.12 54.4176)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(382.223 54.4176)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(352.12 84.521)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(382.223 84.521)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(352.12 114.624)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(382.223 114.624)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(352.12 144.728)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(382.223 144.728)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(352.12 174.831)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(423.905 24.3142)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(454.008 24.3142)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(484.112 24.3142)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(514.215 24.3142)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(544.319 24.3142)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(574.422 24.3142)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(604.525 24.3142)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(634.628 24.3142)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(664.732 24.3142)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(694.835 24.3142)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(724.938 24.3142)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(423.905 54.4176)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(454.008 54.4176)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(484.112 54.4176)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(514.215 54.4176)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(544.319 54.4176)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(574.422 54.4176)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(604.525 54.4176)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(634.628 54.4176)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(664.732 54.4176)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(694.835 54.4176)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(724.938 54.4176)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(423.905 84.521)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(454.008 84.521)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(484.112 84.521)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(514.215 84.521)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(544.319 84.521)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(574.422 84.521)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(604.525 84.521)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(634.628 84.521)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(664.732 84.521)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(694.835 84.521)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(724.938 84.521)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(423.905 114.624)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(454.008 114.624)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(484.112 114.624)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(514.215 114.624)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(544.319 114.624)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(574.422 114.624)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(604.525 114.624)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(634.628 114.624)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(664.732 114.624)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(694.835 114.624)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(724.938 114.624)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(423.905 144.728)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(454.008 144.728)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(484.112 144.728)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(514.215 144.728)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(544.319 144.728)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(574.422 144.728)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(604.525 144.728)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(634.628 144.728)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(664.732 144.728)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(694.835 144.728)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(724.938 144.728)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(423.905 174.831)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(454.008 174.831)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(694.835 174.831)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(724.938 174.831)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(766.62 24.3142)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(796.723 24.3142)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(766.62 54.4176)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(796.723 54.4176)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(766.62 84.521)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(796.723 84.521)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(766.62 114.624)"
					fill="#007AFF"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(796.723 114.624)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(766.62 144.728)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(796.723 144.728)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(796.723 174.831)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(352.12 216.513)"
					fill="#007AFF"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(382.223 216.513)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(352.12 246.616)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(382.223 246.616)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(352.12 276.719)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(382.223 276.719)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(352.12 306.823)"
					fill="#007AFF"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(382.223 306.823)"
					fill="#007AFF"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(352.12 336.926)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(382.223 336.926)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(352.12 367.029)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(766.62 216.513)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(796.723 216.513)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(766.62 246.616)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(796.723 246.616)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(766.62 276.719)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(796.723 276.719)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(766.62 306.823)"
					fill="#35C759"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(796.723 306.823)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(766.62 336.926)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(796.723 336.926)"
					fill="black"
					fill-opacity="0.2"
				/>
				<rect
					width="23.1564"
					height="23.1564"
					transform="translate(796.723 367.029)"
					fill="black"
					fill-opacity="0.2"
				/>
			</svg>

			<div class="seatBottom1">
				<div class="seatInfo">
					<div class="seatCellItem available"></div>
					<div class="label">선택 가능</div>
				</div>
				<div class="seatInfo">
					<div class="seatCellItem sold"></div>
					<div class="label">선택 불가</div>
				</div>
				<div class="seatInfo">
					<div class="seatCellItem selected"></div>
					<div class="label">선택 완료</div>
				</div>
			</div>

			<div class="seatBottom">
				<div class="seatBottomLeft">
					<div class="sbc">
						<div class="body">총 선택 좌석 :</div>
						<div class="headline">4</div>
					</div>
					<div class="sbc">
						<div class="body">총 결제 금액 :</div>
						<div class="headline">40,000원</div>
					</div>
				</div>
				<div
					class="sbbbb"
					onclick={() => {
						step = 3;
					}}
				>
					<div class="body accent">결제하기</div>
				</div>
			</div>
		{:else if step === 3}
			<iframe
				class="if"
				src="https://lottie.host/embed/6387c7e9-e410-4e1d-8811-7179f50be48b/lco1uRfKN4.json"
			></iframe>
		{/if}
	</div>
</main>

<style lang="scss">
	.if {
		border: 0;
		width: 300px;
		height: 300px;
	}
	.cell {
		width: 40px;
		height: 40px;
		border: none;
		cursor: pointer;

		&.cellA {
			background: #4caf50;
		}

		&.cellB {
			background: #9e9e9e;
			cursor: not-allowed;
		}

		&.cellC {
			background: #2196f3;
		}
	}

	.aisle {
		width: 40px;
		height: 200px;
		background: #e91e63;
		opacity: 0.3;
		display: flex;
		align-items: center;
		justify-content: center;

		.aisle-number {
			background: #e91e63;
			padding: 4px 8px;
			border-radius: 4px;
			color: white;
		}
	}
	.section {
		display: flex;
		gap: 32px;
		justify-content: center;
		align-items: flex-start;
		width: 100%;
	}
	.column {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.row {
		display: flex;
		gap: 12px;
		align-items: center;
	}
	.c {
		display: flex;
		padding: 42px 0px;
		justify-content: center;
		align-items: center;
		gap: 32px;
		align-self: stretch;
	}
	.sbbbb {
		display: flex;
		width: 260px;
		height: 58px;
		padding: 16px;
		justify-content: center;
		align-items: center;
		border-radius: 76px;
		background: var(--Contents-Default-Primary, #101016);
		color: #fff;
		cursor: pointer;
		&:hover {
			opacity: 0.9;
		}
		&:active {
			transform: scale(0.98);
		}
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
	}
	.sbc {
		display: flex;
		align-items: center;
		gap: var(--spacing-8, 8px);
		& > .body {
			color: rgba(119, 119, 131, 1);
		}
	}
	.seatBottomLeft {
		display: flex;
		align-items: flex-start;
		gap: 32px;
		flex: 1 0 0;
	}
	.seatBottom {
		display: flex;
		padding: 48px 0px;
		justify-content: flex-end;
		align-items: center;
		align-content: center;
		gap: 24px;
		align-self: stretch;
		flex-wrap: wrap;
	}
	.seatCellItem {
		width: 24px;
		height: 24px;
		&.available {
			background: #35c759;
		}
		&.sold {
			background: rgba(0, 0, 0, 0.2);
		}
		&.selected {
			background: rgba(0, 122, 255, 1);
		}
	}
	.seatInfo {
		display: flex;
		align-items: center;
		gap: var(--spacing-12, 12px);
	}
	.seatBottom1 {
		display: flex;
		padding: 32px 0px;
		justify-content: center;
		align-items: center;
		gap: 32px;
		align-self: stretch;
	}
	.clock {
		width: 200px;
		height: 200px;
		border-radius: 4px;
		&.selected {
			border: 2px solid red;
		}
		cursor: pointer;
		&:hover {
			opacity: 0.9;
		}
		&:active {
			transform: scale(0.98);
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
