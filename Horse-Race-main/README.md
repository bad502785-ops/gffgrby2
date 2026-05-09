# Horse Race

A simple browser-based horse racing game built with HTML, CSS, Tailwind utility classes, and vanilla JavaScript.

## Overview

This project simulates a race between six horses. Each horse moves forward with a random speed on every tick, and the game announces the leading horse during the race and the winner at the finish line.

## Features

- Six animated horses racing in parallel
- Randomized movement logic for each horse
- Real-time leader tracking
- Winner detection when a horse reaches the finish line
- Controls to start, stop, and reset the race
- Responsive layout for desktop and mobile screens

## Tech Stack

- HTML5
- CSS3
- Tailwind CSS (via CDN)
- JavaScript (ES6)

## Project Structure

```text
Horse-Race/
├── index.html
├── js/
│   └── app.js
├── css/
│   ├── import.css
│   ├── font/
│   │   └── fontFamily.css
│   └── reset/
│       └── reset.css
├── img/
│   ├── horse1.gif
│   ├── horse2.gif
│   ├── horse3.gif
│   ├── horse4.gif
│   ├── horse5.gif
│   └── horse6.gif
└── icon/
    └── github.svg
```

## How to Run

1. Clone or download this repository.
2. Open `index.html` in your browser.
3. Click **Start Race** to begin.
4. Use **Stop Race** to pause and **Reset Race** to restart.

## Gameplay Logic

- Every 300 ms, each horse advances by a random value.
- The race status text displays the current leading horse.
- When the leading position reaches the finish line, the race stops automatically and the winner is announced.
