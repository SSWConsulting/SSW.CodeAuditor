<script>
  import { Route } from "svelte-router-spa";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import { userSession, userName, isLoggedIn } from "../stores.js";
  import { scale } from "svelte/transition";
  import { onMount } from "svelte";

  export let currentRoute;

  let scanActive = false,
    settingActive = false,
    signOutActive = false;

  let menu = false;

  const params = {};

  const signOut = () => userSession.logout();

  let latestBuildDaysAgo = "";
  let latestBuildNumber = "";

  onMount(async () => {
    const deploymentUrl =
      "https://api.github.com/repos/SSWConsulting/SSW.CodeAuditor/deployments?environment=production&task=deploy&per_page=1";
    const deploymentResp = await fetch(deploymentUrl);
    const deploymentPayload = await deploymentResp.json();
    latestBuildNumber = deploymentPayload[0].id;

    const latestBuildCreated = deploymentPayload[0].created_at;
    const currentDate = new Date();
    const latestBuildDate = new Date(latestBuildCreated);
    const timeDifference = currentDate.getTime() - latestBuildDate.getTime();
    latestBuildDaysAgo = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  });
</script>

<body class="flex flex-col min-h-screen">
  <main class="flex-grow container mx-auto">
    <nav class="flex items-center justify-between p-6 mt-4 bgdark">
      <div class="flex flex-wrap">
        <div class="w-full">
          <div class="w-full block flex-grow lg:flex lg:items-center">
            <a href="/" class="sm:w-4/4 lg:w-1/3 ml-2">
              <img
                class="h-7 object-cover"
                src="https://github.com/SSWConsulting/SSW.Website/assets/67776356/f1467110-1677-4c76-a18e-3ffb6b3abcb9"
                alt="CodeAuditor"
              />
            </a>
            <div class="text-sm lg:flex-grow" />
            {#if $isLoggedIn}
              <div>
                <span class="text-white">
                  <div
                    class="relative"
                    on:mouseenter={() => (menu = true)}
                    on:mouseleave={() => (menu = false)}
                  >
                    <div
                      class="inline-block text-l px-4 py-2 leading-none border rounded
                    text-white border-white hover:border-transparent hover:text-red-600
                    hover:bg-white"
                    >
                      {$userName}
                    </div>
                    {#if menu}
                      <span
                        in:scale={{ duration: 100, start: 0.95 }}
                        out:scale={{ duration: 75, start: 0.95 }}
                        class="origin-top-right absolute right-0 w-48 py-2 mt-8 rounded shadow-md"
                        style="background-color: #797979"
                      >
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <span
                          class="{scanActive
                            ? 'bgred'
                            : '#797979'} block px-4 py-2 cursor-pointer"
                          on:click={() => navigateTo("/yourScan")}
                          on:mouseenter={() => (scanActive = true)}
                          on:mouseleave={() => (scanActive = false)}
                          >Your Scans</span
                        >
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <span
                          class="{settingActive
                            ? 'bgred'
                            : '#797979'} block px-4 py-2 cursor-pointer"
                          on:click={() => navigateTo("/home/settings")}
                          on:mouseenter={() => (settingActive = true)}
                          on:mouseleave={() => (settingActive = false)}
                          >Ignored URLs</span
                        >
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <span
                          class="{signOutActive
                            ? 'bgred'
                            : '#797979'} block px-4 py-2 cursor-pointer"
                          on:click={signOut}
                          on:mouseenter={() => (signOutActive = true)}
                          on:mouseleave={() => (signOutActive = false)}
                          >Logout</span
                        >
                      </span>
                    {/if}
                  </div>
                </span>
              </div>
            {:else}
              <div>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <span
                  class="text-white mx-2 cursor-pointer"
                  on:click={() => navigateTo("/login")}>Log In</span
                >
                <button
                  on:click={() => navigateTo("/signup")}
                  type="button"
                  class="inline-block text-sm px-4 py-2 leading-none border rounded
                text-white border-white hover:border-transparent hover:text-red-600
                hover:bg-white mt-4 lg:mt-0 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            {/if}
          </div>
        </div>
        <hr class="mt-4 bg-white w-full" />
        <div
          class="w-full grid grid-cols-1 md:grid-cols-3 overflow-hidden text-center mt-4"
        >
          <span class="text-white text-lg pt-4 lg:pt-0 lg:mx-4">
            <span
              class="hover:text-red-600 {currentRoute.path === '/home'
                ? 'text-red-600'
                : 'text-white'}"
            >
              <Navigate to="/home">Home</Navigate>
            </span>
          </span>
          <span class="text-white text-lg pt-4 lg:pt-0 lg:mx-4">
            <span
              class="hover:text-red-600 {currentRoute.path === '/explore'
                ? 'text-red-600'
                : 'text-white'}"
            >
              <Navigate to="/explore">Explore</Navigate>
            </span>
          </span>
          <span class="text-white text-lg pt-4 lg:pt-0 lg:mx-4">
            <span
              class="hover:text-red-600 {currentRoute.path === '/rules'
                ? 'text-red-600'
                : 'text-white'}"
            >
              <Navigate to="/rules">CodeAuditor Rules</Navigate>
            </span>
          </span>
        </div>
      </div>
    </nav>
    <Route {currentRoute} {params} />
  </main>
  <div class="py-2 text-center text-sm bggrey">
    <section class="main-container">
      We <svg
        xmlns="http://www.w3.org/2000/svg"
        height="1em"
        viewBox="0 0 512 512"
        fill="currentColor"
        style="display: inline-block; color: #cc4141;"
        ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
          d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
        /></svg
      >
      open source. Powered by
      <a class="link" href="https://github.com/SSWConsulting/SSW.CodeAuditor"
        >GitHub <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 496 512"
          fill="currentColor"
          style="display: inline-block;"
          ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
            d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
          /></svg
        ></a
      >
    </section>
  </div>
  <footer
    class="footer py-6 text-white md:py-4 lg:py-2 text-sm"
    style="background-color: #000"
  >
    <section class="main-container">
      <div class="xl:mx-6">
        <div class="mx-6 flex flex-col-reverse md:flex-row justify-between">
          <div class="py-2">
            Copyright © SSW 1990 - {new Date().getFullYear()}. All Rights
            Reserved.
          </div>
          <div class="w-full md:w-3/5 md:text-right py-2">
            <a
              class="footer-link"
              target="_blank"
              href="https://github.com/SSWConsulting/SSW.CodeAuditor/issues"
            >
              FEEDBACK / SUGGEST A FEATURE
            </a>
            <span class="px-2">|</span>
            <a
              class="footer-link"
              target="_blank"
              href="https://www.ssw.com.au/terms-and-conditions"
            >
              TERMS AND CONDITIONS
            </a>
            <span class="px-2">|</span>
            <a
              class="footer-link"
              target="_blank"
              href="https://www.youtube.com/user/sswtechtalks"
              title="SSW on YouTube"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 576 512"
                fill="currentColor"
                ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                  d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
                /></svg
              >
            </a>
            <a
              class="footer-link"
              target="_blank"
              href="https://www.linkedin.com/company/ssw"
              title="SSW on LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 448 512"
                fill="currentColor"
                ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                  d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
                /></svg
              >
            </a>
            <a
              class="footer-link"
              target="_blank"
              href="https://www.facebook.com/SSW.page"
              title="SSW on Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                fill="currentColor"
                ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                  d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
                /></svg
              >
            </a>
            <a
              class="footer-link"
              target="_blank"
              href="https://www.instagram.com/ssw_tv"
              title="SSW on Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 448 512"
                fill="currentColor"
                ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                  d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                /></svg
              >
            </a>
            <a
              class="footer-link"
              target="_blank"
              href="https://twitter.com/SSW_TV"
              title="SSW on Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                fill="currentColor"
                ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                  d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                /></svg
              >
            </a>
            <a
              class="footer-link"
              target="_blank"
              href="https://www.tiktok.com/@ssw_tv"
              title="SSW on TikTok"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 448 512"
                fill="currentColor"
                ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                  d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"
                /></svg
              >
            </a>
          </div>
        </div>
        <hr class="border-gray-800 my-2" />
        <div class="flex flex-col md:flex-row justify-between mx-6">
          <div class="py-2">
            Our website is under
            <a
              class="footer-link"
              href="https://www.ssw.com.au/rules/rules-to-better-continuous-deployment-with-tfs"
            >
              CONSTANT CONTINUOUS DEPLOYMENT</a
            >. Last deployed {latestBuildDaysAgo} day(s) ago (Build #
            <a
              class="footer-link"
              href="https://github.com/SSWConsulting/SSW.CodeAuditor/deployments/activity_log?environment=Production"
              >{latestBuildNumber}</a
            >)
          </div>
          <div class="md:text-right py-2">
            Powered by{" "}
            <a
              class="footer-link"
              href="https://www.ssw.com.au/rules/what-is-a-container/"
            >
              {" "}
              Docker
            </a>
            and{" "}
            <a
              class="footer-link"
              href="https://rules.ssw.com.au/static-site-generator"
            >
              {" "}
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  </footer>
</body>

<style>
  .main-container {
    margin-left: auto;
    margin-right: auto;
    max-width: 1280px;
  }
  img {
    max-width: 100%;
    height: auto;
  }
  footer {
    color: #9e9e9e;
    font-size: 0.75rem;
  }
  a.footer-link {
    color: #fff;
    line-height: 0.75rem;
    transition: all 0.3s ease-in-out;
    text-decoration: none;
  }
  a.footer-link:hover {
    color: #cc4141;
  }
  a.footer-link > svg {
    display: inline;
    color: #fff;
    margin-left: 8px;
    height: 16px;
    width: 25px;
  }
</style>
