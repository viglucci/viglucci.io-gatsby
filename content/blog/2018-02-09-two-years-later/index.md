---
title: Two Years Later
date: "2018-02-09T00:00:11.0000Z"
description: "A reflection on the past two years since the repository for this blog was created."
---

When I sat down this evening to write this post I really didn't think it would be special in any kind of way, or really be anything more than a skeleton of a post so I could once again see Jenkins do all of the automated things I've seen it do hundreds of times before, however, it quickly gained a significance that I never intended.

That trait being that this post marks almost exactly the two year anniversary from when I first checked in to git the first lines of code for this repository.

Anyways...

I sat down to write this because I noticed that my "Hello World" post mentions that this blog exists as an exercise for deploying to GitHub pages, but that has changed and this blog is no longer hosted on GitHub pages, and this post shall hereby serve the purpose of briefly outlining the changes it has undergone.

### Changelog

* No longer deployed to GitHub pages
* Now deployed to AWS Elastic Beanstalk
* Dockerized using Multistage Builds
* Automated builds using Jenkins
* Automated deployments using Jenkins
* Updated deployment/build scripts to use ES6 syntax
* Replaced promise usage with async/await in deployment/build scripts

### Final Thoughts

If you are reading this post, then that means that Jenkins once again has done its job of building a new Docker image after being triggered by GitHub, pushed the new Docker image to AWS ECR., created a new AWS EBS application version, and deployed that application version to an existing EBS environment, and that I am patting myself on the back for putting all of the legos together in the correct places to make it happen.

Finally, if any of the above made you scratch your head and wonder how that is done, I recommend you check out the wonderful series by [Chris Fidao](https://twitter.com/fideloper), [Shipping Docker](https://shippingdocker.com), which is where I learned most of it, and which I still refer to as a resource on Docker or AWS services.

Cheers
