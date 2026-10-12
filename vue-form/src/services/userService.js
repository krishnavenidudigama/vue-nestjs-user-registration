
/*
  This file contains functions for communicating
  with the NestJS backend.
*/

const API_URL = 'http://localhost:3000/users';
const AUTH_URL = 'http://localhost:3000/auth';

// Register a new user.
// Registration is public, so no JWT is required.
export async function createUser(userData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message || 'Registration failed'
        );

        // Store the HTTP status code inside the error.
        error.statusCode = response.status;

        throw error;
    }

    return data;
}

// Fetch the requested page of users.
// This endpoint now requires a valid JWT.
export async function getUsers(page = 1, limit = 5, name = '') {

    // Read the JWT stored after successful login.
    const token = sessionStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/list?page=${page}&limit=${limit}&name=${encodeURIComponent(name)}`,
        {
            headers: {
                // Send the JWT to NestJS for verification.
                Authorization: `Bearer ${token}`,
            },
        }
    );

    // A missing, invalid, or expired token usually gives 401.
    if (!response.ok) {
        throw new Error(
            response.status === 401
                ? 'Your session has expired. Please log in again.'
                : 'Failed to fetch users'
        );
    }

    return response.json();
}

// Log in and receive a JWT.
export async function loginUser(email, password) {
    const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await response.json();

    // The backend returns 401 when credentials are incorrect.
    if (!response.ok) {
        const error = new Error(
            data.message || 'Login failed'
        );

        // Store the HTTP status code inside the error.
        error.statusCode = response.status;

        throw error;
    }

    // Return the response, including access_token.
    return data;
}