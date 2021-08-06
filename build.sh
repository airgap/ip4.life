#!/bin/sh

# Clean previous build
./clean.sh

# Create dist and compiled directories
mkdir dist
mkdir compiled

# Install NPM modules
npm i

cd src || exit

# Compile TypeScript and Sass
tsc
sass index.sass ../compiled/index.css || exit 1

cd .. || exit

# Inject the HTML and CSS into index.js
ts-node inject.ts

# Clean the temporary build artifacts
./clean.sh no-dist
