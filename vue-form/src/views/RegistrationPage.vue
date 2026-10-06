<script setup>
import { reactive, ref, onMounted } from 'vue';
import { createUser, getUsers } from '../services/userService.js';

import { useRouter } from 'vue-router';

const router = useRouter();

/*
  reactive() stores the values entered into the form.

  When an input changes through v-model,
  the corresponding property updates automatically.
*/
const form = reactive({
    name: '',
    email: '',
    password: '',
    age: '',
});


/*
  Store validation errors separately from form data.

  Each property contains an error message or
  an empty string when there is no error.
*/
const errors = reactive({
    name: '',
    email: '',
    password: '',
    age: '',
});

// Controls the loading state of the submit button.
const isSubmitting = ref(false);

// Stores success and error messages.
const successMessage = ref('');
const errorMessage = ref('');

// Controls whether the success popup is visible.
const showSuccessPopup = ref(false);
const pendingUserData = ref(null);

/*
  Validate the form before sending data to NestJS.

  Returns true if all fields are valid.
  Returns false if any validation fails.
*/
function validateForm() {
    // Clear old validation errors.
    errors.name = '';
    errors.email = '';
    errors.password = '';
    errors.age = '';

    // Validate name.
    if (!form.name.trim()) {
        errors.name = 'Name is required.';
    } else if (form.name.trim().length < 3) {
        errors.name = 'Name must contain at least 3 characters.';
    }

    // Validate email.
    if (!form.email.trim()) {
        errors.email = 'Email is required.';
    } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
        errors.email = 'Please enter a valid email address.';
    }

    // Validate password.
    if (!form.password) {
        errors.password = 'Password is required.';
    } else if (form.password.length < 6) {
        errors.password = 'Password must contain at least 6 characters.';
    }

    // Validate age.
    const age = Number(form.age);

    if (form.age === '' || form.age === null) {
        errors.age = 'Age is required.';
    } else if (!Number.isInteger(age) || age < 18) {
        errors.age = 'Age must be above 18.';
    }

    /*
      Object.values() collects the values of all
      properties in the errors object.
  
      some() checks whether at least one error exists.
      Jaha koi error nahi hai vaha kuch display nahi karega aur validateForm() will return true.
    */
    return !Object.values(errors).some(
        (message) => message !== '',
    );
}

/*
  Called when the user submits the form.
*/
async function handleSubmit() {
    // Do not submit if validation fails.
    if (!validateForm()) {
        return;
    }

    // Start loading and clear previous messages.
    isSubmitting.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    try {
        /*
          Prepare the request data.
    
          Number(form.age) converts age from a string
          into a number before sending it to NestJS.
        */
        const userData = {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            age: Number(form.age),
        };

        // Store the data temporarily. It is NOT sent to NestJS yet.
        pendingUserData.value = userData;

        // Show confirmation popup
        successMessage.value =
            'Are you sure you want to register this user?';

        showSuccessPopup.value = true;
    } catch (error) {
        /*
          Handles network errors and unsuccessful
          HTTP responses from our service function.
        */
        console.error('Registration failed:', error);

        errorMessage.value =
            'Unable to register the user. Please try again.';

    } finally {
        // Stop loading whether the request succeeds or fails.
        isSubmitting.value = false;
    }

}

/*
  Clear all form fields and validation errors.
*/
function resetForm() {
    form.name = '';
    form.email = '';
    form.password = '';
    form.age = '';

    errors.name = '';
    errors.email = '';
    errors.password = '';
    errors.age = '';
}

