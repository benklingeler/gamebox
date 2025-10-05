#!/bin/sh
node /app/backend/dist/index.js &
nginx -g 'daemon off;'