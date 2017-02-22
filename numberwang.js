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
	targetNw = Math.floor(Math.random() * 3) + 2;
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

if (!IS_TESTING) {
	var cssClasses = {
		ready: 'numberwang-ready',
		rotate: 'numberwang-rotate-the-board',
	};

	document.addEventListener('numberwang-found', function (e) {
		var shouldRotate = !!e.detail.rotate;
		document.documentElement.classList.add(cssClasses.ready);
		document.body.classList.remove(cssClasses.rotate);
		chrome.runtime.sendMessage({ action: 'thatsNumberwang' });
		if (shouldRotate) {
			alert('It’s time for WangerNumb!\n\nLet’s rotate the board.');
			document.body.classList.add(cssClasses.rotate);
		}
	});
}
