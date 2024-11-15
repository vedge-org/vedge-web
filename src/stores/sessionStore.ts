// src/lib/stores/sessionStore.ts
import { writable, derived } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { usersControllerGetSession } from '../api/endpoints/users/users';
import { authControllerExtendSession } from '../api/endpoints/auth/auth';

interface SessionState {
	expiresAt: number | null;
	timeLeft: string;
	isLoading: boolean;
	error: string | null;
	user?: any;
}

function createSessionStore() {
	const initialState: SessionState = {
		expiresAt: null,
		timeLeft: '00:00',
		isLoading: false,
		error: null
	};

	const { subscribe, set, update }: Writable<SessionState> = writable(initialState);
	let timer: NodeJS.Timer | null = null;

	const formatTimeLeft = (expiresAt: number): string => {
		const now = new Date().getTime();
		const difference = expiresAt - now;

		if (difference <= 0) return '00:00';

		const minutes = Math.floor(difference / 1000 / 60);
		const seconds = Math.floor((difference / 1000) % 60);
		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	};

	const startTimer = (expiresAt: number) => {
		if (timer) clearInterval(timer);

		timer = setInterval(() => {
			update((state) => {
				const newTimeLeft = formatTimeLeft(expiresAt);
				if (newTimeLeft === '00:00') {
					clearInterval(timer!);
				}
				return {
					...state,
					timeLeft: newTimeLeft
				};
			});
		}, 1000);
	};

	return {
		subscribe,
		fetchSession: async () => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const response = await usersControllerGetSession();
				const userData = await response.data.user;
				const cookieData = await response.cookie;
				const expiresAt = new Date(cookieData.expires).getTime();

				update((state) => ({
					...state,
					expiresAt,
					timeLeft: formatTimeLeft(expiresAt),
					isLoading: false,
					user: userData
				}));

				startTimer(expiresAt);
			} catch (error) {
				update((state) => ({
					...state,
					error: error instanceof Error ? error.message : '알 수 없는 에러',
					isLoading: false
				}));
			}
		},
		reset: () => {
			if (timer) clearInterval(timer);
			set(initialState);
		},
		extendSession: async () => {
			try {
				await authControllerExtendSession();
				await sessionStore.fetchSession();
			} catch (error) {
				update((state) => ({
					...state,
					error: error instanceof Error ? error.message : '세션 연장 중 오류가 발생했습니다.'
				}));
			}
		}
	};
}

export const sessionStore = createSessionStore();

export const isNearExpiry = derived(sessionStore, ($session) => {
	if (!$session.timeLeft) return false;
	const [minutes] = $session.timeLeft.split(':').map(Number);
	return minutes <= 5;
});
