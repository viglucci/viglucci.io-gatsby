---
title: Package a oclif cli for Windows with GitHub actions
slug: build-and-deploy-a-oclif-cli-on-github-actions
date: "2022-02-21T00:00:00.000Z"
description: "How to use GitHub actions to build and deploy your oclif CLI application"
ogimage: "./intro-to-system-design-interviews-social-image.jpg"
twitterimage: "./intro-to-system-design-interviews-social-image.jpg"
---

This article will provide an overview of how you can build and deploy an [oclif](https://oclif.io/) application via GitHub Actions.

## A quick overview

### oclif

"The Open CLI Framework" ([oclif](https://oclif.io/)) is a open source framework for building CLI (command line interface) applications with familiar technologies such as Node.js, JavaScript, and TypeScript.

### GitHub Actions

[GitHub actions](https://docs.github.com/en/actions) is a CI/CD solution provided directly from GitHub that allows you to run automation tasks based on various "events" that occur on repositories hosted on github.com.

## Releasing a oclif application

oclif is especially appealing when you wish to produce binaries that will work natively on multiple operating systems. This support is provided through a number of commands available on the `oclif` CLI. You can learn about this in more detail in the ["Release" section](https://oclif.io/docs/releasing) on the oclif documentation website, but we'll give a brief overview of the strategies below.

### NPM

Because oclif is built around node.js and npm, an oclif app can be published directly to npm using the standard `npm publish` command. This strategy allows existing node.js and npm users to easily install your application globally using the `npm install -g <app_name>` command.

For public projects, or projects where the target user base is expected to already have node.js and npm installed, this strategy is likely sufficient and the most straight forward. Where this strategy will not be as appealing is when you do not intend to distribute your application publicly, or users can not be expected to have already installed node.js and npm.

### Standalone Tarballs

For projects where you can not expect users to install node.js and npm, oclif provides functionality for producing builds that will output as standalone tarballs, and the standalone tarball builds can be produced for multiple supported operating systems. For the sake of this article, we will be working to produce an installable Windows executable, but you can review the complete list in the ["Release" section](https://oclif.io/docs/releasing) on the oclif documentation website.

## Building with GitHub Actions

GitHub actions are capable of running tasks and commands on a repository in response to events. One of the events that is possible to target is the "release published" event, which is what we will use to kick off our builds.

### GitHub Releases

Releases on GitHub allow you to document and communicate meaningful milestones for your project, as well as distribute "artifacts" related to those releases. To view the releases for a repository on GitHub, you can visit the releases page at `github.com/REPOSITORY_NAME/releases`, or click the "releases" header in the right hand sidebar of the repositories index page.

![GitHub releases header example image](./)
