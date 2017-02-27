(function () {

	var IS_TESTING = document.documentElement.hasAttribute('data-numberwang-testing');

	var curCount, targetCount;
	var nwCount, targetNw;

	var elemValueCache = new WeakMap();

	function trigger(name, elem, value) {
		var event = new CustomEvent(`numberwang-${name}`, {
			detail: value,
			bubbles: true
		});
		(elem || document).dispatchEvent(event);
	}

	function resetCount() {
		curCount = 0;
		targetCount = Math.floor(Math.random() * 20) + 2;
	}

	function resetNwCount() {
		nwCount = 0;
		targetNw = Math.floor(Math.random() * 3) + 3;
	}

	function arraysAreEqual(arr1, arr2) {
		if (!arr1 || !arr2) return false;
		if (arr1.length !== arr2.length) return false;
		var hasDiff = arr1.some((n, i) => arr2[i] !== n);
		return !hasDiff;
	}

	function arrayDiff(arr1, arr2) {
		return arr1.filter((n, i) => arr2[i] !== n);
	}

	function extractNumbers(str) {
		var numbers = String(str).trim()
			.split(/[^0-9.\-]+/)
			.map(n => parseFloat(n))
			.filter(n => !isNaN(n));
		return numbers;
	}

	function parseElement(elem) {
		var numbers = extractNumbers(elem.value);
		if (!numbers.length) {
			return;
		}
		var existing = elemValueCache.get(elem) || [];
		if (arraysAreEqual(numbers, existing)) {
			return;
		}
		elemValueCache.set(elem, numbers);

		var diff = arrayDiff(numbers, existing);
		diff.forEach(n => {
			checkNumberwang(elem, n);
		});
	}

	function checkNumberwang(elem, number) {
		curCount++;
		trigger('check', elem, { number });
		if (curCount === targetCount) {
			thatsNumberwang(elem, number);
		}
	}

	function thatsNumberwang(elem, number) {
		nwCount++;
		var rotate = nwCount === targetNw;
		trigger('found', elem, { number, count: nwCount, rotate });
		if (rotate) {
			resetNwCount();
		}
		resetCount();
	}

	resetCount();
	resetNwCount();

	document.addEventListener('input', function (e) {
		var elem = e.target;
		setTimeout(() => {
			parseElement(elem);
		});
	}, false);


	///// INTERACTIONS

	if (IS_TESTING) {
		return;
	}

	var cssClasses = {
		ready: 'numberwang-ready',
		rotate: 'numberwang-rotate-the-board',
		otherSide: 'numberwang-rotate-the-other-side',
	};

	var gifFiles = [
		'https://media4.giphy.com/media/rrOzTZt2EEhoI/giphy.gif',
		'https://media4.giphy.com/media/FCDRI0twjxVvO/giphy.gif',
		'https://media1.giphy.com/media/xoLGUcAdn24Kc/giphy.gif',
		'https://media2.giphy.com/media/10gZNwuUuer5aU/giphy.gif',
		'https://media1.giphy.com/media/dWm5HKuKjZTO/giphy.gif',
		'http://i.imgur.com/hoqq85M.gif',
		'http://i.imgur.com/gC3i2gd.gif',
	];
	var backupGifFiles = ['dancing-newsreader.gif', 'ski-mime.gif'];

	var otherSide;

	document.addEventListener('numberwang-found', function (e) {
		var shouldRotate = !!e.detail.rotate;
		var msgOpts = { action: 'thatsNumberwang' };
		var msgCallback = function () {};

		document.documentElement.classList.add(cssClasses.ready);
		document.body.classList.remove(cssClasses.rotate);

		if (!otherSide) {
			otherSide = document.createElement('div');
			otherSide.className = cssClasses.otherSide;
			document.body.appendChild(otherSide);
		}

		if (shouldRotate) {
			let gifPath;
			if (navigator.onLine) {
				gifPath = gifFiles[Math.floor(Math.random() * gifFiles.length)];
			} else {
				let gifIndex = Math.floor(Math.random() * backupGifFiles.length);
				gifPath = chrome.extension.getURL('gifs/' + backupGifFiles[gifIndex]);
			}
			// Set the background image early to preload it while waiting for the notification to finish
			otherSide.style.backgroundImage = `url(${gifPath})`;

			// Wait until notification has appeared before showing the alert
			msgCallback = function () {
				alert('It’s time for Wangernumb!\n\nLet’s rotate the board.');
				document.body.classList.add(cssClasses.rotate);
			};
		}

		chrome.runtime.sendMessage(msgOpts, msgCallback);
	});

})();
