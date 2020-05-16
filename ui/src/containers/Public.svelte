<script>
  import marked from "marked";
  import { fade, fly } from "svelte/transition";
  import { isLoggedIn } from "../stores.js";
  import { navigateTo } from "svelte-router-spa";
  isLoggedIn.subscribe(x => {
    if (x) {
      navigateTo("/home");
    }
  });

  async function getReadMe() {
    const res = await fetch(
      `/README.md`
    );
    instructions = await res.text();
  }
  getReadMe();
  let instructions = "";
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <article class="markdown-body">
      {@html marked(instructions)}
    </article>
  </div>

  <div class="text-5xl text-center pt-24">Scan for broken links for FREE</div>
  <div class="grid grid-cols-3 gap-4 pt-16 row-gap-32 pb-24">
    <div class="col-span-2">
      <img
        src="/images/screenshot1.png"
        alt="Screenshot 1"
        class="rounded-lg shadow-2xl border-2 border-gray-600 border-solid" />
    </div>
    <div class="col-span-1">
      <div class="text-center text-3xl">One simple command...</div>
    </div>

    <div class="col-span-1">
      <div class="text-center text-3xl">return list of broken links</div>
    </div>
    <div class="col-span-2">
      <img
        src="/images/screenshot2.png"
        alt="Screenshot 1"
        class="rounded-lg shadow-2xl border-2 border-gray-600 border-solid" />
    </div>

    <div class="col-span-2">
      <img
        src="/images/screenshot3.png"
        alt="Screenshot 1"
        class="rounded-lg shadow-2xl border-2 border-gray-600 border-solid" />
    </div>
    <div class="col-span-1">
      <div class="text-center text-3xl">
        with
        <span class="text-red-500">Exit code 1</span>
      </div>
    </div>
  </div>

  <div class="text-5xl text-center pt-24">
    Sign up to have your last 100 results stored online for free
  </div>
  <div class="text-center pt-6">
    <button
      on:click={() => navigateTo('/signup')}
      type="button"
      class="bg-blue-100 hover:bg-blue-500 text-blue-800 font-semibold
      hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent
      rounded text-3xl">
      Sign up now, it's FREE!
    </button>
  </div>
  <div class="grid grid-cols-3 gap-4 pt-16 row-gap-32 pb-24">
    <div class="col-span-2">
      <img
        src="/images/dashboard.png"
        alt="Dashboard"
        class="rounded-lg shadow-2xl border-2 border-gray-600 border-solid" />
    </div>
    <div class="col-span-1">
      <div class="text-center text-2xl">
        Keep your last 100 scan results for FREE
      </div>
    </div>

    <div class="col-span-1">
      <div class="text-center text-3xl">Export your result to CSV</div>
    </div>
    <div class="col-span-2">
      <img
        src="/images/result.png"
        alt="Screenshot 1"
        class="rounded-lg shadow-2xl border-2 border-gray-600 border-solid" />
    </div>

    <div class="col-span-2">
      <img
        src="/images/ignore.png"
        alt="Screenshot 1"
        class="rounded-lg shadow-2xl border-2 border-gray-600 border-solid" />
    </div>
    <div class="col-span-1">
      <div class="text-center text-3xl">Add broken URLs to ignore list</div>
    </div>
  </div>
</div>
