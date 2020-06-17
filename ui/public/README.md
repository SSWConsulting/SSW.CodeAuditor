## CodeAuditor

Scan any website for broken links and [HTML Issues](https://htmlhint.com) by running the following command:

```bash
$ docker run sswconsulting/codeauditor --url <URL>
```

Include [Lighthouse](https://developers.google.com/web/tools/lighthouse) Audit:

```bash
$ docker container run --cap-add=SYS_ADMIN sswconsulting/codeauditor --lighthouse --url <URL>
```

Include [Static Code Analysis](https://github.com/nvhoanganh/urlchecker/tree/master/sswcodeauditor/rules):

```bash
$ docker container run --cap-add=SYS_ADMIN \
    -v "<YOUR_SOURCE_CODE>:/home/lhci/app/src" \
    sswconsulting/codeauditor --lighthouse --url <URL>
```

If you don't want Lighthouse audit, you can use the lighter version
```bash
$ docker container run \
    -v "<YOUR_SOURCE_CODE>:/usr/app/src" \
    sswconsulting/codeauditor:light --url <URL>
```