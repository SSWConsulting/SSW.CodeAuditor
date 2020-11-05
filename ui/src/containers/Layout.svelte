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
  img {
    max-width: 100%;
    height: auto;
  }
</style>

<main class="container mx-auto">
  <nav class="flex items-center justify-between p-6 nav">
    <div class="flex items-center flex-wrap text-white mr-6">
      <div href="/" class="sm:w-4/4 lg:w-1/3 ml-2">
        <img
          class="h-7 object-cover"
          src="images/CodeAuditor_logo.png"
          alt="CodeAuditor" />
      </div>
      <span class="w-1/3 text-white text-lg lg:text-xl pt-4 lg:pt-1 lg:mx-5">
        <Navigate to="/explore">Explore</Navigate>
      </span>
    </div>

    <div class="w-full block flex-grow lg:flex lg:items-center">
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
                    <Navigate to="/home">Your Scans</Navigate>
                  </span>
                  <span
                    class="block px-4 py-2 hover:bg-green-500 hover:text-green-100">
                    <Navigate to="/home/settings">Ignored URLs</Navigate>
                  </span>
                  <span
                    on:click={signOut}
                    class="block px-4 py-2 hover:bg-green-500 hover:text-green-100">Logout</span>
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
