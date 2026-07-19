# How to Approach a System Design

System design is an open-ended conversation. You're expected to lead the discussion.

You can use the steps below to guide the discussion. To reinforce this process, use the following steps to work through the system design interview questions and solutions in this chapter.

## Step 1: Outline Use Cases, Constraints, and Assumptions

Gather everything you need and examine the problem. Keep asking questions so you can pin down the use cases and constraints. Discuss assumptions.

Who will use it?
How will they use it?
How many users are there?
What does the system do?
What are the system's inputs and outputs?
How much data do we expect to handle?
How many requests per second do we expect to handle?
What read/write ratio do we expect?

## Step 2: Create a High-Level Design

Sketch out a high-level design using all the important components.

Draw the major components and their connections
Justify your reasoning

## Step 3: Design Core Components

Dive into a detailed analysis of each core component. For example, if you're asked to design a URL shortening service, start discussing:

Generating and storing a hash of the full URL
MD5 and Base62
Hash collisions
SQL or NoSQL
Database schema
Translating a hashed URL back into the full URL
Database lookups
API and object-oriented design

## Step 4: Scale the Design

Identify and address bottlenecks and other limitations. For example, do you need any of the following to handle scalability concerns?

Load balancing
Horizontal scaling
Caching
Database sharding
Discuss possible solutions and their trade-offs. Everything involves a trade-off. You can apply scalable system design principles to address bottlenecks.
