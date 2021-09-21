---
title: How to polyfill Buffer with Webpack 5
slug: how-to-polyfill-buffer-with-webpack-5
date: "2021-09-20T00:00:00.000Z"
description: "How to polyfill the Node.js Buffer API for usage in browser environments with Webpack 5."
ogimage: "./how-to-polyfill-buffer-with-webpack-5-og-image.jpg"
twitterimage: "./how-to-polyfill-buffer-with-webpack-5-twitter-image.jpg"
---

[Buffer](https://nodejs.org/api/buffer.html) is a core Node.js API useful when working with binary data. This article will briefly overview how to polyfill the Buffer API for browser environments with Webpack 5.

### Why do we need to polyfill Buffer?

When working in the context of a browser environment, Node.js APIs, such as [Buffer](https://nodejs.org/api/buffer.html), aren't available. There are sometimes comparable APIs available in the browser environment. However, the author of 3rd party libraries and code you may be using would have had to either replace the Node.js specific APIs they are using with the browser versions or provide another mechanism to provide your API to satisfy the libraries' need.

Unfortunately, library authors often do not consider browser environments, or their library may not have been intended to be used in a browser environment. In these cases, it is popular to use a build tool such as Webpack to replace the Node.js specific APIs used by the library with a version that provides a browser environment compatible API, known as [polyfilling](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill).

### Webpack v5

Before Webpack v5, the polyfilling of many Node.js APIs would be performed automatically. With v5, [Webpack will no longer polyfill Node.js APIs](https://webpack.js.org/blog/2020-10-10-webpack-5-release/#automatic-nodejs-polyfills-removed) automatically.

### Solving the Problem

#### Install a polyfill

First, we will need to install or otherwise provide a browser-compatible Buffer implementation. For my needs, I have found the [feross/buffer](https://www.npmjs.com/package/buffer) package to be suitable.

The below command will install `buffer` as a `dev` dependency.

```
npm install -D buffer
```

#### Configure Webpack Fallback

The Webpack `resolve.fallback` configuration option allows us to configure Webpack to leverage the provided package as a "fallback" for APIs which are not natively available in the target environments that Webpack is building for (ie, a Browser).

```js
const webpackConfig = {
    ...
    resolve: {
        ...
        fallback: {
            buffer: require.resolve('buffer/'),
        },
    },
};
```

The `/` at the end of `buffer/` may appear strange to you, as it did to me. However, it is recommended by the [`buffer` documentation](https://www.npmjs.com/package/buffer#usage) because the Node.js module lookup algorithm works.

> To require this module explicitly, use require('buffer/') which tells the node.js module lookup algorithm (also used by browserify) to use the npm module named buffer instead of the node.js core module named buffer!

#### Configure Webpack `ProvidePlugin`

The Webpack `ProvidePlugin` provides a mechanism for injecting a module/value as a replacement/API for global variables that would otherwise be undefined. For instance, in Node.js you can leverage the `Buffer` class from the global namespace without any `import` or `require` statements. The' Buffer' class would be' undefined in a browser environment and without the `ProvidePlugin.`

```js
new Buffer();

Uncaught ReferenceError: Buffer is not defined
    at <anonymous>:1:1
```

We can provide a compatible implementation of the `Buffer` class via the Webpack configuration `plugins` array to overcome this.

```js
const webpackConfig = {
    ...
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ]
};
```

The provided array (`['buffer', 'Buffer']`) informs the `webpack.ProvidePlugin` to set the global value of `Buffer` to the `Buffer` export from the `buffer` package.

For example:

```js
const Buffer = require('buffer/').Buffer;
```

#### All together

Below is an example of the combined relevant parts of your Webpack configuration to polyfill the `Buffer` class using Webpack v5.

```js
const webpackConfig = {
    resolve: {
        fallback: {
            buffer: require.resolve('buffer/'),
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
};
```

## Conclusion

Now that you've configured Webpack to polyfill the `Buffer` class globally, you should be able to reference and create an instance of the `Buffer` class without the pesky `Uncaught ReferenceError: Buffer is not defined` error. Additionally, any reference to `Buffer` in libraries included in your "bundle" should now also reference the provided polyfill.

Lastly, don't forget to let me know in the below comments (or on Twitter) if this tutorial helped you in any way!