import pool from "./index.js";

const quizData = [
  {
    topic_id: 6, // Arrays and Strings
    questions: [
      { q: "What is the time complexity to access an element in an array by index?", o: {A: "O(1)", B: "O(n)", C: "O(log n)", D: "O(n^2)"}, c: "A", e: "Arrays use contiguous memory, allowing constant time access via index." },
      { q: "Which approach is common for finding pairs in a sorted array that sum to a target?", o: {A: "Binary Search", B: "Two Pointers", C: "Recursion", D: "Breadth First Search"}, c: "B", e: "Two pointers (left and right) can efficiently find sums in O(n) time." },
      { q: "What is a 'String' in most programming languages?", o: {A: "A single character", B: "An array of characters", C: "A type of number", D: "A pointer to a memory address"}, c: "B", e: "Strings are sequences of characters stored together." },
      { q: "Which algorithm is used to find if a string is a palindrome?", o: {A: "Dijkstra's", B: "Two Pointers (comparing start and end)", C: "Merge Sort", D: "Quick Sort"}, c: "B", e: "Checking from both ends moving inward is the most efficient way." },
      { q: "What happens during array resizing in dynamic arrays (like ArrayList)?", o: {A: "New memory is added at the end", B: "The array is deleted", C: "A new larger array is created and elements are copied", D: "It's not possible to resize"}, c: "C", e: "Dynamic arrays allocate a new larger space (usually 2x) and copy old elements." },
      { q: "What is 'Sliding Window' useful for?", o: {A: "Sorting an array", B: "Finding sub-arrays or sub-strings with specific properties", C: "Reversing an array", D: "Deleting an element"}, c: "B", e: "Sliding window maintains a range to avoid redundant calculations in sub-problems." },
      { q: "What is the space complexity of a string reversal algorithm that uses an extra string?", o: {A: "O(1)", B: "O(n)", C: "O(n^2)", D: "O(log n)"}, c: "B", e: "An extra string of size n requires O(n) additional space." },
      { q: "Which data structure is often used to store character frequencies in string problems?", o: {A: "Stack", B: "Queue", C: "Hash Map / Frequency Array", D: "Linked List"}, c: "C", e: "Hash maps allow O(1) frequency lookups." },
      { q: "What is the index of the last element in an array of size 'n'?", o: {A: "n", B: "n + 1", C: "n - 1", D: "0"}, c: "C", e: "Most languages use zero-based indexing, so the last is n-1." },
      { q: "Which string operation is typically O(n)?", o: {A: "Getting length", B: "Accessing first char", C: "Concatenation (in many languages)", D: "Checking if empty"}, c: "C", e: "Concatenating strings often involves copying all characters from both strings." }
    ]
  },
  {
    topic_id: 7, // Linked Lists
    questions: [
      { q: "What is a major advantage of a Linked List over an Array?", o: {A: "Faster random access", B: "Efficient insertions/deletions at the beginning", C: "Uses less memory", D: "Simpler to implement"}, c: "B", e: "Adding/removing the head is O(1) in a linked list, but O(n) in an array." },
      { q: "What does each node in a singly linked list contain?", o: {A: "Only data", B: "Data and a pointer to the next node", C: "Data and a pointer to the previous node", D: "Pointers only"}, c: "B", e: "Each node points forward to the next link in the chain." },
      { q: "What is the time complexity to find an element in a linked list?", o: {A: "O(1)", B: "O(n)", C: "O(log n)", D: "O(1)"}, c: "B", e: "You must traverse the list from the head to find a specific value." },
      { q: "Which algorithm is used to detect a cycle in a linked list?", o: {A: "Binary Search", B: "Floyd's Cycle-Finding (Tortoise and Hare)", C: "Merge Sort", D: "Quick Sort"}, c: "B", e: "A slow and fast pointer will eventually meet if there is a loop." },
      { q: "In a doubly linked list, what does each node store?", o: {A: "Next pointer only", B: "Previous pointer only", C: "Data, Next pointer, and Previous pointer", D: "Index of node"}, c: "C", e: "Doubly linked lists allow traversal in both directions." },
      { q: "How do you delete a node 'curr' given its predecessor 'prev'?", o: {A: "prev.next = null", B: "prev.next = curr.next", C: "curr = null", D: "prev = curr.next"}, c: "B", e: "Skipping 'curr' by pointing 'prev' to 'curr.next' effectively removes it." },
      { q: "What is a 'Dummy Head' node used for?", o: {A: "To store metadata", B: "To simplify edge cases like inserting at the head", C: "To stop traversal", D: "To increase performance"}, c: "B", e: "Dummy heads avoid special 'if (head == null)' checks in algorithms." },
      { q: "What is the time complexity to insert at the end of a singly linked list if you only have a head pointer?", o: {A: "O(1)", B: "O(n)", C: "O(log n)", D: "O(1)"}, c: "B", e: "You must traverse all n elements to reach the end." },
      { q: "Which linked list type forms a circle where the last node points to the first?", o: {A: "Singly", B: "Doubly", C: "Circular", D: "Static"}, c: "C", e: "Circular lists have no null terminator at the end." },
      { q: "Can we perform Binary Search on a Linked List?", o: {A: "Yes, efficiently", B: "No, because there is no random access", C: "Only on circular lists", D: "Only on doubly lists"}, c: "B", e: "Binary search requires O(1) access to the middle, which linked lists lack." }
    ]
  },
  {
    topic_id: 8, // Stacks and Queues
    questions: [
      { q: "Which principle does a Stack follow?", o: {A: "FIFO (First In First Out)", B: "LIFO (Last In First Out)", C: "Random Access", D: "Prioritized"}, c: "B", e: "The last element added is the first one removed (like a stack of plates)." },
      { q: "Which principle does a Queue follow?", o: {A: "FIFO", B: "LIFO", C: "Ordered", D: "Unordered"}, c: "A", e: "The first element added is the first one removed (like a line at a store)." },
      { q: "Which operation adds an item to a stack?", o: {A: "Enqueue", B: "Pop", C: "Push", D: "Peek"}, c: "C", e: "'Push' puts a new element on the top of the stack." },
      { q: "Which operation removes an item from a queue?", o: {A: "Dequeue", B: "Pop", C: "Push", D: "Peek"}, c: "A", e: "'Dequeue' removes the element from the front of the queue." },
      { q: "What does the 'Peek' operation do?", o: {A: "Removes the top element", B: "Returns the top element without removing it", C: "Clears the stack", D: "Finds an element"}, c: "B", e: "Peek lets you look at the top item without changing the structure." },
      { q: "In recursion, which data structure is internally used by the system?", o: {A: "Queue", B: "Heap", C: "Stack", D: "Tree"}, c: "C", e: "The call stack tracks active function calls." },
      { q: "What is a 'Priority Queue'?", o: {A: "A queue that processes VIPs first", B: "A queue where items are removed based on priority rather than arrival", C: "A stack with indices", D: "A sorted array"}, c: "B", e: "Priority queues typically use Heaps for efficiency." },
      { q: "Which problem can be solved using a Stack?", o: {A: "Level order traversal", B: "Balanced parentheses check", C: "Shortest path in unweighted graph", D: "Buffering data"}, c: "B", e: "Matching brackets uses the LIFO property perfectly." },
      { q: "Which data structure is used for Breadth-First Search (BFS)?", o: {A: "Stack", B: "Queue", C: "Priority Queue", D: "Hash Set"}, c: "B", e: "Queues process nodes in the order they are discovered (layer by layer)." },
      { q: "What is a 'Circular Queue'?", o: {A: "A queue implemented using a circular linked list", B: "A fixed-size queue that reuse empty space at the beginning", C: "A stack that never ends", D: "A type of recursive function"}, c: "B", e: "Circular queues connect the last position back to the first to save space." }
    ]
  },
  {
    topic_id: 9, // Trees and Binary Search Trees
    questions: [
      { q: "What is the maximum number of children a node in a Binary Tree can have?", o: {A: "1", B: "2", C: "Unlimited", D: "0"}, c: "B", e: "A binary tree node has at most two children: left and right." },
      { q: "In a Binary Search Tree (BST), where are smaller values located?", o: {A: "Right subtree", B: "Left subtree", C: "Root node", D: "Leaf nodes only"}, c: "B", e: "The BST property: left < root < right." },
      { q: "Which traversal of a BST returns values in sorted order?", o: {A: "Pre-order", B: "Post-order", C: "In-order", D: "Level-order"}, c: "C", e: "In-order (Left-Root-Right) visits nodes in ascending order." },
      { q: "What is the time complexity of searching in a balanced BST?", o: {A: "O(n)", B: "O(log n)", C: "O(1)", D: "O(n log n)"}, c: "B", e: "A balanced tree halves the search space at each step." },
      { q: "What is a 'Leaf' node?", o: {A: "The top node", B: "A node with no children", C: "A node with two children", D: "The middle node"}, c: "B", e: "Leaves are the terminal nodes of a tree." },
      { q: "What is the 'Root' node?", o: {A: "The bottom node", B: "The first node of the tree", C: "Any node with a parent", D: "A node with no next pointer"}, c: "B", e: "The root is the unique starting node with no parent." },
      { q: "Which data structure is used for Depth-First Search (DFS) on trees?", o: {A: "Queue", B: "Stack (or Recursion)", C: "Array", D: "Priority Queue"}, c: "B", e: "DFS goes deep into one branch before backtracking using a stack." },
      { q: "What is a 'Full Binary Tree'?", o: {A: "All nodes have 0 or 2 children", B: "Every level is completely filled", C: "Nodes only have left children", D: "A tree with 10 nodes"}, c: "A", e: "In a full binary tree, no node has exactly one child." },
      { q: "What is the height of an empty tree?", o: {A: "0", B: "-1", C: "1", D: "Undefined"}, c: "B", e: "Commonly defined as -1 (a single node has height 0)." },
      { q: "In which traversal is the Root visited first?", o: {A: "In-order", B: "Post-order", C: "Pre-order", D: "Level-order"}, c: "C", e: "Pre-order sequence is Root -> Left -> Right." }
    ]
  },
  {
    topic_id: 10, // Graphs
    questions: [
      { q: "What are the two main components of a Graph?", o: {A: "Nodes and Leaves", B: "Vertices and Edges", C: "Roots and Children", D: "Keys and Values"}, c: "B", e: "Vertices represent entities, and Edges represent connections between them." },
      { q: "What is an 'Adjacency Matrix'?", o: {A: "A list of nodes", B: "A 2D array representing connections between vertices", C: "A type of stack", D: "A linked list of edges"}, c: "B", e: "Matrix[i][j] is 1 if there's an edge between i and j, 0 otherwise." },
      { q: "Which algorithm finds the shortest path in a weighted graph with non-negative weights?", o: {A: "BFS", B: "DFS", C: "Dijkstra's", D: "Kruskal's"}, c: "C", e: "Dijkstra's is the standard algorithm for shortest paths in weighted graphs." },
      { q: "What is a 'Directed Graph'?", o: {A: "A graph with no cycles", B: "A graph where edges have a specific direction", C: "A graph with no edges", D: "A tree"}, c: "B", e: "Edges in directed graphs point from one vertex to another (one-way)." },
      { q: "What is a 'Cycle' in a graph?", o: {A: "A node with no edges", B: "A path that starts and ends at the same vertex", C: "A graph with only 3 nodes", D: "An edge pointing to itself only"}, c: "B", e: "Cycles allow you to travel back to where you started." },
      { q: "Which traversal uses a Queue to explore neighbors level by level?", o: {A: "DFS", B: "BFS", C: "Binary Search", D: "Topological Sort"}, c: "B", e: "Breadth-First Search (BFS) explores all immediate neighbors first." },
      { q: "What is 'Topological Sort' used for?", o: {A: "Sorting numbers", B: "Ordering tasks based on dependencies in a DAG", C: "Finding the shortest path", D: "Detecting cycles"}, c: "B", e: "It produces a linear ordering of vertices in a Directed Acyclic Graph (DAG)." },
      { q: "What is a 'Minimum Spanning Tree' (MST)?", o: {A: "The shortest path in a graph", B: "A subset of edges that connects all vertices with minimum total weight and no cycles", C: "A graph with the fewest nodes", D: "A tree with only leaf nodes"}, c: "B", e: "Kruskal's and Prim's algorithms are used to find MSTs." },
      { q: "What does it mean for a graph to be 'Connected'?", o: {A: "Every node has an edge to every other node", B: "There is a path between every pair of vertices", C: "It has no cycles", D: "It's a tree"}, c: "B", e: "In a connected graph, no node is isolated." },
      { q: "What is the time complexity of BFS/DFS using an Adjacency List?", o: {A: "O(V + E)", B: "O(V^2)", C: "O(E^2)", D: "O(log V)"}, c: "A", e: "V is number of vertices, E is number of edges." }
    ]
  },
  {
    topic_id: 11, // Dynamic Programming
    questions: [
      { q: "What are the two main properties a problem must have to be solved by DP?", o: {A: "Sorting and Searching", B: "Optimal Substructure and Overlapping Subproblems", C: "Recursion and Iteration", D: "Fast and Slow pointers"}, c: "B", e: "DP solves complex problems by breaking them into simpler, repeated sub-problems." },
      { q: "What is 'Memoization'?", o: {A: "A way to delete memory", B: "Storing results of expensive function calls to reuse when same inputs occur", C: "A sorting algorithm", D: "A type of loop"}, c: "B", e: "Memoization is a Top-Down approach to DP." },
      { q: "What is the 'Tabulation' approach in DP?", o: {A: "Top-Down", B: "Bottom-Up", C: "Random Access", D: "Recursive"}, c: "B", e: "Tabulation builds a table from the smallest sub-problems up to the solution." },
      { q: "Which problem is a classic example of Dynamic Programming?", o: {A: "Binary Search", B: "Fibonacci Sequence", C: "Reversing a String", D: "Bubble Sort"}, c: "B", e: "Fibonacci shows how repeated sub-problems (like calculating F(3) multiple times) can be optimized." },
      { q: "What is the main goal of Dynamic Programming?", o: {A: "To use more memory", B: "To reduce time complexity by avoiding redundant calculations", C: "To make code more readable", D: "To find multiple solutions"}, c: "B", e: "DP trades space for time by caching results." },
      { q: "In the 0/1 Knapsack problem, what does '0/1' mean?", o: {A: "The weight is 0 or 1", B: "You either take an item or leave it (no fractions)", C: "Binary search is used", D: "The profit is 0 or 1"}, c: "B", e: "Items cannot be divided; you take the whole thing or nothing." },
      { q: "Which DP problem finds the longest subsequence common to two sequences?", o: {A: "Longest Increasing Subsequence", B: "Longest Common Subsequence (LCS)", C: "Shortest Path", D: "Subset Sum"}, c: "B", e: "LCS is a standard DP problem used in diff tools and bioinformatics." },
      { q: "What is the time complexity of the naive recursive Fibonacci vs DP Fibonacci?", o: {A: "O(n) vs O(2^n)", B: "O(2^n) vs O(n)", C: "O(n log n) vs O(n)", D: "Both are O(n)"}, c: "B", e: "Naive recursion recalculates values exponentially; DP does it linearly." },
      { q: "Can all recursive problems be optimized with DP?", o: {A: "Yes, always", B: "Only if they have overlapping subproblems", C: "Only if they use a stack", D: "No, never"}, c: "B", e: "If sub-problems don't repeat, DP offers no benefit over standard recursion." },
      { q: "What is 'Optimal Substructure'?", o: {A: "The code is written optimally", B: "An optimal solution to the problem contains optimal solutions to sub-problems", C: "The data structure is a tree", D: "The problem is solved in O(1) time"}, c: "B", e: "This property allows building the final answer from sub-answers." }
    ]
  },
  {
    topic_id: 12, // Sorting and Searching
    questions: [
      { q: "Which sorting algorithm has the best average-case time complexity of O(n log n)?", o: {A: "Bubble Sort", B: "Selection Sort", C: "Merge Sort", D: "Insertion Sort"}, c: "C", e: "Merge Sort and Quick Sort are O(n log n) on average." },
      { q: "How does Binary Search work?", o: {A: "Checks every element", B: "Randomly picks elements", C: "Repeatedly divides the search interval in half", D: "Sorts the array first"}, c: "C", e: "Binary search requires a sorted array and halves the search area each step." },
      { q: "What is the worst-case time complexity of Bubble Sort?", o: {A: "O(n)", B: "O(n^2)", C: "O(log n)", D: "O(n log n)"}, c: "B", e: "Bubble sort uses nested loops to compare and swap elements." },
      { q: "Which sorting algorithm is 'Stable'?", o: {A: "Quick Sort", B: "Merge Sort", C: "Heap Sort", D: "Selection Sort"}, c: "B", e: "A stable sort preserves the relative order of equal elements." },
      { q: "What is the 'Pivot' in Quick Sort?", o: {A: "The largest element", B: "An element used to partition the array into two halves", C: "The first element only", D: "The middle of the array"}, c: "B", e: "Quick sort partitions the array around a chosen pivot." },
      { q: "Which search algorithm is O(n)?", o: {A: "Linear Search", B: "Binary Search", C: "Hash Search (average)", D: "Interpolation Search"}, c: "A", e: "Linear search checks every element one by one." },
      { q: "What is the space complexity of Merge Sort?", o: {A: "O(1)", B: "O(n)", C: "O(log n)", D: "O(n^2)"}, c: "B", e: "Merge sort requires an auxiliary array of size n to merge halves." },
      { q: "Which sort is often the fastest in practice for large arrays despite its O(n^2) worst case?", o: {A: "Bubble Sort", B: "Quick Sort", C: "Selection Sort", D: "Merge Sort"}, c: "B", e: "Quick sort has very small constant factors and good cache performance." },
      { q: "What is 'Insertion Sort' best suited for?", o: {A: "Large random arrays", B: "Small or nearly sorted arrays", C: "Reverse sorted arrays", D: "String arrays only"}, c: "B", e: "Insertion sort is O(n) for nearly sorted data." },
      { q: "What is the time complexity to build a Heap from an array of size n?", o: {A: "O(n log n)", B: "O(n)", C: "O(n^2)", D: "O(log n)"}, c: "B", e: "Building a heap (heapify) can be done in linear time." }
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
    console.log("✅ Batch 2 Inserted!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

insertData();
