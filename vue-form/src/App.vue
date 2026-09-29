<script setup>
import { reactive, ref, onMounted } from 'vue';
import { createUser, getUsers } from './services/userService.js';

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

const users = ref([]);
const isLoadingUsers = ref(false);
const usersError = ref('');

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

    // Call our separate API service function.
    const data = await createUser(userData);
    // Get the latest users from NestJS
    await loadUsers();

    successMessage.value =
      data.message || 'User created successfully!';

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
function handlePopupOk() {
  showSuccessPopup.value = false;
  resetForm();
}

/*
  Cancel only dismisses the popup.
  The submitted user is NOT deleted or undone.
*/
function handlePopupCancel() {
  showSuccessPopup.value = false;
}

async function loadUsers() {
  isLoadingUsers.value = true;
  usersError.value = '';

  try {
    // Call GET /users
    users.value = await getUsers();
  } catch (error) {
    console.error('Failed to load users:', error);

    usersError.value = 'Unable to load users.';
  } finally {
    isLoadingUsers.value = false;
  }
}
onMounted(() => {
  loadUsers();
});

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
            :aria-invalid="Boolean(errors.name)" :aria-describedby="errors.name ? 'name-error' : undefined" />

          <small v-if="errors.name" id="name-error" class="field-error">
            {{ errors.name }}
          </small>
        </div>

        <!-- Email field -->
        <div class="form-group">
          <label for="email">Email</label>

          <input id="email" v-model="form.email" type="email" placeholder="Enter your email"
            :aria-invalid="Boolean(errors.email)" :aria-describedby="errors.email ? 'email-error' : undefined" />

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

          <input id="age" v-model="form.age" type="number" min="18" max="100" step="1" placeholder="Enter your age"
            :aria-invalid="Boolean(errors.age)" :aria-describedby="errors.age ? 'age-error' : undefined" />

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
      </form>
    </section>

    <!-- Success popup -->
    <div v-if="showSuccessPopup" class="popup-overlay" @keydown.esc="handlePopupCancel">
      <section class="success-popup" role="dialog" aria-modal="true" aria-labelledby="popup-title">
        <div class="success-icon">✓</div>

        <h2 id="popup-title">User Created Successfully!</h2>

        <p>{{ successMessage }}</p>

        <p class="popup-note">
          Your registration has been submitted.
        </p>

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
    <!-- Users list -->
    <section class="users-section">
      <div class="users-header">
        <h2>Registered Users</h2>

        <button type="button" class="refresh-button" @click="loadUsers" :disabled="isLoadingUsers">
          {{ isLoadingUsers ? 'Loading...' : 'Refresh Users' }}
        </button>
      </div>

      <!-- Loading -->
      <p v-if="isLoadingUsers">
        Loading users...
      </p>

      <!-- Error -->
      <p v-else-if="usersError" class="error-message">
        {{ usersError }}
      </p>

      <!-- No users -->
      <p v-else-if="users.length === 0" class="empty-message">
        No users registered yet.
      </p>

      <!-- Users -->
      <div v-else class="users-list">
        <article v-for="user in users" :key="user.id" class="user-card">
          <h3>{{ user.name }}</h3>

          <p>
            <strong>Email:</strong>
            {{ user.email }}
          </p>

          <p>
            <strong>Age:</strong>
            {{ user.age }}
          </p>

          <p>
            <strong>ID:</strong>
            {{ user.id }}
          </p>
        </article>
      </div>
    </section>

  </main>
</template>