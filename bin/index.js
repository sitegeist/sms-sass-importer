#!/usr/bin/env node
'use strict';
var sass = require('node-sass');
var importer = require('../dist/index');
var _UtilPrefixConfig = require('../dist/Util/PrefixConfig');
var fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

const ImporterFunc = () => {

    return new Promise((resolve, reject) => {

        importer = _interopRequireDefault(importer);

        var config = (0, _UtilPrefixConfig.getPrefixConfig)();

        if (!config.nodeSassOptions) {
            reject (new Error('please provide node sass options object in your buildconfig.json ' +
                '("nodeSassOptions": { "file": "main.scss", "outputStyle": "compressed", "outFile": "Main.min.css", "sourceMap": true })'));
        }

        if (!config.nodeSassOptions.file || !fs.existsSync(config.nodeSassOptions.file)) {
            reject (new Error('please provide a valid path to an scss file in your buildconfig in the "nodeSassOptions" ("nodeSassOptions": { "file": "main.scss",)'));
        }

        if (!config.nodeSassOptions.outFile) {
            reject (new Error('please provide a css output file'));
        }

        sass.render({
            file: config.nodeSassOptions.file,
            outputStyle: config.nodeSassOptions.outputStyle,
            outFile: config.nodeSassOptions.outFile,
            sourceMap: config.nodeSassOptions.sourceMap,
            importer: (0, importer['default'])(),
        }, function (err, result) {
            if (!err) {
                fs.writeFile(config.nodeSassOptions.outFile, result.css, function (err2) {
                    if (!err2) resolve(`${config.nodeSassOptions.outFile} file generated!`);
                    else reject (new Error(`${config.nodeSassOptions.outFile} could not be created: ${err}`));
                });
            } else
                reject (new Error(`${config.nodeSassOptions.outFile} could not be created: ${err}`));
        });


    })
}

ImporterFunc().then(console.log)
    .catch(data => ( console.log(data)  ));




