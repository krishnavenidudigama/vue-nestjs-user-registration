
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
    })

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
    return response.json()
}

export async function getUsers(page = 1, limit = 5, name = '') {

    // Retrieve the JWT saved when the user logged in.
    const token = sessionStorage.getItem('token');

    // Request the paginated users from NestJS.
    const response = await fetch(
        `http://localhost:3000/users/list?page=${page}&limit=${limit}&name=${encodeURIComponent(name)}`,
        {
            headers: {
                // Send the JWT so NestJS can verify the request.
                Authorization: `Bearer ${token}`,
            },
        }
    );

    // Handle missing, invalid, or expired tokens and other HTTP errors.
    if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
    }

    return response.json();
}

//login user 

/*
  Sends login credentials to our NestJS backend
  and returns the response containing the JWT.
*/
export async function loginUser(email, password) {

    // Send the login request to our new JWT endpoint.
    const response = await fetch(
        'http://localhost:3000/auth/login',
        {
            method: 'POST',

            // Tell NestJS that we are sending JSON data.
            headers: {
                'Content-Type': 'application/json',
            },

            // Convert our email and password into JSON.
            body: JSON.stringify({
                email,
                password,
            }),
        }
    );

    // Handle HTTP errors, such as 400 or 500.
    if (!response.ok) {
        throw new Error('Login request failed');
    }

    // Convert the JSON response into a JavaScript object.
    // It contains success, message and access_token.
    return response.json();
}
