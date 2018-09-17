const io = require('socket.io')()
const port = 1445
io.listen(port)

io.on('connection', function (socket) {
	console.log("connected")
	socket.on('disconnect', function () {
	})
})

console.log('Listening on port ' + port + '...')

const { NFC } = require('nfc-pcsc');
const nfc = new NFC(); // optionally you can pass logger

nfc.on('reader', reader => {

	console.log(`${reader.reader.name}  device attached`);
	
	reader.aid = 'F222222222';

	reader.on('card', card => {

		// card is object containing following data
		// [always] String type: TAG_ISO_14443_3 (standard nfc tags like Mifare) or TAG_ISO_14443_4 (Android HCE and others)
		// [always] String standard: same as type
		// [only TAG_ISO_14443_3] String uid: tag uid
		// [only TAG_ISO_14443_4] Buffer data: raw data from select APDU response
		io.emit('nfc', card.uid)
		console.log(`${reader.reader.name}  card detected`, card);

	});

	reader.on('card.off', card => {
		//console.log(`${reader.reader.name}  card removed`, card);
	});

	reader.on('error', err => {
		console.log(`${reader.reader.name}  an error occurred`, err);
	});

	reader.on('end', () => {
		console.log(`${reader.reader.name}  device removed`);
	});

});

nfc.on('error', err => {
	console.log('an error occurred', err);
});