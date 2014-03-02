var args = process.argv.slice(2);

if( args.length != 1){
  console.error("Usage: node app.js data.json ");
  process.exit(1);
}

var dataFileName = args[0];

var handlebars = require('handlebars');
var fs = require('fs');
var merge = require('merge');

var data  = JSON.parse(fs.readFileSync(dataFileName, {encoding : 'utf8'}));



function build ( sourcePath, destinationPath, context){
  context = merge(true, context);
  context.page = merge(context.page, context.pages[sourcePath]);
  console.log(context.page);
  var layoutFileName = context.page.layout;
  var layout  = fs.readFileSync(layoutFileName, {encoding : 'utf8'});
  var page  = fs.readFileSync(sourcePath, {encoding : 'utf8'});
  

  handlebars.registerPartial('body', page);
  var template = handlebars.compile(layout);

  fs.writeFileSync(destinationPath, template(context), {encoding : 'utf8'});
};



function processFolder (sourceFolder, destinationFolder) {
  fs.readdir(sourceFolder, function(err, files){
    if(err){ 
      console.error(err);
      throw err;
    }
    for(var i=0; i < files.length; i++){
      var sourcePath = path.join(sourceFolder, files[i]);
      var destPath = path.join(destinationFolder, files[i]);
      processFile(sourcePath, destPath);
      
    }
  });
}

var path = require('path');

function processFile (sourceFile, destinationFile) {
  var fileExtention = path.extname(sourceFile);
  
  if(fileExtention === '.hbs'){
     var fileNameParts = destinationFile.split('.');
     fileNameParts.pop();
     destinationFile = fileNameParts.join('.');
     console.log(sourceFile + " --> " + destinationFile);
     build( sourceFile, destinationFile, data);
  }
 
}



processFolder(data.sourceFolder, data.destinationFolder);




