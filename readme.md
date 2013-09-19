# streamit

streamIt is a variant of nodejs stream2 readable class ( http://nodejs.org/api/stream.html ; http://nodejs.org/api/stream.html#stream_class_stream_readable )
streamIt will take Buffers or streams as input and stream them to a output with definable encoding and highWaterMark.
a typical use case would be piping of a in-memory buffer to a http.res:


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

# VERSION
v 0.1.0

# author

Toni Wagner

#Licence

free
