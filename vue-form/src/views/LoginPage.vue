<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '../services/userService'

const router = useRouter()

const email = ref('')
const password = ref('')

const error = ref('')
const loading = ref(false)



async function handleLogin() {
    error.value = '';

    // Check required fields before making a request.
    if (!email.value || !password.value) {
        error.value = 'Please enter email and password';
        return;
    }

    loading.value = true;

    try {
        // Call POST /auth/login.
        const result = await loginUser(
            email.value,
            password.value
        );

        // The backend should return a signed JWT.
        if (!result.access_token) {
            error.value = 'Login response did not contain a token';
            return;
        }

        // Store the real token instead of a fake login flag.
        sessionStorage.setItem('token', result.access_token);

        // Remove the old flag because JWT replaces it.
        sessionStorage.removeItem('isLoggedIn');

        // Navigate to the dashboard.
        await router.push('/dashboard');

    } catch (err) {
        console.error(err);
        error.value =
            `${err.statusCode || 'Error'} - ${err.message || 'Unable to login. Please try again.'}`;
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="login-page">

        <div class="login-card">

            <h1>Login</h1>

            <p>Login to your account</p>

            <form @submit.prevent="handleLogin">

                <div class="form-group">
                    <label>Email</label>

                    <input v-model="email" type="email" placeholder="Enter your email" />
                </div>

                <div class="form-group">
                    <label>Password</label>

                    <input v-model="password" type="password" placeholder="Enter your password" />
                </div>

                <p v-if="error" class="error">
                    {{ error }}
                </p>

                <button type="submit" :disabled="loading">
                    {{ loading ? 'Logging in...' : 'Login' }}
                </button>

            </form>

            <p class="register-link">
                Don't have an account?
                <button @click="router.push('/register')">
                    Register
                </button>
            </p>

        </div>

    </div>
</template>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-card {
    width: 400px;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.login-card h1 {
    margin-bottom: 5px;
}

.login-card>p {
    margin-bottom: 25px;
}

.form-group {
    margin-bottom: 18px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
}

.form-group input {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
}

.login-card form button {
    width: 100%;
    padding: 12px;
    margin-top: 10px;
    cursor: pointer;
}

.error {
    color: red;
}

.register-link {
    text-align: center;
    margin-top: 20px;
}

.register-link button {
    width: auto;
    padding: 0;
    margin: 0;
    border: none;
    background: none;
    color: blue;
    cursor: pointer;
}
</style>