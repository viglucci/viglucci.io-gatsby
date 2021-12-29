---
title: Introduction to System Design Interviews
slug: introduction-to-system-design-interviews
date: "2021-12-20T00:00:00.000Z"
description: "What to expect when navigating a system design interview, and tips for success."
ogimage: "./intro-to-system-design-intreivew-social-image.jpg"
twitterimage: "./intro-to-system-design-intreivew-social-image.jpg"
---

This article will overview practices and areas to focus on when navigating a systems design interview at a high level. I expect this information to be most helpful to engineers in the 1 - 3 years of experience range or those who have never done a systems design interview.

Lastly, this article is expected to be used as a jumping-off point, and readers will likely need to leverage other resources to dig deeper into the referenced concepts and terms.

## What you can expect

The shape of a system design interview will likely depend heavily on the company you are interviewing with and the level of the role you have applied for. For instance, an intern or an associate-level candidate might be asked to diagram how multiple classes or modules in a system would interact with each other. In contrast, a more experienced candidate might be asked to design an entire distributed system.

### Whiteboarding

These interviews are generally conducted in a "whiteboard" style, where the interviewer will ask the candidate to present their answer as a diagram. Before the increased prevalence of remote work, this would be conducted on a physical whiteboard; however, as more of the engineering workforce moves to remote work, these interviews are more commonly being performed with tools like [Excalidraw](https://excalidraw.com), [tldraw](https://www.tldraw.com/), [diagrams.net](https://app.diagrams.net/), and similar online whiteboarding tools. Ideally, the employer will let you know which tools they use for their interviews, and I highly recommend familiarizing yourself with the tool ahead of time. If the employer doesn't let you know which tool they expect you to use, don't fret, the interviewer shouldn't be grading your proficiency with using it.

### Questions

System design questions generally focus on the candidates' ability to either talk about a system they've already worked in or how they would solve a theoretical scenario.

Examples of questions that I've been asked, others have been asked, or that I've asked myself:

- Can you describe a system you've worked in recently?
- How would you design the backend for a social media app?
- How would you design the system for a parking garage?
- How would you design an e-commerce site?
- How would you design the content management system for a large blog?

An interviewer might ask you a question specific to the domain they operate in, so it wouldn't hurt to understand some of the complexities of their industry. However, it is just as likely that an interviewer will ask you a generic question, so try not to deep dive too heavily into specialized solutions during your preparation.

## Prepare for the interview

The systems design interview can and should be something you deliberately prepare for like any other interview.

An easy way to practice systems design is to diagram the system you are currently working in and identify the components or areas that are undefined or unknown to you. This exercise should help you identify additional areas of preparation. For instance, your system may use a specific type of database or leverage AWS S3 for block storage. Do you know why the particular database technology was chosen or the benefits of block storage? Looking into these topics more deeply should be part of your interview preparation.

If the system you are currently working in isn't very complex or exciting, you may be at a slight disadvantage when designing a system from scratch. If this applies to you, it is recommended to spend time trying to answer some of the example questions above, watch mock systems design interviews on platforms like YouTube, and even ask your friends or trusted colleagues to run a mock interview with you.

## Seek out the customer

A system is only helpful if it serves a customer's needs.

### Identify the customer

A "customer" is any user of the system. These customers could be the actual human being using the mobile app that interacts with your design or other services inside a company's microservices architecture. As the system designer, you will need to ask yourself, "who is my customer?".

In your answer to a system design interview question, it will be vital that you identify who the primary customer of the system is and what requirements those customers have of the system. You can accomplish this by simply asking the interviewer, "Who is the primary customer of this system?".

Additionally, you can accomplish this by making assumptions based on statements from the interviewer. For instance, if the interviewer asks you to "design TikTok," you could assume that the customer is users all over the globe, primarily interacting with your system using their smartphone. Once you think you know who the primary customer is, you should validate this assumption with the interviewer; "Is it safe to assume that my primary customer is global users who are using a smartphone application?".

### Identify customer needs

The "needs" of the customer can generally be defined as either "functional requirements" or "non-functional requirements." It is imperative to identify and validate requirements with the interviewer, both functional and non-functional before you start drawing your system/solution.

#### Functional requirements

Generally speaking, you should start by defining the system's functional requirements, and your interviewer should be receptive to your questions about these requirements. For instance, given the question to "design TikTok," you might ask your interviewer if the below list of functional requirements satisfies the customer's need. The interviewer will likely reply, "looks great to me!" and if not, you should try to dig in on what functional requirements you might have missed.

- upload short videos (length <= 3 minutes)
- view a "feed" of videos
- "like" videos
- comment on videos

As you dig into your system design, these functional requirements should also expand to include the fundamental ways they will be satisfied. For example, it would be a good idea to list out the various API endpoints needed to satisfy each requirement and maybe even which database structures (tables, documents, etc.) might be required to support those API endpoints. Later on, we'll touch a bit more on when you should go into detail and leave things vague.

#### Non-functional requirements

Along with functional requirements, non-functional requirements should be identified and vetted with the interviewer before you dig into or decide on system architecture or start creating a diagram. These non-functional requirements could include concepts such as:

- High Availability
- Low Latency
- Eventually Consistent (or Strongly Consistent)

When determining which of these are relevant to your system, you should always ask yourself how this requirement would serve or impact your customer (end-user). For example, in the question to "design TikTok," you might presume that this system could support an architecture that is "Eventually Consistent." You could argue that it is more important that users can quickly access videos in their feed than those videos are the latest or most up-to-date, suggesting that eventual consistency is sufficient.

When making these arguments or assumptions, you should again validate them with your interviewer. If you fail to validate your assumptions, you may be leaving yourself open to a "curveball" later if the interviewer decides to introduce a constraint contrary to an assumption you made and that your design does not support.

To validate your assumptions, you may pose the question to your interviewer; "Is it safe to assume that it is more important for the video feed to load quickly than it is for the videos to be the most up to date?".

### Knowing the appropriate level of detail

A common misstep when answering system design questions is when you provide too much or too little detail. Knowing and ascertaining the correct level of detail expected from your interviewer can be vital to answering your question correctly and sufficiently. Remember that interviews are a two-way conversation between the candidate and the interviewer, and becoming comfortable asking these questions will make you more successful. When describing a particular component of the system, take a moment to pause and ask your interviewer, "is this the level of detail you were expecting, or would you like me to give more or less?". 

For example, prematurely giving too much detail can hinder you, especially when digging deep on a particular portion of the system in a sufficiently more detailed way than others. For example, the chances are that the system you are designing will require some database or data storage, and you might be eager to blurt out the first database technology that comes to mind, or maybe whichever is your favorite. Unless you've established with the interviewer that they are interested in these finer details, try your best to avoid doing this. If you feel the urge to recommend a specific solution, be sure to confirm with the interviewer if they would like those details at that time, but it can also be advantageous to defer that decision.

By avoiding specifics where they aren't yet necessary, you allow yourself the flexibility to make this decision later when you potentially have more information. You also avoid showing a potential bias towards a solution or technology that may not fit the system's requirements. If you do go as far as to state that the database will be a NoSQL database, and even worse, will specifically use Cassandra, you've made a strong indication that you think these technologies would provide significant value to the system. The interviewer would be well within their rights to go deep on questioning these decisions.

### Don't show up with a solution

You've likely worked in a few different architectures, and you might even have a favorite design or pattern that you think works best. Experience and opinions are great, but this can be a trap when answering system design questions. It is best to avoid approaching systems with rigid pre-existing solutions or designs.

For example, suppose you are a big fan of event-driven architectures and are already set on or fantasizing about how you'll apply this pattern to whichever scenario the interviewer describes. In that case, you'll quickly fall short when the functional or non-functional requirements of the system don't lend themselves to the limitations of your predetermined solution.

Rather than showing up with an architecture already in mind, it is best to understand standard components and approaches and where they can be employed to satisfy different requirements of any given scenario. While the list below is not comprehensive, and the best components and approaches will vary heavily based on the system, it is recommended to understand where each offers value and which tradeoffs they present. These topics are likely to be expected knowledge for mid-level and higher backend engineering interviews.

- Vertical vs. Horizontal Scaling
- Monolith vs. Microservices Architecture
- Database Approaches (Relational, NoSQL, Graph)
- Event/Message Queues
- Load Balancers
- Block/Cloud Storage
- Content Delivery Networks (CDN)
- Serverless/Lambdas

## Next Steps

I hope this article gave you some insights into what to expect from a systems design interview and strategies for successfully navigating them. As stated at the beginning, this article likely isn't where your preparation ends but where it has just started. I highly recommend digging deeper into the above concepts via other resources and watching a mock system design interview (or ten) to gain broader exposure to common questions and suitable approaches.

If you landed on this article while preparing for an upcoming interview, or if someone shared it with you, I wish you the best of luck 😊. Please feel free to leave any questions/comments below, or drop me a Tweet!

