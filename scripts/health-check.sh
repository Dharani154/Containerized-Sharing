#!/bin/bash

URL="http://localhost:4040/health"

echo "    "
echo "ShareBox Health Check"
echo "    "

if curl -fs "$URL" > /dev/null; then

    echo "Application Status : UP"
    echo "Health Check       : PASSED"

    exit 0

else

    echo "Application Status : DOWN"
    echo "Health Check       : FAILED"

    exit 1

fi
