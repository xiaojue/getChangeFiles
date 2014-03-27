getChangeFiles
==============

get directory change files list

## Usage

```js
var gcf = require('gcf');

var changed = gcf.get('./',function(item){
	if(item.match(/^node_modules|^\./)) return false;
	return true;
});

console.log(changed); // [];
```

## License
MIT license
