<script>
  import marked from "marked";
  import { fade, fly } from "svelte/transition";

  const instructions = `
  ## SSW Link Auditor - Setup instructions
  Scan any website for broken links, for free, by running the following command:
  \`\`\` bash
  $ docker run nvhoanganh1909/sswlinkauditor --url <URL> -buildId <BUILDID>
  \`\`\`
  Where: **BUILDID** [optional]: your CI build number

  If you [sign up](/signup), you will get a unique token which allow you to store last **100** scan results on this website
  \`\`\` bash
  $ docker run nvhoanganh1909/sswlinkauditor --url <URL> -buildId <BUILDID> --token <TOKEN>
  \`\`\`
  `;
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <article class="markdown-body">
      {@html marked(instructions)}
    </article>
  </div>
</div>
