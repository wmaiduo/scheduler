import React from "react";
import ReactDOM from "react-dom";

import "./index.scss";

import Application from "./components/Application";

require("dotenv").config();

console.log("process here", process.env);

ReactDOM.render(<Application />, document.getElementById("root"));
