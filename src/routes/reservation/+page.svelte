<script lang="ts">
	import { goto } from '$app/navigation';
	import { seleniumGuard } from '$lib/seleniumGuard';
	import Back from '../../images/Back.svelte';
	import Refresh from '../../images/Refresh.svelte';
	let step = $state(1);
	import axios from 'axios';
	let selectedCell = $state([]);
	import { onMount } from 'svelte';

	let clockImages = $state([]);
	let correctImageIndex = $state();
	let correctTime = $state({ hour: 0, minute: 0 });

	let selectedImageIndex = $state();

	function generateRandomTime() {
		return {
			hour: Math.floor(Math.random() * 12),
			minute: Math.floor((Math.random() * 60) / 5) * 5
		};
	}

	enum CellType {
		SEAT = 'SEAT',
		SOLD = 'SOLD',
		AISLE = 'AISLE',
		EMPTY = 'EMPTY',
		SELECTED = 'SELECTED'
	}

	// 실제 좌석 배치 데이터 (1은 SEAT, 0은 SOLD, 빈 공간은 AISLE)
	const seatPattern = [
		[1, 0, ' ', 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, ' ', 0, 0],
		[0, 1, ' ', 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, ' ', 0, 1],
		[1, 0, ' ', 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, ' ', 0, 0],
		[1, 1, ' ', 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, ' ', 1, 0],
		[0, 0, ' ', 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, ' ', 0, 0],
		[0, ' ', ' ', 0, 0, ' ', ' ', ' ', ' ', ' ', ' ', ' ', 0, 0, ' ', 0]
	];

	interface SeatCell {
		type: CellType;
		rowIndex: number;
		columnIndex?: number; // 필요한 경우 추가
	}

	let selectedSeat = $state<{ rowIndex: number; columnIndex: number } | null>(null);

	// 2. seatMap 데이터에 columnIndex 추가
	const seatMap = {
		name: '공연장 좌석',
		sections: [
			{
				rowIndex: 0,
				columns: seatPattern[0]
					.map((col, colIndex) => ({
						type: col === ' ' ? 'AISLE' : 'SEAT',
						columnIndex: colIndex,
						cells: seatPattern.map((row, rowIndex) => ({
							type:
								row[colIndex] === 1 ? CellType.SEAT : row[colIndex] === 0 ? CellType.SOLD : 'AISLE',
							rowIndex: rowIndex,
							columnIndex: colIndex // columnIndex 추가
						}))
					}))
					.filter((col) => col.type !== 'AISLE')
			}
		]
	};

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

			clockImages = clockImages.sort(() => Math.random() - 0.5);
			correctImageIndex = clockImages.findIndex((image) => image.isCorrect);
		} catch (error) {
			console.error('Error fetching images:', error);
			clockImages = [];
			correctImageIndex = null;
		}
	}
	$effect(() => {
		console.log(selectedImageIndex);
	});

	onMount(fetchClockImages);

	const getCellClass = (type: string) => {
		switch (type) {
			case 'SEAT':
				return 'seat';
			case 'SOLD':
				return 'sold';
			case 'SELECTED':
				return 'cellC';
			default:
				return 'aisle';
		}
	};
</script>

