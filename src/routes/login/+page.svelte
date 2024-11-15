<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Alert from '../../images/Alert.svelte';
	import LogoSmall from '../../images/LogoSmall.svelte';
	import QrImage from '../../images/QRImage.svelte';
	import Back from '../../images/Back.svelte';
	import OtpInput from '../../components/OTPInput.svelte';
	import {
		authControllerRequestLoginVerification,
		authControllerVerifyLogin
	} from '../../api/endpoints/auth/auth';
	import { goto } from '$app/navigation';

	let tel = $state('');
	let otpValue = $state(['', '', '', '', '']);
	let step = $state(0);

	async function sendVerificationCode(phoneNumber: string) {
		return await authControllerRequestLoginVerification({
			phoneNumber: phoneNumber.replace(/[^\d]/g, '')
		});
	}

	async function handleSecondButton() {
		await authControllerVerifyLogin({
			phoneNumber: tel.replace(/[^\d]/g, ''),
			code: otpValue.join('')
		});
		await goto('/');
	}

	async function handleFirstButton() {
		await sendVerificationCode(tel);
		step = 1;
	}

	function formatPhoneNumber(value: string) {
		// 숫자만 추출
		const numbers = value.replace(/[^\d]/g, '');

		// 11자리를 넘어가면 잘라내기
		const trimmed = numbers.slice(0, 11);

		// 첫 번째 숫자가 0이 아니면 빈 문자열 반환
		if (trimmed.length > 0 && trimmed[0] !== '0') {
			return '';
		}

		// 포맷팅
		let formatted = '';
		if (trimmed.length <= 3) {
			formatted = trimmed;
		} else if (trimmed.length <= 7) {
			formatted = `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
		} else {
			formatted = `${trimmed.slice(0, 3)}-${trimmed.slice(3, 7)}-${trimmed.slice(7)}`;
		}

		// 유효한 전화번호 패턴인지 확인
		const isValid = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/.test(
			formatted.replace(/-/g, '')
		);

		return isValid || formatted.length < 13 ? formatted : tel;
	}

	function handleInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const formattedNumber = formatPhoneNumber(input.value);

		// 커서 위치 저장
		const cursorPosition = input.selectionStart;
		const oldLength = tel.length;

		tel = formattedNumber;

		// 커서 위치 조정
		setTimeout(() => {
			const newCursorPosition = cursorPosition + (formattedNumber.length - oldLength);
			input.setSelectionRange(newCursorPosition, newCursorPosition);
		}, 0);
	}
</script>

<main>
	<div
		class="container"
		class:small={step === 1}
		transition:slide={{ duration: 300, easing: quintOut }}
	>
		{#if step === 0}
			<div
				class="content-wrapper"
				in:fly={{ x: 50, duration: 300, delay: 300 }}
				out:fly={{ x: -50, duration: 300 }}
			>
				<div class="column">
					<LogoSmall />
					<div class="title accent">로그인</div>
					<div class="form">
						<input
							class="input"
							type="text"
							placeholder="전화번호 입력 (예: 010-1234-5678)"
							bind:value={tel}
							oninput={handleInput}
						/>
						<button onclick={handleFirstButton} class="button label accent">
							인증번호 요청하기
						</button>
					</div>
					<div class="bottom">
						<Alert />
						<div class="caption">서비스 회원가입은 모바일에서만 가능합니다.</div>
					</div>
				</div>
				<div class="qrContainer">
					<div class="qr">
						<QrImage />
					</div>
					<div class="qrBottom">
						<div class="body accent">QR코드로 로그인</div>
						<div class="caption">
							VEDGE앱에서
							<br />
							설정 > QR코드 로그인
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div
				class="content-wrapper"
				in:fly={{ x: 50, duration: 300, delay: 300 }}
				out:fly={{ x: -50, duration: 300 }}
			>
				<div class="column">
					<button class="back" onclick={() => (step = 0)}>
						<Back />
					</button>
					<div class="title accent">인증번호 입력</div>
					<OtpInput bind:otp={otpValue} />
					<div class="form">
						<button class="button label accent" onclick={handleSecondButton}>인증하기</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</main>

<style lang="scss">
	.back {
		display: flex;
		height: 40px;
		padding: 4px 16px;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 10px;
		border-radius: 100px;
		background: rgba(0, 0, 0, 0.03);
		border: none;
		cursor: pointer;
		transition:
			background 0.2s ease,
			transform 0.2s ease;
		&:hover {
			background: rgba(0, 0, 0, 0.05);
		}
		&:active {
			transform: scale(0.98);
		}
	}
	.qr {
		display: flex;
		width: 170px;
		height: 170px;
		padding: 20px;
		align-items: center;
		gap: 10px;
		border-radius: 22px;
		box-shadow: inset 0 0 0 6px $fixed-contents-accent;
	}
	.qrContainer {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}
	.qrBottom {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		& > .caption {
			color: $contents-default-tertiary;
			text-align: center;
		}
	}

	.bottom {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		align-self: stretch;
		color: $contents-default-secondary;
	}
	.form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
		align-self: stretch;
	}
	.input {
		border-radius: 999px;
		box-shadow: inset 0 0 0 1px var(--background-gray-Border, #e7e7e9);
		display: flex;
		padding: 14px 20px;
		align-items: center;
		gap: 10px;
		align-self: stretch;
		color: $contents-default-primary;
		font-family: Interop;
		font-size: 16px;
		font-style: normal;
		font-weight: 500;
		line-height: 24px; /* 150% */
		letter-spacing: -0.65px;
		border: none;
		outline: none;
		transition: box-shadow 0.2s ease-in-out;
		&::placeholder {
			color: $contents-default-quaternary;
		}
		&:focus {
			box-shadow: inset 0 0 0 2px var(--Contents-Accent, #000);
		}
	}
	.button {
		border: none;
		outline: none;
		cursor: pointer;
		border-radius: 76px;
		background: $contents-default-primary;
		display: flex;
		padding: 16px 96px;
		justify-content: center;
		align-items: center;
		gap: 10px;
		align-self: stretch;
		color: $background-gray-default;
		transition:
			background 0.2s ease-in-out,
			transform 0.2s ease;
		&:hover {
			background: $contents-default-secondary;
		}
		&:active {
			transform: scale(0.98);
		}
	}
	main {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.content-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 80px;
		width: 100%;
		height: 100%;
	}

	.container {
		position: relative;
		border-radius: 9px;
		background: var(--background-gray-Elevated, #fff);
		display: flex;
		height: 430px;
		padding: 64px 52px;
		justify-content: center;
		align-items: center;
		gap: 80px;
		max-width: 735px;
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1); /* easing 추가 */

		&.small {
			max-width: 474px; /* step 1일 때의 너비 */
		}
	}

	.content-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 80px;
		width: 100%;
	}

	.column {
		display: flex;
		width: 370px;
		align-self: stretch;
		flex-direction: column;
		height: 100%;
		justify-content: space-between;
		align-items: flex-start;
		will-change: transform, opacity;
	}
</style>
