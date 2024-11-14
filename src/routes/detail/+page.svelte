<script>
	import Calendar from '../../components/Calendar.svelte';
	import Chip from '../../components/Chip.svelte';
	import Header from '../../components/Header.svelte';

	let selected = $state(0);
</script>

<Header />
<main>
	<div class="banner">
		<div class="wrapper">
			<div class="left">
				<div class="badge caption">콘서트</div>
				<div class="concert-name title accent">
					2024 2NE1 CONCERT <br />
					[WELCOME BACK] IN SEOUL
				</div>
				<div class="info-group">
					<div class="body">공연장소 : 올림픽공원 올림픽홀</div>
					<div class="body">공연일시 : 2024.12.31</div>
					<div class="body">공연시간 : 오후 6시</div>
				</div>
			</div>
			<img src="images/poster-6.png" class="poster" alt="poster" />
		</div>
	</div>
	<div class="section">
		<div class="container">
			<div class="concert-container"></div>
			<div class="sidebar-container">
				<div class="reservation">
					<div class="reservation-section">
						<div class="reservation-section-top headline accent">날짜 선택</div>
						<Calendar />
					</div>
					<div class="reservation-section">
						<div class="reservation-section-top headline accent">날짜 선택</div>
						<div class="timeContainer">
							<Chip selected>오후 6시</Chip>
							<Chip>오후 6시</Chip>
						</div>
					</div>
					<div class="reservation-section">
						<div class="reservation-section-top headline accent">날짜 선택</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<style lang="scss">
	.timeContainer {
		display: flex;
		padding: 8px 0px;
		align-items: flex-start;
		align-content: flex-start;
		gap: 16px 8px;
		align-self: stretch;
		flex-wrap: wrap;
	}
	main {
		margin-top: 80px;
	}
	.info-group {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		color: #fff;
	}
	.banner {
		position: relative;
		width: 100%;
		height: 404px;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.banner::before {
		content: '';
		position: absolute;
		top: -10%; /* 상하좌우로 확장 */
		left: -10%;
		right: -10%;
		bottom: -10%;
		background-image: linear-gradient(90deg, rgba(1, 3, 130, 0.75) 0%, rgba(24, 24, 22, 0.75) 100%),
			url('images/poster-6.png');
		background-position: center;
		background-size: cover;
		filter: blur(10px);
		z-index: 1;
	}

	.wrapper {
		display: flex;
		width: 100%;
		max-width: 1171px;
		padding: 0px 16px;
		justify-content: space-between;
		align-items: center;
		position: relative;
		z-index: 2;
	}

	.left {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 24px;
		color: #fff;
	}

	.poster {
		display: flex;
		width: 250px;
		height: 340px;
		flex-shrink: 0;
		background-position: center;
		background-size: cover;
	}

	.badge {
		display: flex;
		padding: 6px 12px;
		justify-content: center;
		align-items: center;
		gap: 10px;
		border-radius: 999px;
		background: var(--Variable-Background-Default, #fff);
		color: var(--Variable-Text-Default, #000);
	}
	.section {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}
	.container {
		display: flex;
		width: 100%;
		max-width: 1170px;
		gap: 32px;
	}

	.concert-container {
		display: flex;
		min-height: 1024px;
		padding: 48px 0px;
		flex-direction: column;
		align-items: flex-start;
		flex: 1;
	}

	.sidebar-container {
		width: 388px;
		display: flex;
		padding: 48px 0px;
		justify-content: center;
		align-items: flex-start;
		align-self: stretch;
	}

	.reservation {
		display: flex;
		padding: 16px 24px;
		flex-direction: column;
		align-items: flex-start;
		border-radius: 4px;
		background: var(--background-gray-Elevated, #fff);
		width: 100%;
	}
	.reservation-section {
		display: flex;
		padding: 12px 0px;
		flex-direction: column;
		align-items: flex-start;
		align-self: stretch;
	}

	.reservation-section-top {
		display: flex;
		padding: 8px 0px;
		align-items: center;
		gap: 10px;
		align-self: stretch;
		color: $contents-default-primary;
	}
</style>
