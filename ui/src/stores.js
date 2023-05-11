import { writable, derived } from 'svelte/store';
import { navigateTo } from 'svelte-router-spa';
import slug from 'slug';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { CONSTS, newGuid } from './utils/utils';
import { getFirestore, collection, getDoc, doc } from "firebase/firestore";

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

export const ignoredUrls$ = writable([]);
export const loadingIgnored$ = writable(false);
export const activeRun$ = writable(null);

export const ignoredUrlsList$ = derived(ignoredUrls$, (list) => {
	return list ? list.map((x) => x.urlToIgnore) : [];
});

export const userName = derived(userSession$, (session) => {
	return session ? session._delegate.displayName || session._delegate.email : ''
}
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
		
		const docSnap = await getDoc(
			doc(collection(getFirestore(), CONSTS.USERS), user.uid)
		)

		if (docSnap.exists()) {
			userSession.login({ ...user, ...docSnap.data() });
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

export const getIgnoreList = async (user) => {
	loadingIgnored$.set(true);
	try {
		const res = await fetch(
			`${CONSTS.API}/api/config/${user.apiKey}/ignore`
		);
		const result = await res.json();
		if (res.ok) {
			ignoredUrls$.set(result);
		} else {
			throw new Error('Failed to load');
		}
	} catch (error) {
	} finally {
		loadingIgnored$.set(false);
	}
};

export const deleteIgnoreUrl = async (url, user) => {
	try {
		await fetch(
			`${CONSTS.API}/api/config/${user.apiKey}/ignore/${
				slug(url.urlToIgnore) + '_' + slug(url.ignoreOn)
			}`,
			{
				method: 'DELETE',
			}
		);
		await getIgnoreList(user);
	} catch (error) {
		throw new Error(error);
	}
};

export const getBuildDetails = async (runId) => {
	if (activeRun && activeRun.summary.runId === runId) {
		return activeRun;
	}

	const res = await fetch(`${CONSTS.API}/api/run/${runId}`);
	const result = await res.json();

	if (res.ok) {
		const d = {
			summary: {
				...result.summary,
				whiteListed: result.summary.whiteListed
					? JSON.parse(result.summary.whiteListed)
					: [],
			},
			brokenLinks: result.brokenLinks,
		};
		activeRun$.set(d);
		return d;
	} else {
		throw new Error('Failed to load');
	}
};

export const getLatestBuildDetails = async (api, url) => {
	const res = await fetch(`${CONSTS.API2}/latest/${api}/${url}`);
	const result = await res.json();

	if (res.ok) {
		const d = {
			summary: {
				...result.summary[0],
				whiteListed: result.summary[0].whiteListed
					? JSON.parse(result.summary[0].whiteListed)
					: [],
			},
			brokenLinks: result.brokenLinks,
		};
		activeRun$.set(d);
		return d;
	} else {
		throw new Error('Failed to load');
	}
};

let activeRun;
activeRun$.subscribe((x) => (activeRun = x));
