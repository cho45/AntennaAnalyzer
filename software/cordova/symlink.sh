#!/bin/sh

for i in www/*; do
	rm -r platforms/browser/$i
	ln -s ../../../$i platforms/browser/$i
done
