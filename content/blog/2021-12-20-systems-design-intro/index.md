---
title: System Design Interviews for Beginners
slug: system-design-interviews-for-beginners
date: "2021-12-20T00:00:00.000Z"
description: "A high level introduction to navigating a system design interview for beginners"
ogimage: "./how-to-polyfill-buffer-with-webpack-5-og-image.jpg"
twitterimage: "./how-to-polyfill-buffer-with-webpack-5-twitter.jpg"
---

This article will overview, at a high level, practices and areas to focus on when navigating a systems design interview. I expect this information to be most helpful to engineers in the 1 - 3 years of experience range, or those who have never done a systems design interview.

Lastly, this article is expected to be used as a jumping off point, and readers will likely need to leverage other resources to dig deeper into the referenced concepts and terms. 

## What you can expect

The shape of a system design interview will likely depend heavily on the company you are interviewing with and the level of the role you have applied for. For instance, an intern, or an associate level candidate might be asked to diagram how multiple classes or modules in a system would interact with each other, where a more experienced candidate might be asked to design an entire distributed system.

### Whiteboarding

These interviews are generally conducted in a "whiteboard" style, where the interviewer will ask the candidate to present their answer as a diagram. Before the increased prevelance of remote work, this would be conducted on a physical whiteboard, however, as more of the engineering workforce moves to remote work, these interviews are more commonly being conducted with tools like [Excalidraw](https://excalidraw.com), [tldraw](https://www.tldraw.com/), [diagrams.net](https://app.diagrams.net/), and similar online whiteboarding tools. Ideally, the employer will let you know which tools they use for their interviews, and I highly recommend familiarizing yourself with the tool ahead of time. If the employer doesn't let you know which tool they expect you to use, don't fret, the interviewer shouldn't be grading your proficiency with using the tool.

### Questions

System design questions are generally focused on the candidates ability to either talk about a system they've already worked in, or to conceptualize the design of a theoretical system.

Examples of questions that I've seen asked, other's have been asked, or that I've asked myself:

- Can you describe a system you've worked in recently?
- How would you design TikTok?
- How would you design the system for a parking garage?
- How would you design Instagram?
- How would you design a blog?

An interviewer might ask you a question specific to the domain that they operate in, so it wouldn't hurt to understand some of the complexities of their industry. However, it is just as likely that a interviewer will ask you a totally generic question, so try not to deep dive too heavily on specialized solutions during your preperation.

## A system you've worked in recently

Generally speaking, its expected that asking a candidate to talk about something they've recently worked in should be somewhat of a "softball" question. However, from recent experience, I've found this question can seem to throw some candidates off. As such, I wanted to take a quick aside and touch more deeply on the "Can you describe a system you've worked in recently?" line of questioning.

In my opinion, this question does a great deal to help an interviewer understand how a candidate thinks about the systems they are working in, and how the invidual components they work on fit into the overall system.

I highly recommend if you are preparing for a system design interview, to take some time and try and answer this question yourself. Draw out the system you are currently working in, and try to identify the components or areas that are undefined or unknown to you. During an interview you'll need to consider all of the components of a system, not just the one or two components you maintain.

If your experiences have been more confined to one or two components of a system, do your best to describe this to your interviewer, and they hopefully won't hold it against you. Additionally, if this happens, and the interviewer doesn't move on to a new question, make sure to be specific about where your knowledge of the system you worked in ends. Don't try to guess or make things up on the fly.

## Seek out the customer

A system is only useful if it serves a customer need.

### Identify the customer

A "customer" is any user of the system. These customers could be the actual human being using the mobile app that interacts your system, or it could be other services inside of a companies microservices architecture. As the designer of a system, you will need to ask yourself; "who is my customer?".

In your answer to a system design interview question, it will be important that you identify who the primary customer of the system is, and what requirements those customers have of the system. This can be accomplished by simply asking the interviewer; "Who is the primary customer of this system?".

Additionally, this can be accomplished by making assumptions based on statements from the interviewer. For instance, if the interviewer asks you to "design TikTok", you could assume that the customer is users all over the globe, primarily interacting with your system using their smart phone. Once you think you know who the primary customer is, you should validate this assumption with the interviewer; "Is it safe to assume that my primary customer is global users who are using a smart phone application?".

### Identify customer needs

The "needs" of the customer can generally be defined as either "functional requirements" or "non-functional requirements". It is very important to identify, and validate with the interviewer, both the functional and non-functional before you start drawing your system/solution.

#### Functional requirements

Generally speaking, you should start by defining the functional requirements of the system, and your interviewer should be receptive to your questions about these requirements. For instance, given the question to "design TikTok", you might ask your interviewer if the below list of functional requirements satisfies the customer need. The interview will likely reply "looks great to me!", and if not, you should try to dig in on what functional requirements you might have missed.

- upload short videos (length <= 3 minutes)
- view a "feed" of videos
- "like" videos
- comment on videos

As you dig into your system design, these functional requirements should also expand to include the actual ways in which they will be satisfied. For example, it would be a good idea to list out the various API endpoints needed to satisfy each requirement, and maybe even which database structures (tables, documents, etc.) might be needed to support those API endpoints. Later on, we'll touch a bit more on when you should go into detail, and when you should leave things vague.

#### Non-functional requirements

Along with functional requirements, non-functional requirements should be identified and vetted with the interviewer before you dig into or decide on a system architecture, or start creating a diagram. These non-functional requirements could include concepts such as:

- High Availability
- Low Latency
- Eventually Consistent (or Strongly Consistent)

When determining which of these are relevant to your system, you should always ask yourself how would this requirement serve or impact your customer (end user). For example, in the question to "design TikTok", you might presume that this system could support an architecture which is "Eventually Consistent". You could argue that it is more important that users are able to quickly access videos in their feed than it is that those videos be the latest or most up to date, and that would suggest that eventual consistency is sufficient.

When making these arguments or assumptions, you should again validate them with your interviewer. If you fail to validate your assumptions, you may be leaving yourself open to a "curveball" later if the interviewer decides to introduce a constraint that is contrary to a assumption you made, and that your design does not support.

In order to validate your assumptions, you may simply pose the question to your interviewer; "Is it safe to assume that it is more important for the video feed to load quickly, than it is for the videos to be the most up to date?".

### Avoid details until necessary

A common misstep when answering system design question is providing more detail than is currently necessary. For example, chances are that the system you are designing is going to require some type of databse or data storage, and you might be eager to blurt out the first database technology that comes to mind, or maybe whichever is your favorite. Avoid doing this. It is perfectly fine to show that the system includes a database, provide no additional details, and move on. If the interviewer is interested in specifics they will likely ask for them, but if they don't ask, try to avoid providing that information just yet.

By avoiding specifics where they aren't yet necessary, you allow yourself flexibility to make this decision later when you potentially have more information, and you avoid showing a potential bias towards a solution or technology that may not fit the requirements of the system. Additionally, if you do make this mistake, and go as far as to state that the database will be a NoSQL database, and even worse, will specifically use Cassandra, you've made a strong indication that you think these technologies would provide significant value to the system, and the interviewer would be well within their rights to go deep on questioning around these technologies.

### Don't showup with a solution

You've likely worked in a few different architectures, and you might even have a favorite design or pattern that you think works best. Experience and opinions are great, but this can be a trap when answering system design questions. It is best to avoid approaching system design interview questions with rigid pre-existing solutions or designs.

For example, if you are a big fan of event driven architectures, and are already set on or fantasizing about how you'll apply this pattern to whichever scenario the interviewer describes, you'll quickly fall short when the functional or non-functional requirements of the system don't lend themselves to the limitations of your predetermined solution.

Rather than showing up with a architecture already in mind, it is best to understand common components and approaches, and where those components can be employed to satisfy different requirements of any given scenario. While this list is by no means conmprehensive, and the best components and approachs to consider will vary based on the scneario, I would recommend understanding what value and tradeoffs are offerred by each of the below.

- Monolith Architecture
- Microservices Architecture
- Serverless/Lambdas
- Database Approaches (Relational, NoSQL, Graph)
- Event/Message Queues
- Load Balancers
- Block/Cloud Storage
- Content Delivery Networks (CDN)

## Next Steps

I hope this article provided you with some insights into what to expect from a systems design interview, and strategies for successfully navigating them. As stated at the beginning, this article likely isn't where your preparation ends, but where it has just started. I highly recommend digging deeper into the above concepts via other resources, and maybe watching a mock system design interview (or ten) to gain broader expsoure to common questions and some suitable approaches.

If you landed on this article while preparing for an upcoming interview, or if someone shared it with you, I wish you the best of luck 😊. Please feel free to leave any questions/comments below, or drop me a Tweet!