<script>
  import { Route } from "svelte-router-spa";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import { userSession, userName, isLoggedIn } from "../stores.js";
  import { scale } from "svelte/transition";

  export let currentRoute;

  let menu = false;

  const params = {};

  const signOut = () => userSession.logout();

  const showMenu = () => (menu = !menu);

  const buildTimeStamp = __myapp.env.TIME
</script>

<body class="flex flex-col min-h-screen ">
<main class="flex-grow container mx-auto">
  <nav class="flex items-center justify-between p-6 mt-4 nav">
    <div class="flex flex-wrap">
      <div class="w-full overflow-hidden">
        <span class="text-white text-lg pt-4 lg:pt-0 lg:mx-4">
          <span class="hover:text-red-600">
            <Navigate to="/explore">Explore</Navigate> 
          </span>
        </span>
        <span class="text-white text-lg pt-4 lg:pt-0 lg:mx-4">
          <span class="hover:text-red-600">        
            <Navigate to="/howitworks">How It Works</Navigate>
          </span>
        </span>
        <span class="text-white text-lg pt-4 lg:pt-0 lg:mx-4">
          <span class="hover:text-red-600">        
            <Navigate to="/rules">CodeAuditor Rules</Navigate>
          </span>
        </span>
        <hr class="mt-4 bg-white">
      </div>
    
      <div class="w-full mt-4">
        <div class="w-full block flex-grow lg:flex lg:items-center">
          <a href="/" class="sm:w-4/4 lg:w-1/3 ml-2">
            <img
              class="h-7 object-cover"
              src="https://i.ibb.co/QYTq9D3/Code-Auditor-logo.png"
              alt="CodeAuditor"
            />
          </a> 
          <div class="text-sm lg:flex-grow" />
          {#if $isLoggedIn}
            <div>
              <span class="text-white">
                <div class="relative">
                  <button
                    on:click={showMenu}
                    class="inline-block text-l px-4 py-2 leading-none border rounded
                text-white border-white hover:border-transparent hover:text-red-600
                hover:bg-white mt-4 lg:mt-0"
                    >{$userName}
                  </button>
                  {#if menu}
                    <span
                      in:scale={{ duration: 100, start: 0.95 }}
                      out:scale={{ duration: 75, start: 0.95 }}
                      class="origin-top-right absolute right-0 w-48 py-2 mt-10 bg-gray-800
                    rounded shadow-md"
                    >
                      <span
                        class="block px-4 py-2 hover:bg-red-600 hover:text-white"
                      >
                        <Navigate to="/home">Your Scans</Navigate>
                      </span>
                      <span
                        class="block px-4 py-2 hover:bg-red-600 hover:text-white"
                      >
                        <Navigate to="/home/settings">Ignored URLs</Navigate>
                      </span>
                      <span
                        on:click={signOut}
                        class="block px-4 py-2 hover:bg-red-600 hover:text-white"
                        >Logout</span
                      >
                    </span>
                  {/if}
                </div>
              </span>
            </div>
          {:else}
            <div>
              <span class="text-white mx-2">
                <Navigate to="/login">Log In</Navigate>
              </span>
              <button
                on:click={() => navigateTo("/signup")}
                type="button"
                class="inline-block text-sm px-4 py-2 leading-none border rounded
                text-white border-white hover:border-transparent hover:text-red-600
                hover:bg-white mt-4 lg:mt-0"
              >
                Sign Up
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </nav>
  <Route {currentRoute} {params} />
  </main>
  <footer class="footer py-6 text-white md:py-4 lg:py-2">
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
              href="https://github.com/SSWConsulting/SSW.CodeAuditor/issues"
            >
              FEEDBACK TO SSW
            </a>
            <span class="px-2">|</span>
            <a
              class="footer-link"
              href="https://www.ssw.com.au/ssw/Standards/Forms/ConsultingOrderTermsConditions.aspx"
            >
              TERMS AND CONDITIONS
            </a>
            <span class="px-2">|</span>
            <a
              class="footer-link footer-facebook"
              href="https://www.facebook.com/SSW.page"
            >
              FIND US ON FACEBOOK
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
            Last deployed {buildTimeStamp}
          </div>
          <div class="md:text-right py-2">
            Powered by{" "}
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
  .nav,
  footer {
    background-color: #333;
  }
  img {
    max-width: 100%;
    height: auto;
  }
  body {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  padding: 0;
}
  main {
  flex: 1; /* Or flex-grow: 1;*/
}
</style>
