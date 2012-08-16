#!/bin/bash

src="$(cd $(dirname "$0"); cd ..;pwd)"
output_js="$src/jscommits-min.js"
output_css="$src/jscommits-min.css"

cat $src/gh3/gh3.js $src/jscommits.js > temp.js

rm $output_js
java -jar $src/tools/compiler.jar --js temp.js --js_output_file $output_js
rm temp.js

cat $src/jscommits.css | $src/tools/cssmin.py > $output_css
