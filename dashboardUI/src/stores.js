import { writable, derived } from 'svelte/store';

const createUserSession = () => {
	const { subscribe, set } = writable(null);

	return {
		subscribe,
		login: (n) => set(n),
		logout: () => set(null),
	};
};
export const userSession = createUserSession();
export const oauthLoginError = writable(null);

export const isLoggedIn = derived(userSession, ($isLoggedIn) => !!$isLoggedIn);

export const userName = derived(userSession, ($isLoggedIn) =>
	$isLoggedIn ? $isLoggedIn.displayName || $isLoggedIn.email : ''
);

export const userApi = derived(userSession, ($isLoggedIn) => 'l1w5nshz7i');
