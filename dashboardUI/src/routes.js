import Login from './containers/Login.svelte';
import Signup from './containers/Signup.svelte';
import Dashboard from './containers/Dashboard.svelte';
import AppLayout from './containers/Layout.svelte';

function userIsAdmin() {
    //check if user is admin and returns true or false
    return false;
}

const routes = [
	{
		name: '/',
		component: Login,
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
		onlyIf: { guard: userIsAdmin, redirect: '/login' },
		nestedRoutes: [{ name: 'index', component: Dashboard }],
	},
];


export { routes };
