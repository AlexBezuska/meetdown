var args = process.argv.slice(2);

if( args.length != 3){
  console.error("Usage: node app.js layout.hbs template.hbs template.json ");
  process.exit(1);
}

var handlebars = require('handlebars');
var fs = require('fs');

var layout  = fs.readFileSync(args[0], {encoding : 'utf8'});
var source  = fs.readFileSync(args[1], {encoding : 'utf8'});
var data  = JSON.parse(fs.readFileSync(args[2], {encoding : 'utf8'}));
data.page = data.pages[args[1]];
console.log(data);

handlebars.registerPartial('body', source);
var template = handlebars.compile(layout);
console.log(template(data));




