#!/bin/bash

echo ""
echo "ShareBox Health Check"
echo ""

if curl -fs http://localhost:4040/health; then
    echo ""
    echo "Application Status : UP"
    echo "Health Check       : PASSED"
    exit 0
else
    echo ""
    echo "Application Status : DOWN"
    echo "Health Check       : FAILED"
    exit 1
fi