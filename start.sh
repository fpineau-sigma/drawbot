#!/bin/bash

sshpass -p 12345678 ssh -f -L 0.0.0.0:9222:localhost:9221 localhost -N

cd /home/pi/drawbot/
npm start