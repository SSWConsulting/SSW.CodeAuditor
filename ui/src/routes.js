import Login from './containers/Login.svelte';
import Signup from './containers/Signup.svelte';
import Dashboard from './containers/Dashboard.svelte';
import Settings from './containers/Settings.svelte';
import BuildDetails from './containers/BuildDetails.svelte';
import Public from './containers/Public.svelte';
import AppLayout from './containers/Layout.svelte';
import { isLoggedIn } from './stores.js';

let loggedIn = false;
isLoggedIn.subscribe((x) => (loggedIn = x));

const routes = [
	{
		name: '/',
		component: Public,
		layout: AppLayout,
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
		name: '/build/:id',
		component: BuildDetails,
		layout: AppLayout
	},
	{
		name: 'home',
		component: AppLayout,
		onlyIf: {
			guard: () => {
				console.log('checking if user is logged in', loggedIn);
				return loggedIn;
			},
			redirect: '/login',
		},
		nestedRoutes: [
			{ name: 'index', component: Dashboard },
			{ name: 'settings', component: Settings },
		],
	},
];

export { routes };
