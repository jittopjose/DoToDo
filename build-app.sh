#!/bin/bash

ionic build

sed -i 's/type="module"//g' ./www/index.html

rm -rf ./ubports-app/www/
mkdir -p ./ubports-app/www/
cp -r ./www/* ./ubports-app/www/

cd ./ubports-app

clickable

