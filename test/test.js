var streamit = require ('../streamit');
var assert = require('assert');
var fs = require('fs');
var testFilePath = './readme.md';
var testFileContent = fs.readFileSync(testFilePath);
describe(
	'Buffer -> streamit -> Writeable',
	function() {
		it(
			'should equal using streamit with defaults pipe Input Buffer to Output Writable Stream.', 
			function(done) {
				var outFilePath = './test/testcopy01.md';
				var dataToSend = new Buffer(testFileContent);
				var si = new streamit(dataToSend);
				var out = new fs.createWriteStream(outFilePath);
				out.on(
					'error', 
					function(err) {
						done(err);
						setTimeout(
							function() { fs.unlinkSync(outFilePath); },
							500
						);
					}
				);
				si.once(
					'end',
					function() {
						setImmediate(
							function() {
								var result01 = fs.readFileSync(outFilePath);
								var a = result01.toString();
								var b = testFileContent.toString();
								var match = (a === b);
								if (match === true) done();
								else throw(new Error('input and output Buffers did not match!'));
								setTimeout(
									function() { fs.unlinkSync(outFilePath); },
									500
								);
							}
						);
					}
				);
				si.pipe(out);
			}
		);
	}
);
describe(
	'Stream -> streamit -> Writeable', 
	function() {
		it(
			'using streamit with defaults pipe Input Buffer to Output Writable Stream.', 
			function(done) {
				var outFilePath = './test/testcopy02.md';
				var dataToSend = fs.createReadStream(testFilePath);
				var si = new streamit(dataToSend);
				var out = new fs.createWriteStream(outFilePath);
				out.on(
					'error', 
					function(err) {
						done(err);
						setTimeout(
							function() { fs.unlinkSync(outFilePath); },
							500
						);
					}
				);
				si.once(
					'end',
					function() {
						process.nextTick(
							function() {
								var result01 = fs.readFileSync(outFilePath);
								var a = result01.toString();
								var b = testFileContent.toString();
								var match = (a === b);
								if (match === true) done();
								else throw(new Error('input and output Buffers did not match!'));
							}
						);
					}
				);
				si.pipe(out);
			}
		);
	}
);
describe(
	'Stream -> streamit -> Writeable', 
	function() {
		it(
			'using streamit with defaults pipe Input Buffer as utf8 with mini chunks to Output Writable Stream.', 
			function(done) {
				var outFilePath = './test/testcopy03.md';
				var dataToSend = fs.createReadStream(testFilePath);
				var si = new streamit(dataToSend, 'utf8', 64);
				var out = new fs.createWriteStream(outFilePath);
				out.on(
					'error', 
					function(err) {
						done(err);
					}
				);
				si.once(
					'end',
					function() {
						process.nextTick(
							function() {
								var result01 = fs.readFileSync(outFilePath);
								var a = result01.toString();
								var b = testFileContent.toString();
								var match = (a === b);
								if (match === true) done();
								else throw(new Error('input and output Buffers did not match!'));
							}
						);
					}
				);
				si.pipe(out);
			}
		);
	}
);
