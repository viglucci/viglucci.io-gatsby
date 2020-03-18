---
title: Considerations for Using RSocket in Javascript
slug: considerations-for-using-rsocket-in-javascript
date: "2020-03-16T16:41:00.000Z"
description: "******************TODO******************"
ogimage: "./og-image.jpg"
---

RSocket is an exciting new advancement in the distributed systems space, however, it hasn't quite picked up the same popularity in the Javascript ecosystem as other networking techonologies, such as GraphQL. In contrast to GraphQL where entire conferences, companies, and library suites have taken life, RSocket is missing a similar level of investment from Javascript developers and big time Javascript consumers.

## RSocket Hasn't Gained Popularity

Let's compare RSocket's search popularity with [GraphQL's](https://graphql.org/), which is another networking and application protocol.

RSocket's search popularity only started picking up steam in late 2018.

![Graph showing RSocket search popularity on Google Trends](./rsocket-search-trends.png)

Source: [Google Trends](https://trends.google.com/trends/explore?date=2015-01-01%202020-03-15&q=rsocket)

In contrast, GraphQL has experienced a much steeper increase in search popularity.

![Graph showing RSocket search popularity on Google Trends](./graphql-search-trends.png)

Source: [Google Trends](https://trends.google.com/trends/explore?date=2015-01-01%202020-03-15&q=graphql)

If we draw a parallel between search popularity and industry adoption, RSocket has yet to experience the same search popularity growth as GraphQL, signifying that it hasn't adopted the same level of adoption.

![Graph showing RSocket vs GraphQL search popularity on Google Trends](./rsocket-search-trends-vs-graphql.png)

GraphQL in red. RSocket in blue.
<br/>
Source: [Google Trends](https://trends.google.com/trends/explore?date=2015-01-01%202020-03-15&q=rsocket,graphql)

The popularity of GraphQL can be attributed to its conception at Facebook as well as investment into its ecosystem from startups such as [Apollo GraphQL](https://www.apollographql.com/). If RSocket were to gain popularity with large enterprise companies and Javascript developers, it has the potential to experience similar adoption.

Javascript developers have become accustomed to leveraging open source packages to solve a wide range of problems. Unfortunately, RSocket's ecosystem hasn't quite developed yet; there is only a single reference implementation of RSocket for Javascript and no well established supporting libraries. If you expect to be able to `npm install` your way to victory, you're going to have a bad time.

![Image of "super cool ski instructor" meme from Southpark](./npm-rsocket-bad-time-meme.jpg)

## Support for RSocket in Javascript

There exists enough library support to build *something* with RSocket & Javascript, however, when it comes to running an application in production, your mileage may vary when considering monitoring, telemetry, and other common production needs.

### rsocket-js

[rsocket-js](https://github.com/rsocket/rsocket-js) is the primary reference implementation of RSocket for Javascript. The library provides the low level base implementations for several [transports](https://github.com/rsocket/rsocket/blob/master/Protocol.md#transport-protocol), as well as a [Reactive Streams](https://github.com/rsocket/rsocket/blob/master/Protocol.md#flow-control-reactive-streams) implemention.

When building an application, developers will find it is much more practical to consume an abstraction library, such as [rsokcet-rpc-js](https://github.com/rsocket/rsocket-rpc-js), rather than consume rsocket-js directly. However, library authors would likely spend a majority of their time interfacing with rsocket-js directly.

**Project Ownership**

The rsocket-js project appears to have been developed primarily by engineers at Facebook. The project has also received varying levels of contribution from engineers at companies such as [Pivotal](https://pivotal.io/) and [Netifi](https://www.netifi.com/), as well as contributors from the open source community.

At first glance, it can be difficult to determine the primary maintainers of the project. While several of the licenses in the repository reference Facebook, and contributors to the project are expected to accept the Facebook OSS agreement, the contributions as of late are from engineers who could not tie directly back to Facebook.

**Uncertain Ownership & Future**

The Java implementation of RSocket ([rsocket-java](https://github.com/rsocket/rsocket-java)) has received heavy and continued contribution from engineers at companies such as Netflix and Pivotal. This continued investment provides consumers of RSocket in the Java ecosystem with a certain levle of confidence that the project has life, and as such, they can have added confidence in building their application with it.

In contrast, it is uncertain if rsocket-js has a clear set of core maintainers, a defined road map, or is being used by any large companies.

### rsocket-rpc-js

In its own words, [rsocket-rpc-js](https://github.com/rsocket/rsocket-rpc-js) is "The Standard RPC implementation for RSocket" in Javascript. In addition to exposing the reactive streams implementation behind a familiar service interface, the library also ties in nicely with RSocket message brokers that facilitate message routing, which is generally core to any distributed messaging system.

**Opinionated**

RPC style client and server implementations are generally opinionated about the interfaces they expose and how messages are framed and formatted. In contrast to a restful API where you might consume a User resource by invoking an HTTP GET request to `/users/1`, where `1` is the user ID, in an RPC API it would more common to invoke a HTTP POST request to `/UserService/GetUserById` and include in the request body the ID of the user `{ "userId": 1 }`. rsocket-rpc-js encourages these types of RPC patterns and interfaces with implemented methods looking similar to `GetUserById(int: id)`.

Following such patterns empowers developers to make tooling and standardized universal integrations. For instance, because rsocket-rpc-js and other RSocket RPC implementations follow an established spec, it is possible to generate source code for clients, servers, and message payloads using common tools such as protoc.

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

In my [previous article](/reviewing-distributed-system-architectures) we learned briefly about a somewhat new addition to the network/application protocol space called RSocket.
