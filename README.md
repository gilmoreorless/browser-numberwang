# Numberwang

A browser extension that tells you when a number you’ve typed is Numberwang.

# Numberwang?

[The maths quiz that simply everyone is talking about.](https://www.youtube.com/watch?v=qjOZtWZ56lc)

# Numberwang!

That’s Numberwang!


## Demo

<iframe width="560" height="315" src="https://www.youtube.com/embed/dCxaxHobCBo" frameborder="0" allowfullscreen></iframe>


## Usage

This extension currently works for Chromium-based browsers (Chrome and Opera being the main ones), and can be temporarily used in Firefox.
It’s not in the Chrome web store yet because, well, let’s face it, I’ve already put a bit too much effort into a cheap joke.

If you really want to install it, go ahead, but it can get annoying pretty quickly. Maybe it’s good for pranking colleagues?

To install the extension in Chrome or Opera:

1. Clone this repository to your machine (`git clone https://github.com/gilmoreorless/browser-numberwang.git`)
2. Go to `chrome://extensions` in your Chrome/Opera browser.
3. Make sure the “Developer mode” checkbox at the top of the page is checked.
4. Press the “Load unpacked extension...” button and select the directory where you cloned the repository.

To install the extension in Firefox:

1. Assuming the repository is cloned to your machine as listed above...
2. Go to `about:debugging` in your Firefox browser.
3. Press the “Load Temporary Add-on” button and select the `manifest.json` file in the directory where you cloned the repository.
4. The extension is installed but **only until you close Firefox** – this is a limitation of testing add-ons in Firefox.


### TODO

* Add proper support for browsers other than Chrome/Opera (Firefox works only because it temporarily supports some Chrome APIs).
* Add a config option for the intensity of the number checking (i.e. the likely percentage of finding Numberwang).


## Obligatory legal bits

This code is open source under the [MIT license](LICENSE) – © 2017 Gilmore Davidson.

“Numberwang” name and concept is probably copyright of the British Broadcasting Corporation. I assume.

And yes, I’m aware that [I’m far from the first person to have built Numberwang code](https://github.com/search?q=numberwang&ref=reposearch&type=Repositories&utf8=%E2%9C%93), but I really wanted to do the “rotate the board” bit.
