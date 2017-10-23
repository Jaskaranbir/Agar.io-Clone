## Introduction

A simple Agar.io clone developed using WebSocket and HTML on java.

### Live Demo

The game is deployed on free subscription (as Web App) on Azure. Hence the resources available are very limited. It might take a few seconds for the application webpage to load initially since the VM goes to "suspend" mode after a while of inactivity, and has to be started again.

Additionally, daily CPU time is limited to 60 minutes. [*Here*][1] are more details regarding free limitations and other variants.

Finally, [**here**][2] is the live demo! (Can be played by multiple clients for multiplayer experience).

---

**Index:**

 * [Game Attributes][3]
 * [Additional Game Attributes][4]
 * [Gameplay][5]
 * [TODO][6]
 * [Developing / Development-Environment][7]
 * [Build Cycle][8]
 * [FAQs][9]
 * [License][10]

--------------

[![Splash Menu][11]][11]

[![Gameplay Stage][12]][12]

[![Multiplayer Demo][13]][13]

[![Game Over][14]][14]

--------------

## Game Attributes

* The stage size comprises of **14143 x 14143** pixels. Although at a given time, only elements that can fit into one screen (player viewport) are rendered.

* Player moves using the mouse.

* Player needs 3 points more than enemy to consume it.

* Players can change color and take the color of next food they eat (changes reflected only client side)

* In-game chat and dynamic leaderboard implemented.

--------------

## Additional Game Attributes

* Game sends updates to server every **32 milliseconds**. For other clients, the position is extrapolated for those frames without updates and interpolated upon receiving the update.

* Stage will **scale automatically** according to player's size in an attempt to accommodate it within screen limits.

* The **number of sides** constituting food polygon adjusts to screen and game scale.

* General Agar.io rules apply, like slowing down of player as it gains more mass.

* The server, designed using **Apache Tomcat 8.5** container, sends update messages using only **single thread** since at the time, writing concurrently involved using complex and out-of-use-case APIs (and time-constraints did not allow for that. This may/may not be fixed in future), and lead to exceptions.

* Javascript has been kept to ES5 according to the projects requirements.

* To accommodate varying device performances, **game scales** according to internally detected FPS by device to maintain consistency across cross-device gameplay.

* Server works in a "lazy" way; ie, it only **sends messages when a change occurs**. For instance, no chat, leaderboard, enemy (except positions and score) or food updates are sent unless there is a change in respective attributes. Also, the server sends only the changelog once. New players connected in between game receive updated game due to temporarily-persistent game state on servers (also updated along with changelogs).

--------------

## Gameplay

* There is no concept of lobbies or player limits (yet).

* Game spawns players close to other players (checking from top-left) with sufficient distance and overlapping prevention.

* Most logic runs on client side disregarding facts of cheating to squeeze server performance.

* Score is used to calculate players' radii and other game dynamics (such as if a player can consume other). Unlike original game, this game does not have concept of mass.

* Player velocity slows as more score is attained (similar to original game).

* Player radius increases at every score multiple of 90.

* The number of sides constituting the food polygon scale with screen size/ratio.

--------------

## TODO

* Add cell splitting.

* Add viruses.

* Add skins.

* Transform JS code to ES6

* *Anything you feel relevant.*

--------------

## Development Environment

Considering this as a college project, the aim was to make deployment easier (hence the implementation of React framework without Node.js). Further, being built using maven allows for easier dependency resolution.

There are two methods to setup the environment for running this game.

* **Using Docker**

**On Windows**

* Since Docker config used is based on linux containers, windows users will have to run it inside a VM. So, download and install [Vagrant][15] and [Virtualbox][16].

* Go to project directory and run `vagrant up` in terminal.

* This will setup Vagrant and docker containers and deploy application on address `http://localhost:<PORT>/agario` (where `<PORT>` corresponds to a valid open port chosen by Vagrant).

* *You will get the exact web-address which you can enter in your browser to run the game (once the script finishes successfully)*.

* If for some reason, docker containers do not build, you can ssh into VM using `vagrant ssh` and then use the command `docker rm $(docker ps -aq) && docker-compose up -d` to try building again.

**On Linux**

* Download and install docker and docker-compose.

* Go to project directory and run `docker-compose up -d`.

* Ensure port `8080` is free or the containers won't run (unless configured to specifically use another port). Application will be deployed on address `http://localhost:8080/agario`.

**NOTE**: You can also setup Vagrant in Linux and use the same procedure as provided for Windows.

This setup is recommended if you intend to just test and play around with the game. This will **entirely** rebuild the project everytime the images are built (including downloading Maven dependencies). Hence manual setup (provided below) is recommended for manual development.

