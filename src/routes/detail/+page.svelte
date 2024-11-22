<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Age from '../../components/Age.svelte';
	import Calendar from '../../components/Calendar.svelte';
	import Chip from '../../components/Chip.svelte';
	import Header from '../../components/Header.svelte';
	import Minus from '../../images/Minus.svelte';
	import Plus from '../../images/Plus.svelte';

	let date = $state();
	let time = $state();
	let count = $state(1);
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
					<div class="body2">
						<span class="body">관람 연령 :</span>
						<Age age="19" />
						<span class="body">만 15세 이상</span>
					</div>
				</div>
			</div>
			<img src="images/poster-6.png" class="poster" alt="poster" />
		</div>
	</div>
	<div class="section">
		<div class="container">
			<div class="concert-container">
				<div class="title2">
					<div class="headline accent">공연시간 정보</div>
				</div>
				<div class="title2">
					<div class="headline accent">주의사항</div>
				</div>
				<div class="label">
					※ 티켓 예매 시 공연 안내 사항에 동의한 것으로 간주하며, 본 내용은 공연 상황에 따라
					추가/변경될 수 있습니다. 공연 관람에 지장이나 불이익을 받지 않도록 관람 전 반드시 공연
					안내 사항을 재 확인 바랍니다.
					<br /> <br />
					※ 결제 수단 중 ‘무통장 입금’으로 예매한 경우 예매 당일 23:59까지 입금하셔야 예매가 취소되지
					않습니다. <br />
					- 무통장 입금 기한: 예매 당일 23:59까지 (미 입금 시 취소)
					<br /> <br />
					※ 본 공연은 원활한 예매 환경 제공 및 안정적인 서버 운영을 위하여 잔여석 안내 서비스를 제공하지
					않습니다.
					<br />
					※ 본 공연은 안심 예매(보안문자) 서비스가 적용됩니다. <br />
					※ 본 공연은 예매 대기 서비스와 동일 좌석 재예매서비스 이용이 제한됩니다.
				</div>
				<div class="title2">
					<div class="headline accent">공연상세 / 출연진정보</div>
				</div>
				<div class="poster" alt="poster" />
				<img src="/images/detail.png" alt="detail" />
			</div>
			<div class="sidebar-container">
				<div class="reservation">
					<div class="reservation-section">
						<div class="reservation-section-top headline accent">날짜 선택</div>
						<Calendar />
					</div>
					<div class="reservation-section">
						<div class="reservation-section-top headline accent">날짜 선택</div>
						<div class="timeContainer">
							<Chip selected>18:30</Chip>
							<Chip>20:50</Chip>
						</div>
					</div>
					<div class="emptyDivider"></div>
					<div class="reservation-bottom">
						<div class="counterContainer">
							<div class="body">티켓 수량</div>
							<div class="counterRight">
								<div class="counterButton">
									<Minus />
								</div>
								{count}
								<div class="counterButton">
									<Plus />
								</div>
							</div>
						</div>
						<button class="primaryButton body" onclick={async () => await goto('./reservation')}
							>예매하기</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<style lang="scss">
	.poster {
		position: relative;
		background-image: url('/images/poster-6.png');
		// need to shown 100% width with 3/4 aspect ratio image
		width: 100%;
		background-size: cover;
	}
	.emptyDivider {
		display: flex;
		height: 24px;
		padding: var(--spacing-12, 12px) 0px;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		width: 100%;
	}
	.counterButton {
		display: flex;
		width: 32px;
		height: 32px;
		padding: 11px 6px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 10px;
		border-radius: 40px;
		background: $fixed-contents-accent;
		color: #ffffff;
	}
	.counterRight {
		display: flex;
		align-items: center;
		gap: var(--spacing-12, 12px);
	}
	.counterContainer {
		display: flex;
		width: 100%;
		height: 58px;
		padding: 0px 13px 0px 20px;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-12, 12px);
		border-radius: 76px;
		border: 1px solid $background-gray-border;
	}
	.primaryButton {
		cursor: pointer;
		border: none;

		display: flex;
		width: 100%;
		height: 58px;
		padding: 16px 24px;
		justify-content: center;
		align-items: center;
		border-radius: 76px;
		background: var(--Contents-Default-Primary, #101016);
		color: #ffffff;
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
		&:hover {
			opacity: 0.9;
		}
		&:active {
			transform: scale(0.98);
		}
	}
	.reservation-bottom {
		width: 100%;
		display: flex;
		padding: var(--spacing-12, 12px) 0px;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}
	.title2 {
		display: flex;
		padding: 8px 0px;

		align-items: center;
		gap: 10px;
		align-self: stretch;
		text-align: left;
	}
	.body2 {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-8, 8px);
	}
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
		padding: 48px 16px;
		flex-direction: column;
		align-items: flex-start;
		flex: 1;
		text-align: left;
		gap: 8px;
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
		position: sticky;
		top: 100px;
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
