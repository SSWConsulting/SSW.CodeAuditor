<script>
  import { navigateTo } from "svelte-router-spa";
</script>
<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <article class="markdown-body">
      <h1>About SSW</h1>
      <h3>
        Australia's Leading Software Consultants
      </h3>
      <p>
        SSW's Consulting Services have delivered the best breed Microsoft solutions for thousands of clients in 15 countries over more than 30 years. With over 100 consultants in 4 countries, SSW's developers are some of the best in the business. We have many Microsoft Certifications, several MVPs, and a Microsoft Regional Director.
      </p>
      <p>
        We deliver scalable and extensible custom solutions with the future in mind. Our solutions improve businesses' bottom lines, with real time savings and long-term value. We will provide you with the competitive advantage you need.
      </p>
      <h1>
        About CodeAuditor
      </h1>
      <h3>
        What is CodeAuditor?
      </h3>
      <p>
        CodeAuditor is a tool that automatically scans your website and its code to check
      </p>
      <ul class="list-disc">
        <li>Find broken Links - Links to pages which do not work</li>
        <li>Check HTML formatting - May cause pages to be incorrectly shown to the user</li>
        <li>Lighthouse scan - Audits for performance, accessibility, SEO, and more</li>
        <li>Artillery load test - See how website behaves when lot of users access it simultaneously</li>
      </ul> 
      <h3>
        How does it work?
      </h3> 
      <p>
        CodeAuditor runs scans and checks for issues on your website, and can then generate a report which can be viewed online.
      </p>
      <p>
        CodeAuditor is simple to use and can be either be run manually, or embedded directly into your build pipeline where it can be configured to automatically fail a build based on a number of broken links, SEO issues or other rules failures to ensure quality.
      </p>
      <p>Signing up for free and logging in to CodeAuditor will allow you to view and track your website's changes and improvements over time.</p>
      <h1>
        CodeAuditor Case Studies
      </h1>
      <p> 
        In these case studies, we'll explore real-world scenarios where CodeAuditor has played a pivotal role in enhancing code quality and streamlining development processes. 
        From identifying and resolving broken links that hinder user engagement to pinpointing critical code errors that impact functionality, each case study 
        showcases CodeAuditor's ability to uncover issues efficiently and facilitate their resolution. 
      </p>
      <h3>
        SSW Products
      </h3>
      <div class="float-left mb-2 mr-4 block border-r-1 p-4">
        <a href="https://ssw.com.au/">
        <img width="129" alt="image" src="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/6c077ba5-111c-4e00-9067-f1f7cc3c5685">
        </a>
      </div>
      <div class="prose max-w-full prose-img:my-0">
        <p>
          SSW offers a diverse array of products comprising web applications featuring server-side rendering and static website generation, rendering them ideally suited for CodeAuditor's scanning capabilities. 
          These products include SSW Rules, SSW People, and SSW Website.
        </p>
      </div>
      <button 
        type="button"
        on:click={() => {navigateTo("/aboutus/casestudy/ssw")}} 
        class="bgred hover:bg-red-800 text-white font-semibold py-2 px-4 border hover:border-transparent rounded"
      >
        Read the case study
      </button>
    </article>
  </div>
</div>