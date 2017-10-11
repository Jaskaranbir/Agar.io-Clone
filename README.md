## Introduction

A simple Agar.io clone developed using WebSocket and HTML on java.

---

**Index:**

 * [Game Attributes][1]
 * [Additional Game Attributes][2]
 * [Gameplay][3]
 * [TODO][4]
 * [Developing / Development-Environment][5]
 * [FAQs][6]
 * [License][7]

--------------

[![][8]][8]

[![][9]][9]

[![][10]][10]

[![][11]][11]

--------------

## Game Attributes

* The stage size comprises of **14143 x 14143** pixels. Although at a given time, only elements that can fit into one screen (player viewport) are rendered.

* Player moves using mouse.

* Player needs 3 points more than enemy to consume it.

* Players can change color and take the color of next food they eat (changes reflected only client side)

* In-game chat and dynamic leaderboard implemented.

--------------

## Additional Game Attributes

* Game sends updates to server every **32 milliseconds**. For other clients, position is extrapolated for those frames without updates and interpolated upon receiving the update.

* Stage will **scale automatically** according to player's size in an attempt to accommodate it within screen limits.

* The **number of sides** constituting food polygon adjusts to screen and game scale.

* General Agar.io rules apply, like slowing down of player as it gains more mass.

* The server, designed using **Apache Tomcat 8.5** container, sends update messages using only **single thread**, since at the time, writing concurrently is not possible and leads to exceptions.

* Javascript has been kept to ES5 according to the projects requirements.

* To accommodate varying device performances, **game scales** according to internally detected FPS by device to maintain consistency across cross-device gameplay.

* Server works in a "lazy" way; ie, it only **sends messages when a change occurs**. For instance, no chat, leaderboard, enemy (except positions and score) or food updates are sent unless there is a change in respective attributes. Also, the server sends only the changelog once. New players connected in between game receive updated game due to temporarily-persistent game state on servers (also updated along with changelogs).

--------------

## Gameplay

* There is no concept of lobbies or player limits (yet).

* Game spawns players close to other players (checking from top-left) with sufficient distance and overlapping prevention.

* Most logic runs on client side disregarding facts of cheating to squeeze server performance.

* Score is used to calculate players' radii and other game dynamimcs (such as if a player can consume other). Unlike original game, this game does not have concept of mass.

* Player velocity slows as more score is attained (similar to original game).

* Player radius increases at every score multiple of 90.

* The number of sides constituting the food polygon scale with screen size/ratio.

--------------

## TODO

* Add cell splitting.

* Add viruses.

* Add skins.

* *Anything you feel relevant.*

--------------

## Development Environment

Considering this as a college project, the aim was to make deployment easier (hence implementation of React framework without Node.js). Further, being built using maven allows for easier dependency resolution.

There are two methods to setup the environment for running this game.

* **Using Docker**

**On Windows**

Since Docker config used is based on linux containers, windows users will have to run it inside a VM. So, download and install [Vagrant][12] and [Virtualbox][13].

Go to project directory and run `vagrant up` in terminal.

This will setup Vagrant and docker containers and deploy application on address `http://localhost:8080` (if port `8080` is already in use, some other port will be used. The new port will be listed in Vagrant output).

**On Linux**

Download and install docker and docker-compose.

Go to project directory and run `docker-compose up -d`.

Ensure port `8080` is free or the containers won't run. Application will be deployed on address `http://localhost:8080`.

This setup is recommended if you intend to just test and play around with game.

* **Running manually without Docker**

To setup environment, simply clone this repository and open the project in your preferred IDE with integration of your preferred web container (Apache Tomcat 8.5 was used for initial development).

Install Maven dependencies, ensure MySQL is running, and edit the MySQL connection string in [src/main/java/com/agario/dao/DAO.java][14] (could have probably used `dotenv` to make things easier, but oh well...).

This setup is recommended if you want to develop on this game.


----------


--------------

## FAQs

* **What's "Agar.io"?**

Visit [agar.io][15] and check for yourself!

* **Why create this game?**

As my java project for the college term, having the freedom to create program of choice (with few conditions), I chose Agar.io as per its really elegant concept. This was a good challenge for the allotted time to make cross-device gameplay smooth and consistent.

* **Why use MySQL, JSTL/JSP?**

They were part of requirements for my project. Modular structure allows for easy replacement/removal when required.

* **Can I use the code from this game in my projects?**

Definitely! Just be sure to give credits where required.

* **Can I contribute?**

Yes of course! Any contribution (including bug reporting) is highly appreciated and a special credits area will be created upon contribution.

* **How do I contribute?**

Simply create a [Pull Request][16]. I will approve your changes and commit them if relevant. And of course, add you as contributor in a crerdits section (to be created).

* **Where can I report bugs/queries?**

Go to [Issues][17] and create a new issue.

* **Any existing bugs?**

No bugs were found during testing.

--------------

## License

This project is licensed under the terms of the **MIT** license.

The complete license can be read [here][18].

For educational purposes.


  [1]: https://github.com/Jaskaranbir/Agar.io-Clone#game-attributes
  [2]: https://github.com/Jaskaranbir/Agar.io-Clone#additional-game-attributes
  [3]: https://github.com/Jaskaranbir/Agar.io-Clone#gameplay
  [4]: https://github.com/Jaskaranbir/Agar.io-Clone#todo
  [5]: https://github.com/Jaskaranbir/Agar.io-Clone#development-environment
  [6]: https://github.com/Jaskaranbir/Agar.io-Clone#faqs
  [7]: https://github.com/Jaskaranbir/Agar.io-Clone#license
  [8]: https://i.stack.imgur.com/mPYb9.png
  [9]: https://i.stack.imgur.com/lYoxY.png
  [10]: https://i.stack.imgur.com/hpuKV.png
  [11]: https://i.stack.imgur.com/pQyEx.png
  [12]: https://www.vagrantup.com/
  [13]: https://www.virtualbox.org/
  [14]: https://github.com/Jaskaranbir/Agar.io-Clone/blob/master/src/main/java/com/agario/dao/DAO.java#L16
  [15]: http://agar.io
  [16]: https://help.github.com/articles/creating-a-pull-request/
  [17]: https://github.com/Jaskaranbir/Agar.io-Clone/issues
  [18]: https://github.com/Jaskaranbir/Agar.io-Clone/blob/master/LICENSE
