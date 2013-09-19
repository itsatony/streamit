/*
	streamit is a variant of nodejs stream2 readable class ( http://nodejs.org/api/stream.html ; http://nodejs.org/api/stream.html#stream_class_stream_readable )
	streamit will take Buffers or streams as input and stream them to a output with definable encoding and highWaterMark.
	a typical use case would be piping of a in-memory buffer to a http.res:
	
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
	
*/


var stream = require('stream');
var fs = require('fs');


streamit.prototype = Object.create(stream.Readable.prototype, { constructor: { value: streamit } } );


function streamit(input, encoding, hwm) {
	this.highWaterMark = (typeof hwm === 'number') ? hwm : 16384; // 16kb - is default
	this.encoding = (typeof encoding === 'string' &&  Buffer.isEncoding(string) === true) ? encoding : 'utf8';
	this.type = 'buffer';
	if (typeof input === 'undefined') input = new Buffer('');
	else if (typeof input === 'string') input = new Buffer(input);
	else if (typeof input === 'object' && input instanceof stream) this.type = 'stream';
	// console.log('chunkstream type %s', this.type);
	this.position = 0;
	this.end = -1;
	this.input = input;
	this.complete = false;
	this.empty = new Buffer('');
	stream.Readable.call(this, [ this.highWaterMark, this.encoding, false ]);
	this._start();
};

streamit.prototype.version = '0.1.0';

streamit.prototype._start = function() {
	var self = this;
	if (this.type === 'buffer') {
		this.data = this.input;
		this.end = this.data.length;
		this.complete = true;
	} else if (this.type === 'stream') {
		this.data = new Buffer('');
		this.input.on(
			'data',
			function(chunk) {
				self.data = Buffer.concat([self.data, chunk]);
				self.end = self.data.length;
				// console.log('--> data size = ' + self.end);
				self.read(0);
			}
		);
		this.input.on(
			'end',
			function() {
				// console.log('complete @ ' + self.end);
				self.complete = true;
				self.read(0);
			}
		);
	}
	return this;
};

streamit.prototype._read = function(size) {
	// console.log('--> READ');
	var self = this;
	if (this.end > -1 && (this.complete === false || this.position < this.end)) {
		var chunkEnd = this.position + size;
		if (chunkEnd > this.end) chunkEnd = this.end;
		var chunk = this.data.slice(this.position, chunkEnd);
		// console.log('--> POS : [' + this.position + ',' + chunkEnd + '/' + this.end + '] ');
		this.position = chunkEnd;
		if (chunk.length > 0) {
			// console.log('chunk ' + chunk.length);
			this.push(chunk);
			return true;
		} else {
			
		}
	} else if (this.complete === true && !(this.position < this.end)) {
		// console.log('--> END');
		setImmediate(
			function() { 
				self.emit('end'); 
			}
		);
		return true;
	}
	this.push(this.empty);
	// console.log('...reading');
	return true;
};




module.exports = streamit;