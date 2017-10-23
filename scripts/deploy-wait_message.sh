#!/bin/bash

echo -e "\n---------------------------------------------------------"
echo "Waiting for project deployment pipeline to complete..."
echo "---------------------------------------------------------"

function get_deploy_status() {
  res=$(curl --write-out %{http_code} --silent --output /dev/null localhost:8080/agario)
}

if [ ! -f ../.mvn_temp/node/node ]; then
  echo "---------------------------------------------------------"
  echo "Waiting with additional wait time to allow node setup..."
  echo "---------------------------------------------------------"
  max_attempts=300
else
  max_attempts=40
fi

cur_attempts=0
get_deploy_status
while (( res != 200 && res != 302 && ++cur_attempts != max_attempts))
do
  echo "==> Waiting for project deployment pipeline (attempt: $cur_attempts of $max_attempts)."
  sleep 2
  get_deploy_status
done

echo

if (( cur_attempts == max_attempts )); then
  for cntnr in $(docker ps -q)
  do
    cntnrInfo=$(docker ps -f "id=$cntnr" --format "---Container: "{{.Names}}\t" and ---Image: "{{.Image}})

    echo "----------------------------------------"
    echo -e "Printing logs for $cntnrInfo \n\n"
    echo "----------------------------------------"

    docker logs $cntnr
    echo -e "\n\n\n\n"
  done

  # Panic messages
  echo "=============================================================="
  echo "Timeout for deployment pipeline. Most likely an error occured."
  echo -e "Please provide me with above printed logs so I can look into issue.\n"
  echo "For self troubleshooting, follow steps below."

  echo -e "Please run 'vagrant ssh' and check docker logs for troubleshooting.\n"
  echo -e "Alternatively, you can also try running docker containers manually after vagrant ssh using:\n"

  echo "docker-compose up"
  echo "or"
  echo -e "docker-compose up -d\n"

  echo -e "NOTE: Docker and source files are mounted at '/vagrant'. So you will need to cd into that first.\n\n\n"

  echo "You might need to press Ctrl+C to exit."

  exit 1
else
  echo "---------------------------------------------------------"
  echo "Project Deployment Complete!"
  echo "---------------------------------------------------------"
fi