[![build status](https://secure.travis-ci.org/itsatony/streamit.png)](http://travis-ci.org/itsatony/streamit)

# streamit

streamIt is a variant of nodejs stream2 readable class ( http://nodejs.org/api/stream.html ; http://nodejs.org/api/stream.html#stream_class_stream_readable )
streamIt will take Buffers or streams as input and stream them to a output with definable encoding and chunkSize( === highWaterMark ).

    var outStream = new streamit(dataToSend, encoding, chunkSize);
		outStream.pipe(res);

a typical use case would be piping of a in-memory buffer to a http.res:


* installing

````
    npm install streamit
````

* buffer as input. encoding will be default ('utf8') and chunkSize will be default (16kb)

````
    var dataToSend = new Buffer(104857600); //100mb
    var stream = new streamit(dataToSend);
    stream.on(
    	'end',
    	function() {
    		process.nextTick(
    			function() {
    				res.end();
    			}
    		);
    		return;
    	}
    );
    stream.pipe(res);
````

* stream as input. actively setting encoding to 'binary' and chunkSize to 64kb

````
    var dataToSend = fs.createReadStream('./someimage.png', 'binary', 65536);
    var stream = new streamit(dataToSend);
    stream.on(
    	'end',
    	function() {
    		process.nextTick(
    			function() {
    				res.end();
    			}
    		);
    		return;
    	}
    );
    stream.pipe(res);
````



# VERSION
v 0.1.1

# author

Toni Wagner

#Licence

free
