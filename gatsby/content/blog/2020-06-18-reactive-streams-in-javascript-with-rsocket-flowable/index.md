---
title: Reactive Streams in JavaScript with RSocket Flowable
slug: reactive-streams-in-javascript-with-rsocket-flowable
date: "2020-06-18T00:00:00.000Z"
description: "Message streaming, back-pressure, cancellation, and async programming in JavaScript with rsocket-flowable."
ogimage: "./rsocket-flowable-overview-og-image.png"
twitterimage: "./rsocket-flowable-overview-twitter-image.png"
---

When programming async operations, JavaScript developers are generally at least familiar with Promises, async/await, and callbacks. However, newer async models such as ReactiveX ([RxJS](https://github.com/ReactiveX/rxjs) in JavaScript), are not quite as popular. In this article, we dig into something similar but slightly different to RxJS; a Reactive Streams implementation called [RSocket Flowable](https://github.com/rsocket/rsocket-js/blob/master/docs/03-flowable-api.md) (rsocket-flowable on npm).

## Core Concepts

At the core of RSocket Flowable is the Observer Pattern, implemented in rsocket-flowable via the **Single** and **Flowable** interfaces.

> The observer pattern is a software design pattern in which an object, called the subject, maintains a list of its dependents, called observers, and notifies them automatically of any state changes, usually by calling one of their methods. https://en.wikipedia.org/wiki/Observer_pattern

### Single and Flowable Interfaces

```js
const { Single, Flowable } = require('rsocket-flowable');

// construct an instance of a Single
const mySingle$ = new Single(subscriber => {});

// constuct an instance of a Flowable
const myFlowable$ = new Flowable(subscriber => {});
```

#### Single

The Single is an observable interface that supports the following interactions:

- emit a single value via the `subscriber.onComplete` callback
- emit an error value via the `subscriber.onError` callback
- cancellation via the `cancel` callback passed to observers through the `onSubscribe` callback

Apart from cancellation, these operations should feel familiar as they are mostly the same as interacting with Promises, as promises can only ever resolve or reject.

##### Single Example

A practical example of consuming the Single interface would be wrapping a promise API/operation, such as the `fetch` API. In the below case, we do just that; we create a new instance of Single, which when subscribed to will call to the Starwars API to retrieve data about Luke Skywalker.

```js
const { Single } = require('rsocket-flowable');
const fetch = require('node-fetch');

const luke$ = new Single(subscriber => {
  fetch('https://swapi.dev/api/people/1')
    .then(response => response.json())
    .then(data => subscriber.onComplete(data))
    .catch(error => subscriber.onError(error));
  subscriber.onSubscribe();
});

luke$.subscribe({
  onComplete: data => {
    console.log(data);
  },
  onError: err => {
    console.error('There was a disturbance in the force!', err);
  },
  onSubscribe: cancel => {
    /* calling cancel() will stop calls to onComplete/onError */
  },
});
```

#### Flowable

The Flowable is an observable interface that supports the following interactions:

- emit a single value via the `subscriber.onComplete` callback
- emit one or more values via the `subscriber.onNext` callback when the subscriptions **request callback** is invoked
- emit one or more error values via the `subscriber.onError` callback
- cancellation via the `cancel` callback passed to observers through the `onSubscribe` callback

Flowable differs from Single on a fundamental level in that we expect Flowable to emit one or more values. Single is only ever supposed to emit a single or no value. Additionally, Flowable supports the concept of back-pressure.

From the Reactive Manifesto:

> ... back-pressure is an important feedback mechanism that allows systems to gracefully respond to load rather than collapse under it https://www.reactivemanifesto.org/glossary#Back-Pressure

The concept of back-pressure isn't exactly unique to rsocket-flowable, but it is simpler compared to the back-pressure support provided through RxJS. In the simplest terms, Flowable's back-pressure support allows for an observer to control the rate at which an observable emits or "publishes" values. To support this, **the Flowable interface accepts a subscriber that must implement a request method**. This request method acts as a callback that is responsible for "publishing" values as requested by an observer.

#### The Request Method

The request method is responsible for publishing data at the rate requested by an observer, with the observer controlling the flow of data by passing an int value representing the number of events it can handle.

```js
const { Flowable } = require('rsocket-flowable');

const ints$ = new Flowable(subscriber => {
  subscriber.onSubscribe({
    request: n => {
      for(let i = 0; i < n; i++) {
        subscriber.onNext(i);
      }
    }
  });
});

ints$.subscribe({
  onNext: i => console.log(i),
  onSubscribe: sub => sub.request(3)
});
```

In this example, calling `sub.request(3)` would result in `onNext()` being called with the values `0, 1, 2`.

For a more complex "real world" usage example, read the detailed explanation of an algorithm leveraging Flowable labeled "Flowable Code Example Explanation," or jump straight the corresponding code sample labeled "Flowable Code Example."

#### Flowable Code Example Explanation

Below we've implemented a Flowable publisher that will emit data retrieved from the Starwars API for every movie that contains the character Luke Skywalker. To accomplish this, we implement the request method of the subscription object passed to `filmsSubscriber.onSubscribe()` that roughly follows the following algorithm:

When the request method is invoked for the first time:

- Fetch data about Luke Skywalker from the Starwars API and destructure the array of films from the response. We then save the collection of films to the `pendingFilms` variable so that we can reference it on subsequent calls to `request`.

When the request method is invoked for the first time, and on every subsequent call to request:

- Loop over each URL in the `pendingFilms` array to load data about a movie with Luke Skywalker as a character.
  - Break the loop if we have requested the number of movies that the observer requested (`requestedFilmsCount`).
  - Break the loop if data for all of the movies is loaded.
- Remove a URL to a movie from the `pendingFilms` list.
- Fetch the data about the movie removed from the `pendingFilms` list, and add the resulting promise to the unsettled promises array (`fetches`).
  - Once the promise resolves, pass the resulting data to `filmsSubscriber.onNext(filmData)`.
  - If the promise rejects, pass the resulting error to `filmsSubscriber.onError(err)`.
- Once all the promises saved to the unsettled promises array (`fetches`) have settled, check if we still have movies we haven't loaded data for yet.
  - If there are movies that still haven't loaded data for yet, do nothing and wait for the observer to perform a subsequent call to `request` on its subscription.
  - If there are no more movies waiting to be loaded, call `filmsSubscriber.onComplete()`, which will signify to the observer that all possible data is loaded.

This algorithm is substantially more complex than the more straightforward case of leveraging `Single` to forward the result of a Promise.  However, the support for controlling the rate at which we pull additional data, along with the backing for cancellation (with small adjustments), makes the added complexity of Flowable a worthwhile tradeoff.

#### Flowable Code Example

```js
const { Flowable } = require('rsocket-flowable');
const Promise = require('bluebird');
const fetch = require('node-fetch');

const films$ = new Flowable(subscriber => {

  let pendingFilms = null;

  subscriber.onSubscribe({
    request: async requestedFilmsCount => {
      if (!pendingFilms) {
        const response = await fetch('https://swapi.dev/api/people/1');
        const { films } = await response.json();
        pendingFilms = films;
      }

      const fetches = [];
      while (requestedFilmsCount-- && pendingFilms.length) {
        const nextFilm = pendingFilms.splice(0, 1)[0];
        const promise = fetch(nextFilm)
          .then(response => response.json())
          .then(filmData => subscriber.onNext(filmData))
          .catch(err => subscriber.onError(err));
        fetches.push(promise);
      }

      await Promise.allSettled(fetches);

      if (!pendingFilms.length) {
        subscriber.onComplete();
      }
    }
  });
});

films$.subscribe({
  onComplete: () => console.log('All films fetched!'),
  onError: err => console.error(err),
  onNext: film => console.log(film.title),
  onSubscribe: sub => sub.request(100)
});
```

### Lazy Observables

The observable interfaces implemented by rsocket-flowable are "lazy," meaning that no "work" begins until an observer subscribes to the observable. These observables can also be referred to as "cold observables," which is in contrast to a "hot observable." When working with a hot observable, the observable may emit values regardless of the presence of any observers.

```js
const mySingle$ = new Single(subscriber => {
  // closure is not invoked until mySingle$.subscribe() is invoked.
});

const myFlowable$ = new Flowable(subscriber => {
  // closure is not invoked until myFlowable$.subscribe() is invoked.
});
```

In contrast, you may already be familiar with the concept of "eager" or "hot" interfaces in the form of Promises. For promises, the callback passed to the Promise constructor is invoked as soon as the Promise instance is created (or on the next tick of the event loop if you want to get specific).

If a tree falling in the woods was a hot observable, it would make sound regardless of if anyone was around to hear it or not.

```js
new Promise((resolve, reject) => {
  const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);
  log('Callback called');
  setTimeout(() => {
    const randomInt = Math.floor(Math.random() * Math.floor(10));
    log(`The random int is ${randomInt}`);
    resolve(randomInt);
  }, 1000);
});
```

In the above example, the `setTimeout` method  in the callback passed to the Promise constructor is invoked whether the `.then()` prototype method is invoked or not. You can verify this for yourself by copying the above example into your browser's dev tools console, where you will see that a console logline printed immediately, followed by a random int value about one second later.

### Cancellation

Cancellation is a powerful feature of observable interfaces, such as rsocket-flowable. Cancellation allows for an observer to indicate to the observable that they are no longer interested in the result of any operations which are ongoing. Cancellation is useful when programming user interfaces with frameworks such as ReactJS, where being able to cancel in-flight async operations is essential for cleaning up state to avoid side effects when unmounting components. Cancellation support is also useful when implementing stateful web services with protocols such as WebSockets, where a client could terminate their connection at any time, and continuing to perform operations on their behalf after they've disconnected likely doesn't make sense.

#### Cancellation Example

In the example below, we create an instance of a Flowable that will emit an integer value until canceled, with a subscriber requesting a random number of ints every 500 milliseconds (half a second). The subscriber will additionally cancel the stream of ints after three seconds. This example is similar to how you could implement a timeout for an async operation, such as a network request or file read.

```js
const { Flowable } = require('rsocket-flowable');

let lastInt = 0;
const ints$ = new Flowable(subscriber => {
  subscriber.onSubscribe({
    cancel: () => console.log('Stream canceled!'),
    request: (n) => {
      const upperBounds = lastInt + n;
      for(let i = lastInt; i < upperBounds; i++) {
        lastInt = i;
        subscriber.onNext(i);
      }
    }
  });
});

ints$.subscribe({
  onComplete: () => { /* onComplete is never called */ },
  onNext: i => console.log(i),
  onSubscribe: sub => {
    /**
     * Request a random number of ints every 500 milliseconds.
     */
    const interval = setInterval(() => {
      const n = Math.floor(Math.random() * Math.floor(10)) + 1;
      sub.request(n);
    }, 500);

    /**
     * Cancel the stream after 3 seconds.
     */
    setTimeout(() => {
      clearInterval(interval);
      sub.cancel();
    }, 3000);
  }
});
```

#### Cancellation Caveat

It is essential to understand that canceling an observable stream only instructs the observable that the subscriber no longer cares to receive updates, it does not automatically cancel any operations which the publisher may have been performing. If it is vital for your observable to react to being canceled, then you can implement the `subscription.cancel` callback to perform cleanup as needed.

Lastly, with `rsocket-flowable@0.0.14`, to avoid the below TypeError, you must implement the cancel callback on the publisher if you intend to invoke cancel from a subscriber.

```
TypeError: this._subscription.cancel is not a function
```

### The Future of RSocket Flowable

In a previous article [The State of RSocket in JavaScript](/the-state-of-rsocket-in-javascript), we reviewed how the future of rsocket-js may be uncertain, and with a maintainer of rsocket-js stating that RSocket Flowable may be replaced in the future by a [new project](https://github.com/rsocket/rsocket-js/issues/45#issuecomment-522035252), I feel the same way about RSocket Flowable. However, the GitHub repo for the proposed replacement has not received meaningful contributions for over 16 months, so it is hard to say if this will occur. It is, of course, possible that the project could be in-development behind the scenes as a closed source project to be released as OSS in the future.

### Final Thoughts

Advancements such as RSocket support the continued adoption of observable patterns. RSocket models a stream of messages moving fluently through a system, with each leveraging a ReactiveX, or a React Streams implementation. Reactive Streams, and ReactiveX (implemented as RxJS in JavaScript), have grown on me after discovering RSocket, and I believe we will continue to see growth and adoption of these patterns over the next couple of years. In the Java ecosystem, it is already clear that Reactive Streams has become more prevalent through the popular Project Reactor.

I recommend diving deeper into these concepts if building highly scalable reactive microservices and real-time interfaces intrigues you.