<main>
	{#if step !== 3}
		<div class="header">
			<div class="headerLeft">
				<button
					style="background: none; border: none;"
					onclick={() => {
						if (step > 1) step -= 1;
						else if (step === 1) goto('/detail');
					}}
				>
					<Back />
				</button>
				<div class="headline accent">예매하기 ({step}/3)</div>
			</div>
			<div class="headerRight">
				<Refresh />
				<div class="label">새로고침</div>
			</div>
		</div>
	{/if}
	<div
		class="container"
		use:seleniumGuard={{
			minLayers: 10,
			maxLayers: 30,
			addAttributes: true,
			addClasses: true
		}}
	>
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
								onclick={() => {
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
				<button class="button">새로고침</button>
				<button
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
				</button>
			</div>
		{:else if step === 2}
			<div class="containerTop">
				<div class="title accent">원하는 좌석을 선택해 주세요</div>
				<div class="body">
					{seatMap.sections[0].columns.reduce(
						(acc, col) => acc + col.cells.filter((cell) => cell.type === CellType.SEAT).length,
						0
					)} 개 좌석 남았어요
				</div>
			</div>
			<div class="seat-map">
				{#each seatMap.sections[0].columns as column, colIndex}
					<div class="column">
						{#each column.cells as cell, rowIndex}
							{#if cell.type !== 'AISLE'}
								<button
									class="cell {getCellClass(cell.type)}"
									style="background-color: {selectedSeat &&
									selectedSeat.rowIndex === rowIndex &&
									selectedSeat.columnIndex === colIndex
										? '#007AFF'
										: ''}"
									disabled={cell.type === CellType.SOLD}
									onclick={() => {
										if (cell.type === CellType.SEAT) {
											if (
												selectedSeat?.rowIndex === rowIndex &&
												selectedSeat?.columnIndex === colIndex
											) {
												selectedSeat = null;
											} else {
												selectedSeat = { rowIndex, columnIndex: colIndex };
											}
										}
									}}
								/>
							{/if}
						{/each}
					</div>
				{/each}
			</div>
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
						<div class="headline">{selectedSeat ? 1 : 0}</div>
					</div>
					<div class="sbc">
						<div class="body">총 결제 금액 :</div>
						<div class="headline">{selectedSeat ? '10,000' : '0'}원</div>
					</div>
				</div>
				<button
					class="sbbbb"
					disabled={!selectedSeat}
					onclick={() => {
						if (selectedSeat) {
							step = 3;
						}
					}}
				>
					<div class="body accent">결제하기</div>
				</button>
			</div>
		{:else if step === 3}
			<iframe
				title="lottie"
				class="if"
				src="https://lottie.host/embed/6387c7e9-e410-4e1d-8811-7179f50be48b/lco1uRfKN4.json"
			></iframe>
			<div class="display accent">에매가 완료되었습니다!</div>
			<div class="body">예매 내역을 확인해 주세요</div>

			<div class="ff">
				<div class="fff">
					<div class="fleft headline">예매 번호</div>
					<div class="fr headline accent">SDA7F7824DA</div>
				</div>
				<div class="fff">
					<div class="fleft headline">예매 번호</div>
					<div class="fr headline accent">2024. 11. 22. (금) 16:00 관람</div>
				</div>
				<div class="fff">
					<div class="fleft headline">결제 정보</div>
					<div class="fr headline accent">총 1매, 10,000원</div>
				</div>
			</div>
		{/if}
	</div>
</main>

<style lang="scss">
	.fr {
		flex: 1;
		text-align: right;
	}
	.fleft {
		color: $contents-default-secondary;
	}
	.fff {
		display: flex;
		align-items: center;
		gap: 48px;
		align-self: stretch;
	}
	.ff {
		margin-top: 42px;
		display: flex;
		width: 400px;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}
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

		&.seat {
			background: #4caf50;
			&:hover {
				opacity: 0.8;
			}
			&:active {
				transform: scale(0.95);
			}
			&.cellC {
				background: #007aff;
			}
		}

		&.sold {
			background: #9e9e9e;
			cursor: not-allowed;
		}
	}

	.aisle {
		width: 40px;
		height: 200px;
		opacity: 0.3;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.section {
		display: flex;
		gap: 32px;
		justify-content: center;
		align-items: flex-start;
		width: 100%;
	}
	.seat-map {
		display: flex;
		gap: 4px;
		padding: 20px;
		background: #f5f5f5;
	}

	.column {
		display: flex;
		flex-direction: column;
		gap: 4px;
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
		border: none;
		&:hover {
			opacity: 0.9;
		}
		&:active {
			transform: scale(0.98);
		}
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;
		}
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
		&.aisile {
			background: none;
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
		border: none;
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
