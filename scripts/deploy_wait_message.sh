#!/bin/bash

function get_deploy_status() {
  res=$(curl --write-out %{http_code} --silent --output /dev/null localhost:8080/agario)
}

get_deploy_status
while (( res != 200 && res != 302 ))
do
  echo "---------------------------------------------------------"
  echo "Waiting for project deployment pipeline to complete..."
  echo "---------------------------------------------------------"

  sleep 1
  get_deploy_status
done

# Do not change name for final file, or the game won't wprk.
# This is because that would also change the internally used URL of game.
# cp -r /src/target/agario-1.0-SNAPSHOT.war /usr/local/tomcat/webapps/agario.war


echo "---------------------------------------------------------"
echo "Project Deployment Complete!"
echo
echo "Agar.io Clone - Developed by Jaskaranbir"
echo "---------------------------------------------------------"