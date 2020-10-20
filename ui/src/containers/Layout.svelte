<script>
  import { Route } from "svelte-router-spa";
  import firebase from "firebase/app";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import Icon from "../components/Icon.svelte";
  import { userSession, userName, isLoggedIn } from "../stores.js";
  import { scale } from "svelte/transition";

  export let currentRoute;
  let menu = false;

  const params = {};
  const signOut = () => userSession.logout();
  const showMenu = () => (menu = !menu);
</script>

<style>
  .brand {
    color: white !important;
  }
  .nav {
    background-color: #414141;
  }
</style>

<main class="container mx-auto">
  <nav class="flex items-center justify-between flex-wrap p-6 nav">
    <div class="flex items-center flex-shrink-0 text-white mr-6">
      <Icon cssClass="inline-block text-red-600" height="24" width="24">
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </Icon>
      <a href="/" class="ml-2 font-semibold text-xl tracking-tight brand">
        SSW CodeAuditor
      </a>
      <span class="text-white text-xl mx-5">
        <Navigate to="/explore">Explore</Navigate>
      </span>
    </div>
    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div class="text-sm lg:flex-grow" />
      {#if $isLoggedIn}
        <div>
          <span class="text-white">
            <div class="relative">
              <button
                on:click={showMenu}
                class="inline-block text-l px-4 py-2 leading-none border rounded
            text-white border-white hover:border-transparent hover:text-teal-500
            hover:bg-white mt-4 lg:mt-0">{$userName}
              </button>
              {#if menu}
                <span
                  in:scale={{ duration: 100, start: 0.95 }}
                  out:scale={{ duration: 75, start: 0.95 }}
                  class="origin-top-right absolute right-0 w-48 py-2 mt-10 bg-gray-800
                rounded shadow-md">
                  <span
                    class="block px-4 py-2 hover:bg-green-500 hover:text-green-100">
                    <Navigate to="/home">👌 Your Scans</Navigate>
                  </span>
                  <span
                    class="block px-4 py-2 hover:bg-green-500 hover:text-green-100">
                    <Navigate to="/home/settings">🏷️ Ignored URLs</Navigate>
                  </span>
                  <span
                    on:click={signOut}
                    class="block px-4 py-2 hover:bg-green-500 hover:text-green-100">🚪
                    Logout</span>
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
            on:click={() => navigateTo('/signup')}
            type="button"
            class="inline-block text-sm px-4 py-2 leading-none border rounded
            text-white border-white hover:border-transparent hover:text-teal-500
            hover:bg-white mt-4 lg:mt-0">
            Sign Up
          </button>
        </div>
      {/if}
    </div>
  </nav>
  <Route {currentRoute} {params} />
</main>
