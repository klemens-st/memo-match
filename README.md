# MemoMatch

A simple in-browser memory matching game, written in JavaScript (no jQuery or 3rd party frameworks).
Utilises browser local storage for leaderboard entries.
It is available live [here](https://zymeth25.github.io/memo-match/).

## Table of contents

* [How to play](#how-to-play)
* [Getting Started (for developers)](#getting-started-for-developers)
* [Built with](#built-with)
* [Authors](#authors)
* [License](#license)
* [Acknowledgments](#acknowledgments)

## How to play

### Installing

Clone this repository, either by going to the desired directory and running `git clone https://github.com/zymeth25/memo-match.git`
or by clicking the green "Clone or download" button on the [repository's main page](https://github.com/zymeth25/memo-match)
and downloading a ZIP. The second option is most probably the only one if you are on Windows.
When you have the files ready on your computer (unzipped, if necessary), open the `index.html` file. That's it!

If you are using a mobile device or just don't want to download anyting, you can
[go to this URL](https://zymeth25.github.io/memo-match/) and start the game right away.

### Gampeplay

Once you have launched the game, hit the "Start" button - a new deck of cards will appear. Then, just click or tap on the cards to flip
them over. When two cards are open the game will either lock them if their symbols match, or flip them back to closed position if it is
a mismatch. You can reset the game by hitting the `↻` button above the deck.

### Rating

The game will also count the moves you make (2 flips = 1 move) and assign a star rating based on this number.
There is also a timer but it does not affect the actual score.

### Leaderboard

Once you have matched all cards, a modal will pop up. It will allow you to enter your name and save your score.
Note that the score is stored locally in your browser, not globally on a server.
To clear the leaderboard, tap/click the button below the table and hold it for 5 seconds. (The button will not appear
if the leaderboard is empty).

## Getting Started (for developers)

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have your machine setup to serve pages locally.
You will also need Node if you want to work with JS files.


### Installing


[Install Node.js](https://nodejs.org/en/) if you haven't already

Clone this repository
```
git clone https://github.com/zymeth25/memo-match.git
```

cd into the project direcotory

```
cd memo-match
```

Install dependencies (Grunt)
```
npm install
```

You can now run `grunt` and it will run the JavaScript concat task.


## Built With

* [Node.js](https://nodejs.org/en/) - Dependency management
* [Grunt](https://gruntjs.com/) - Task runner

No production JavaScript libraries were used :)

## Authors

* **Klemens Starybrat**

## License

This project is licensed under the GPL v3.0 License. It is available [here](https://github.com/zymeth25/memo-match/blob/master/LICENSE)

## Acknowledgments

* [This awesome SO thread](https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array)
* storageAvailable function from [this MDN article](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
