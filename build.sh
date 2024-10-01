#!/bin/bash
cd client
npm install
npm run build
rm -rf ../public/client
mkdir -p ../public/client
cp -r dist/* ../public/client/