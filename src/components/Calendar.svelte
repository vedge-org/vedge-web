<script>
	import { onMount } from 'svelte';

	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1;

	let monthData = $state();

	function getWeeksInMonth() {
		const weeks = [];
		const firstDay = new Date(year, month - 1, 1);
		const lastDay = new Date(year, month, 0);
		let start = 1 - firstDay.getDay();
		let end = 7 - firstDay.getDay();

		while (weeks.length < 7) {
			const week = [];
			for (let day = start; day <= end; day++) {
				const currentDate = new Date(year, month - 1, day);
				const dayObj = {
					isCurrentMonth: currentDate.getMonth() === month - 1,
					isToday: currentDate.toDateString() === new Date().toDateString(),
					day: day <= 0 ? new Date(year, month, day).getDate() : day
				};
				week.push(dayObj);
			}
			weeks.push(week);
			start = end + 1;
			end = end + 7;
			end = end > new Date(year, month, 0).getDate() ? new Date(year, month, 0).getDate() : end;
		}
		return weeks;
	}

	onMount(() => {
		monthData = getWeeksInMonth();
		const interval = setInterval(() => {
			date = new Date();
			year = date.getFullYear();
			month = date.getMonth() + 1;
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="container">
	<div class="top">
		<div class="caldenar-top-left">
			<div class="turn">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
				>
					<mask
						id="mask0_1890_871"
						style="mask-type:alpha"
						maskUnits="userSpaceOnUse"
						x="0"
						y="0"
						width="24"
						height="24"
					>
						<rect width="24" height="24" fill="#D9D9D9" />
					</mask>
					<g mask="url(#mask0_1890_871)">
						<path d="M14 17L9 12L14 7V17Z" fill="#9797A0" />
					</g>
				</svg>
			</div>
			<div class="body accent">
				{year}년 {month}월
			</div>
			<div class="turn">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
				>
					<mask
						id="mask0_1890_875"
						style="mask-type:alpha"
						maskUnits="userSpaceOnUse"
						x="0"
						y="0"
						width="24"
						height="24"
					>
						<rect width="24" height="24" fill="#D9D9D9" />
					</mask>
					<g mask="url(#mask0_1890_875)">
						<path d="M10 17V7L15 12L10 17Z" fill="#9797A0" />
					</g>
				</svg>
			</div>
		</div>
		<div class="body accent">오늘</div>
	</div>
	<div class="dayContainer">
		<div class="day label">일</div>
		<div class="day label">월</div>
		<div class="day label">화</div>
		<div class="day label">수</div>
		<div class="day label">목</div>
		<div class="day label">금</div>
		<div class="day label">토</div>
	</div>
	<div class="calendarItems">
		{#each monthData as week}
			<div class="itemContainer">
				{#each week as day}
					<div class="item" class:active={day.isToday}>
						{#if day.isCurrentMonth}
							{day.day}
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.turn {
		width: 24px;
		height: 24px;
		&:hover {
			cursor: pointer;
			filter: brightness(0.8);
		}
		transition:
			transform 0.3s ease-in-out,
			filter 0.3s ease-in-out;
		&:active {
			transform: scale(0.9);
		}
	}
	.container {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: flex-start;
	}
	.top {
		display: flex;
		padding: 16px 9px;
		justify-content: space-between;
		align-items: center;
		align-self: stretch;
	}
	.caldenar-top-left {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.dayContainer {
		display: flex;
		height: 32px;
		align-items: flex-start;
		align-self: stretch;
	}

	.day {
		display: flex;
		padding: 4px 0px;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		flex: 1 0 0;
		color: $contents-default-secondary;
	}

	.item {
		display: flex;
		height: 48px;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		justify-content: center;
		flex: 1;
		user-select: none;
		color: $contents-default-quaternary;
		&.active {
			background-color: $contents-default-primary;
			color: #fff;
			border-radius: 50%;
			cursor: pointer;
			transition: color 0.3s;
		}
	}

	.itemContainer {
		display: flex;
		align-items: flex-start;
		align-self: stretch;
	}
	.calendarItems {
		display: flex;
		flex-direction: column;
		align-items: center;
		align-self: stretch;
	}
</style>
