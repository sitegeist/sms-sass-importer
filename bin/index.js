#!/usr/bin/env node
'use strict';
var sass = require('node-sass');
var importer = require('../dist/index');
var _UtilPrefixConfig = require('../dist/Util/PrefixConfig');
var fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

importer = _interopRequireDefault(importer);

var config = (0, _UtilPrefixConfig.getPrefixConfig)();
var nodeSassOptions = config.nodeSassOptions;

sass.render({
    file: nodeSassOptions.file,
    outputStyle: nodeSassOptions.outputStyle,
    outFile: nodeSassOptions.outFile,
    sourceMap: nodeSassOptions.sourceMap,
    importer: (0, importer['default'])(),
},function(err, result) {
        if (!err) {
            fs.writeFile(nodeSassOptions.outFile, result.css, function(err2) {
                if (!err2) console.log(`${nodeSassOptions.outFile} file generated!`);
                else console.log(`${nodeSassOptions.outFile} could not be created: ${err}`);
            });
        } else
            console.log(`${nodeSassOptions.outFile} could not be created: ${err}`);
    });

