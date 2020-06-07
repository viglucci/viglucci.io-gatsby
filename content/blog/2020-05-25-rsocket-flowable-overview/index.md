---
title: Reactive Programming in JavaScript with RSocket Flowable
slug: rsocket-flowable-overview
date: "2020-05-25T00:00:00.000Z"
description: "******PLACEHOLDER******."
ogimage: "./rsocket-flowable-overview-og-image.png"
twitterimage: "./rsocket-flowable-overview-twitter-image.png"
---

Asynchronous programming is a concept as paramount to working in JavaScript as any other, with developers generally familiar with patterns such as Promises, async/await, and callbacks. However, implementations of Reactive Streams, such as [RxJS](https://github.com/ReactiveX/rxjs), are not as widely taught or utilized. RxJS has done a great deal for normalizing reactive programming in JavaScript, largely in the Angular ecosystem, but today we are going to dig into a different implementation of Reactive Streams called [RSocket Flowable](https://github.com/rsocket/rsocket-js/blob/master/docs/03-flowable-api.md) (rsocket-flowable on npm).

## Core Concepts

At the core of RSocket Flowable is the Observer Pattern, implemented in rsocket-flowable via the **Single** and **Flowable** interfaces.

> The observer pattern is a software design pattern in which an object, called the subject, maintains a list of its dependents, called observers, and notifies them automatically of any state changes, usually by calling one of their methods. https://en.wikipedia.org/wiki/Observer_pattern

### Single and Flowable Interfaces

RSocket Flowable exports two primary interfaces, Single and Flowable, which in contrast to the more functional programming style that RxJS follows, are implemented and exposed using object oriented patterns.

```js
const { Single, Flowable } = require('rsocket-flowable');

// construct an instance of a Single
const mySingle = new Single((subscriber) => {});

// constuct an instance of a Flowable
const myFlowable = new Flowable((subscriber) => {});
```

#### Single

The Single is an observable interface that supports the following interactions:

- emit a single value via the `subscriber.onComplete` callback
- emit an error value via the `subscriber.onError` callback
- be cancelled via the `cancel` method passed to the subscribers `onSubscribe` callback

Apart from with the added functionality of being able to cancel observing and observable, these operations should feel familiar to JavaScript programmers as they are similiar to interacting with Promises, where a promise can only ever resolve or reject.

##### Single Example

A practical example of consuming the Single interface would be wraping a promise API/operation, such as the `fetch` API. In the below example we do just that, we create a new instance of Single, which when subscribed to will call to the Starwars API to retrieve data about Luke Skywalker.

```js
const { Single } = require("rsocket-flowable");
const fetch = require("node-fetch");

const observable = new Single(subscriber => {
  fetch("https://swapi.dev/api/people/1")
    .then(response => response.json())
    .then(data => subscriber.onComplete(data))
    .catch(error => subscriber.onError(error));
  subscriber.onSubscribe();
});

observable.subscribe({
  onComplete: lukeSkywalkerData => {
    console.log(lukeSkywalkerData);
  },
  onError: err => {
    console.error("There was a disturbance in the force!", err);
  }
});
```

#### Flowable

The Flowable is an observable interface that supports the following interactions:

- emit a single value via the `subscriber.onComplete` callback
- emit one or more values via the `subscriber.onNext` callback when the subscriptions **request callback** is invoked
- emit one or more error values via the `subscriber.onError` callback
- be cancelled via the `cancel` method passed to the subscribers `onSubscribe` callback

Flowable differs from Single on a fundamental level in that the purpose of Flowable is to emit one or more values, compared to Single emitting a single or no values, **as well as Flowable supporting the concept of back-pressure**.

From the Reactive Manifesto:

> ...back-pressure is an important feedback mechanism that allows systems to gracefully respond to load rather than collapse under it https://www.reactivemanifesto.org/glossary#Back-Pressure

This concept of back-pressure is unique to observable implementations in JavaScript through rsocket-flowable, and in the simplest terms allows for an observer to control the rate at which an observable emits or "publishes" values. To support this, **the Flowable interface accepts a subscriber that must implement the request method**. This request implementation is responsible for "publishing" values as they are request from an observer that has invoked `.subscribe()`.

To see this in action, you can read the detailed explanation of an algorithm leveraging Flowable under "Flowable Code Example Explanation", or skip the explanation and jump to the Flowable Code Example section below that.

#### Flowable Code Example Explanation

**The Flowable interface requires a bit more thought than Single**. This is primarily due to the support for back-pressure, and how supporting back-pressure can often require some caching to save off partial or staged data until it is requested by observers.

To demonstrate this, below we've implemented a Flowable publisher which will emit data retrieved from the Starwars API for every movie that contains the character Luke Skywalker. To accomplish this, we implement the request method of the subscription object passed to `filmsSubscriber.onSubscribe()` that roughly follows the following algorithm:

The first time request is called:

- Fetch data about Luke Skywalker from the Starwars API and destructured the array of films from the response. We then save the array of filmsto the `pendingFilms` variable so that we can reference it on subsequent calls to `request`.

The first time request is called, and every subsequent call to request:

- Loop over each URL in the `pendingFilms` array to load data about a movie with Luke Skywalker as a character.
  - Break the loop if we have requested the number of movies that the observer requested (`requestedFilmsCount`).
  - Break the loop if there are no more movies to load data for.
- Remove a URL to a movie from the `pendingFilms` list.
- Fetch the data about the movie removed from the `pendingFilms` list, and add the resulting promise to the unsettled promises array (`fetches`).
  - Once the promise resolves, pass the resulting data to `filmsSubscriber.onNext(filmData)`.
  - If the promise rejects, pass the resulting error to `filmsSubscriber.onError(err)`.
- Once all the promises saved to the unsettled promises array (`fetches`) have settled, check if we still have movies we haven't loaded data for yet.
  - If there are movies that still haven't loaded data for yet, do nothing and wait for the observer to perform a subsequent call to `request` on its subscription.
  - If there are no more movies to load that have Luke Skywalker in them, call `filmsSubscriber.onComplete()` which will signify to the observer that all of the possible data has been loaded and it should not expect anything further.

As you can see, this algorithm is substantially more complex than that of the simple case of using a Single to forward along a resolve or reject call from a Promise. Even though this algorithm is more complex, it is also substantially more powerful as it supports the observer controlling the rate at which the movie data is loaded, and with small adjustments, could also allow for the observer to cancel the whole operation should it choose to for any reason.

#### Flowable Code Example

```js
const { Flowable } = require("rsocket-flowable");
const Promise = require("bluebird");
const fetch = require("node-fetch");

const films$ = new Flowable((filmsSubscriber) => {

  let pendingFilms = null;
  let fetchFilmsWithLukeSkywalker = null;

  filmsSubscriber.onSubscribe({
    request: async (requestedFilmsCount) => {
      if (!fetchFilmsWithLukeSkywalker) {
        const response = await fetch("https://swapi.dev/api/people/1");
        const { films } = await response.json();
        pendingFilms = films;
      }

      const fetches = [];
      while (requestedFilmsCount-- && pendingFilms.length) {
        const nextFilm = pendingFilms.splice(0, 1)[0];
        const promise = fetch(nextFilm)
          .then(response => response.json())
          .then(filmData => filmsSubscriber.onNext(filmData))
          .catch(err => filmsSubscriber.onError(err));
        fetches.push(promise);
      }

      await Promise.allSettled(fetches);

      if (!pendingFilms.length) {
        filmsSubscriber.onComplete();
      }
    }
  });
});

films$.subscribe({
  onComplete: () => console.log("All films fetched!"),
  onError: err => console.error(err),
  onNext: film => console.log(film.title),
  onSubscribe: sub => sub.request(100)
});
```

### Lazy Observables

The observable interfaces exposed by rsocket-flowable are "lazy", in that no "work" is started until a observer subscribes to the observable. This concept is also often referred to as a "cold observable", which is in contrast to a "hot observable", where the observable performs work and emits values regardless of the presence of any observers.

```js
const mySingle = new Single((subscriber) => {
  // closure is not invoked until mySingle.subscribe() is called.
});

const myFlowable = new Flowable((subscriber) => {
  // closure is not invoked until myFlowable.subscribe() is called.
});
```

As a comparison, you may already be familiar with the concept of "eager" or "hot" interfaces in the form of Promises, which will begin executing the asynchronous operation as soon as the object is created (or on the next tick of the event loop if you want to get specific).

```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    const randomInt = Math.floor(Math.random() * Math.floor(10));
    console.log(`[${new Date().toISOString()}] ${randomInt}`);
    resolve(randomInt);
  }, 1000);
});
```

In the above example, the `setTimeout` method  in the callback passed to the constructor for Promise is executed whether the `.then()`, or any other prototype methods has been called on the promise instance or not. You can verify this for yourself by copying the above example into your browsers devtools console, and you will see that after about one second, a random int value is printed to the console.

### Cancellation


## Source Code

The source for roscket-flowable comes from the [rsocket-js](https://github.com/rsocket/rsocket-js) github repository, which is a monorepo  style repository housing numerous libraries and packages for working with the RSocket application protocol in JavaScript. The project is implemented using the Flow type system, which is not as popular as other type systems (such as Typescript) these days, but if you want to dig in you can find the source for rsocket-flowable at [https://github.com/rsocket/rsocket-js/tree/master/packages/rsocket-flowable/](https://github.com/rsocket/rsocket-js/tree/master/packages/rsocket-flowable/).
