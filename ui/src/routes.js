import Login from './containers/Login.svelte';
import Signup from './containers/Signup.svelte';
import ForgetPassword from './containers/ForgetPassword.svelte';
import Dashboard from './containers/Dashboard.svelte';
import Settings from './containers/Settings.svelte';
import HtmlHints from './containers/HtmlHints.svelte';
import BuildDetails from './containers/BuildDetails.svelte';
import PublicBuilds from './containers/PublicBuilds.svelte';
import Home from './containers/Home.svelte';
import HowItWorks from './containers/HowItWorks.svelte';
import Rules from './containers/Rules.svelte';
import LighthouseReport from './containers/LighthouseReport.svelte';
import ArtilleryReport from './containers/ArtilleryReport.svelte';
import AppLayout from './containers/Layout.svelte';
import ScanCompare from './containers/ScanCompare.svelte';
import ErrorPage from './containers/ErrorPage.svelte';

const routes = [
	{
		name: '/',
		component: Home,
		layout: AppLayout,
	},
	{
		name: '/login',
		component: Login,
	},
	{
		name: '/explore',
		component: PublicBuilds,
		layout: AppLayout
	},
	{
		name: '/signup',
		component: Signup,
	},
	{
		name: '/forgetPassword',
		component: ForgetPassword,
	},
	{
		name: '/rules',
		component: Rules,
		layout: AppLayout
	},
	{
		name: '/build/:id',
		component: BuildDetails,
		layout: AppLayout
	},
	{
		name: '/lighthouse/:id',
		component: LighthouseReport,
		layout: AppLayout
	},
	{
		name: '/artillery/:id',
		component: ArtilleryReport,
		layout: AppLayout
	},
	{
		name: '/htmlhint/:id',
		component: HtmlHints,
		layout: AppLayout
	},
	{
		name: '/latest/:api/:url',
		component: BuildDetails,
		layout: AppLayout
	},
	{
		name: '/scanCompare/:api/:url/:buildDate',
		component: ScanCompare,
		layout: AppLayout
	},
	{
		name: '/error',
		component: ErrorPage,
		layout: AppLayout
	},
	{
		name: '/yourScan',
		component: Dashboard,
		layout: AppLayout
	},
	{
		name: '/howItWorks',
		component: HowItWorks,
		layout: AppLayout
	},
	{
		name: '/home',
		redirectTo: '/',
		component: Home,
		layout: AppLayout,
	},
	{ 
		name: '/settings',
		component: Settings,
		layout: AppLayout,
	},
];

export { routes };
