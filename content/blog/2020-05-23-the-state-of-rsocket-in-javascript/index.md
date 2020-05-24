---
title: The State of RSocket in JavaScript
slug: the-state-of-rsocket-in-javascript
date: "2020-05-23T00:00:00.000Z"
description: "Sufficient support exists to build applications with RSocket & JavaScript, however, the level of support and adoption could give you pause before you bet your business on it."
ogimage: "./state-of-rsocket-js-og-image.png"
---

RSocket is an exciting new advancement in the application protocol space with decent adoption and support in the Java ecosystem, largely due to contributions to the Java implementation from companies such as [Pivotal](https://pivotal.io/), and decent support for RSocket in the popular [Spring](https://spring.io) framework. With respect to JavaScript, RSocket hasn't quite picked up the same level of popularity, adoption, or investment as other protocols, such as [GraphQL](https://graphql.org/).

## Stiff Competition

Let's compare RSocket's search popularity with GraphQL's to help gauge popularity of each protocol.

#### RSocket

In the below graph, we see that RSocket's search popularity only started picking up steam in late 2018.

![Graph showing RSocket search popularity on Google Trends](./rsocket-search-trends.png)

Source: [Google Trends](https://trends.google.com/trends/explore?date=2015-01-01%202020-03-15&q=rsocket)

#### GraphQL

In contrast, GraphQL has experienced a much steeper increase in search popularity, starting in 2016.

![Graph showing RSocket search popularity on Google Trends](./graphql-search-trends.png)

Source: [Google Trends](https://trends.google.com/trends/explore?date=2015-01-01%202020-03-15&q=graphql)

### Drawing Parallels

If we draw a parallel between search popularity and industry adoption, RSocket has yet to experience the same search popularity growth as GraphQL, signifying that it hasn't adopted the same level of adoption.

![Graph showing RSocket vs GraphQL search popularity on Google Trends](./rsocket-search-trends-vs-graphql.png)

GraphQL in red. RSocket in blue.
<br/>
Source: [Google Trends](https://trends.google.com/trends/explore?date=2015-01-01%202020-03-15&q=rsocket,graphql)

### Popularity and Adoption

One can easily contribute the popularity of GraphQL to its conception at Facebook and Facebook's opensource contributions having high visibility in the JavaScript space. Additionally, the investment into the GraphQL ecosystem from startups such as [Apollo GraphQL](https://www.apollographql.com/) have paid dividends into popularizing GraphQL. If RSocket were to gain popularity with large enterprise companies, as well as an engaged audience of JavaScript developers, I believe it could help RSocket experience similar adoption.

#### RSocket's Ecosystem is Undeveloped in JavaScript

In JavaScript, most developers have become accustomed to leveraging open source packages to solve a wide range of common problems, and it's never been a better time to avoid reinventing the wheel. However, being that there is only a single reference implementation of RSocket and no well-established supporting libraries, if you expect to be able to `npm install` your way to victory, you're going to have a bad time with RSocket.

![Image of "super cool ski instructor" meme from Southpark](./npm-rsocket-bad-time-meme.jpg)

## Support for RSocket in JavaScript

There exists enough library support to build *something* with RSocket & JavaScript, however, when it comes to running an application in production, and you start considering monitoring, telemetry, and other needs, your mileage may vary.

### rsocket-js

[rsocket-js](https://github.com/rsocket/rsocket-js) is the primary reference implementation of RSocket for JavaScript. The library provides the low level base implementations for several [transports](https://github.com/rsocket/rsocket/blob/master/Protocol.md#transport-protocol), as well as a [Reactive Streams](https://github.com/rsocket/rsocket/blob/master/Protocol.md#flow-control-reactive-streams) implemention.

When building an application, developers will find it is much more practical to consume an abstraction library, such as [rsokcet-rpc-js](https://github.com/rsocket/rsocket-rpc-js), rather than consume rsocket-js directly. However, library authors would likely spend a majority of their time interfacing with rsocket-js directly.

#### Project Ownership

At first glance, it can be difficult to determine the primary maintainers of the rsocket-js. The contributions as of late have primarily been from engineers who do not appear to be associated with Facebook, however, several of the licenses in the repository reference Facebook, and new contributors to the project are expected to accept the Facebook OSS agreement. Based on this, it appears that Facebook may not be taking a leading role in the libraries continued development, even if they did bootstrap and get the library off the ground initially. It is also important to note that the project has received varying levels of contribution from engineers at companies such as Pivotal and [Netifi](https://www.netifi.com/), as well as contributors from the open source community.

#### Uncertainty

The Java implementation of RSocket for Java ([rsocket-java](https://github.com/rsocket/rsocket-java)) has received heavy and continued contribution from engineers at established well known companies, such as Netflix and Pivotal. This investment by leaders in the Java OSS space provides consumers of rsocket-java with a certain level of confidence that the project has a long life ahead of it, and as such, could feel more comfortable betting their project, and possibly their business of the technology. In contrast, it is uncertain if rsocket-js has a clear set of core maintainers, a defined road map, or is being used by any large companies.

### rsocket-rpc-js

rsocket-rpc-js is an abstraction library which consumes rsocket-js, and in practical terms, is likely the interface that most applications or developers would consume when working with RSocket in JavaScript.

> [rsocket-rpc-js](https://github.com/rsocket/rsocket-rpc-js) - "The Standard RPC implementation for RSocket" in JavaScript.

In addition to exposing the reactive streams implementation behind service interfaces that will be familiar to traditional OOP programmers, the library also ties in nicely with RSocket message brokers that facilitate message routing, which can core to any distributed messaging system.

#### Opinionated

RPC style client and server implementations are generally opinionated about the interfaces they expose and how messages are framed/formatted.

In contrast to a restful API where you might consume a User resource by invoking an HTTP GET request to `/users/1`, where `1` is the user ID, in an RPC API it would more common to invoke a HTTP POST request to `/UserService/GetUserById` and include in the request body the ID of the user `{ "userId": 1 }`. rsocket-rpc-js encourages these types of RPC patterns and interfaces. A method following this pattern could have a signature similar to the following: `getUserById(Number: id): Single<User>`.

#### Tooling

**Opinionated APIs and specifications empowers tooling** to be built which further standardizes integrations without requiring developers to work around new ideas that present their own unique challenges. For instance, because rsocket-rpc-js and other RSocket RPC implementations follow an established spec, it is possible to generate source code for clients, servers, and message payloads in a number of languages by leveraging common tools and interchange formats such as protoc and protobuf.

An example of consuming a generated client service produced by protoc when combined with the [rsocket-rpc-protobuf protoc plugin](https://github.com/rsocket/rsocket-rpc-js/tree/master/rsocket-rpc-protobuf) would be similar to the below:

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

In the above example a service has been implemented that exposes a method that utilizes the "Request Response" flow (review the list of flows on the [rsocket.io website](https://rsocket.io/docs/Protocol#stream-sequences-and-lifetimes)), and this `helloServiceClient` implementation can be generated by protoc when given a protobuf defintion such as:

```protobuf
syntax = "proto3";

service HelloService {
    rpc SayHello (HelloRequest) returns (HelloResponse) {}
}

message HelloRequest {
    string name = 1;
}

message HelloResponse {
    string message = 1;
}
```

#### Platforms

In addition to promoting the creation of tooling, a standardized opinionated specification also supports the creation of platform services and solutions, such as [netifi](https://www.netifi.com/), which is a language agnostic broker for RSocket that aims to solve many of the common service mesh orchestration challenges.

### rsocket-flowable

[rsocket-flowable](https://github.com/rsocket/rsocket-js/blob/master/docs/03-flowable-api.md) provides an implementation for Reactive Streams in JavaScript, and is deeply ingrained into both rsocket-js and rsocket-rpc-js. Learning the rsocket-flowable API, and what it means to work with Reactive libraries and paradigms is going to be paramount to successfully working rsocket-js and rsocket-rpc-js.

If you are familiar with [RxJS](https://github.com/ReactiveX/rxjs), then rsocket-flowable will likely feel familiar to you. If you are not familiar with RxJS, or reactive programming paradigms, then you could experience a somewhat steep learning curve.

## What to Expect Next

While the bulk of ongoing development appears to be centered around the Java and C++ implementations of RSocket, it is my hope that the JavaScript implementation will continue to receive updates and additions to meet the full RSocket spec, but only time will tell.

If you are passionate about RSocket and a seasoned JavaScript developer, now may be a good time to get involved with the project to leave your mark and assist in its continuity. If contributing to the project is not your cup of tea, then sharing this article amd RSocket with your friends, coworkers, and on your social networks would be a great way to increase RSocket's visibility in the JavaScript community.

Drop me a comment below, or tweet me on Twitter and let me know if this is the first you are hearing of RSocket, or if you are also closely watching its development, as I am.
