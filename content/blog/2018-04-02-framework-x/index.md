---
title: Framework X - Whats in a Framework?
date: "2018-04-02T00:12:06.0000Z"
description: "Thoughts about developing my own HTTP framework built on Express"
---


![require('framework-x')](https://i.imgur.com/HDtNnOg.png)

So, I've decided to write my own HTTP 'framework', if you can even call it that.

For the time being I am going to call this project framework-x, until I think of something better... or not, IDK.

What qualifies as a framework? I'm not exactly sure, but that is what I am going to call this project until I am educated otherwise.

Either way... what I am attempting to do is write a series of tested, proven, and exercised patterns that will assist with working with the popular Node framework [Express](https://expressjs.com/).

The main goals of the project will be to implement a series of objects that will assist a consumer in managing their application in three high-level areas:

* Application lifecycle (startup, teardown, etc)
* Object lifecycle (object creation, IOC, dependency injection, etc)
* Routing (extend the express router to add additional features, route groups, etc)

The framework may expand past these concepts in the future, however, with the goal to simply extend Express and hopefully promote some 'best practices', I want to keep it pretty simple to promote the concept of migrating an existing Express powered application to the framework with minimal fuss.

If you'd like to check out the project you can dig through the source code over on [GitHub](https://github.com/viglucci/framework-x).

You can also take a look at a simple application I will be building with the framework in this [repository](https://github.com/viglucci/framework-x-example).

Thanks for reading :)

![test](https://i.imgur.com/hLj4wFM.png)
