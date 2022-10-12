/**
 * Base of all modules
 */

import "@babel/polyfill";
import { displayMap } from "./mapbox";
import { login } from "./login";

//! DOM Elements

const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form");

//! Check for mapbox;

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);

  displayMap(locations);
}

/**
 * !Submit login form handler
 */
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}