* **Running manually without Docker**

* To setup environment, simply clone this repository and open the project in your preferred IDE with integration of your preferred web container (Apache Tomcat 8.5 was used for initial development).

* Install Maven dependencies (**Maven version 3 or higher required**), ensure MySQL is running, and edit the MySQL connection string in [src/main/java/com/agario/dao/DAO.java][17] (could have probably used `dotenv` to make things easier, but oh well...).

This setup is recommended if you want to develop on this game.

**Side Note:** Vagrant connects with a website to get a random string to prevent Docker from caching builds (otherwise source code changes will not be recognized by Docker). If you get an error that says something like `request timedout`, and you are positive that your internet is working fine, then try restarting vagrant (`vagrant reload`) or try restarting your computer.

----------

## Build Cycle

The project compiles mainly in 3 main cycles:

 * Webpack Minification (using [maven-frontend-plugin][18])
 * Compiling project files and packaging into `war` file (maven)
 * Deploy to Tomcat

As one the project requirements to keep the main syntax purely ES5 (and taking it as personal 'challenege' at that time to implement builds without ES6), `exports-loader` and `webpack-provide-plugin` have been used to bundle files and share required variables.

The first step is Webpack bundling files to `src/main/webapp/dist`, followed by compiling java classes, and finally bundling to `war` file.

Webpack configs are split into 3 parts:

* Base config (inherited by below configs)
* Regular config (for all non-jsp files)
* JSP config (specifically for jsp files (yeah -.-))

Webpack builds are built in parallel using `parallel-webpack`, consisting above configs.

----------

## FAQs

* **What's "Agar.io"?**

Visit [agar.io][19] and check for yourself!

* **Why create this game?**

As my java project for the college term, having the freedom to create program of choice (with few conditions), I chose Agar.io as per its really elegant concept. This was a good challenge for the allotted time to make cross-device gameplay smooth and consistent.

* **Why use MySQL, JSTL/JSP?**

They were part of requirements for my project. Modular structure allows for easy replacement/removal when required.

* **Why not use JSON for sending messages?**

The idea was to keep bandwidth usage minimal (while using simpler methods because of time constraints). Hence no JSON. Compression wasn't used to keep performance optimal.

* **Can I use the code from this game in my projects?**

Definitely! Just be sure to give credits where required.

* **Can I contribute?**

Yes of course! Any contribution (including bug reporting) is highly appreciated and a special credits area will be created upon contribution.

* **How do I contribute?**

Simply create a [Pull Request][20]. I will approve your changes and merge them if relevant. And of course, add you as contributor in a credits section (to be created).

* **Where can I report bugs/queries?**

Go to [Issues][21] and create a new issue.

* **Any existing bugs?**

No bugs were found during testing.

--------------

## License

This project is licensed under the terms of the **MIT** license.

The complete license can be read [here][22].

For educational purposes.


  [1]: https://blog.siliconvalve.com/2016/05/12/understanding-azure-app-service-plans-and-pricing/
  [2]: http://jas-java-proj-1.azurewebsites.net/agario/
  [3]: https://github.com/Jaskaranbir/Agar.io-Clone#game-attributes
  [4]: https://github.com/Jaskaranbir/Agar.io-Clone#additional-game-attributes
  [5]: https://github.com/Jaskaranbir/Agar.io-Clone#gameplay
  [6]: https://github.com/Jaskaranbir/Agar.io-Clone#todo
  [7]: https://github.com/Jaskaranbir/Agar.io-Clone#development-environment
  [8]: https://github.com/Jaskaranbir/Agar.io-Clone#build-cycle
  [9]: https://github.com/Jaskaranbir/Agar.io-Clone#faqs
  [10]: https://github.com/Jaskaranbir/Agar.io-Clone#license
  [11]: https://i.stack.imgur.com/mPYb9.png
  [12]: https://i.stack.imgur.com/lYoxY.png
  [13]: https://i.stack.imgur.com/hpuKV.png
  [14]: https://i.stack.imgur.com/pQyEx.png
  [15]: https://www.vagrantup.com/
  [16]: https://www.virtualbox.org/
  [17]: https://github.com/Jaskaranbir/Agar.io-Clone/blob/master/src/main/java/com/agario/dao/DAO.java#L16
  [18]: https://github.com/eirslett/frontend-maven-plugin
  [19]: http://agar.io
  [20]: https://help.github.com/articles/creating-a-pull-request/
  [21]: https://github.com/Jaskaranbir/Agar.io-Clone/issues
  [22]: https://github.com/Jaskaranbir/Agar.io-Clone/blob/master/LICENSE