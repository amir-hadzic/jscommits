#!/bin/bash

src=".."
output_js="$src/jscommits-min.js"
output_css="$src/jscommits-min.css"

cat $src/github.js $src/jscommits.js > temp.js

rm $output_js
java -jar compiler.jar --js temp.js --js_output_file $output_js
rm temp.js

cat $src/jscommits.css | ./cssmin.py > $output_css
