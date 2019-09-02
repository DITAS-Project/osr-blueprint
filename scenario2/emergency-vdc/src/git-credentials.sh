#!/bin/sh
case "$1" in
Username*) echo $NPM_USERNAME ;;
Password*) echo $NPM_PASSWORD ;;
esac
