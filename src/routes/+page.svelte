<script>
	import Banner from '../components/Banner.svelte';
	import Concert from '../components/Concert.svelte';
	import Header from '../components/Header.svelte';
</script>

<Header />

<div class="container">
	<Banner />
	<div class="wrapper">
		<div class="section">
			<div class="section-title title accent">현재 랭킹</div>
			<div class="concert-list">
				<Concert
					id={1}
					image="/images/poster-1.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-2.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-3.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-4.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-5.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-6.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
			</div>
		</div>
		<div class="section">
			<div class="section-title title accent">콘서트 보기</div>
			<div class="concert-grid">
				<Concert
					id={1}
					image="/images/poster-1.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-2.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-3.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-4.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-5.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-6.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-1.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-2.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-3.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-4.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-5.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-6.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-1.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-2.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-3.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-4.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-5.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
				<Concert
					id={1}
					image="/images/poster-6.png"
					name="콘서트 이름"
					date="2021.12.31"
					address="서울특별시 강남구"
				/>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.concert-grid {
		display: flex;
		align-items: center;
		align-content: center;
		gap: 24px 18px;
		align-self: stretch;
		flex-wrap: wrap;
	}
	.concert-list {
		display: flex;
		align-items: center;
		align-content: center;
		gap: 24px 18px;
		align-self: stretch;
		flex-wrap: wrap;
	}
	.section-title {
		display: flex;
		padding: 16px 0px;
		align-items: flex-end;
		align-self: stretch;
	}
	.section {
		display: flex;
		padding: 0px 16px;
		flex-direction: column;
		align-items: flex-start;
		align-self: stretch;
	}
	.container {
		margin-top: 80px;
		width: 100%;
		display: flex;
		flex-direction: column;
		padding-bottom: 48px;
		justify-content: center;
		align-items: center;
	}
	.wrapper {
		display: flex;
		width: 100%;
		max-width: 1172px;
		min-height: 896px;
		padding: 32px 0px;
		flex-direction: column;
		align-items: center;
		gap: 32px;
	}
</style>
