<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUsers } from '../services/userService'

const router = useRouter()
const route = useRoute()

const users = ref([])
const loading = ref(false)
const error = ref('')
const currentPage = ref(
    Number(route.query.page) || 1
)
const limit = ref(
    Number(route.query.limit) || 5
)

const searchText = ref(
    route.query.search || ''
)

// Add User button
function addUser() {
    router.push('/register')
}

// Get users from NestJS
async function loadUsers() {
    loading.value = true
    error.value = ''

    try {
        const result = await getUsers(
            currentPage.value,
            limit.value,
            searchText.value
        )

        users.value = result

        router.replace({
            query: {
                page: currentPage.value,
                limit: limit.value,
                search: searchText.value || undefined
            }
        })

    } catch (err) {
        // Print the real error in the browser console.
        console.error('Error loading users:', err);

        // Display a useful message on the dashboard.
        error.value = err.message || 'Failed to load users';
    } finally {
        loading.value = false;
    }
}

// Search when search text changes
watch(searchText, () => {
    currentPage.value = 1
    loadUsers()
})

// Logout
function logout() {
    // Remove the JWT from this browser tab's session.
    sessionStorage.removeItem('token');

    // Return to the login page.
    router.push('/login');
}

// Load users when dashboard opens
onMounted(() => {
    loadUsers()
})

function nextPage() {
    currentPage.value++
    loadUsers()
}

function previousPage() {
    if (currentPage.value > 1) {
        currentPage.value--
        loadUsers()
    }
}

</script>


<template>

    <div class="dashboard">

        <div class="dashboard-header">

            <div>
                <h1>Dashboard</h1>
                <p>Registered Users</p>
            </div>

            <!-- Add User and Logout buttons -->
            <button @click="addUser">
                + Add User
            </button>

            <button class="logout-button" @click="logout">
                Logout
            </button>

        </div>


        <!-- Search -->

        <div class="search-section">

            <input v-model="searchText" type="text" placeholder="Search by name or email..." />

        </div>


        <!-- User count -->

        <div class="user-count">

            Users Shown:
            <strong>{{ users.length }}</strong>

        </div>


        <!-- Loading -->

        <p v-if="loading">
            Loading users...
        </p>


        <!-- Error -->

        <p v-if="error">
            {{ error }}
        </p>


        <!-- Users table -->

        <table v-if="!loading && users.length > 0">

            <thead>

                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Age</th>
                </tr>

            </thead>

            <tbody>

                <tr v-for="user in users" :key="user.id">

                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.age }}</td>

                </tr>

            </tbody>

        </table>

        <div class="pagination">

            <button @click="previousPage" :disabled="currentPage === 1">
                Previous
            </button>

            <span>
                Page {{ currentPage }}
            </span>

            <button @click="nextPage" :disabled="users.length < limit">
                Next
            </button>

        </div>


        <!-- No users -->

        <p v-if="!loading && users.length === 0">
            No users found.
        </p>

    </div>

</template>
<style scoped>
.dashboard {
    max-width: 1000px;
    margin: 40px auto;
    padding: 30px;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.dashboard-header h1 {
    margin: 0;
}

.dashboard-actions {
    display: flex;
    gap: 10px;
}

.logout-button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.search-section {
    margin-bottom: 20px;
}

.search-section input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
}

.user-count {
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
}

th {
    font-weight: bold;
}
</style>