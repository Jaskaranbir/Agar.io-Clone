#!/bin/bash

mvn clean install

status=$?

if [ $status == 0 ]; then
  # Do not change name for final file, or the game won't wprk.
  # This is because that would also change the internally used URL of game.
  cp -r ./target/agario-1.0-SNAPSHOT.war /usr/local/tomcat/webapps/agario.war

  echo "---------------------------------------------------------"
  echo -e "Project built!\n"
  echo "Now deploying project..."
  echo "---------------------------------------------------------"

  catalina.sh run

  status=$?

  echo "---------------------------------------------------------"
  echo "Application deployed on Tomcat!"
  echo "---------------------------------------------------------"

  if [ $status != 0 ]; then
    echo "---------------------------------------------------------"
    echo "An error occured; failed to deploy application on Tomcat"
    echo "---------------------------------------------------------"
  fi

else
  echo "---------------------------------------------------------"
  echo "An error occured. Failed to build project."
  echo "---------------------------------------------------------"
fi
