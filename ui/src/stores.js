import { writable, derived } from 'svelte/store';
import { navigateTo } from 'svelte-router-spa';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { CONSTS, newGuid } from './utils/utils';

const createUserSession = () => {
	const { subscribe, set } = writable(null);

	return {
		subscribe,
		login: (n) => {
			performingLogin.set(false);
			set(n);
		},
		logout: () => {
			firebase.auth().signOut();
			set(null);
			navigateTo('/login');
		},
	};
};
export const performingLogin = writable(true);
export const lastBuilds = writable(null);
export const userSession = createUserSession();
export const userSession$ = derived(
	[userSession, performingLogin],
	([session, performing]) => (performing ? null : session)
);

export const oauthLoginError = writable(null);

export const isLoggedIn = derived(userSession$, (session) => {
	return !!session;
});

export const userName = derived(userSession$, (session) =>
	session ? session.displayName || session.email : ''
);

export const userApi = derived(userSession$, (session) =>
	session ? session.apiKey : ''
);

export const loginCompleted = async (user) => {
	try {
		if (!user) {
			userSession.login(null);
			return;
		}
		const doc = await firebase
			.firestore()
			.collection(CONSTS.USERS)
			.doc(user.uid)
			.get();

		if (doc.exists) {
			userSession.login({ ...user, ...doc.data() });
		} else {
			// create
			const apiKey = newGuid();
			await firebase
				.firestore()
				.collection(CONSTS.USERS)
				.doc(user.uid)
				.set({
					apiKey,
				});
			userSession.login({ ...user, apiKey });
		}

		// navigate to home
		if (window.location.href.match(/(\/login|\/signup)$/)) {
			navigateTo('/home');
		}
	} catch (error) {
		oauthLoginError.set(error);
	}
};
