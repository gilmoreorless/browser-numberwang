var prevNumber;
var nextCount;
var curCount;
var nwCount = 0;

function resetCount() {
	curCount = 0;
	nextCount = Math.floor(Math.random() * 20) + 2;
}

function checkNumberwang(number) {
	number = parseFloat(number);
	if (isNaN(number) || number === prevNumber) {
		return;
	}
	curCount++;
	if (curCount === nextCount) {
		thatsNumberwang();
	}
}

function thatsNumberwang() {
	nwCount++;
	document.documentElement.classList.add('numberwang-ready');
	document.body.classList.remove('numberwang-rotate-the-board');
	if (nwCount === 3) {
		nwCount = 0;
		alert('That\'s numberwang!\n\nLet\'s rotate the board.');
		document.body.classList.add('numberwang-rotate-the-board');
	} else {
		alert('That\'s numberwang!');
	}
	resetCount();
}

resetCount();

document.addEventListener('input', function (e) {
	var elem = e.target;
	// TODO: Split value into all numbers rather than checking the whole string
	setTimeout(() => {
		checkNumberwang(elem.value.trim());
	});
}, false);
