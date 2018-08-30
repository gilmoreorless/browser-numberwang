/* global messageActions, sendMessage */

/***** NUMBER CHECKING *****/

let curCount, targetCount;
let nwCount, targetNw;

function resetCount() {
	curCount = 0;
	targetCount = Math.floor(Math.random() * 20) + 2;
}

function resetNwCount() {
	nwCount = 0;
	targetNw = Math.floor(Math.random() * 3) + 3;
}

function checkNumber(number, tab) {
	curCount++;
	if (curCount === targetCount) {
		thatsNumberwang(number, tab);
	}
}

function thatsNumberwang(number, tab) {
	nwCount++;
	notify(number);
	sendMessage('thatsNumberwang', { number }, tab.id);

	const rotate = nwCount === targetNw;
	if (rotate) {
		sendMessage('rotateTheBoard', {}, tab.id);
		resetNwCount();
	}
	resetCount();
}

resetCount();
resetNwCount();


/***** BROWSER COMMS *****/

function notify(number) {
	const id = Math.floor(Math.random() * 1000);
	let message = 'That’s Numberwang!';
	if (number < 1e7) {
		message = `${number} — ${message}`;
	}
	chrome.notifications.create(`numberwang-${id}`, {
		type: 'basic',
		title: 'Numberwang',
		message,
		iconUrl: 'icons/numberwang-256.png',
	});
}

messageActions.add('checkNumber', function (opts, sender) {
	checkNumber(opts.number, sender.tab);
});
