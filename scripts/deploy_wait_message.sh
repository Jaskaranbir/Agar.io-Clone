#!/bin/bash

echo -e "\n---------------------------------------------------------"
echo "Waiting for project deployment pipeline to complete..."
echo "---------------------------------------------------------"

function get_deploy_status() {
  res=$(curl --write-out %{http_code} --silent --output /dev/null localhost:8080/agario)
}

tries=15
get_deploy_status
while (( res != 200 && res != 302 && --tries != 0))
do
  echo -n ". "
  sleep 1
  get_deploy_status
done

echo -e ".\n"

if (( tries == 0 )); then
  for cntnr in $(docker ps -q)
  do
    echo "========================================"
    echo "Printing logs for: $cntnr"
    docker logs $cntnr
    echo -e "\n\n\n\n"
  done

  echo "Timeout for deployment pipeline. Most likely an error occured."
  echo -e "Please provide me with above printed logs so I can look into issue.\n"
  echo "For self troubleshooting, follow steps below."
  echo -e "Please run 'vagrant ssh' and check docker logs for troubleshooting.\n"
  echo -e "Alternatively, you can also try running docker containers manually after vagrant ssh using:\n"
  echo "docker-compose up"
  echo "or"
  echo -e "docker-compose up -d\n"
  echo "NOTE: Docker and source files are mounted at '/vagrant'. So you will need to cd into that first."
else
  echo "---------------------------------------------------------"
  echo "Project Deployment Complete!"
  echo
  echo "Agar.io Clone - Developed by Jaskaranbir"
  echo
  echo "https://github.com/Jaskaranbir/Agar.io-Clone"
  echo "---------------------------------------------------------"
fi