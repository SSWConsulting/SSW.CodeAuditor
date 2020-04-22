## run locally
- start locally : `func start`
## deploy to Azure
- need az cli version 2.0.76 or above
- run `az.cmd login`
- run `az.cmd group create --name url-checker --location australiaeast`
- run `az.cmd storage account create --name urlchecker --location australiaeast --resource-group url-checker --sku Standard_LRS`
- run `az.cmd functionapp create --resource-group url-checker --consumption-plan-location australiaeast --runtime node --runtime-version 10 --functions-version 2 --name urlcheckerfunc --storage-account urlchecker`
- run `func azure functionapp publish urlcheckerfunc --javascript`
- visit `https://urlcheckerfunc.azurewebsites.net/api/submitresult?name=hello`
- delete `az.cmd group delete --name url-checker`
- run `az.cmd functionapp config appsettings set --name urlcheckerfunc --resource-group url-checker --settings "AZURE_STORAGE_ACCOUNT=<NAME>"`
- run `az.cmd functionapp config appsettings set --name urlcheckerfunc --resource-group url-checker --settings "AZURE_STORAGE_ACCESS_KEY=<KEY>"`
- run `az functionapp cors add -g url-checker -n urlcheckerfunc --allowed-origins *`