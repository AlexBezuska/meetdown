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

function processFile(sourceFile, destinationFile, context) {
	var fileExtention = path.extname(sourceFile);

	if (fileExtention === '.hbs') {
		var fileNameParts = destinationFile.split('.');
		fileNameParts.pop();
		destinationFile = fileNameParts.join('.');
		console.log(sourceFile + " --> " + destinationFile);
		build(sourceFile, destinationFile, context);
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
	context = merge(true, context);
	context.page = merge(context.page, context.pages[sourcePath]);

	var layoutFileName = context.page.layout;
	var layout  = fs.readFileSync(layoutFileName, { encoding: 'utf8' });
	var page  = fs.readFileSync(sourcePath, { encoding: 'utf8' });

	handlebars.registerPartial('body', page);
	var template = handlebars.compile(layout);

	fs.writeFileSync(destinationPath, template(context), { encoding: 'utf8' });
}
