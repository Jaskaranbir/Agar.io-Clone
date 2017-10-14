#!/bin/bash

# Deploy as azure web app
curl --ftp-create-dirs -T \
./target/agario-1.0-SNAPSHOT.war \
-u $AZ_WEB_USER:$AZ_WEB_PASSWORD \
ftp://waws-prod-yq1-003.ftp.azurewebsites.windows.net/site/wwwroot/webapps/agario.war