#!/bin/bash

# Deploy as azure web app
curl --ftp-ssl --ftp-create-dirs -T \
./target/agario-1.0-SNAPSHOT.war \
-u "$AZ_WEB_USER":"$AZ_WEB_PASSWORD" \
"$AZ_WEB_HOST_PATH"