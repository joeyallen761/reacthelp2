/** @jsx React.DOM */
const React = require("react")

// this is for the information that goes in the side panel (so no short description in here)
const Panel  = () => {
      return (
          // error type header section
         <div>
            <h1>Error type name</h1>
         </div>
          // medium description section
         <div>
            <p>Sample medium-length description about the error.</p>
         </div>
         // images section (the images used are completely random sample images just used to see if the images show up!)
         <div>
            <h3>Image 1 Title</h3>
            <img src="https://code.visualstudio.com/assets/docs/nodejs/reactjs/intellisense.png" alt="Sample React Code Example 1" width="100" height="62">
            <h3>Image 2 Title</h3>
            <img src="https://user-images.githubusercontent.com/20761166/61405629-48270680-a8a8-11e9-906e-aa80d51e51e3.png" alt="Sample React Code Example 2" width="100" height="65">
         </div>
         //  referenceURL section
        <div>
            <a href="https://reactjs.org/">Sample Reference URL 1</a>
            <a href="https://www.w3schools.com/">Sample Reference URL 2</a>
         </div>
      );
}

export default Panel;
