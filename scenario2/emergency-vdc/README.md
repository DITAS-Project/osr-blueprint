# emergency-vdc
## Building
`docker build --build-arg NPM_USERNAME=$NPM_USERNAME --build-arg NPM_PASSWORD=$NPM_PASSWORD -t emergency-vdc .`

## Running
`docker run -p 3000:3000 -e DAL_HOSTNAME=$DAL_HOSTNAME -e DAL_PORT=$DAL_PORT emergency-vdc`