var args = process.argv.slice(2);

if( args.length != 2){
  console.error("Usage: node app.js page.hbs data.json ");
  process.exit(1);
}
var templateFileName = args[0];
var dataFileName = args[1];

var handlebars = require('handlebars');
var fs = require('fs');

var data  = JSON.parse(fs.readFileSync(dataFileName, {encoding : 'utf8'}));
data.page = data.pages[templateFileName];

var layoutFileName = data.page.layout;
var layout  = fs.readFileSync(layoutFileName, {encoding : 'utf8'});
var page  = fs.readFileSync(templateFileName, {encoding : 'utf8'});
console.log(data);

handlebars.registerPartial('body', page);
var template = handlebars.compile(layout);
console.log(template(data));




