import Login from './containers/Login.svelte';
import Signup from './containers/Signup.svelte';
import Dashboard from './containers/Dashboard.svelte';
import Settings from './containers/Settings.svelte';
import AppLayout from './containers/Layout.svelte';
import { isLoggedIn } from './stores.js';

let loggedIn = false;
isLoggedIn.subscribe((x) => (loggedIn = x));

const routes = [
	{
		name: '/',
		redirectTo: 'home',
	},
	{
		name: '/login',
		component: Login,
	},
	{
		name: '/signup',
		component: Signup,
	},
	{
		name: 'home',
		component: AppLayout,
		onlyIf: {
			guard: () => loggedIn,
			redirect: '/login',
		},
		nestedRoutes: [
			{ name: 'index', component: Dashboard },
			{ name: 'settings', component: Settings },
		],
	},
];

export { routes };
