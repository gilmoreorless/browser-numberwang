function notify(callback) {
	var id = Math.floor(Math.random() * 1000);
	chrome.notifications.create(`numberwang-${id}`, {
		type: 'basic',
		title: 'NumberWang',
		message: 'That’s NumberWang!',
		iconUrl: 'icons/numberwang-256.png',
	}, callback);
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	console.log('Got message', message, sender);
	if (sender.tab && message.action === 'thatsNumberwang') {
		notify(function () {
			sendResponse();
		});
		// Keep the message channel open until we send a response once the notification has appeared
		return true;
	}
});
