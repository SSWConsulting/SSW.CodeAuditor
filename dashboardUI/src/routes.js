import Login from './containers/Login.svelte';
import Signup from './containers/Signup.svelte';
import Dashboard from './containers/Dashboard.svelte';
import Settings from './containers/Settings.svelte';
import AppLayout from './containers/Layout.svelte';

const isLoggedIn = () => !!localStorage.getItem('uid');

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
		onlyIf: { guard: isLoggedIn, redirect: '/login' },
		nestedRoutes: [
			{ name: 'index', component: Dashboard },
			{ name: 'settings', component: Settings },
		],
	},
];

export { routes };
