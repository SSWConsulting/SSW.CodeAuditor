<script>
  import { Route } from "svelte-router-spa";
  import firebase from "firebase/app";
  import { Navigate } from "svelte-router-spa";
  import { navigateTo } from "svelte-router-spa";
  import { userSession, userName } from "../stores.js";
  export let currentRoute;
  const params = {};
  const signOut = () => {
    firebase.auth().signOut();
    userSession.logout();
    navigateTo("/login");
  };
  userName.subscribe(x => {
    console.log(x);
  });
</script>

<main class="container mx-auto">
  <nav class="flex items-center justify-between flex-wrap bg-gray-800 p-6">
    <div class="flex items-center flex-shrink-0 text-white mr-6">
      <span class="font-semibold text-xl tracking-tight">SSW Link Auditor</span>
    </div>
    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div class="text-sm lg:flex-grow" />
      <div>
        <span class="text-white mx-2">{$userName}</span>
        <button
          on:click={signOut}
          type="button"
          class="inline-block text-sm px-4 py-2 leading-none border rounded
          text-white border-white hover:border-transparent hover:text-teal-500
          hover:bg-white mt-4 lg:mt-0">
          Sign Out
        </button>
      </div>
    </div>
  </nav>
  <Route {currentRoute} {params} />
</main>
