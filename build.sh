#!/bin/sh

./clean.sh
mkdir dist
mkdir compiled
npm i
cd src || exit
tsc
sass index.sass ../compiled/index.css
cd .. || exit
ts-node inject.ts
./clean.sh no-dist
