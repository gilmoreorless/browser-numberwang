/***** BROWSER COMMS - Common across background page and content scripts *****/

class SetMap extends Map {
	get(key) {
		let value = super.get(key);
		return value || new Set();
	}

	add(key, value) {
		const values = this.get(key);
		values.add(value);
		this.set(key, values);
	}
}

const messageActions = new SetMap();

function sendMessage(name, opts = {}, tabId = null) {
	let msgOpts = Object.assign({ action: name }, opts);
	if (tabId) {
		chrome.tabs.sendMessage(tabId, msgOpts);
	} else {
		chrome.runtime.sendMessage(msgOpts);
	}
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action && messageActions.has(message.action)) {
		messageActions.get(message.action).forEach(listener => {
			listener(message, sender, sendResponse);
		});
	}
});


/***** NUMBER CHECKING - Only runs in content scripts *****/

(function () {

	// Quick check to see if this is running in a content script
	if (chrome.runtime.onInstalled !== undefined) {
		return;
	}

	const elemValueCache = new WeakMap();

	function arraysAreEqual(arr1, arr2) {
		if (!arr1 || !arr2) return false;
		if (arr1.length !== arr2.length) return false;
		const hasDiff = arr1.some((n, i) => arr2[i] !== n);
		return !hasDiff;
	}

	function arrayDiff(arr1, arr2) {
		return arr1.filter((n, i) => arr2[i] !== n);
	}

	function extractNumbers(str) {
		return String(str).trim()
			.split(/[^0-9.-]+/)
			.map(n => parseFloat(n))
			.filter(n => !isNaN(n));
	}

	function parseElement(elem) {
		let value = elem.value;
		if (value === undefined && elem.hasAttribute('contenteditable')) {
			value = elem.textContent;
		}
		const numbers = extractNumbers(value);
		if (!numbers.length) {
			return;
		}
		const existing = elemValueCache.get(elem) || [];
		if (arraysAreEqual(numbers, existing)) {
			return;
		}
		elemValueCache.set(elem, numbers);

		const diff = arrayDiff(numbers, existing);
		// Only check the first number to avoid DoS-wang when pasting a bunch of numbers at once
		if (diff.length > 0) {
			sendMessage('checkNumber', { number: diff[0] });
		}
	}

	const excludeInputTypes = new Set(['checkbox', 'color', 'file', 'password', 'radio', 'range']);

	document.addEventListener('input', function (e) {
		const elem = e.target;
		if (elem.nodeName === 'SELECT' || elem.nodeName == 'INPUT' && excludeInputTypes.has(elem.type)) {
			return;
		}
		setTimeout(() => {
			parseElement(elem);
		});
	}, false);


	/***** BOARD ROTATION *****/

	const cssClasses = {
		ready: 'numberwang-ready',
		rotate: 'numberwang-rotate-the-board',
		otherSide: 'numberwang-rotate-the-other-side',
	};

	const gifFiles = [
		'https://media4.giphy.com/media/rrOzTZt2EEhoI/giphy.gif',
		'https://media4.giphy.com/media/FCDRI0twjxVvO/giphy.gif',
		'https://media1.giphy.com/media/xoLGUcAdn24Kc/giphy.gif',
		'https://media2.giphy.com/media/10gZNwuUuer5aU/giphy.gif',
		'https://media1.giphy.com/media/dWm5HKuKjZTO/giphy.gif',
		'http://i.imgur.com/hoqq85M.gif',
		'http://i.imgur.com/gC3i2gd.gif',
	];
	const backupGifFiles = ['dancing-newsreader.gif', 'ski-mime.gif'];

	let otherSide;

	messageActions.add('thatsNumberwang', function () {
		document.documentElement.classList.add(cssClasses.ready);
		document.body.classList.remove(cssClasses.rotate);

		if (!otherSide) {
			otherSide = document.createElement('div');
			otherSide.className = cssClasses.otherSide;
			document.body.appendChild(otherSide);
		}
	});

	messageActions.add('rotateTheBoard', function () {
		let gifPath;
		if (navigator.onLine) {
			gifPath = gifFiles[Math.floor(Math.random() * gifFiles.length)];
		} else {
			let gifIndex = Math.floor(Math.random() * backupGifFiles.length);
			gifPath = chrome.extension.getURL('gifs/' + backupGifFiles[gifIndex]);
		}
		// Set the background image early to preload it
		otherSide.style.backgroundImage = `url(${gifPath})`;
		// Add a short delay to allow the background page's notification to show up
		setTimeout(() => {
			alert('It’s time for Wangernumb!\n\nLet’s rotate the board.');
			document.body.classList.add(cssClasses.rotate);
		}, 1000);
	});

})();
