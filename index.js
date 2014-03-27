var lithe = require('lithe');
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
var hfs = lithe.hfs;

function getMd5(p){
	var str = fs.readFileSync(p,'utf-8');
	var md5um = crypto.createHash('md5');
	md5um.update(str);
	return md5um.digest('hex');
}

function gcf(){
	this.database = path.join(process.cwd(),'./.gcf');
	if(!fs.existsSync(this.database)){
		hfs.writeFileSync(this.database,'{}','utf-8');	
	}
}

gcf.prototype = {
	constructor:gcf,
	get:function(p,filter){
		var self = this,
		base = fs.readFileSync(this.database),
		changedList = [],
		files;
		base = JSON.parse(base);
		hfs.walk(p,function(lists,a){
			files = lists;
			files.forEach(function(file){
				var filepath = path.join(p,file);
				var md5str = getMd5(filepath);
				if(base[filepath] && base[filepath] !== md5str) changedList.push(filepath);
				base[filepath] = md5str;	
			});
			hfs.writeFileSync(self.database,JSON.stringify(base),'utf-8');
		},{
			filter:filter
		});
		return changedList;
	}
};

module.exports = new gcf();
/*
var changed = module.exports.get('./',function(item){
	if(item.match(/^node_modules|^\./)) return false;
	return true;
});
console.log(changed);
*/
