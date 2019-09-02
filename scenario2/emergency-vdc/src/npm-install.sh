#!/bin/sh
set -e

[ -z "$NPM_USERNAME" ] && echo "Need to set NPM_USERNAME" && exit 1;
[ -z "$NPM_PASSWORD" ] && echo "Need to set NPM_PASSWORD" && exit 1;

GIT_SSL_NO_VERIFY=true GIT_ASKPASS=$(pwd)/git-credentials.sh npm install $@
