var args = process.argv.slice(2);
if (args.length !== 1) {
	console.error("Usage: node app.js data.json");
	process.exit(1);
}

var fs = require('fs');
var path = require('path');

var dataFileName = args[0];
var data = JSON.parse(fs.readFileSync(dataFileName, { encoding: 'utf8' }));
processFolder(data.sourceFolder, data.destinationFolder, data);

function processFolder(sourceFolder, destinationFolder, context) {
	fs.readdir(sourceFolder, function(err, files) {
		if (err) {
			console.error(err);
			throw err;
		}
		for (var i = 0; i < files.length; i++) {
			var sourcePath = path.join(sourceFolder, files[i]);
			var destPath = path.join(destinationFolder, files[i]);
			processFile(sourcePath, destPath, context);
		}
	});
}

var copyFile = require('./copyFile');

var filenameTransforms = {
	".hbs": function(filename) {
		var parts = filename.split('.');
		parts.pop();
		return parts.join('.');
	}
};
var fileTransforms = {
	".hbs": build
};

function processFile(sourceFile, destinationFile, context) {
	var ext = path.extname(sourceFile);

	if (typeof filenameTransforms[ext] === 'function') {
		destinationFile = filenameTransforms[ext](destinationFile);
	}
	console.log(sourceFile + " --> " + destinationFile);

	if (typeof fileTransforms[ext] === "function") {
		context = merge(true, context); // make a copy
		var contextPagePath = sourceFile.split(path.sep).join("/");
		context.page = merge(context.page, context.pages[contextPagePath]);

		fileTransforms[ext](sourceFile, destinationFile, context);
	} else {
		copyFile(sourceFile, destinationFile, function(err){
			if (err) {
				console.error(err);
			}
		});
	}
}

var handlebars = require('handlebars');
var merge = require('merge');

function build(sourcePath, destinationPath, context) {
	var layoutFileName = context.page.layout;
	var layout  = fs.readFileSync(layoutFileName, { encoding: 'utf8' });
	var page  = fs.readFileSync(sourcePath, { encoding: 'utf8' });

	handlebars.registerPartial('body', page);
	var template = handlebars.compile(layout);

	fs.writeFileSync(destinationPath, template(context), { encoding: 'utf8' });
}
