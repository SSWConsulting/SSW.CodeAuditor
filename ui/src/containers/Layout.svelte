<script>
  import { Route } from "svelte-router-spa";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import { userSession, userName, isLoggedIn } from "../stores.js";
  import { scale } from "svelte/transition";

  export let currentRoute;

  let scanActive = false,
    settingActive = false,
    signOutActive = false;

  let menu = false;

  const params = {};

  const signOut = () => userSession.logout();
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
  <footer
    class="footer py-6 text-white md:py-4 lg:py-2 text-sm mt-16"
    style="background-color: #414141"
  >
    <section class="main-container">
      <div class="xl:mx-6">
        <div class="mx-6 flex flex-col-reverse md:flex-row justify-between">
          <div class="py-2">
            Copyright © SSW 1990 - {new Date().getFullYear()}. All Rights
            Reserved.
          </div>
          <div class="w-full md:w-3/6 md:text-right py-2">
            <a
              class="footer-link"
              target="_blank"
              href="https://github.com/SSWConsulting/SSW.CodeAuditor/issues"
            >
              FEEDBACK TO SSW CODEAUDITOR
            </a>
            <span class="px-2">|</span>
            <a
              class="footer-link"
              target="_blank"
              href="https://www.ssw.com.au/ssw/Standards/Forms/ConsultingOrderTermsConditions.aspx"
            >
              TERMS AND CONDITIONS
            </a>
            <span class="px-2">|</span>
            <a
              class="footer-link footer-facebook"
              target="_blank"
              href="https://github.com/SSWConsulting/SSW.CodeAuditor"
            >
              FIND US ON GITHUB
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
              CONSTANT CONTINUOUS DEPLOYMENT.
            </a>
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
  .brand {
    color: white !important;
  }
  img {
    max-width: 100%;
    height: auto;
  }
</style>
