import Login from './containers/Login.svelte';
import Signup from './containers/Signup.svelte';
import ForgetPassword from './containers/ForgetPassword.svelte';
import Dashboard from './containers/Dashboard.svelte';
import Settings from './containers/Settings.svelte';
import HtmlHints from './containers/HtmlHints.svelte';
import LinkReport from './containers/LinkReport.svelte';
import PublicBuilds from './containers/PublicBuilds.svelte';
import Home from './containers/Home.svelte';
import HowItWorks from './containers/HowItWorks.svelte';
import Rules from './containers/Rules.svelte';
import LighthouseReport from './containers/LighthouseReport.svelte';
import ArtilleryReport from './containers/ArtilleryReport.svelte';
import K6Report from './containers/K6Report.svelte';
import AppLayout from './containers/Layout.svelte';
import ScanCompare from './containers/ScanCompare.svelte';
import ErrorPage from './containers/ErrorPage.svelte';
import About from './containers/About.svelte';
import CaseStudy from './containers/CaseStudy.svelte';

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
		name: '/about',
		component: About,
		layout: AppLayout
	},
	{
		name: '/about/case-study/:project',
		component: CaseStudy,
		layout: AppLayout
	},
	{
		name: '/build/:id',
		component: LinkReport,
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
		name: '/k6/:id',
		component: K6Report,
		layout: AppLayout
	},
	{
		name: '/htmlhint/:id',
		component: HtmlHints,
		layout: AppLayout
	},
	{
		name: '/latest/:api/:url',
		component: LinkReport,
		layout: AppLayout
	},
	{
		name: '/scanCompare/:api/:url/:buildDate',
		component: ScanCompare,
		layout: AppLayout
	},
	{
		name: '404',
		path: '404',
		component: ErrorPage,
		layout: AppLayout
	},
	{
		name: '/yourScan',
		component: Dashboard,
		layout: AppLayout
	},
	{
		name: '/howItWorks/:page',
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
