#!/bin/bash

if [ "$(id -u)" == "0" ]; then
   echo "This script may NOT run as Root (chromium does not work as root)"
   exit 1
fi

killall Xvfb
Xvfb :7 -screen 8 1024x768x8 &

echo "Listing known displays:"
ls /tmp/.X11-unix

export DISPLAY=:7.8
./demo.sh
killall Xvfb
