
/*
  This file contains functions for communicating
  with our NestJS Users API.

  Keeping fetch() here prevents App.vue from
  becoming too complicated.
*/

// Base URL of our NestJS backend.
const API_URL = 'http://localhost:3000/users';

/*
  Create a new user.

  The function receives the data from App.vue,
  sends it to NestJS, and returns the response.
*/
export async function createUser(userData) {
  const response = await fetch(API_URL, {
    method: 'POST',

    // Tell NestJS that the request body is JSON.
    headers: {
      'Content-Type': 'application/json',
    },

    // Convert the JavaScript object into JSON.
    body: JSON.stringify(userData),
  });

  /*
    fetch() does not automatically throw an error
    for HTTP errors such as 400 or 500.

    We must check response.ok ourselves.
  */
  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}`,
    );
  }

  // Convert the JSON response into a JS object.
  return response.json();
}
export async function getUsers() {
  // Send GET request to NestJS
  const response = await fetch(API_URL);

  // fetch() does not throw automatically for 400/500 errors
  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}`,
    );
  }

  // Convert JSON response into JavaScript data
  return response.json();
}