/*
  OK means the user has acknowledged the success
  message and is ready to start a fresh registration.
*/
async function handlePopupOk() {

    // Make sure we actually have data waiting
    if (!pendingUserData.value) {
        return;
    }

    isSubmitting.value = true;
    errorMessage.value = '';

    try {

        // NOW we save the user
        const data = await createUser(
            pendingUserData.value
        );

        // Registration is now actually successful
        sessionStorage.setItem(
            'isLoggedIn',
            'true'
        );

        // Close popup
        showSuccessPopup.value = false;

        // Clear temporary data
        pendingUserData.value = null;

        // Clear form
        resetForm();

        // Go to dashboard
        router.push('/dashboard');

    } catch (error) {

        console.error(
            'Registration failed:',
            error
        );

        errorMessage.value =
            'Unable to register the user. Please try again.';

    } finally {

        isSubmitting.value = false;

    }
}
/*
  Cancel only dismisses the popup.
  The submitted user is NOT deleted or undone.
*/
function handlePopupCancel() {
    showSuccessPopup.value = false;
}

</script>

<template>
    <main class="page">

        <!-- Registration card -->
        <section class="app">
            <h1>User Registration</h1>

            <p class="subtitle">
                Create a new user account
            </p>

            <form @submit.prevent="handleSubmit" novalidate>

                <!-- Name field -->
                <div class="form-group">
                    <label for="name">Name</label>

                    <input id="name" v-model="form.name" type="text" placeholder="Enter your name"
                        :aria-invalid="Boolean(errors.name)"
                        :aria-describedby="errors.name ? 'name-error' : undefined" />

                    <small v-if="errors.name" id="name-error" class="field-error">
                        {{ errors.name }}
                    </small>
                </div>

                <!-- Email field -->
                <div class="form-group">
                    <label for="email">Email</label>

                    <input id="email" v-model="form.email" type="email" placeholder="Enter your email"
                        :aria-invalid="Boolean(errors.email)"
                        :aria-describedby="errors.email ? 'email-error' : undefined" />

                    <small v-if="errors.email" id="email-error" class="field-error">
                        {{ errors.email }}
                    </small>
                </div>

                <!-- Password field -->
                <div class="form-group">
                    <label for="password">Password</label>

                    <input id="password" v-model="form.password" type="password" placeholder="Enter your password"
                        :aria-invalid="Boolean(errors.password)"
                        :aria-describedby="errors.password ? 'password-error' : undefined" />

                    <small v-if="errors.password" id="password-error" class="field-error">
                        {{ errors.password }}
                    </small>
                </div>

                <!-- Age field -->
                <div class="form-group">
                    <label for="age">Age</label>

                    <input id="age" v-model="form.age" type="number" min="18" max="100" step="1"
                        placeholder="Enter your age" :aria-invalid="Boolean(errors.age)"
                        :aria-describedby="errors.age ? 'age-error' : undefined" />

                    <small v-if="errors.age" id="age-error" class="field-error">
                        {{ errors.age }}
                    </small>
                </div>

                <!-- Submit button -->
                <button type="submit" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Registering...' : 'Register' }}
                </button>

                <!-- General error message -->
                <p v-if="errorMessage" class="error-message" role="alert">
                    {{ errorMessage }}
                </p>
                <div class="login-link">
                    <span>Already have an account?</span>

                    <button @click="router.push('/login')">
                        Login
                    </button>
                </div>

            </form>
        </section>

        <!-- Success popup -->
        <div v-if="showSuccessPopup" class="popup-overlay" @keydown.esc="handlePopupCancel">
            <section class="success-popup" role="dialog" aria-modal="true" aria-labelledby="popup-title">
                <div class="success-icon">✓</div>

                <h2 id="popup-title">Registering User</h2>

                <p>{{ successMessage }}</p>

                <!-- <p class="popup-note">
                    Your registration has been submitted.
                </p> -->

                <div class="popup-actions">
                    <button type="button" class="cancel-button" @click="handlePopupCancel">
                        Cancel
                    </button>

                    <button type="button" class="ok-button" @click="handlePopupOk">
                        OK
                    </button>
                </div>
            </section>
        </div>

    </main>
</template>

<style>
/* Apply consistent sizing to all elements. */
* {
    box-sizing: border-box;
}

