#/bin/bash
clear
while true; do
  clear
  node lvlgen.js
  echo Server went off, waiting ten sec then restarting it...
  sleep 10
done
