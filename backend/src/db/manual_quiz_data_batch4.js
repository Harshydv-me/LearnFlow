import pool from "./index.js";

const quizData = [
  {
    topic_id: 19, // Relational Database Fundamentals
    questions: [
      { q: "What is a 'Primary Key'?", o: {A: "A key that opens the database", B: "A unique identifier for each record in a table", C: "The first column in a table", D: "A type of password"}, c: "B", e: "Primary keys ensure each row is uniquely addressable." },
      { q: "What is a 'Foreign Key'?", o: {A: "A key from another country", B: "A field that links two tables together", C: "A hidden column", D: "A backup key"}, c: "B", e: "Foreign keys create relationships between tables by referencing primary keys." },
      { q: "What does 'Normalization' aim to achieve?", o: {A: "Make the database larger", B: "Reduce data redundancy and improve data integrity", C: "Delete old records", D: "Encrypt the data"}, c: "B", e: "Normalization organizes data into related tables to avoid duplication." },
      { q: "Which SQL command is used to retrieve data?", o: {A: "GET", B: "FETCH", C: "SELECT", D: "READ"}, c: "C", e: "SELECT is the primary command for querying data." },
      { q: "What is the 'Schema' of a database?", o: {A: "The physical server", B: "The logical structure and organization of data", C: "A type of virus", D: "The user manual"}, c: "B", e: "Schema defines tables, fields, relationships, and constraints." },
      { q: "What does 'NULL' represent in a database?", o: {A: "Zero", B: "An empty string", C: "Missing or unknown information", D: "A deleted record"}, c: "C", e: "NULL is not a value; it's a marker for the absence of a value." },
      { q: "Which constraint ensures that a column cannot have duplicate values?", o: {A: "NOT NULL", B: "UNIQUE", C: "CHECK", D: "DEFAULT"}, c: "B", e: "UNIQUE prevents the same value from appearing twice in a column." },
      { q: "What is 'SQL'?", o: {A: "Simple Query Language", B: "Structured Query Language", C: "System Quality Log", D: "Standard Query Link"}, c: "B", e: "SQL is the standard language for relational database management." },
      { q: "What is a 'Table' in a database?", o: {A: "A flat piece of wood", B: "A collection of related data held in a structured format within a database", C: "A list of users", D: "A single piece of data"}, c: "B", e: "Tables consist of columns (attributes) and rows (records)." },
      { q: "What is 'DML'?", o: {A: "Data Modeling Level", B: "Data Manipulation Language (INSERT, UPDATE, DELETE)", C: "Database Management Link", D: "Direct Memory Listing"}, c: "B", e: "DML commands are used to manage the data within the schema." }
    ]
  },
  {
    topic_id: 20, // Joins and Subqueries
    questions: [
      { q: "Which JOIN returns records that have matching values in both tables?", o: {A: "LEFT JOIN", B: "INNER JOIN", C: "RIGHT JOIN", D: "FULL OUTER JOIN"}, c: "B", e: "INNER JOIN is the most common type of join." },
      { q: "What does a 'LEFT JOIN' do?", o: {A: "Returns all records from the left table and matched records from the right", B: "Returns only unmatched records", C: "Returns only matched records", D: "Deletes the left table"}, c: "A", e: "Unmatched rows from the right table will show NULL values." },
      { q: "What is a 'Subquery'?", o: {A: "A small database", B: "A query nested inside another query", C: "A query that runs very fast", D: "A backup query"}, c: "B", e: "Subqueries can be used in SELECT, FROM, or WHERE clauses." },
      { q: "Which JOIN returns all records when there is a match in either left or right table?", o: {A: "CROSS JOIN", B: "FULL OUTER JOIN", C: "SELF JOIN", D: "INNER JOIN"}, c: "B", e: "FULL OUTER JOIN combines the results of both LEFT and RIGHT joins." },
      { q: "What is a 'Self Join'?", o: {A: "A join between two identical databases", B: "A regular join where a table is joined with itself", C: "A join that doesn't need a key", D: "A join with no results"}, c: "B", e: "Self joins are useful for hierarchical data in a single table." },
      { q: "Which keyword is used to combine the results of two SELECT statements (removing duplicates)?", o: {A: "COMBINE", B: "UNION", C: "MERGE", D: "JOIN"}, c: "B", e: "UNION merges results; UNION ALL keeps duplicates." },
      { q: "What is a 'Correlated Subquery'?", o: {A: "A fast subquery", B: "A subquery that uses values from the outer query", C: "A subquery with many joins", D: "A broken subquery"}, c: "B", e: "Correlated subqueries are executed once for each row processed by the outer query." },
      { q: "What is the purpose of 'CROSS JOIN'?", o: {A: "To find matches", B: "To produce a Cartesian product (all possible combinations)", C: "To delete records", D: "To find unique values"}, c: "B", e: "If Table A has 10 rows and Table B has 10, CROSS JOIN gives 100 rows." },
      { q: "Which clause is used to filter groups created by GROUP BY?", o: {A: "WHERE", B: "HAVING", C: "FILTER", D: "ORDER BY"}, c: "B", e: "WHERE filters rows; HAVING filters groups." },
      { q: "Can a subquery return multiple columns?", o: {A: "No, never", B: "Yes, if used with certain operators like EXISTS or IN", C: "Only if the database is MySQL", D: "Only in the FROM clause"}, c: "B", e: "Subqueries in the FROM clause (derived tables) often return multiple columns." }
    ]
  },
  {
    topic_id: 21, // Indexing and Query Optimization
    questions: [
      { q: "What is the main benefit of a Database Index?", o: {A: "Reduces storage space", B: "Increases the speed of data retrieval", C: "Makes inserts faster", D: "Encrypts the data"}, c: "B", e: "Indexes allow the DB engine to find rows without scanning the whole table." },
      { q: "What is the trade-off of having too many indexes?", o: {A: "Queries become slower", B: "Write operations (INSERT, UPDATE, DELETE) become slower", C: "The database crashes", D: "Data becomes inconsistent"}, c: "B", e: "Each index must be updated whenever data changes." },
      { q: "What is a 'Clustered Index'?", o: {A: "An index on multiple columns", B: "An index that defines the physical order of data in the table", C: "A group of indexes", D: "A temporary index"}, c: "B", e: "A table can have only one clustered index (usually the Primary Key)." },
      { q: "Which data structure is most commonly used for database indexes?", o: {A: "Linked List", B: "B-Tree / B+Tree", C: "Stack", D: "Queue"}, c: "B", e: "B-Trees allow for efficient searching, insertion, and deletion in logarithmic time." },
      { q: "What is a 'Full Table Scan'?", o: {A: "A fast way to find data", B: "When the database reads every single row in a table to find a result", C: "A security check", D: "A way to back up data"}, c: "B", e: "Optimization aims to avoid full table scans on large tables." },
      { q: "What does 'EXPLAIN' (or EXPLAIN ANALYZE) do in SQL?", o: {A: "Gives a definition of a column", B: "Shows the execution plan of a query", C: "Corrects syntax errors", D: "Deletes slow queries"}, c: "B", e: "EXPLAIN helps developers understand how the DB will execute a query." },
      { q: "What is a 'Composite Index'?", o: {A: "An index on a single column", B: "An index on multiple columns", C: "A broken index", D: "A system index"}, c: "B", e: "Composite indexes are useful for queries that filter on multiple fields." },
      { q: "How does 'Index Covering' work?", o: {A: "The index is hidden", B: "The index contains all the data needed for the query, avoiding a table lookup", C: "The index is encrypted", D: "The index covers the whole database"}, c: "B", e: "Covering indexes are extremely fast as only the index is read." },
      { q: "What is 'SARGable' in query optimization?", o: {A: "Search Argumentable; queries that can effectively use indexes", B: "A type of database", C: "A sorting algorithm", D: "A security protocol"}, c: "A", e: "Using functions on indexed columns (e.g., WHERE YEAR(date) = 2024) often makes them non-SARGable." },
      { q: "Which tool/feature is used to identify slow queries in production?", o: {A: "Nginx", B: "Slow Query Log", C: "React DevTools", D: "Docker"}, c: "B", e: "Slow logs help DBA/Devs find and optimize problematic queries." }
    ]
  },
  {
    topic_id: 22, // Transactions and Concurrency
    questions: [
      { q: "What is a 'Database Transaction'?", o: {A: "A payment to the DB provider", B: "A sequence of operations performed as a single logical unit of work", C: "A simple SELECT query", D: "A backup process"}, c: "B", e: "Transactions follow the 'all or nothing' principle." },
      { q: "What does 'Atomicity' guarantee?", o: {A: "The data is small", B: "All operations in a transaction either complete successfully or none are applied", C: "The data is secure", D: "The query is fast"}, c: "B", e: "Atomicity prevents partial updates." },
      { q: "What is 'Isolation' in ACID?", o: {A: "The database is offline", B: "Ensuring that concurrent transactions do not interfere with each other", C: "Keeping data in one table", D: "Encrypting the server"}, c: "B", e: "Isolation levels manage how changes made by one transaction are visible to others." },
      { q: "What is a 'Deadlock'?", o: {A: "A very fast transaction", B: "A situation where two or more transactions are waiting for each other to release locks", C: "A deleted record", D: "A system crash"}, c: "B", e: "Deadlocks require the system to kill one transaction to proceed." },
      { q: "Which SQL command saves all changes made during a transaction?", o: {A: "SAVE", B: "COMMIT", C: "ROLLBACK", D: "FINISH"}, c: "B", e: "COMMIT makes the transaction's changes permanent." },
      { q: "Which SQL command undoes all changes made during a transaction?", o: {A: "UNDO", B: "CANCEL", C: "ROLLBACK", D: "DELETE"}, c: "C", e: "ROLLBACK reverts the state to before the transaction started." },
      { q: "What is a 'Dirty Read'?", o: {A: "Reading data from a slow DB", B: "Reading uncommitted changes from another transaction", C: "Reading deleted data", D: "A syntax error"}, c: "B", e: "Dirty reads can lead to processing data that might later be rolled back." },
      { q: "Which isolation level provides the highest protection but lowest performance?", o: {A: "Read Uncommitted", B: "Read Committed", C: "Serializable", D: "Repeatable Read"}, c: "C", e: "Serializable transactions behave as if they were executed one after another." },
      { q: "What is 'Optimistic Concurrency Control'?", o: {A: "Locking everything early", B: "Assuming conflicts are rare and checking for them only at commit time", C: "Being happy while coding", D: "Not using transactions"}, c: "B", e: "Often uses version numbers or timestamps to detect changes." },
      { q: "What is 'Pessimistic Locking'?", o: {A: "Never using locks", B: "Locking data as soon as it is read to prevent any concurrent changes", C: "A type of error", D: "A slow database"}, c: "B", e: "Pessimistic locking prevents conflicts but reduces concurrency." }
    ]
  },
  {
    topic_id: 23, // Data Modeling
    questions: [
      { q: "What is the goal of Data Modeling?", o: {A: "To write code faster", B: "To define how data is stored, organized, and related in a system", C: "To buy more hardware", D: "To encrypt the internet"}, c: "B", e: "Modeling creates a blueprint for the database." },
      { q: "What is an 'Entity' in an ER Diagram?", o: {A: "A database query", B: "An object or concept that exists and is distinguishable (like a User or Product)", C: "A type of join", D: "A hardware server"}, c: "B", e: "Entities usually become tables in a relational database." },
      { q: "What represents a 'One-to-Many' relationship?", o: {A: "A user has one password", B: "A department has many employees, but an employee belongs to one department", C: "A student can take many courses", D: "Two databases syncing"}, c: "B", e: "This is the most common relationship type." },
      { q: "How is a 'Many-to-Many' relationship implemented in a relational DB?", o: {A: "Using a single foreign key", B: "Using an associative (junction) table with two foreign keys", C: "It's not possible", D: "By duplicating all data"}, c: "B", e: "A junction table (e.g., Student_Courses) links the two entities." },
      { q: "What is an 'Attribute' in data modeling?", o: {A: "A link between tables", B: "A property or characteristic of an entity (like Name or Price)", C: "A type of lock", D: "A database user"}, c: "B", e: "Attributes become columns in the final table." },
      { q: "What is a 'Logical Data Model'?", o: {A: "Physical server details", B: "A detailed map of entities and relationships independent of specific technology", C: "SQL code only", D: "A type of backup"}, c: "B", e: "Logical models focus on the business logic and structure." },
      { q: "What is '1NF' (First Normal Form)?", o: {A: "Tables must have many columns", B: "Each column must contain atomic (indivisible) values and no repeating groups", C: "Tables must be encrypted", D: "Using only strings"}, c: "B", e: "1NF is the basic requirement for a relational table." },
      { q: "What is a 'Weak Entity'?", o: {A: "An entity with no data", B: "An entity that cannot be uniquely identified by its own attributes alone (depends on a parent)", C: "A slow entity", D: "A deleted entity"}, c: "B", e: "A 'Room' in a 'Building' is often a weak entity." },
      { q: "What is 'Denormalization' used for in modeling?", o: {A: "Improving consistency", B: "Intentionally introducing redundancy to optimize read performance", C: "Reducing storage costs", D: "Cleaning the database"}, c: "B", e: "Used in analytical systems (Data Warehouses) more than transactional ones." },
      { q: "What is 'Cardinality' in an ER diagram?", o: {A: "The color of the nodes", B: "The numerical relationship between entities (1:1, 1:N, M:N)", C: "The speed of the query", D: "The size of the table"}, c: "B", e: "Cardinality defines the constraints on the number of related items." }
    ]
  },
  {
    topic_id: 24, // NoSQL and Modern Databases
    questions: [
      { q: "What is the main characteristic of 'Document Stores' (like MongoDB)?", o: {A: "Data is stored in rows and columns", B: "Data is stored as semi-structured objects (JSON/BSON)", C: "They don't allow indexes", D: "They only store text files"}, c: "B", e: "Document stores offer flexible schemas and easy scaling." },
      { q: "Which NoSQL type is simplest and stores data as a unique ID linked to a value?", o: {A: "Graph Store", B: "Key-Value Store (like Redis)", C: "Relational", D: "Columnar"}, c: "B", e: "Key-Value stores are extremely fast for simple lookups." },
      { q: "What is a 'Graph Database' best for?", o: {A: "Calculating averages", B: "Managing complex relationships and networks (Social, Fraud, Recs)", C: "Storing large logs", D: "Simple data entry"}, c: "B", e: "Graph DBs focus on the 'connections' between data." },
      { q: "What is 'BASE' in NoSQL (alternative to ACID)?", o: {A: "Binary, Async, Static, Encrypted", B: "Basically Available, Soft state, Eventual consistency", C: "Basic Atomicity, Simple Entry", D: "Database acronym"}, c: "B", e: "BASE prioritizes availability and scale over immediate consistency." },
      { q: "What is a 'Wide-Column' store (like Cassandra)?", o: {A: "A table with 1000 columns", B: "A database that stores data in columns rather than rows, good for heavy writes", C: "A type of spreadsheet", D: "A legacy database"}, c: "B", e: "Wide-column stores excel at distributed writes across many servers." },
      { q: "What is 'Horizontal Scaling' in NoSQL terms?", o: {A: "Adding more RAM", B: "Distributing data across many nodes (partitioning/sharding)", C: "Creating a giant table", D: "Deleting old shards"}, c: "B", e: "Most NoSQL databases are designed for horizontal scale from the start." },
      { q: "What is 'Schema-less'?", o: {A: "No data is stored", B: "The ability to insert data without a pre-defined fixed structure", C: "A database with no primary key", D: "A type of security flaw"}, c: "B", e: "Schema-on-read (NoSQL) vs Schema-on-write (SQL)." },
      { q: "Which NoSQL database is often used as a distributed search engine?", o: {A: "Redis", B: "Elasticsearch", C: "SQLite", D: "PostgreSQL"}, c: "B", e: "Elasticsearch is built for full-text search and real-time analytics." },
      { q: "What is 'Time Series' database used for?", o: {A: "User profile storage", B: "Storing data indexed by time (Metrics, IoT, Logs)", C: "Managing movie schedules", D: "Game development only"}, c: "B", e: "InfluxDB and Prometheus are popular time-series databases." },
      { q: "What is 'Replication' in NoSQL?", o: {A: "Deleting duplicates", B: "Storing copies of data on multiple nodes for fault tolerance", C: "Running the same query twice", D: "A type of index"}, c: "B", e: "Replication ensures data availability even if a node fails." }
    ]
  },
  {
    topic_id: 25, // Linux and Command Line
    questions: [
      { q: "What command is used to list files in a directory?", o: {A: "list", B: "ls", C: "dir", D: "show"}, c: "B", e: "ls is one of the most basic and used Linux commands." },
      { q: "What command is used to change directories?", o: {A: "mov", B: "cd", C: "chdir", D: "goto"}, c: "B", e: "cd stands for 'change directory'." },
      { q: "Which command prints the full path of the current directory?", o: {A: "path", B: "pwd", C: "where", D: "here"}, c: "B", e: "pwd stands for 'print working directory'." },
      { q: "What does the 'sudo' command do?", o: {A: "Restarts the system", B: "Executes a command with superuser (admin) privileges", C: "Deletes a file", D: "Changes the password"}, c: "B", e: "Sudo stands for 'superuser do'." },
      { q: "How do you create a new directory?", o: {A: "newdir", B: "mkdir", C: "create", D: "touch"}, c: "B", e: "mkdir stands for 'make directory'." },
      { q: "What command is used to display the contents of a file?", o: {A: "show", B: "cat", C: "view", D: "open"}, c: "B", e: "cat (concatenate) prints file contents to the terminal." },
      { q: "What command is used to search for text patterns within files?", o: {A: "find", B: "grep", C: "search", D: "scan"}, c: "B", e: "grep is a powerful pattern matching tool." },
      { q: "How do you remove (delete) a file?", o: {A: "del", B: "rm", C: "remove", D: "erase"}, c: "B", e: "rm stands for 'remove'." },
      { q: "What command shows the current running processes and system resources?", o: {A: "proc", B: "top", C: "sys", D: "stats"}, c: "B", e: "top (or htop) provides a real-time view of system activity." },
      { q: "What is the 'root' user in Linux?", o: {A: "A new user", B: "The system administrator with full access to everything", C: "A restricted user", D: "A system backup"}, c: "B", e: "The root user has UID 0 and total control." }
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
    console.log("✅ Batch 4 Inserted!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

insertData();
