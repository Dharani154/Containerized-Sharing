#!/bin/bash

echo "      "
echo "ShareBox System Information"
echo "      "

echo ""
echo "Hostname:"
hostname

echo ""
echo "Date:"
date

echo ""
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | head -1

echo ""
echo "Memory Usage:"
free -h

echo ""
echo "Disk Usage:"
df -h /

echo ""
echo "Docker Containers:"
docker ps

echo ""
echo "  "
