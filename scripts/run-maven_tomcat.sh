#!/bin/bash

rm -rf /src/target
mv -f /target /src

# Do not change name for final file, or the game won't wprk.
# This is because that would also change the internally used URL of game.
cp -r /src/target/agario-1.0-SNAPSHOT.war /usr/local/tomcat/webapps/agario.war

echo "---------------------------------------------------------"
echo -e "Project built!\n"
echo "Now deploying project..."
echo "---------------------------------------------------------"

catalina.sh run
