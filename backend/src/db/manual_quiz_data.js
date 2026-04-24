import pool from "./index.js";

const quizData = [
  {
    topic_id: 1, // HTML Fundamentals
    questions: [
      { q: "What does HTML stand for?", o: {A: "Hyper Text Markup Language", B: "High Tech Modern Language", C: "Hyperlink and Text Markup Language", D: "Home Tool Markup Language"}, c: "A", e: "HTML is the standard markup language for creating web pages." },
      { q: "Which HTML element is used for the largest heading?", o: {A: "<h6>", B: "<heading>", C: "<h1>", D: "<head>"}, c: "C", e: "<h1> is used for the most important, top-level heading." },
      { q: "What is the correct HTML element for inserting a line break?", o: {A: "<break>", B: "<lb>", C: "<br>", D: "<hr>"}, c: "C", e: "<br> is an empty element that creates a single line break." },
      { q: "Which attribute is used to provide a unique identifier for an element?", o: {A: "class", B: "id", C: "type", D: "name"}, c: "B", e: "The 'id' attribute must be unique within the entire document." },
      { q: "What is the correct HTML for creating a hyperlink?", o: {A: "<a url='http://google.com'>Google</a>", B: "<a>http://google.com</a>", C: "<a href='http://google.com'>Google</a>", D: "<link href='http://google.com'>Google</link>"}, c: "C", e: "The <a> tag defines a hyperlink, and 'href' specifies the destination URL." },
      { q: "Which HTML element is used to define an unordered list?", o: {A: "<ul>", B: "<ol>", C: "<li>", D: "<list>"}, c: "A", e: "<ul> stands for Unordered List, typically displayed with bullet points." },
      { q: "What is the purpose of the <alt> attribute for images?", o: {A: "To change image size", B: "To provide alternative text if image fails to load", C: "To align the image", D: "To add a border"}, c: "B", e: "Alt text is crucial for accessibility and SEO." },
      { q: "Which tag is used to define a table row?", o: {A: "<td>", B: "<th>", C: "<tr", D: "<table>"}, c: "C", e: "<tr> stands for Table Row." },
      { q: "HTML form elements include all except:", o: {A: "<input>", B: "<textarea>", C: "<button>", D: "<div>"}, c: "D", e: "<div> is a generic container, not a specific form control." },
      { q: "What is the correct doctype for HTML5?", o: {A: "<!DOCTYPE html>", B: "<html>", C: "<doctype html5>", D: "<!DOCTYPE HTML PUBLIC>"}, c: "A", e: "<!DOCTYPE html> is the short and simple declaration for HTML5." }
    ]
  },
  {
    topic_id: 2, // CSS Fundamentals
    questions: [
      { q: "What does CSS stand for?", o: {A: "Creative Style Sheets", B: "Cascading Style Sheets", C: "Computer Style Sheets", D: "Colorful Style Sheets"}, c: "B", e: "CSS describes how HTML elements are to be displayed on screen." },
      { q: "Where in an HTML document is the correct place to refer to an external style sheet?", o: {A: "In the <body> section", B: "At the end of the document", C: "In the <head> section", D: "Inside the <html> tag"}, c: "C", e: "External CSS is linked within the <head> using the <link> tag." },
      { q: "Which HTML tag is used to define an internal style sheet?", o: {A: "<css>", B: "<script>", C: "<style>", D: "<link>"}, c: "C", e: "The <style> element contains CSS rules directly in the HTML file." },
      { q: "Which property is used to change the background color?", o: {A: "color", B: "bgcolor", C: "background-color", D: "surface-color"}, c: "C", e: "background-color sets the background color of an element." },
      { q: "How do you add a background color for all <h1> elements?", o: {A: "all.h1 {bg-color:#FFF;}", B: "h1 {background-color:#FFFFFF;}", C: "h1.all {background-color:#FFFFFF;}", D: "#h1 {background-color:#FFFFFF;}"}, c: "B", e: "The element selector target all instances of that tag." },
      { q: "Which CSS property controls the text size?", o: {A: "font-style", B: "text-style", C: "font-size", D: "text-size"}, c: "C", e: "font-size defines the size of the font." },
      { q: "What is the correct CSS syntax to make all the <p> elements bold?", o: {A: "p {font-weight:bold;}", B: "p {text-size:bold;}", C: "<p style='font-size:bold;'>", D: "p {style:bold;}"}, c: "A", e: "font-weight controls the thickness of characters." },
      { q: "How do you display a border like this: Top border = 10px, Bottom = 5px, Left = 20px, Right = 1px?", o: {A: "border-width:10px 5px 20px 1px;", B: "border-width:10px 20px 5px 1px;", C: "border-width:10px 1px 5px 20px;", D: "border-width:5px 20px 10px 1px;"}, c: "C", e: "Shorthand order is: top, right, bottom, left (clockwise)." },
      { q: "Which property is used to change the left margin of an element?", o: {A: "padding-left", B: "margin-left", C: "indent-left", D: "spacing-left"}, c: "B", e: "margin-left sets the space outside the element on its left side." },
      { q: "How do you select an element with id 'demo'?", o: {A: ".demo", B: "*demo", C: "demo", D: "#demo"}, c: "D", e: "The hash (#) symbol is used for ID selectors." }
    ]
  },
  {
    topic_id: 3, // JavaScript Basics
    questions: [
      { q: "Inside which HTML element do we put the JavaScript?", o: {A: "<js>", B: "<scripting>", C: "<script>", D: "<javascript>"}, c: "C", e: "The <script> tag is used to embed or reference executable script." },
      { q: "How do you write 'Hello World' in an alert box?", o: {A: "msg('Hello World');", B: "alertBox('Hello World');", C: "alert('Hello World');", D: "msgBox('Hello World');"}, c: "C", e: "window.alert() displays an alert dialog with content." },
      { q: "How do you create a function in JavaScript?", o: {A: "function:myFunction()", B: "function myFunction()", C: "function = myFunction()", D: "def myFunction()"}, c: "B", e: "The 'function' keyword starts a function declaration." },
      { q: "How do you call a function named 'myFunction'?", o: {A: "call myFunction()", B: "call function myFunction()", C: "myFunction()", D: "run myFunction()"}, c: "C", e: "Simply use the function name followed by parentheses." },
      { q: "How to write an IF statement in JavaScript?", o: {A: "if i = 5 then", B: "if (i == 5)", C: "if i == 5", D: "if i = 5"}, c: "B", e: "IF statements use parentheses for the condition." },
      { q: "How does a WHILE loop start?", o: {A: "while (i <= 10)", B: "while i = 1 to 10", C: "while (i <= 10; i++)", D: "while i <= 10"}, c: "A", e: "A while loop continues as long as the condition in () is true." },
      { q: "How can you add a comment in a JavaScript?", o: {A: "'This is a comment", B: "<!--This is a comment-->", C: "//This is a comment", D: "*This is a comment*"}, c: "C", e: "// is used for single-line comments in JS." },
      { q: "What is the correct way to write a JavaScript array?", o: {A: "var colors = 1 = ('red'), 2 = ('green')", B: "var colors = (1:'red', 2:'green')", C: "var colors = ['red', 'green', 'blue']", D: "var colors = 'red', 'green', 'blue'"}, c: "C", e: "Arrays use square brackets []." },
      { q: "How do you round the number 7.25, to the nearest integer?", o: {A: "round(7.25)", B: "Math.rnd(7.25)", C: "Math.round(7.25)", D: "rnd(7.25)"}, c: "C", e: "Math.round() provides standard rounding to nearest integer." },
      { q: "Which operator is used to assign a value to a variable?", o: {A: "*", B: "-", C: "=", D: "x"}, c: "C", e: "The single equals (=) is the assignment operator." }
    ]
  },
  {
    topic_id: 4, // JavaScript Advanced
    questions: [
      { q: "What is closure in JavaScript?", o: {A: "A way to close a browser window", B: "A function bundled together with its lexical environment", C: "A method to terminate a loop", D: "A type of private variable"}, c: "B", e: "Closures allow a function to access variables from an outer scope even after the outer function has finished executing." },
      { q: "What is the purpose of 'this' keyword in JavaScript?", o: {A: "It refers to the current function", B: "It refers to the object it belongs to", C: "It refers to the previous variable", D: "It is a placeholder"}, c: "B", e: "The value of 'this' depends on how the function is called (context)." },
      { q: "What is a Promise in JavaScript?", o: {A: "A guarantee that code will not fail", B: "An object representing the eventual completion or failure of an asynchronous operation", C: "A reserved word for future features", D: "A function that runs immediately"}, c: "B", e: "Promises are used for async programming to avoid callback hell." },
      { q: "What is the difference between '==' and '==='?", o: {A: "No difference", B: "'==' checks value, '===' checks value and type", C: "'==' checks type, '===' checks value", D: "'==' is for assignment"}, c: "B", e: "== performs type coercion, === is strict equality." },
      { q: "What is 'hoisting' in JavaScript?", o: {A: "Moving all script tags to the bottom", B: "Moving declarations to the top of the current scope", C: "Increasing memory allocation", D: "A way to optimize images"}, c: "B", e: "Variable and function declarations are moved to the top of their scope during compilation." },
      { q: "Which method is used to transform elements in an array and return a new array?", o: {A: "forEach()", B: "map()", C: "filter()", D: "reduce()"}, c: "B", e: ".map() creates a new array with the results of calling a function for every array element." },
      { q: "What is 'event bubbling'?", o: {A: "Events starting from the root and going down", B: "Events starting from the target and going up to ancestors", C: "Multiple events firing at once", D: "Events that never end"}, c: "B", e: "Bubbling means the event propagates from the element that triggered it up through its parents." },
      { q: "What is the purpose of 'use strict'?", o: {A: "To enforce faster execution", B: "To catch common coding bloopers and throw exceptions", C: "To enable new ES6 features", D: "To prevent external script loading"}, c: "B", e: "Strict mode makes it easier to write 'secure' JavaScript." },
      { q: "What does the 'bind' method do?", o: {A: "Executes a function immediately", B: "Creates a new function with a specific 'this' value", C: "Joins two arrays together", D: "Links a variable to a DOM element"}, c: "B", e: ".bind() returns a new function with the context permanently set." },
      { q: "What is the 'Temporal Dead Zone' in JS?", o: {A: "A period when the CPU is idle", B: "The area where let/const variables are unreachable before declaration", C: "A memory leak state", D: "The time it takes for an API to respond"}, c: "B", e: "TDZ occurs between entering a scope and the actual variable declaration." }
    ]
  },
  {
    topic_id: 5, // React Fundamentals
    questions: [
      { q: "What is a React component?", o: {A: "A part of the database", B: "A reusable, independent piece of UI", C: "A styling rule", D: "A JavaScript library"}, c: "B", e: "Components are the building blocks of any React application." },
      { q: "What is JSX?", o: {A: "A syntax extension for JavaScript", B: "A type of CSS", C: "A database query language", D: "A React hook"}, c: "A", e: "JSX allows you to write HTML-like code inside JavaScript." },
      { q: "Which hook is used to manage state in a functional component?", o: {A: "useEffect", B: "useContext", C: "useState", D: "useReducer"}, c: "C", e: "useState allows functional components to have their own state." },
      { q: "What are 'props' in React?", o: {A: "Internal state of a component", B: "Inputs passed from parent to child component", C: "Global variables", D: "CSS properties"}, c: "B", e: "Props (short for properties) allow data to flow down the component tree." },
      { q: "What is the purpose of 'useEffect'?", o: {A: "To create new components", B: "To perform side effects in functional components", C: "To style elements", D: "To handle user clicks only"}, c: "B", e: "useEffect handles actions like data fetching, subscriptions, or manual DOM changes." },
      { q: "What is the 'Virtual DOM'?", o: {A: "A direct copy of the real DOM", B: "A lightweight representation of the real DOM in memory", C: "A browser extension", D: "A type of server-side rendering"}, c: "B", e: "React uses the Virtual DOM to efficiently update only the parts of the UI that changed." },
      { q: "What must every React component return?", o: {A: "A string", B: "A single JSX element", C: "Nothing", D: "A function"}, c: "B", e: "Components must return JSX to describe what should appear on the screen." },
      { q: "How do you handle clicks in React?", o: {A: "onclick='handler()'", B: "onClick={handler}", C: "click={handler}", D: "on-click={handler}"}, c: "B", e: "React events are named using camelCase, and you pass a function as the handler." },
      { q: "What is the 'key' prop used for in lists?", o: {A: "To style list items", B: "To help React identify which items have changed, been added, or removed", C: "To secure the data", D: "To sort the list"}, c: "B", e: "Keys provide a stable identity for elements in an array." },
      { q: "Can functional components have lifecycle methods?", o: {A: "No, only class components", B: "Yes, using hooks like useEffect", C: "Only if they are inside a class", D: "Yes, by default"}, c: "B", e: "Hooks like useEffect serve the same purpose as lifecycle methods in class components." }
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
    console.log("✅ Batch 1 Inserted!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

insertData();
