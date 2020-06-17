# Run CodeAuditor in your CI/CD pipeline

Scan any website for broken links and HTML issues by running the following command:

```bash
$ docker run sswconsulting/codeauditor --url <URL>
```

You can also get [Lighthouse](https://developers.google.com/web/tools/lighthouse) report score by running

```bash
$ docker container run --rm --cap-add=SYS_ADMIN sswconsulting/codeauditor --url <URL> --lighthouse
```

What is **--cap-add=SYS_ADMIN** option? [Read here](https://github.com/GoogleChrome/lighthouse-ci/tree/master/docs/recipes/docker-client)

## Sign up at https://codeauditor.com/

If you [**sign up**](https://codeauditor.com/signup), you will get a unique token which allow you to store last **100** scan results online for **FREE**

```bash
$ docker run sswconsulting/codeauditor --url <URL> --buildId <BUILDID> --token <TOKEN>
```
Where: **BUILDID** [optional]: your CI build number

Or with Lighthouse options

```bash
$ docker container run --rm --cap-add=SYS_ADMIN sswconsulting/codeauditor --url <URL> --lighthouse --buildId <BUILDID> --token <TOKEN>
```

Run help for all command line options:

```bash
$ docker run sswconsulting/codeauditor --help
```

### Static Code Analysis
Include [Static Code Analysis](https://github.com/nvhoanganh/urlchecker/tree/master/sswcodeauditor/rules):

```bash
$ docker container run --cap-add=SYS_ADMIN \
    -v "<YOUR_SOURCE_CODE>:/home/lhci/app/src" \
    sswconsulting/codeauditor --lighthouse --url <URL>
```

### Using smaller image
You can also run `lighthouse` tool directly on your build server and have the result published to https://codeauditor.com/

```bash
$ npm install -g @lhci/cli
$ lhci collect --url=<URL>
$ docker container run --rm -v "$PWD/.lighthouseci:/usr/app/.lighthouseci" sswconsulting/codeauditor:light --url <URL> --lighthouse --token <TOKEN>
```
