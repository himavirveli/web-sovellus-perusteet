
---

# README

This project is a web application where users can build a racecar by purchasing various performance parts. The app is built using HTML, CSS (Bootstrap), and JavaScript, with dynamic features such as part filtering, adding parts, and calculating car performance stats.

App is hosted in AWS using EC2 Stockholm instance.

# Main features

- Responsive layout: Built using Bootstrap, ensuring the app is accessible on different screen sizes.
- Dynamic parts list: Users can add new parts through a form, which updates the list in real time.
- Category filter: Allows users to filter available parts by category (engine, exhaust, suspension).
- Buy parts: Users can buy parts with a budget, and car stats are updated based on the parts purchased.
- Car stats: Power, emissions, and handling are recalculated dynamically whenever parts are added or removed.
- Inactivity timer: Automatically resets the game after 5 minutes of user inactivity.

# Vastaavuus vaatimuksiin:

## 1. **HTML (25%)**

#### 1/5: Basic HTML structure is present
- The project uses a basic HTML structure, with elements such as `<head>`, `<body>`, and proper HTML5 doctype.
- Example: Line 1 (`index.html`) defines the doctype and basic HTML structure. All the standard structure can be found in the beginning of the index.html.

#### 2/5: HTML structure with clear content differentiation
- The project uses headings (`<h1>`, `<h2>`), paragraphs (`<p>`), and lists (`<ul>`) for clear content differentiation.
- Example: Line 15 (`index.html`) has a `<h1>` for the main heading of the page.
- Line 16 starts a  paragraph
- Line 18 starts a  list

#### 3/5: Use of forms, links, and media
- A form is used to add new car parts, and external links and media (images) are present in the page.
- Example: Line 107 (`index.html`) contains a form for adding parts, with inputs for name, price, power, emissions, and handling.
- Line 17 has a standard link
- Line 28 has an <img> picture embedded

#### 4/5: Tables are effectively used
- The installed car parts are displayed in a table that dynamically updates when new parts are added or removed.
- Example: Line 58 (`index.html`) defines a table for showing installed parts.

#### 5/5: Consistent use of semantic HTML throughout
- The project uses semantic HTML elements like `<h1>`, `<h2>`, `<ul>`, and `<table>`, which are consistently applied to enhance the structure and meaning of the content.
- Whole document uses semantic HTML.

---

## 2. **CSS (25%)**

#### 1/5: Basic CSS styling (colors, fonts)
- Bootstrap is used to style the page, providing default colors, fonts, and responsive utilities.
- Example: Line 7 (`index.html`) includes Bootstrap CDN import for styling.

#### 2/5: Use of classes and IDs to style specific elements
- Bootstrap classes and custom classes are applied to buttons, forms, and table elements for styling.
- Example: Line 85 (`index.html`) uses `class="form-control"` to style form inputs.
- Line 95 has <div id>
- A lot of IDs and classes are used for all parts of the page

#### 3/5: Implementation of responsive design elements
- The page layout is fully responsive, thanks to Bootstrap’s grid system and utility classes.
- Example: Line 13 and 14 (`index.html`) uses Bootstrap’s `row` and `col-md-6` classes for responsive layout.

#### 4/5: Use of layouts for advanced user interfaces (arrays, float, flexbox, CSS grid)
- Flexbox is used to align elements and structure content inside the container.
- Example: Line 44 (`index.html`) uses Bootstrap’s flexbox utility classes like `d-flex` and `justify-content-between`.

#### 5/5: Styling demonstrates a strong grasp of layout principles, aesthetics, and user experience
- The project shows good understanding of layout principles and a user-friendly interface, with clear and responsive design using Bootstrap’s grid system and flexbox utilities.
- Example: The form layout, car stats, and parts tables are well separated and visually accessible.

---

## 3. **JavaScript Basics (25%)**

#### 1/5: Simple interactions (like alerts on button click)
- Alerts are used to provide feedback when the user interacts with the app, such as when buying or uninstalling parts.
- Example: Line 122 (`main.js`) shows an alert when a you already have the part you try to purchase.

#### 2/5: Multiple event listeners and basic DOM manipulations
- Multiple event listeners are implemented for form submissions, button clicks, and dropdown filtering. The DOM is dynamically updated to reflect these actions.
- Example: Line 60 (`main.js`) sets up event listeners for multiple features.

#### 3/5: Use of arrays, objects, and functions
- Arrays and objects are used to manage installed parts and car stats, while functions handle adding and removing parts.
- Example: Line 27 (`main.js`) defines the `installedParts` array, and Line 138 (`main.js`) defines the `buyPart()` function.

#### 4/5: Advanced logic, looping through data, and dynamic DOM updates
- Loops are used to iterate over the `installedParts` array and dynamically update the DOM.
- Example: Line 99 (`main.js`) uses a loop inside `updateInstalledPartsList()` to update the parts table.

#### 5/5: Consistent use of Object-Oriented JavaScript principles
- A `Part` class has been implemented to encapsulate the creation and management of car parts, adhering to object-oriented principles.
- Example: Line 2 (`main.js`) defines the `Part` class, which is used to create part objects in `handlePartSubmission()`.

---

## 4. **Asynchronous Operations (25%)**

#### 1/5: Use of timers
- A timer is used to detect inactivity and reset the game if the user remains inactive for 5 minutes.
- Example: Line 164 (`main.js`) sets a 5-minute inactivity timer using `setTimeout()`.

#### 2/5: Successful implementation of an AJAX call or Fetch
- The `fetch()` API is used to retrieve car parts data asynchronously from the server.
- Example: Line 188 (`main.js`) defines the `fetchParts()` function, which fetches parts from an API endpoint.

#### 3/5: Data from the asynchronous call is displayed on the webpage
- Data fetched from the server is displayed dynamically as part cards.
- Example: Line 201 (`main.js`) displays the fetched parts by dynamically creating cards using `displayParts()`.

#### 4/5: Error handling is implemented (for failed API calls, etc.)
- Error handling is present for failed fetch requests, logging errors to the console.
- Example: Line 196 (`main.js`) includes a `catch()` block for handling errors during the `fetch()` call.

#### 5/5: Effective use of asynchronous data to enhance user experience (like filtering, sorting)
- The app includes a filter for selecting car parts by category, which updates the display dynamically without reloading the page.
- Example: Line 206 (`main.js`) implements filtering based on the category selected in the dropdown.

---

### Summary

All required features and functionalities for **WebOhjelmoinninPerusteet** have been implemented. The project uses HTML, CSS, JavaScript, and asynchronous operations to create an interactive, user-friendly application.
