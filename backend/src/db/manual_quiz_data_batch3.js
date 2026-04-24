import pool from "./index.js";

const quizData = [
  {
    topic_id: 13, // Fundamentals of System Design
    questions: [
      { q: "What is 'Scalability' in system design?", o: {A: "The ability to handle increasing amounts of work by adding resources", B: "The speed of a single request", C: "The security of the network", D: "The cost of the servers"}, c: "A", e: "Scalability ensures a system can grow to meet demand." },
      { q: "What is 'Vertical Scaling'?", o: {A: "Adding more servers to the cluster", B: "Increasing the power (CPU, RAM) of an existing server", C: "Moving servers to a higher floor", D: "Using a faster database"}, c: "B", e: "Vertical scaling (scaling up) has hardware limits and a single point of failure." },
      { q: "What is 'Horizontal Scaling'?", o: {A: "Buying a bigger CPU", B: "Adding more machines to your pool of resources", C: "Connecting servers with longer cables", D: "Optimizing code logic"}, c: "B", e: "Horizontal scaling (scaling out) is generally more flexible and resilient." },
      { q: "What does 'High Availability' mean?", o: {A: "The system is very fast", B: "The system remains operational for a long time without downtime", C: "The system is accessible globally", D: "The system uses many databases"}, c: "B", e: "Availability is often measured in 'nines' (e.g., 99.99%)." },
      { q: "What is a 'Single Point of Failure' (SPOF)?", o: {A: "The fastest part of the system", B: "A part of the system that, if it fails, stops the entire system from working", C: "A user who enters wrong data", D: "A bug in the UI"}, c: "B", e: "Redundancy is used to eliminate SPOFs." },
      { q: "What does 'Latency' measure?", o: {A: "The number of requests per second", B: "The time it takes for data to travel from source to destination", C: "The storage capacity", D: "The number of users"}, c: "B", e: "Lower latency means a more responsive system." },
      { q: "What is 'Throughput'?", o: {A: "The delay in processing", B: "The amount of work/data processed in a given time period", C: "The weight of the server", D: "The security level"}, c: "B", e: "Throughput is often measured in requests per second (RPS)." },
      { q: "What is the 'CAP Theorem' components?", o: {A: "Caching, Availability, Performance", B: "Consistency, Availability, Partition Tolerance", C: "Concurrency, Accuracy, Persistence", D: "CPU, Arch, Power"}, c: "B", e: "CAP states a distributed system can only provide 2 of the 3 guarantees." },
      { q: "What is 'Reliability'?", o: {A: "The system's speed", B: "The probability that a system will perform its function without failure", C: "The cost of maintenance", D: "The number of lines of code"}, c: "B", e: "Reliability is about the system working correctly over time." },
      { q: "What is a 'Load Balancer'?", o: {A: "A tool to increase CPU speed", B: "A device that distributes network traffic across multiple servers", C: "A database backup tool", D: "A security firewall"}, c: "B", e: "Load balancers improve scalability and availability." }
    ]
  },
  {
    topic_id: 14, // Load Balancing and Proxies
    questions: [
      { q: "Which algorithm distributes requests sequentially to each server in a list?", o: {A: "Least Connections", B: "IP Hash", C: "Round Robin", D: "Random"}, c: "C", e: "Round Robin is the simplest load balancing algorithm." },
      { q: "What is a 'Reverse Proxy'?", o: {A: "A proxy used by clients to access the internet", B: "A server that sits in front of web servers and forwards client requests to them", C: "A way to hide a client's IP", D: "A type of database"}, c: "B", e: "Reverse proxies provide security, caching, and load balancing." },
      { q: "What is 'Session Persistence' (Sticky Sessions)?", o: {A: "Keeping a server running forever", B: "Ensuring all requests from a client are sent to the same server during a session", C: "Saving data to a database", D: "Caching images"}, c: "B", e: "Sticky sessions are needed when application state is stored locally on a server." },
      { q: "What is 'Layer 4' Load Balancing based on?", o: {A: "HTTP headers and cookies", B: "IP address and TCP/UDP ports", C: "User login status", D: "Database queries"}, c: "B", e: "L4 balancing is fast as it doesn't look at the application data." },
      { q: "What is 'Layer 7' Load Balancing?", o: {A: "Packet-level balancing", B: "Content-aware balancing (URLs, cookies, headers)", C: "Hardware balancing only", D: "DNS balancing"}, c: "B", e: "L7 balancing allows complex routing based on the actual content of the request." },
      { q: "How does 'Least Connections' algorithm work?", o: {A: "Picks a random server", B: "Sends the request to the server with the fewest active connections", C: "Uses the fastest server", D: "Checks the server's CPU usage"}, c: "B", e: "Least Connections is better for requests that take varying amounts of time." },
      { q: "What is a 'Health Check' in load balancing?", o: {A: "A manual server inspection", B: "Automatic tests to ensure a backend server is responding correctly", C: "Checking user's internet speed", D: "A virus scan"}, c: "B", e: "Traffic is only sent to 'healthy' servers." },
      { q: "What is the primary difference between a Proxy and a Reverse Proxy?", o: {A: "Speed", B: "Proxy protects clients; Reverse Proxy protects servers", C: "Proxies are hardware; Reverse Proxies are software", D: "There is no difference"}, c: "B", e: "Forward proxies hide clients; Reverse proxies hide/protect backends." },
      { q: "What is 'SSL Termination' on a load balancer?", o: {A: "Blocking all HTTPS traffic", B: "Decrypting SSL requests at the load balancer instead of the web servers", C: "Generating new SSL certificates", D: "Encrypting database connections"}, c: "B", e: "Termination reduces the CPU load on individual application servers." },
      { q: "Which tool is commonly used as a high-performance Load Balancer?", o: {A: "React", B: "HAProxy", C: "MongoDB", D: "PostgreSQL"}, c: "B", e: "HAProxy and Nginx are industry standards for load balancing." }
    ]
  },
  {
    topic_id: 15, // Databases at Scale
    questions: [
      { q: "What is 'Database Sharding'?", o: {A: "Creating a backup of the database", B: "Horizontal partitioning of data across multiple database instances", C: "Adding more RAM to the database server", D: "Normalizing the table structure"}, c: "B", e: "Sharding allows a database to handle much larger data sets and traffic." },
      { q: "What is 'Read Replicas' used for?", o: {A: "Scaling write operations", B: "Scaling read operations and providing high availability", C: "Saving storage space", D: "Hiding data from users"}, c: "B", e: "Read-heavy applications use replicas to offload traffic from the primary DB." },
      { q: "What is the 'Primary-Secondary' (Master-Slave) replication model?", o: {A: "All nodes handle reads and writes", B: "One node handles writes; others handle reads and sync from the primary", C: "Servers are selected randomly", D: "Data is only stored on one node"}, c: "B", e: "The Primary is the single source of truth for writes." },
      { q: "What is 'Data Partitioning'?", o: {A: "Deleting old data", B: "Dividing a large dataset into smaller, manageable chunks", C: "Encrypting the database", D: "Changing column names"}, c: "B", e: "Partitioning can be done within a single server or across many (sharding)." },
      { q: "What is a 'NoSQL' database?", o: {A: "A database with no data", B: "Non-relational databases designed for scale and flexible schemas", C: "A database that doesn't use any language", D: "An old type of SQL"}, c: "B", e: "NoSQL (e.g., MongoDB, Cassandra) is often used for massive scale." },
      { q: "What is 'Eventual Consistency'?", o: {A: "Data is immediately consistent across all nodes", B: "Data will become consistent across all nodes given enough time", C: "Data is never consistent", D: "Data is only stored on one node"}, c: "B", e: "Many distributed databases trade immediate consistency for availability." },
      { q: "What is the 'Hot Key' problem in sharding?", o: {A: "A key that is too long", B: "An imbalance where one shard receives significantly more traffic than others", C: "A database that is overheating", D: "A forgotten password"}, c: "B", e: "Poor shard key choice can lead to bottlenecks." },
      { q: "What is 'Vertical Partitioning'?", o: {A: "Dividing rows into different tables", B: "Dividing columns of a table into different tables", C: "Adding more CPUs", D: "Sorting data alphabetically"}, c: "B", e: "Vertical partitioning puts different features/columns in separate DBs." },
      { q: "What does 'ACID' stand for in databases?", o: {A: "Availability, Consistency, Isolation, Durability", B: "Atomicity, Consistency, Isolation, Durability", C: "Accuracy, Concurrency, Indexing, Data", D: "All Columns In Database"}, c: "B", e: "ACID properties ensure reliable database transactions." },
      { q: "Which NoSQL type is best for social network connections?", o: {A: "Key-Value Store", B: "Document Store", C: "Graph Database", D: "Wide-Column Store"}, c: "C", e: "Graph DBs (like Neo4j) excel at managing relationships between entities." }
    ]
  },
  {
    topic_id: 16, // Caching
    questions: [
      { q: "What is the primary purpose of Caching?", o: {A: "To store data permanently", B: "To reduce data access latency and server load", C: "To secure the data", D: "To organize data alphabetically"}, c: "B", e: "Cache stores copies of data in high-speed memory for quick retrieval." },
      { q: "Where can Caching occur in a system?", o: {A: "Only on the server", B: "Only in the database", C: "At multiple levels (Browser, CDN, App, DB)", D: "Only in the CPU"}, c: "C", e: "Multi-level caching provides the best performance benefits." },
      { q: "What is a 'Cache Hit'?", o: {A: "When the cache is full", B: "When requested data is found in the cache", C: "When the cache server crashes", D: "When data is deleted from cache"}, c: "B", e: "A cache hit results in fast data delivery." },
      { q: "What is a 'Cache Miss'?", o: {A: "Deleting the wrong data", B: "When requested data is NOT found in the cache", C: "A slow database query", D: "An error in the UI"}, c: "B", e: "A miss requires fetching data from the slower primary source." },
      { q: "What is 'Cache Invalidation'?", o: {A: "Adding new data to cache", B: "The process of removing or updating stale data from the cache", C: "Hiding the cache", D: "Calculating cache size"}, c: "B", e: "Invalidation is 'one of the two hard things in computer science'." },
      { q: "What is the 'LRU' eviction policy?", o: {A: "Last Recently Used", B: "Least Recently Used", C: "Longest Running User", D: "Least Random Unit"}, c: "B", e: "LRU removes the item that hasn't been accessed for the longest time." },
      { q: "What is 'Write-Through' cache?", o: {A: "Data is written only to the cache", B: "Data is written to the cache and the database simultaneously", C: "Data is written only to the database", D: "Data is written after a delay"}, c: "B", e: "Write-through ensures data consistency but adds write latency." },
      { q: "What is 'CDN' (Content Delivery Network)?", o: {A: "A type of database", B: "A distributed network of proxy servers that cache content close to users", C: "A security firewall", D: "A programming language"}, c: "B", e: "CDNs significantly speed up static asset delivery globally." },
      { q: "What is 'Cache Stampede'?", o: {A: "A very fast cache hit", B: "When many requests hit the system at once for a missing/expired cache key", C: "Too many items in the cache", D: "A type of virus"}, c: "B", e: "Stampedes can overwhelm the backend database." },
      { q: "Which tool is commonly used as a distributed cache?", o: {A: "PostgreSQL", B: "Redis", C: "React", D: "Docker"}, c: "B", e: "Redis and Memcached are the most popular caching solutions." }
    ]
  },
  {
    topic_id: 17, // Message Queues and Event-Driven Design
    questions: [
      { q: "What is the main benefit of using a Message Queue?", o: {A: "To make the system slower", B: "To decouple services and handle asynchronous tasks", C: "To store data forever", D: "To replace the database"}, c: "B", e: "Queues allow services to communicate without waiting for each other." },
      { q: "What is 'Asynchronous Communication'?", o: {A: "Sender and receiver must be online at the same time", B: "Sender sends a message and continues its work without waiting for a response", C: "Real-time chat only", D: "A type of CPU instruction"}, c: "B", e: "Async processing improves user-perceived performance." },
      { q: "Who is the 'Producer' in a message queue system?", o: {A: "The service that consumes the message", B: "The service that creates and sends the message", C: "The database", D: "The user"}, c: "B", e: "Producers add tasks to the queue." },
      { q: "Who is the 'Consumer' in a message queue system?", o: {A: "The service that sends the message", B: "The service that receives and processes the message", C: "The load balancer", D: "The internet provider"}, c: "B", e: "Consumers pull and process tasks from the queue." },
      { q: "What is 'Pub/Sub' (Publish-Subscribe)?", o: {A: "A way to buy software", B: "A pattern where messages are broadcast to all interested subscribers", C: "A type of database query", D: "A security protocol"}, c: "B", e: "Pub/Sub allows one-to-many communication." },
      { q: "What is 'Dead Letter Queue' (DLQ)?", o: {A: "A queue for deleted users", B: "A queue for messages that cannot be processed successfully", C: "A fast queue", D: "A queue for marketing emails"}, c: "B", e: "DLQs help in debugging and handling failed tasks." },
      { q: "What is 'Backpressure' in stream processing?", o: {A: "High water pressure", B: "A signal from consumers to producers to slow down when overwhelmed", C: "A type of server error", D: "Hacking attempt"}, c: "B", e: "Backpressure prevents the system from crashing under heavy load." },
      { q: "What does 'At-least-once delivery' mean?", o: {A: "Message might be lost", B: "Message is guaranteed to be delivered but might be duplicated", C: "Message is delivered exactly one time", D: "Message is delivered to at least one user"}, c: "B", e: "Consumers must handle duplicate messages (idempotency)." },
      { q: "Which tool is a popular distributed streaming platform?", o: {A: "Nginx", B: "Apache Kafka", C: "MySQL", D: "Vite"}, c: "B", e: "Kafka is widely used for high-throughput, fault-tolerant messaging." },
      { q: "What is 'Idempotency'?", o: {A: "Making the system faster", B: "Ensuring an operation can be performed multiple times with the same result as a single time", C: "Deleting redundant data", D: "Encrypting messages"}, c: "B", e: "Idempotency is crucial for safe retries in distributed systems." }
    ]
  },
  {
    topic_id: 18, // Designing Real Systems
    questions: [
      { q: "What is the first step in designing a real-world system?", o: {A: "Writing code", B: "Defining requirements and constraints", C: "Picking a database", D: "Buying servers"}, c: "B", e: "Understanding scale, features, and goals is critical before architecting." },
      { q: "What is 'Rate Limiting'?", o: {A: "Measuring server temperature", B: "Controlling the number of requests a user/IP can make in a given time", C: "Speeding up the internet", D: "Counting database tables"}, c: "B", e: "Rate limiting prevents abuse and ensures fair usage." },
      { q: "What is a 'Microservices' architecture?", o: {A: "One giant application", B: "A system composed of small, independent services communicating over a network", C: "A very small database", D: "A system with only one user"}, c: "B", e: "Microservices allow teams to work and scale independently." },
      { q: "What is a 'Monolith' architecture?", o: {A: "A single, unified unit containing all application logic", B: "A system with no database", C: "A network of many services", D: "A type of stone"}, c: "A", e: "Monoliths are easier to start with but harder to scale and maintain as they grow." },
      { q: "What is 'Database Denormalization'?", o: {A: "Organizing data to remove redundancy", B: "Adding redundant data to a database to speed up read queries", C: "Deleting the database", D: "Changing table names"}, c: "B", e: "Denormalization trades write complexity/storage for read performance." },
      { q: "What is the purpose of 'API Gateway'?", o: {A: "To store user passwords", B: "A single entry point for clients that routes requests to internal services", C: "A tool to generate code", D: "A hardware router"}, c: "B", e: "Gateways handle authentication, logging, and routing." },
      { q: "What is 'Service Discovery'?", o: {A: "Finding new programming languages", B: "How services find the network locations (IP/Port) of other services", C: "A search engine for code", D: "A type of cloud storage"}, c: "B", e: "In dynamic cloud environments, services need a way to find each other." },
      { q: "What is 'Observability'?", o: {A: "Watching the screen", B: "The ability to understand a system's internal state from its external outputs (logs, metrics, traces)", C: "Testing the UI", D: "Hiring more QA engineers"}, c: "B", e: "Observability is key to debugging complex distributed systems." },
      { q: "What is 'Horizontal Pod Autoscaling' (in Kubernetes)?", o: {A: "Making servers taller", B: "Automatically adjusting the number of replicas based on CPU/RAM usage", C: "Deleting old code", D: "Sorting pods alphabetically"}, c: "B", e: "Autoscaling ensures the system handles spikes efficiently." },
      { q: "What is 'Tiered Storage'?", o: {A: "Only using SSDs", B: "Moving data between different storage types (fast/expensive to slow/cheap) based on access frequency", C: "A database with many tables", D: "Using multiple cloud providers"}, c: "B", e: "Tiering optimizes costs while maintaining performance for 'hot' data." }
    ]
  }
];

const insertData = async () => {
  try {
    for (const topic of quizData) {
      console.log(`Inserting questions for topic ${topic.topic_id}...`);
      for (const q of topic.questions) {
        await pool.query(
          `INSERT INTO topic_quiz_questions 
           (topic_id, question, options, correct_option, explanation)
           VALUES ($1, $2, $3, $4, $5)`,
          [topic.topic_id, q.q, JSON.stringify(q.o), q.c, q.e]
        );
      }
    }
    console.log("✅ Batch 3 Inserted!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

insertData();
