function notify() {
	var id = Math.floor(Math.random() * 1000);
	chrome.notifications.create(`numberwang-${id}`, {
		type: 'basic',
		title: 'NumberWang',
		message: 'That’s NumberWang!',
		iconUrl: 'icons/numberwang-256.png',
	});
}

chrome.runtime.onMessage.addListener(function (message, sender) {
	console.log('Got message', message, sender);
	if (sender.tab && message.action === 'thatsNumberwang') {
		notify();
	}
});
