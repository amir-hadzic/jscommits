#!/bin/bash

output="jscommits-min.js"
src=".."

cat $src/github.js $src/jscommits.js > temp.js

rm $output 
java -jar compiler.jar --js temp.js --js_output_file $src/$output
rm temp.js

cat $src/jscommits.css | ./cssmin.py > $src/jscommits-min.css
