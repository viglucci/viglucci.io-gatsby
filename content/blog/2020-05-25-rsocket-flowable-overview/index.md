---
title: Reactive Programming in JavaScript with RSocket Flowable
slug: rsocket-flowable-overview
date: "2020-05-25T00:00:00.000Z"
description: "******PLACEHOLDER******."
ogimage: "./rsocket-flowable-overview-og-image.png"
twitterimage: "./rsocket-flowable-overview-twitter-image.png"
---

Asynchronous programming is a concept as paramount to working in JavaScript as any other. JavaScript programmers are generally familiar with Promises, async/await, and callbacks, however, implementations of Reactive Streams, such as [RxJS](https://github.com/ReactiveX/rxjs) are not as widely taught or utilized.

The RxJS library has done a great deal for normalizing reactive programming in JavaScript, largely in the Angular ecosystem, but today we are going to dig into a different implementation of Reactive Streams called [RSocket Flowable](https://github.com/rsocket/rsocket-js/blob/master/docs/03-flowable-api.md), which is published to npm as rsocket-flowable.

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

#### Flowable

The Flowable is an observable interface that supports the following interactions:

- emit a single value via the `subscriber.onComplete` callback
- emit one or more values via the `subscriber.onNext` callback when the subscriptions **request callback** is invoked
- emit one or more error values via the `subscriber.onError` callback
- be cancelled via the `cancel` method passed to the subscribers `onSubscribe` callback

Flowable differs from Single on a fundamental level in that the purpose of Flowable is to emit one or more values, compared to Single emitting a single or no values, **as well as Flowable supporting the concept of back-pressure**.

From the Reactive Manifesto:

> ...back-pressure is an important feedback mechanism that allows systems to gracefully respond to load rather than collapse under it https://www.reactivemanifesto.org/glossary#Back-Pressure

This concept of back-pressure is unique to observable implementations in JavaScript through rsocket-flowable, and in the simplest terms allows for an observer to control the rate and which an observable emits or "publishes" values.

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
