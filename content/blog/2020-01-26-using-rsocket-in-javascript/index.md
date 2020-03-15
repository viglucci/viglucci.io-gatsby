---
title: Approaching RSocket in Javascript
slug: state-of-rsocket-with-javascript
date: "2020-01-26T16:41:00.000Z"
description: "Quick overview of using RSocket with Javascript"
ogimage: "./og-image.jpg"
---

In my [previous article](/reviewing-distributed-system-architectures) we learned briefly about a somewhat new addition to the network/application protocol space called RSocket. In this article we will first set the stage, and then review some of the ways RSocket is supported in the Javascript ecosystem today.

## Setting the stage: RSocket is young

Although Google shows search trends dating back to 2015 for RSocket, its popularity as a search term appears to have been rather stagnant until late 2018, where it started to pickup some momentum.

![graph showing rsocket search popularity on Google Trends](./rsocket-search-trends.png)

Why is this relevant?

If we use Google Trends as a tool/lense to determine industry adoption we can see that when compared to other protocols that have gained adoption and momentum, such  as GraphQL (denoted in red below), RSocket (denoted in blue below) has yet to experience the same boom and growth that would signify a similar adoption.

![graph showing rsocket vs graphql search popularity on Google Trends](./rsocket-search-trends-vs-graphql.png)

In my opinion the search trend data represents somewhat closely the level of support and development occurring in the Javascript ecosystem for RSocket. I also believe that the popularity and boom in adoption of GraphQL is due in part to the great support and adoption that GraphQL has found in the Javascript ecosystem, not to mention its backing by large companies such as Facebook. If RSocket were to gain popularity with Javascript developers, and additionally gain some additional enterprise backing, I believe it has the potential to experience similar growth in regards to adoption.

Why is any of that relevant?

Javascript developers have become widely accustomed (myself included) to leveraging hundreds or thousands of open source packages to solve a wide range of problems, but that ecosystem of libraries and abstractions around RSocket hasn't quite developed just yet. So if you expect to be able to `npm install` your way to victory with RSocket, your going to have a bad time.

![super cool ski instructor meme from southpark](./npm-rsocket-bad-time-meme.jpg)

*[know your meme: super cool ski instructor](https://knowyourmeme.com/memes/super-cool-ski-instructor)*

## What support exists today?

Even though the open source landscape for RSocket in Javascript is relatively up and coming, there is enough to build *something* with what is currently available. And dare I say, there is likely enough to build something that you *could* run in production, though your mileage may vary when it comes to monitoring, telemetry and other production considerations.

### rsocket-js

[rsocket-js](https://github.com/rsocket/rsocket-js) is the primary reference implementation of RSocket for Javascript and although you can consumer it directly to implement RSocket requesters and responders, it is much more practical to create abstraction wrappers, such as [rsokcet-rpc-js](https://github.com/rsocket/rsocket-rpc-js).

**Core team/ownership**

As far as ownership is concerned, it appears that the library was developed either in part or mostly by Facebook engineers, and has received varying levels of contribution from open source contributors, as well as engineers at companies such as [Pivotal](https://pivotal.io/) and [Netifi](https://www.netifi.com/).

Several of the licenses in the repository reference Facebook, and your are expected to accept the Facebook OSS agreement when contributing, which implies to me that Facebook may be the primary maintainer of the project, however I believe there is some uncertainty in that regard.

**Uncertainty**

In contrast to the Java implementation of RSocket ([rsocket-java](https://github.com/rsocket/rsocket-java)), where investment and contribution from companies such as Netflix and Pivotal give consumers confidence and security in its continued development, I am not sure that rsocket-js currently has a clear set of core maintainers with a defined road map.

The documentation for rsocket-js states that there exist parts of the spec that are yet to be implemented, and it is unclear if the library has experienced enough dog fooding to work out any quirks or edge cases, so consumers will likely need to make their  own determination as to if the library is mature enough to ship to code in production.

### rsocket-rpc-js

[rsokcet-rpc-js](https://github.com/rsocket/rsocket-rpc-js), in its own words, is "The Standard RPC implementation for RSocket" in Javascript. In practical terms rsocket-rpc-js is likely the interface you as an applications developer would consume when writing RSocket services as it provides a level of abstraction on top of RSocket that adds commonly required functionality, such as message routing.

**Opinionated**

rsocket-rpc-js and other RPC style client/server implementations are generally opinionated about how consumers implement clients and servers and how messages are framed and formatted.

For some consumers this may cause frustration if you find yourself in a situation where your use-case doesn't fit into the established convention, however, it empowers developers to develop tooling and standardized universal integrations. For instance, because rsocket-rpc-js and other RSocket RPC implementations follow an established spec, it is possible to generate source code for clients, servers, and message payloads using common tools such as protoc.

An example of consuming a client service generated with protoc and the [rsocket-rpc-protobuf protoc plugin](https://github.com/rsocket/rsocket-rpc-js/tree/master/rsocket-rpc-protobuf) may look something like the below:

```js
const request = new HelloRequest();
request.setName('John Doe');
helloServiceClient.sayHello(request).subscribe({
    onComplete: (response) => {
        console.log(`HelloService.sayHello response received with message: ${response.getMessage()}`);
    },
    onError: (error) => {
        console.log(`HelloService.sayHello response received with error: ${error.name}`);
        console.error(error);
    }
});
```

In this example we have implemented a service with a method that is utilizing the Request Response flow, where the client makes a response and expects a single response from the server. You can review the full list of interactions between client and server on the [rsocket.io website](https://rsocket.io/docs/Protocol#stream-sequences-and-lifetimes).

Having a standardized opinionated spec and implementation also allows for the creation of platform services and solutions, such as [netifi](https://www.netifi.com/), which is a language agnostic broker for RSocket that aims to solve many of the common service mesh orchestration.

### rsocket-flowable

[rsocket-flowable](https://github.com/rsocket/rsocket-js/blob/master/docs/03-flowable-api.md) provides an interface for interacting with Reactive Streams in Javascript. rsocket-flowable is deeply ingrained into both rsocket-js and rsocket-rpc-js, so learning its API is going to be paramount to successfully working with either project.

is that you are going to need to change your mental model of thinking from "perform an operation and receive a return value", to "perform an operation and subscribe to the side effects of said operation".


If you are familiar with [RxJS](https://github.com/ReactiveX/rxjs), then rsocket-flowable will likely feel familiar to you. If you are not familiar with RxJS, or reactive programming paradigms, then you are likely going to experience a learning curve.

## Whats next

While the bulk of ongoing development appears to be centered around the Java and C++ implementations of RSocket, it is my hope that the Javascript implementation will continue to receive updates and additions to meet the full RSocket spec, but only time will tell.

If you are passionate about RSocket and a seasoned Javascript developer, now may be a good time to get involved with the project to leave your mark and assist in its continuity. If contributing to the project(s) might not be your cup of tea, then sharing this article with your friends, coworkers, and your social networks would be a great way to increase RSockets visibility in the Javascript community.
