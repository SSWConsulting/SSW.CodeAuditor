# local debug
- run `npm run serve`
- OR run `node index.js --debug`
# deploy configs
-  `firebase functions:config:set azurestorage.account=urlchecker azurestorage.key=<KEY>`
-  `firebase functions:config:get`
# deploy
-  `curl http://localhost:5000/sswlinkauditor-c1131/asia-northeast1/api/config/l1w5nshz7i`