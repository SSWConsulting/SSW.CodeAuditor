<script>
    import { onDestroy } from "svelte";
    import { userSession$ } from "../../stores";
    import * as marked from "marked";

    let instruction, instructionSteps;
    
    const unsubscribe = userSession$.subscribe((x) => {
        if (x) {
        const tokenText = '--token ' + x.apiKey;
        updateDockerInstructions(tokenText);
        }
        else {
        updateDockerInstructions('');
        }
    });

    onDestroy(unsubscribe);

    function updateDockerInstructions(tokenText) {
    instruction = `
# How to Use CodeAuditor
Scan any website for broken links, [HTML Issues](https://htmlhint.com), [Google Lighthouse Audit](https://developers.google.com/web/tools/lighthouse) and [Artillery Load Test](https://artillery.io/) by running the following command:
\`\`\` bash
$ docker container run --cap-add=SYS_ADMIN sswconsulting/codeauditor ${tokenText} --url <URL>
\`\`\`
`;

    instructionSteps = `
## Instructions to scan a URL 
### On Windows 
\`\`\` bash
1. Download Docker for Windows at https://docs.docker.com/docker-for-windows/install/
2. Follow the installation steps and run Docker
3. On CodeAuditor, copy the following command: docker run sswconsulting/codeauditor ${tokenText} --url <URL>
4. Open Windows Powershell and paste the above command, replace <URL> with your designated url 
  (make sure to include the full URL with 'https')
5. Once scan is complete, a result script will display which gives you a link to your scan result page
\`\`\`

### On Mac 
\`\`\` bash
1. Download Docker for Mac at https://docs.docker.com/docker-for-mac/install/
2. Follow the installation steps and run Docker
3. On CodeAuditor, copy the following command: docker run sswconsulting/codeauditor ${tokenText} --url <URL>
4. Open the Terminal and paste the above command, replace <URL> with your designated url 
  (make sure to include the full URL with 'https')
5. Once scan is complete, a result script will display which gives you a link to your scan result page
\`\`\``;
  };

  const systemRequirements = `
  ## System requirements
  Make sure your system meets the following requirements:
  \`\`\` bash
  - Have Docker Desktop running in the background 
  - Have at least 1GB of storage to download the Docker image
  \`\`\``;
</script>

<article class="markdown-body">
  {@html marked.parse(instruction)}
</article>
<article class="markdown-body mt-8">
  {@html marked.parse(systemRequirements)}
</article>
<article class="markdown-body mt-8">
  {@html marked.parse(instructionSteps)}
</article>
<article class="markdown-body mt-8">
  <h3>Video - How to use Code Auditor:</h3>
  <div>
    <iframe class="max-w-full" width="560" height="315" src="https://www.youtube.com/embed/DCDAtmvaPUY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>
</article>