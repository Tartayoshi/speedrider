# Speed Rider
*Racing game in PHP, JavaScript, HTML5, CSS as an exam test for Web Development course.*

![Game Preview](/src/game/assets/maps/circuit_1/circuit_1_preview.png)

The project is a web application that uses a classic **MPA (Multi-Page Application)** architecture. The backend is powered by **PHP**, where each page is a separate `.php` file that handles logic and renders the HTML structure. Server-side scripts manage database interactions for fetching map data, user authentication, and storing game records.

The frontend is built with standard **HTML, CSS, and JavaScript**. The game itself is a 2D racing game with a "fake" 3D prospective developed in **JavaScript** using the **HTML5 Canvas API**. The game's logic is structured around a **state machine pattern** to manage different phases like the countdown, racing, and game over.

The styling is handled by **CSS**, with a main `default.css` file providing base styles. The layout is made reactive using **CSS media queries**, which adapt the content for screens wider or narrower than 850px. However, the game itself is designed for desktop use and is not optimized for mobile devices.


> ## WARNING!
> The project is in Italian, a translation in English is not planned soon an wont likely happen, if you wish to frok and translate it be my guest^^.
>
> It also was ment for an older version of FireFox and Chrome, expect things to not work properly.

- [Speed Rider](#speed-rider)
- [About the game](#about-the-game)
- [Navigation](#navigation)
- [How to play](#how-to-play)
  - [Starting a Game](#starting-a-game)
  - [Game Controls](#game-controls)
  - [Vehicle Control](#vehicle-control)
- [Installation](#installation)
  - [Step by step guide](#step-by-step-guide)


---

# About the game
Speed ​​Rider is an engaging, highly competitive racing game.<br>
Cruise through retro-style tracks in a lightning-fast go-kart, challenging the best players!<br>
The tracks bring with them many challenges! Every braking, acceleration, and steering maneuver must be executed with precision and at the right time to catch that fraction of a second that can lead you to the top of the scoreboards!<br>

Competitors will play on equal terms; you can't choose your vehicle; what makes the difference here is your skill!

Remember! Brake too much and you'll lose precious fractions of a second; brake too little and you'll find yourself flying off the track.

---

# Navigation
The top menu allows you to easily navigate the site.

From the `Home` page, you can directly access the two most popular courses, or challenge the ghosts of players who have just raced.

![Home Page](/docs/img/Screenshot%202026-01-08%20232336.png)

By clicking on `Courses`, you can see all available courses and the current record for that course.<br>
By clicking on a *`course`*, you'll see the map, a description of the course, and a ranking of all the challengeable ghosts.

`Login` allow you to access the site, or create an account if you're not already registered. Simply fill in the fields.

![Map Info](/docs/img/Screenshot%202026-01-08%20232440.png)

# How to play
## Starting a Game
A game can be started in several ways:

+ From the `Home` page, by tapping on one of the `latest games`, you will challenge the selected player.
+ By navigating to a track page and tapping on one of the `top players`, you will challenge the selected player.
+ By navigating to a track page and tapping on `Play` under `Time Trial` in the bottom right, you will be playing alone.

## Game Controls
Once you've chosen your course, you must complete **3 laps** of the track.
Pausing is not an option! A game can be interrupted but not paused, so make sure you are not disturbed during the race.

The game can be interrupted using the `Enter` key (**WARNING!** The game will be interrupted immediately after pressing the Enter key!).<br>
If you've pressed `Full Screen` and want to return to windowed view, simply press the `Esc` key on your keyboard.

## Vehicle Control
The go-kart can be controlled using the `arrow keys` and `Ctrl` or the "`WASD`" key combination plus the `Space` key.<br>
If you hold down the accelerator button during the countdown before **"1"** appears, you'll get a slight advantage.

 Here's the complete list of controls:

> ### Arrow keys
> + Up arrow: accelerate
> + Down arrow: brake/reverse
> + Left arrow: steer left
> + Right arrow: steer right
> + Ctrl: drift (brakes with a sharper turning radius)

> ### WASD 
> **WARNING**
> Make sure CapsLock is off ^^
> + W: accelerate
> + S: brake/reverse
> + A: steer left
> + D: steer right
> + Space: drift (brakes with a sharper turning radius)

You can also use a combination of the above modes; do what works best for you (for example, using the `arrows` and `spacebar` to drift, `WASD` and `Ctrl`, or something creative like accelerating with `W` and steering with the `arrows`).

>### Remember!
>To play, you must have a valid account and be logged in.
>
>At the end of each race, you'll be asked whether or not to save your results. If you press `save`, your time will be saved in the leaderboard and other players will be able to challenge your ghost. If you press `delete`, you'll have to say goodbye to the match you just played.
>
> **Times longer than 5 minutes cannot be saved!**

---

# Installation
This project require XAMPP to properly work:

## Step by step guide
1. Go to [XAMPP](https://www.apachefriends.org/it/index.html) home page and follow installation instructions. **Make sure to select MySQL in the installation process!**
2. Open XAMPP Control Panel and click on `Start` for **Apache** and **MySQL** module
3. Click on Explorer then open `htdocs` folder
4. Remove the content of the folder and drag the content of `src` folder in there
5. Open your browser and navigate to [localhost](http://localhost)
6. Have fun ^^

![Autodromo Modena](/src/game/assets/maps/autodromo_modena/autodromo_modena_preview.png)

---