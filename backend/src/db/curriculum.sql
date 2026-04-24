-- LearnFlow curriculum seed (safe re-runs)

-- SKILL: Data Structures & Algorithms
INSERT INTO skills (name, description)
VALUES (
  'Data Structures & Algorithms',
  'Master fundamental computer science concepts for technical interviews and efficient software engineering.'
)
ON CONFLICT (name) DO NOTHING;

-- TOPIC 1: Arrays and Strings
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms'),
  'Arrays and Strings',
  'The building blocks of all data manipulation.',
  1
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Arrays and Strings' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Array memory model',
 'How arrays are stored contiguously, index access O(1), insertion and deletion costs',
 1),
((SELECT id FROM topics WHERE title = 'Arrays and Strings' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Two pointer technique',
 'Solve problems like pair sum, palindrome check, and container with most water',
 2),
((SELECT id FROM topics WHERE title = 'Arrays and Strings' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Sliding window pattern',
 'Fixed and variable windows for subarray/substring problems',
 3),
((SELECT id FROM topics WHERE title = 'Arrays and Strings' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'String manipulation',
 'Reversal, anagram detection, character frequency maps',
 4),
((SELECT id FROM topics WHERE title = 'Arrays and Strings' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Practice problems',
 'Two Sum, Best Time to Buy Stock, Valid Anagram, Longest Substring Without Repeating Characters',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 2: Linked Lists
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms'),
  'Linked Lists',
  'Dynamic data structures built on node references.',
  2
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Linked Lists' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Singly linked list',
 'Node structure, traversal, insertion at head/tail/middle',
 1),
((SELECT id FROM topics WHERE title = 'Linked Lists' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Doubly linked list',
 'Bidirectional pointers, pros vs singly linked',
 2),
((SELECT id FROM topics WHERE title = 'Linked Lists' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Fast and slow pointers',
 'Cycle detection, finding middle node',
 3),
((SELECT id FROM topics WHERE title = 'Linked Lists' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Reversal techniques',
 'Iterative and recursive list reversal',
 4),
((SELECT id FROM topics WHERE title = 'Linked Lists' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Practice problems',
 'Reverse Linked List, Detect Cycle, Merge Two Sorted Lists, LRU Cache',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 3: Stacks and Queues
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms'),
  'Stacks and Queues',
  'LIFO and FIFO structures powering parsing and scheduling systems.',
  3
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Stacks and Queues' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Stack implementation',
 'Array and linked list based, push/pop/peek',
 1),
((SELECT id FROM topics WHERE title = 'Stacks and Queues' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Queue and deque',
 'Enqueue/dequeue, circular queue, deque operations',
 2),
((SELECT id FROM topics WHERE title = 'Stacks and Queues' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Monotonic stack',
 'Next greater element, daily temperatures pattern',
 3),
((SELECT id FROM topics WHERE title = 'Stacks and Queues' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Queue with two stacks',
 'Classic interview problem and its applications',
 4),
((SELECT id FROM topics WHERE title = 'Stacks and Queues' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Practice problems',
 'Valid Parentheses, Min Stack, Sliding Window Maximum, Implement Queue Using Stacks',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 4: Trees and Binary Search Trees
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms'),
  'Trees and Binary Search Trees',
  'Hierarchical structures fundamental to databases, filesystems, and compilers.',
  4
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Trees and Binary Search Trees' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Binary tree basics',
 'Nodes, height, depth, balanced vs unbalanced',
 1),
((SELECT id FROM topics WHERE title = 'Trees and Binary Search Trees' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Tree traversals',
 'Inorder, preorder, postorder, level-order (BFS)',
 2),
((SELECT id FROM topics WHERE title = 'Trees and Binary Search Trees' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'BST operations',
 'Search, insert, delete with O(log n) complexity',
 3),
((SELECT id FROM topics WHERE title = 'Trees and Binary Search Trees' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Lowest common ancestor',
 'Recursive approach for BST and general trees',
 4),
((SELECT id FROM topics WHERE title = 'Trees and Binary Search Trees' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Practice problems',
 'Maximum Depth, Validate BST, Level Order Traversal, Serialize and Deserialize Binary Tree',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 5: Graphs
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms'),
  'Graphs',
  'Network structures modeling relationships in the real world.',
  5
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Graphs' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Graph representations',
 'Adjacency matrix vs adjacency list, space/time tradeoffs',
 1),
((SELECT id FROM topics WHERE title = 'Graphs' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'BFS and DFS',
 'Iterative BFS with queue, recursive and iterative DFS',
 2),
((SELECT id FROM topics WHERE title = 'Graphs' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Topological sort',
 'Kahn''s algorithm and DFS-based approach',
 3),
((SELECT id FROM topics WHERE title = 'Graphs' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Union Find',
 'Disjoint sets, path compression, union by rank',
 4),
((SELECT id FROM topics WHERE title = 'Graphs' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Practice problems',
 'Number of Islands, Course Schedule, Clone Graph, Word Ladder',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 6: Dynamic Programming
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms'),
  'Dynamic Programming',
  'Optimization through memoization and tabulation.',
  6
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Dynamic Programming' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Recursion to memoization',
 'Fibonacci, coin change top-down approach',
 1),
((SELECT id FROM topics WHERE title = 'Dynamic Programming' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Tabulation (bottom-up DP)',
 'Building solutions iteratively',
 2),
((SELECT id FROM topics WHERE title = 'Dynamic Programming' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 '1D DP patterns',
 'Climbing stairs, house robber, decode ways',
 3),
((SELECT id FROM topics WHERE title = 'Dynamic Programming' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 '2D DP patterns',
 'Longest common subsequence, edit distance, coin change 2',
 4),
((SELECT id FROM topics WHERE title = 'Dynamic Programming' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Practice problems',
 'Longest Increasing Subsequence, Partition Equal Subset Sum, Word Break, Unique Paths',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 7: Sorting and Searching
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms'),
  'Sorting and Searching',
  'Core algorithms every engineer must understand deeply.',
  7
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Sorting and Searching' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Comparison sorts',
 'Merge sort and quicksort with full implementation',
 1),
((SELECT id FROM topics WHERE title = 'Sorting and Searching' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Linear time sorts',
 'Counting sort, radix sort, bucket sort',
 2),
((SELECT id FROM topics WHERE title = 'Sorting and Searching' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Binary search patterns',
 'Classic binary search, search in rotated array, find first and last position',
 3),
((SELECT id FROM topics WHERE title = 'Sorting and Searching' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Quick select',
 'Kth largest element in O(n) average',
 4),
((SELECT id FROM topics WHERE title = 'Sorting and Searching' AND skill_id = (SELECT id FROM skills WHERE name = 'Data Structures & Algorithms')),
 'Practice problems',
 'Sort Colors, Search in Rotated Sorted Array, Median of Two Sorted Arrays, Top K Frequent Elements',
 5)
ON CONFLICT DO NOTHING;

-- SKILL: System Design
INSERT INTO skills (name, description)
VALUES (
  'System Design',
  'Learn to design scalable, reliable distributed systems used in production at top tech companies.'
)
ON CONFLICT (name) DO NOTHING;

-- TOPIC 1: Fundamentals of System Design
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'System Design'),
  'Fundamentals of System Design',
  'Core vocabulary and thinking framework for system design interviews.',
  1
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Fundamentals of System Design' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Requirements gathering',
 'Functional vs non-functional requirements, estimating scale (DAU, QPS, storage)',
 1),
((SELECT id FROM topics WHERE title = 'Fundamentals of System Design' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Client-server model',
 'Request-response cycle, stateless vs stateful servers',
 2),
((SELECT id FROM topics WHERE title = 'Fundamentals of System Design' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Horizontal vs vertical scaling',
 'When to scale out vs scale up, trade-offs',
 3),
((SELECT id FROM topics WHERE title = 'Fundamentals of System Design' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Latency and throughput',
 'P50/P99 latency, throughput bottlenecks, SLAs',
 4)
ON CONFLICT DO NOTHING;

-- TOPIC 2: Load Balancing and Proxies
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'System Design'),
  'Load Balancing and Proxies',
  'Distributing traffic efficiently across servers.',
  2
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Load Balancing and Proxies' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Load balancer types',
 'L4 vs L7, round robin, least connections, consistent hashing',
 1),
((SELECT id FROM topics WHERE title = 'Load Balancing and Proxies' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Reverse proxy',
 'Nginx as reverse proxy, SSL termination, request routing',
 2),
((SELECT id FROM topics WHERE title = 'Load Balancing and Proxies' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'API Gateway',
 'Rate limiting, authentication, request aggregation',
 3),
((SELECT id FROM topics WHERE title = 'Load Balancing and Proxies' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Health checks and failover',
 'Active/passive health checks, automatic failover',
 4)
ON CONFLICT DO NOTHING;

-- TOPIC 3: Databases at Scale
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'System Design'),
  'Databases at Scale',
  'Choosing and scaling databases for different workloads.',
  3
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Databases at Scale' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'SQL vs NoSQL',
 'When to use each, CAP theorem basics',
 1),
((SELECT id FROM topics WHERE title = 'Databases at Scale' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Database replication',
 'Master-slave, master-master, read replicas',
 2),
((SELECT id FROM topics WHERE title = 'Databases at Scale' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Sharding strategies',
 'Horizontal partitioning, shard keys, hotspot problems',
 3),
((SELECT id FROM topics WHERE title = 'Databases at Scale' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Database indexing',
 'B-tree indexes, composite indexes, index trade-offs',
 4),
((SELECT id FROM topics WHERE title = 'Databases at Scale' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Connection pooling',
 'Why it matters, PgBouncer, pool sizing formula',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 4: Caching
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'System Design'),
  'Caching',
  'Making systems dramatically faster with layered caching.',
  4
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Caching' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Cache fundamentals',
 'Cache hit/miss, eviction policies (LRU, LFU, TTL)',
 1),
((SELECT id FROM topics WHERE title = 'Caching' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Redis deep dive',
 'Data structures, persistence, pub/sub, Lua scripting',
 2),
((SELECT id FROM topics WHERE title = 'Caching' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Cache patterns',
 'Cache aside, write-through, write-behind, read-through',
 3),
((SELECT id FROM topics WHERE title = 'Caching' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'CDN caching',
 'Edge caching, cache invalidation, cache-control headers',
 4),
((SELECT id FROM topics WHERE title = 'Caching' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Cache stampede',
 'Dog-piling problem and solutions (mutex, probabilistic early expiry)',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 5: Message Queues and Event-Driven Design
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'System Design'),
  'Message Queues and Event-Driven Design',
  'Decoupling services with asynchronous communication.',
  5
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Message Queues and Event-Driven Design' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Why message queues',
 'Decoupling, buffering, async processing use cases',
 1),
((SELECT id FROM topics WHERE title = 'Message Queues and Event-Driven Design' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Kafka fundamentals',
 'Topics, partitions, consumer groups, offsets',
 2),
((SELECT id FROM topics WHERE title = 'Message Queues and Event-Driven Design' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'RabbitMQ vs Kafka',
 'Message queue vs event streaming, when to use which',
 3),
((SELECT id FROM topics WHERE title = 'Message Queues and Event-Driven Design' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Event-driven architecture',
 'Event sourcing, CQRS pattern',
 4),
((SELECT id FROM topics WHERE title = 'Message Queues and Event-Driven Design' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Dead letter queues',
 'Handling failed message processing reliably',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 6: Designing Real Systems
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'System Design'),
  'Designing Real Systems',
  'Apply everything to design real-world systems end to end.',
  6
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Designing Real Systems' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Design a URL shortener',
 'Hashing, redirects, analytics, scale to 100M URLs',
 1),
((SELECT id FROM topics WHERE title = 'Designing Real Systems' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Design a news feed',
 'Fan-out on write vs read, Redis timeline, pagination',
 2),
((SELECT id FROM topics WHERE title = 'Designing Real Systems' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Design a rate limiter',
 'Token bucket, sliding window, Redis implementation',
 3),
((SELECT id FROM topics WHERE title = 'Designing Real Systems' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Design a notification system',
 'Push/email/SMS, fan-out, deduplication',
 4),
((SELECT id FROM topics WHERE title = 'Designing Real Systems' AND skill_id = (SELECT id FROM skills WHERE name = 'System Design')),
 'Design a distributed cache',
 'Consistent hashing ring, replication, eviction',
 5)
ON CONFLICT DO NOTHING;

-- SKILL: Databases
INSERT INTO skills (name, description)
VALUES (
  'Databases',
  'Deep expertise in relational and non-relational databases, query optimization, and data modeling.'
)
ON CONFLICT (name) DO NOTHING;

-- TOPIC 1: Relational Database Fundamentals
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Databases'),
  'Relational Database Fundamentals',
  'The foundation of data storage in most production systems.',
  1
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Relational Database Fundamentals' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Relational model',
 'Tables, rows, columns, keys, relationships (1:1, 1:N, M:N)',
 1),
((SELECT id FROM topics WHERE title = 'Relational Database Fundamentals' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'SQL basics',
 'SELECT, INSERT, UPDATE, DELETE with real examples',
 2),
((SELECT id FROM topics WHERE title = 'Relational Database Fundamentals' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Filtering and sorting',
 'WHERE, ORDER BY, LIMIT, OFFSET, BETWEEN, LIKE',
 3),
((SELECT id FROM topics WHERE title = 'Relational Database Fundamentals' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Aggregate functions',
 'COUNT, SUM, AVG, MIN, MAX with GROUP BY and HAVING',
 4)
ON CONFLICT DO NOTHING;

-- TOPIC 2: Joins and Subqueries
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Databases'),
  'Joins and Subqueries',
  'Combining data across multiple tables efficiently.',
  2
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Joins and Subqueries' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Inner and outer joins',
 'INNER, LEFT, RIGHT, FULL OUTER JOIN with visual diagrams',
 1),
((SELECT id FROM topics WHERE title = 'Joins and Subqueries' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Self joins',
 'Querying hierarchical data (employees and managers)',
 2),
((SELECT id FROM topics WHERE title = 'Joins and Subqueries' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Subqueries',
 'Correlated vs non-correlated, EXISTS, IN, scalar subqueries',
 3),
((SELECT id FROM topics WHERE title = 'Joins and Subqueries' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'CTEs',
 'WITH clause, recursive CTEs for tree traversal',
 4),
((SELECT id FROM topics WHERE title = 'Joins and Subqueries' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Window functions',
 'ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, PARTITION BY',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 3: Indexing and Query Optimization
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Databases'),
  'Indexing and Query Optimization',
  'Make queries 1000x faster with the right indexing strategy.',
  3
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Indexing and Query Optimization' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'How indexes work',
 'B-tree structure, why indexes speed up reads',
 1),
((SELECT id FROM topics WHERE title = 'Indexing and Query Optimization' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Types of indexes',
 'Single column, composite, partial, unique, covering indexes',
 2),
((SELECT id FROM topics WHERE title = 'Indexing and Query Optimization' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'EXPLAIN ANALYZE',
 'Reading query plans, identifying seq scans and bottlenecks',
 3),
((SELECT id FROM topics WHERE title = 'Indexing and Query Optimization' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Query optimization',
 'Rewriting slow queries, avoiding N+1, index-only scans',
 4),
((SELECT id FROM topics WHERE title = 'Indexing and Query Optimization' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Vacuuming and bloat',
 'PostgreSQL VACUUM, autovacuum, table bloat management',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 4: Transactions and Concurrency
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Databases'),
  'Transactions and Concurrency',
  'Guaranteeing data integrity under concurrent access.',
  4
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Transactions and Concurrency' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'ACID properties',
 'Atomicity, Consistency, Isolation, Durability explained',
 1),
((SELECT id FROM topics WHERE title = 'Transactions and Concurrency' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Transaction isolation levels',
 'Read uncommitted, read committed, repeatable read, serializable with real dirty/phantom read examples',
 2),
((SELECT id FROM topics WHERE title = 'Transactions and Concurrency' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Locking',
 'Row locks, table locks, deadlocks, lock monitoring in PostgreSQL',
 3),
((SELECT id FROM topics WHERE title = 'Transactions and Concurrency' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Optimistic vs pessimistic locking',
 'SELECT FOR UPDATE, version columns',
 4),
((SELECT id FROM topics WHERE title = 'Transactions and Concurrency' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'MVCC',
 'How PostgreSQL uses multi-version concurrency control',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 5: Data Modeling
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Databases'),
  'Data Modeling',
  'Designing schemas that age well and scale cleanly.',
  5
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Data Modeling' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Normalization',
 '1NF, 2NF, 3NF with step-by-step normalization examples',
 1),
((SELECT id FROM topics WHERE title = 'Data Modeling' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Denormalization',
 'When to intentionally break normal form for performance',
 2),
((SELECT id FROM topics WHERE title = 'Data Modeling' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'ERD design',
 'Entity-relationship diagrams, cardinality notation',
 3),
((SELECT id FROM topics WHERE title = 'Data Modeling' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Schema design patterns',
 'Polymorphic associations, EAV, audit tables, soft deletes',
 4),
((SELECT id FROM topics WHERE title = 'Data Modeling' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Migration strategies',
 'Zero-downtime migrations, expand-contract pattern',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 6: NoSQL and Modern Databases
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'Databases'),
  'NoSQL and Modern Databases',
  'When and how to use non-relational databases.',
  6
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'NoSQL and Modern Databases' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'NoSQL data models',
 'Document, key-value, wide-column, graph',
 1),
((SELECT id FROM topics WHERE title = 'NoSQL and Modern Databases' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'MongoDB fundamentals',
 'Collections, documents, BSON, CRUD operations',
 2),
((SELECT id FROM topics WHERE title = 'NoSQL and Modern Databases' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Redis as a database',
 'Persistence, data structures, use cases beyond caching',
 3),
((SELECT id FROM topics WHERE title = 'NoSQL and Modern Databases' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Choosing a database',
 'Decision framework for SQL vs NoSQL vs NewSQL',
 4),
((SELECT id FROM topics WHERE title = 'NoSQL and Modern Databases' AND skill_id = (SELECT id FROM skills WHERE name = 'Databases')),
 'Multi-model databases',
 'PostgreSQL as JSON store, full-text search, JSONB',
 5)
ON CONFLICT DO NOTHING;

-- SKILL: DevOps
INSERT INTO skills (name, description)
VALUES (
  'DevOps',
  'Build, deploy, and operate production systems with modern DevOps practices and tooling.'
)
ON CONFLICT (name) DO NOTHING;

-- TOPIC 1: Linux and Command Line
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'DevOps'),
  'Linux and Command Line',
  'The foundation every DevOps engineer must master.',
  1
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Linux and Command Line' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'File system navigation',
 'ls, cd, pwd, find, locate, tree commands',
 1),
((SELECT id FROM topics WHERE title = 'Linux and Command Line' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'File operations',
 'cp, mv, rm, chmod, chown, ln, tar, gzip',
 2),
((SELECT id FROM topics WHERE title = 'Linux and Command Line' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Process management',
 'ps, top, htop, kill, nice, jobs, nohup, systemctl',
 3),
((SELECT id FROM topics WHERE title = 'Linux and Command Line' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Text processing',
 'grep, awk, sed, cut, sort, uniq, wc, xargs pipelines',
 4),
((SELECT id FROM topics WHERE title = 'Linux and Command Line' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Shell scripting',
 'Variables, loops, conditionals, functions, exit codes',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 2: Networking Fundamentals
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'DevOps'),
  'Networking Fundamentals',
  'Understand networks to debug and secure production systems.',
  2
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Networking Fundamentals' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'TCP/IP model',
 'Layers, protocols, IP addressing, subnets, CIDR notation',
 1),
((SELECT id FROM topics WHERE title = 'Networking Fundamentals' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'DNS deep dive',
 'A, CNAME, MX, TXT records, DNS resolution chain',
 2),
((SELECT id FROM topics WHERE title = 'Networking Fundamentals' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'HTTP/HTTPS',
 'Request/response, headers, status codes, TLS handshake',
 3),
((SELECT id FROM topics WHERE title = 'Networking Fundamentals' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Network tools',
 'curl, wget, netstat, ss, tcpdump, nmap, ping, traceroute',
 4),
((SELECT id FROM topics WHERE title = 'Networking Fundamentals' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Firewalls and security groups',
 'iptables basics, AWS security groups, NACLs',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 3: Docker and Containers
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'DevOps'),
  'Docker and Containers',
  'Package and run applications consistently anywhere.',
  3
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Docker and Containers' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Container fundamentals',
 'Namespaces, cgroups, containers vs VMs',
 1),
((SELECT id FROM topics WHERE title = 'Docker and Containers' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Docker basics',
 'Images, containers, Dockerfile, build context, layers',
 2),
((SELECT id FROM topics WHERE title = 'Docker and Containers' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Docker networking',
 'Bridge, host, overlay networks, port mapping',
 3),
((SELECT id FROM topics WHERE title = 'Docker and Containers' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Docker Compose',
 'Multi-container apps, volumes, environment variables, depends_on',
 4),
((SELECT id FROM topics WHERE title = 'Docker and Containers' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Container best practices',
 'Multi-stage builds, non-root users, .dockerignore, image scanning',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 4: CI/CD Pipelines
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'DevOps'),
  'CI/CD Pipelines',
  'Automate building, testing, and deploying software.',
  4
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'CI/CD Pipelines' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'CI/CD concepts',
 'Continuous integration, delivery vs deployment, pipeline stages',
 1),
((SELECT id FROM topics WHERE title = 'CI/CD Pipelines' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'GitHub Actions',
 'Workflows, triggers, jobs, steps, secrets, artifacts',
 2),
((SELECT id FROM topics WHERE title = 'CI/CD Pipelines' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Testing in pipelines',
 'Unit tests, integration tests, coverage gates',
 3),
((SELECT id FROM topics WHERE title = 'CI/CD Pipelines' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Deployment strategies',
 'Blue-green, canary, rolling deployments',
 4),
((SELECT id FROM topics WHERE title = 'CI/CD Pipelines' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Pipeline security',
 'Secret scanning, dependency auditing, SAST tools',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 5: Kubernetes
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'DevOps'),
  'Kubernetes',
  'Orchestrate containers at scale in production.',
  5
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Kubernetes' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Kubernetes architecture',
 'Control plane, worker nodes, etcd, API server',
 1),
((SELECT id FROM topics WHERE title = 'Kubernetes' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Core objects',
 'Pods, Deployments, Services, ConfigMaps, Secrets',
 2),
((SELECT id FROM topics WHERE title = 'Kubernetes' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Networking in Kubernetes',
 'ClusterIP, NodePort, LoadBalancer, Ingress',
 3),
((SELECT id FROM topics WHERE title = 'Kubernetes' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Storage',
 'PersistentVolumes, PersistentVolumeClaims, StorageClasses',
 4),
((SELECT id FROM topics WHERE title = 'Kubernetes' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Helm charts',
 'Package manager for Kubernetes, chart structure, values.yaml',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 6: Monitoring and Observability
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'DevOps'),
  'Monitoring and Observability',
  'Know what your systems are doing at all times.',
  6
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Monitoring and Observability' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'The three pillars',
 'Metrics, logs, and traces explained with examples',
 1),
((SELECT id FROM topics WHERE title = 'Monitoring and Observability' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Prometheus and Grafana',
 'Scraping metrics, PromQL queries, dashboard building',
 2),
((SELECT id FROM topics WHERE title = 'Monitoring and Observability' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Centralized logging',
 'ELK stack, Loki, structured logging best practices',
 3),
((SELECT id FROM topics WHERE title = 'Monitoring and Observability' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Distributed tracing',
 'OpenTelemetry, Jaeger, trace IDs across microservices',
 4),
((SELECT id FROM topics WHERE title = 'Monitoring and Observability' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Alerting',
 'SLOs, SLAs, error budgets, PagerDuty alert fatigue strategies',
 5)
ON CONFLICT DO NOTHING;

-- TOPIC 7: Cloud Platforms (AWS)
INSERT INTO topics (skill_id, title, description, order_index)
VALUES (
  (SELECT id FROM skills WHERE name = 'DevOps'),
  'Cloud Platforms (AWS)',
  'Deploy and manage infrastructure on the world''s largest cloud.',
  7
)
ON CONFLICT DO NOTHING;

INSERT INTO tasks (topic_id, title, description, order_index) VALUES
((SELECT id FROM topics WHERE title = 'Cloud Platforms (AWS)' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'AWS core services',
 'EC2, S3, RDS, VPC, IAM — what each does and when to use',
 1),
((SELECT id FROM topics WHERE title = 'Cloud Platforms (AWS)' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'IAM and security',
 'Users, roles, policies, least privilege, MFA enforcement',
 2),
((SELECT id FROM topics WHERE title = 'Cloud Platforms (AWS)' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Serverless with Lambda',
 'Function anatomy, triggers, cold starts, limits',
 3),
((SELECT id FROM topics WHERE title = 'Cloud Platforms (AWS)' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Infrastructure as Code',
 'Terraform basics, HCL syntax, state management, plan and apply workflow',
 4),
((SELECT id FROM topics WHERE title = 'Cloud Platforms (AWS)' AND skill_id = (SELECT id FROM skills WHERE name = 'DevOps')),
 'Cost optimization',
 'Reserved instances, spot instances, right-sizing, AWS Cost Explorer',
 5)
ON CONFLICT DO NOTHING;
