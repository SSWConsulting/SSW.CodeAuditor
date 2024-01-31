<script>
  import { Router, Route, Link } from "svelte-navigator";
  import GettingStarted from "../components/howitworkscomponents/GettingStarted.svelte";
  import HowToUse from "../components/howitworkscomponents/HowToUse.svelte";
  import AlertEmailDoc from "../components/howitworkscomponents/AlertEmailDoc.svelte";
  import AddRuleDoc from "../components/howitworkscomponents/AddRuleDoc.svelte";
  import CustomizeRuleDoc from "../components/howitworkscomponents/CustomizeRuleDoc.svelte";
  import ScanCompareDoc from "../components/howitworkscomponents/ScanCompareDoc.svelte";
  import AddWorkflowDoc from "../components/howitworkscomponents/AddWorkflowDoc.svelte";

  export let currentRoute; 

</script>

<div class="container grid grid-cols-7 mx-auto">
  <Router>
    <div class="col-span-1">
      <div class="flex flex-col mt-8">
        <span class="{currentRoute.path === '/howitworks' ? 'textred' : 'textdark'} font-sans font-bold lg:pt-0 mx-2 sm:mx-4">
          <span
            class="header-item"
          >
            <Link to="/howitworks">Getting Started</Link>
          </span>
        </span>
        <span class="{currentRoute.path === '/howitworks/howtouse' ? 'textred' : 'textdark'} font-sans font-bold lg:pt-0 mx-2 sm:mx-4 mt-2">
          <span
            class="header-item"
          >
            <Link to="/howitworks/howtouse">How to run a Scan</Link>
          </span>
        </span>
        <span class="{currentRoute.path === '/howitworks/sendalertemails' ? 'textred' : 'textdark'} font-sans font-bold lg:pt-0 mx-2 sm:mx-4 mt-2">
          <span
            class="header-item"
          >
            <Link to="/howitworks/sendalertemails">How to Send Alert Emails</Link>
          </span>
        </span>

        <span class="{currentRoute.path === '/howitworks/scancompare' ? 'textred' : 'textdark'} font-sans font-bold lg:pt-0 mx-2 sm:mx-4 mt-2">
          <span
            class="header-item"
          >
            <Link to="/howitworks/scancompare">How to Compare between Scans</Link>
          </span>
        </span>
        <span class="{currentRoute.path === '/howitworks/customizerule' ? 'textred' : 'textdark'} font-sans font-bold lg:pt-0 mx-2 sm:mx-4 mt-2">
          <span
            class="header-item"
          >
            <Link to="/howitworks/customizerule">How to Customize HTML Rules</Link>
          </span>
        </span>
        <span class="{currentRoute.path === '/howitworks/addingcustomrule' ? 'textred' : 'textdark'} font-sans font-bold lg:pt-0 mx-2 sm:mx-4 mt-2">
          <span
            class="header-item"
          >
            <Link to="/howitworks/addingcustomrule">How to Add custom HTML Rule</Link>
          </span>
        </span>
        <span class="{currentRoute.path === '/howitworks/addingworkflow' ? 'textred' : 'textdark'} font-sans font-bold lg:pt-0 mx-2 sm:mx-4 mt-2">
          <span
            class="header-item"
          >
            <Link to="/howitworks/addingworkflow">How to Integrate CodeAuditor Workflow</Link>
          </span>
        </span>
      </div>
    </div>
    <div class="col-span-6">
      <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <Route path="/howitworks/gettingstarted">
          <GettingStarted />
        </Route>
    
        <Route path="/howitworks/howtouse">
          <HowToUse />
        </Route>

        <Route path="/howitworks/sendalertemails">
          <AlertEmailDoc />
        </Route>

        <Route path="/howitworks/scancompare">
          <ScanCompareDoc />
        </Route>

        <Route path="/howitworks/customizerule">
          <CustomizeRuleDoc />
        </Route>

        <Route path="/howitworks/addingcustomrule">
          <AddRuleDoc />
        </Route>

        <Route path="/howitworks/addingworkflow">
          <AddWorkflowDoc />
        </Route>

        <Route>
          <GettingStarted />
        </Route>
      </div>
    </div>
  </Router>
</div>
