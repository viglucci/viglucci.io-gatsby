---
title: Testing Redis Clients in NodeJS with Testcontainers Node
slug: testing-redis-clients-in-nodejs-with-testcontainers-node
date: "2021-03-04T00:00:00.000Z"
description: "Write unit tests that consume a real Redis with Testcontainers Node and Docker."
ogimage: "./testing-redis-clients-in-nodejs-with-testcontainers-og.jpg"
twitterimage: "./testing-redis-clients-in-nodejs-with-testcontainers-twitter.jpg"
---

Automated testing is an essential aspect of ensuring the quality of any software product. However, it can often be challenging to test systems that rely on databases or other external resources.

Luckily, [Testcontainers](https://www.testcontainers.org/) is a great project that makes setting up external resources more comfortable by providing a programmatic interface to run Docker containers in testing scenarios. In this article, we'll be looking at a community port of Testcontainers for NodeJS ([testcontainers-node](https://www.npmjs.com/package/testcontainers)), and how we can run tests that rely on both a single Redis and a Redis Cluster.

The examples below will leverage [mocha](https://www.npmjs.com/package/mocha) as a test runner, [chai](https://www.npmjs.com/package/chai) as an assertion library, and [ioredis](https://github.com/luin/ioredis) as our backing Redis client.

Before you go any further, you can skip this article altogether and go straight to some [working examples on GitHub](https://github.com/viglucci/testcontainers-node-redis-example) if that's more your style.

## Testing against a single Redis

Testing against a single Redis instance is exceptionally straightforward.

First, we will define a `describe` block with a `before` hook. In our `before` hook, we will create our Docker container that will run Redis, and we will also make our Redis client instance. The `before` hook is run before any tests are invoked.

```js
const Redis = require("ioredis");
const { GenericContainer } = require("testcontainers");

describe("RedisTest", () => {
  let container;
  let redisClient;

  before(async () => {
    // "redis" is the name of the Docker imaage to download and run
    container = await new GenericContainer("redis")
      // exposes the internal Docker port to the host machine
      .withExposedPorts(6379)
      .start();

    redisClient = new Redis({
      host: container.getHost(),
      // retrieves the port on the host machine which maps
      // to the exposed port in the Docker container
      port: container.getMappedPort(6379),
    });
  });
});
```

Once we have our Docker container and Redis client created, we will define an `after` hook to clean up the resources created in the `before` hook. The `after` hook is called when all tests are done executing.

```js
const Redis = require("ioredis");
const { GenericContainer } = require("testcontainers");

describe("RedisTest", () => {
  let container;
  let redisClient;

  before(async () => { ... });

  after(async () => {
    await redisClient && redisClient.quit();
    await container && container.stop();
  });
});
```

Now that our Docker container and Redis client are created, we can write a test that will invoke a command against the running Redis.

```js
const Redis = require("ioredis");
const { GenericContainer } = require("testcontainers");
const { expect } = require("chai");

describe("RedisTest", () => {
  let container;
  let redisClient;

  before(async () => { ... });

  after(async () => { ... });

  it("should set and retrieve values from Redis", async () => {
    await redisClient.set("key", "val");
    expect(await redisClient.get("key")).to.equal("val");
  });
});
```

Putting it all together, we now have a test that can invoke commands against a running Redis instance and perform assertions on the results.

```js
const Redis = require("ioredis");
const { GenericContainer } = require("testcontainers");
const { expect } = require("chai");

describe("RedisTest", () => {
  let container;
  let redisClient;

  before(async () => {
    // "redis" is the name of the Docker imaage to download and run
    container = await new GenericContainer("redis")
      // exposes the internal Docker port to the host machine
      .withExposedPorts(6379)
      .start();

    redisClient = new Redis({
      host: container.getHost(),
      // retrieves the port on the host machine which maps
      // to the exposed port in the Docker container
      port: container.getMappedPort(6379),
    });
  });

  after(async () => {
    await redisClient && redisClient.quit();
    await container && container.stop();
  });

  it("should set and retrieve values from Redis", async () => {
    await redisClient.set("key", "val");
    expect(await redisClient.get("key")).to.equal("val");
  });
});
```

## Testing against a Redis Cluster

Testing against a Redis Cluster can be a bit more complicated than against a single Redis. This is primarily because the Docker container's local network will not map to the same IP and ports as on the host machine. Still, luckily the ioredis library supports the needed configuration to make it possible.

Using our `before` hook from the previous example, we will need to make a few small changes to run a Redis cluster rather than a single Redis in our Docker container. These changes include:

- Changing our Redis Docker image to `grokzen/redis-cluster`.
- Creating a Docker network.
- Creating a list of Redis nodes to connect to.
- Create a [NAT](https://en.wikipedia.org/wiki/Network_address_translation) map to map from the internal Docker network to the host network.

It is necessary to create a NAT map as once our backing Redis client is connected to any node in the cluster; it will attempt to auto-discover any other nodes that belong to the cluster. Unfortunately, when the client discovers new nodes, the nodes will be referenced by local addresses to the Docker container rather than the host machine. Our NAT map will allow the client to properly connect to map the internal Docker address to an available address on the host machine.

```js
const Redis = require("ioredis");
const { GenericContainer, Network, Wait } = require("testcontainers");

describe("RedisTest", () => {
  let container;
  let network;
  let redisClient;

  before(async () => {

    // "grokzen/redis-cluster" exposes 6 Redis nodes
    // on ports 7000 - 7005
    const ports = [
      7000, 7001, 7002,
      7003, 7004, 7005
    ];

    // we create a new Docker network so that we have a consistent way
    // to retrieve the internal addresses of the Redis nodes to build
    // the NAT map
    network = await new Network().start();

    // "grokzen/redis-cluster" is the name of the Docker
    // image to download and run
    container = await new GenericContainer("grokzen/redis-cluster")
      // exposes each of the internal Docker ports listed
      // in `ports` to the host machine
      .withExposedPorts(...ports)
      .withNetworkMode(network.getName())
      .withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
      .start();

    const networkIpAddress = container.getIpAddress(network.getName());

    const dockerHost = container.getHost();
    const hosts = ports.map((port) => {
      // { host: "localhost", port: 55305 }
      return { host: dockerHost, port: container.getMappedPort(port) };
    });

    /**
     * {
     *   "192.168.16.2:7000": { host: "127.0.0.1", port: 55305 }",
     *   "192.168.16.2:7001": { host: "127.0.0.1", port: 55306 }",
     *   ...
     * }
     */
    const natMap = ports.reduce((map, port) => {
      const hostPort = container.getMappedPort(port);
      const internalAddress = `${networkIpAddress}:${port}`;
      map[internalAddress] = { host: dockerHost, port: hostPort };
      return map;
    }, {});

    redisClient = new Redis.Cluster(hosts, { natMap });
  });
});
```

With our Redis cluster container running and our `Redis.Cluster` client created, we now need to make sure we remember to add our newly created `network` resource to our `after` hook.

```js
const Redis = require("ioredis");
const { GenericContainer, Network, Wait } = require("testcontainers");

describe("RedisTest", () => {
  let container;
  let network;
  let redisClient;

  before(async () => { ... });

  after(async () => {
    await redisClient && redisClient.quit();
    await container && container.stop();
    await network && network.stop();
  });
});
```

Everything from this point forward is the same as consuming a single Redis. You can see it all put together below.

```js
const Redis = require("ioredis");
const { GenericContainer, Network, Wait } = require("testcontainers");
const { expect } = require("chai");

describe("RedisClusterTest", () => {
  let container;
  let network;
  let redisClient;

  before(async () => {

    // "grokzen/redis-cluster" exposes 6 Redis nodes
    // on ports 7000 - 7005
    const ports = [
      7000, 7001, 7002,
      7003, 7004, 7005
    ];

    // we create a new Docker network so that we have a consistent way
    // to retrieve the internal addresses of the Redis nodes to build
    // the NAT map
    network = await new Network().start();

    // "grokzen/redis-cluster" is the name of the Docker
    // image to download and run
    container = await new GenericContainer("grokzen/redis-cluster")
      // exposes each of the internal Docker ports listed
      // in `ports` to the host machine
      .withExposedPorts(...ports)
      .withNetworkMode(network.getName())
      .withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
      .start();

    const networkIpAddress = container.getIpAddress(network.getName());

    const dockerHost = container.getHost();
    const hosts = ports.map((port) => {
      // { host: "localhost", port: 55305 }
      return { host: dockerHost, port: container.getMappedPort(port) };
    });

    /**
     * {
     *   "192.168.16.2:7000": { host: "127.0.0.1", port: 55305 }",
     *   "192.168.16.2:7001": { host: "127.0.0.1", port: 55306 }",
     *   ...
     * }
     */
    const natMap = ports.reduce((map, port) => {
      const hostPort = container.getMappedPort(port);
      const internalAddress = `${networkIpAddress}:${port}`;
      map[internalAddress] = { host: dockerHost, port: hostPort };
      return map;
    }, {});

    redisClient = new Redis.Cluster(hosts, { natMap });
  });

  after(async () => {
    await redisClient && redisClient.quit();
    await container && container.stop();
    await network && network.stop();
  });

  it("should set and retrieve values from the Redis cluster", async () => {
    await redisClient.set("key", "val");
    expect(await redisClient.get("key")).to.equal("val");
  });
});
```

Now that you are testing your applications with greater confidence using containers don't forget to let me know if you found this article helpful! I appreciate every like, comment, or question you may have to offer!
