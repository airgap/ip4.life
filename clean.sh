#!/bin/sh

rm -rf compiled
rm -rf package-lock.json
if [ "$1" != "no-dist" ];
then
	rm -rf dist
fi
