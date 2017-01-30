This is [Markdown](http://daringfireball.net/projects/markdown/syntax) powered documentation with some special extensions.

You can use code blocks with syntax highlightening.  The code will show up on the right side of the documentation.

```javascript
var async = require('async'),
	tasks = [];
tasks.push(function (next) {
	console.log('hello');
	next();
});
async.series(tasks,function (err) {
	console.log('done!');
});
```

You can also use special banners.

```warning
This is an example warning.
```

Supported banners are `warning`, `success`, `error`, `notice`.

You can do lists like these:

- one
- two
- three