/* Page background and default font. */
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f3f4f6;
    color: #1f2937;
}

/* Center the registration card on the page. */
.page {
    min-height: 100vh;
    padding: 40px 16px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

/* Registration card. */
.app {
    width: 100%;
    max-width: 420px;
    padding: 30px;
    background: white;
    border-radius: 14px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

h1 {
    margin: 0 0 8px;
    text-align: center;
    font-size: 26px;
}

.subtitle {
    margin: 0 0 28px;
    text-align: center;
    color: #6b7280;
}

/* Each label and input group. */
.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 7px;
    font-size: 14px;
    font-weight: 600;
}

/* Form inputs. */
input {
    display: block;
    width: 100%;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 7px;
    font-size: 15px;
    background: white;
}

input:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
}

/* Highlight fields with validation errors. */
input[aria-invalid="true"] {
    border-color: #dc2626;
}

/* Field-level validation messages. */
.field-error {
    display: block;
    margin-top: 6px;
    color: #dc2626;
    font-size: 12px;
    line-height: 1.5;
}

/* Main Register button. */
button {
    border: none;
    border-radius: 7px;
    padding: 12px 18px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
}

form>button {
    width: 100%;
    background: #4f46e5;
    color: white;
}

form>button:hover:not(:disabled) {
    background: #3730a3;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* API error message. */
.error-message {
    margin: 16px 0 0;
    padding: 12px;
    border-radius: 7px;
    background: #fee2e2;
    color: #991b1b;
    font-size: 14px;
}

/* Popup backdrop covers the page. */
.popup-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;

    display: flex;
    justify-content: center;
    align-items: flex-start;

    padding: 30px 16px;
    background: rgba(17, 24, 39, 0.55);
}

/* Success popup appears near the top-center. */
.success-popup {
    width: 100%;
    max-width: 440px;
    margin-top: 10px;
    padding: 28px;

    background: white;
    border-radius: 14px;
    text-align: center;

    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);

    animation: popup-enter 0.2s ease-out;
}

/* Green checkmark. */
.success-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 54px;
    height: 54px;
    margin: 0 auto 16px;

    border-radius: 50%;
    background: #dcfce7;
    color: #15803d;

    font-size: 30px;
    font-weight: bold;
}

.success-popup h2 {
    margin: 0 0 12px;
    font-size: 22px;
}

.success-popup p {
    line-height: 1.6;
}

.popup-note {
    color: #6b7280;
    font-size: 13px;
}

/* OK and Cancel buttons. */
.popup-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 24px;
}

.cancel-button {
    background: #e5e7eb;
    color: #374151;
}

.cancel-button:hover {
    background: #d1d5db;
}

.ok-button {
    min-width: 100px;
    background: #16a34a;
    color: white;
}

.ok-button:hover {
    background: #15803d;
}

/* Small entrance animation. */
@keyframes popup-enter {
    from {
        opacity: 0;
        transform: translateY(-12px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Make the form comfortable on mobile screens. */
@media (max-width: 480px) {
    .page {
        padding: 24px 12px;
    }

    .app {
        padding: 22px;
    }

    .success-popup {
        padding: 22px;
    }
}

.users-section {
    margin-top: 30px;
    padding-top: 25px;
    border-top: 1px solid #e5e7eb;
}

.users-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
}

.users-header h2 {
    margin: 0;
    font-size: 20px;
}

.refresh-button {
    padding: 9px 12px;
    background: #e5e7eb;
    color: #374151;
    font-size: 13px;
}

.refresh-button:hover:not(:disabled) {
    background: #d1d5db;
}

.users-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.user-card {
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f9fafb;
}

.user-card h3 {
    margin: 0 0 10px;
    font-size: 17px;
}

.user-card p {
    margin: 5px 0;
    font-size: 14px;
}

.empty-message {
    color: #6b7280;
    font-size: 14px;
}
</style>