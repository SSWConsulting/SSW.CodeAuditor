# Run SSW Auditor in your CI/CD pipeline

Scan any website for broken links and HTML issues by running the following command:

```bash
$ docker run sswconsulting/sswauditor --url <URL>
```

You can also get [Lighthouse](https://developers.google.com/web/tools/lighthouse) report score by running

```bash
$ docker container run --rm --cap-add=SYS_ADMIN sswconsulting/sswauditor:lhci --url <URL> --lighthouse
```

Please note, `sswconsulting/sswauditor:lhci` image is **1.38GB** (**498MB** compressed), while the `sswconsulting/sswauditor` is **252MB** (**66MB** compressed)

Why **--cap-add=SYS_ADMIN** option? [Read here](https://github.com/GoogleChrome/lighthouse-ci/tree/master/docs/recipes/docker-client)

## Sign up at https://sswauditor.surge.sh/

If you [**sign up**](https://sswauditor.surge.sh/signup), you will get a unique token which allow you to store last **100** scan results online for **FREE**

```bash
$ docker run sswconsulting/sswauditor --url <URL> --buildId <BUILDID> --token <TOKEN>
```
Where: **BUILDID** [optional]: your CI build number

Or with Lighthouse options

```bash
$ docker container run --rm --cap-add=SYS_ADMIN sswconsulting/sswauditor:lhci --url <URL> --lighthouse --buildId <BUILDID> --token <TOKEN>
```

Run help for all command line options:

```bash
$ docker run sswconsulting/sswauditor --help
```

### Include Lighthouse without using sswconsulting/sswauditor:lhci image
You can also run `lighthouse` tool directly on your build server and publish the result to https://sswauditor.surge.sh/ (This way, you don't have to pull the larger `sswconsulting/sswauditor:lhci` image)

```bash
$ npm install -g @lhci/cli
$ lhci collect --url=<URL>
$ docker container run --rm -v "$PWD/.lighthouseci:/usr/app/.lighthouseci" sswconsulting/sswauditor --url https://azuregems.io --lighthouse --token <TOKEN>
```