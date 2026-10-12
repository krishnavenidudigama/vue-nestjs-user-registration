<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUsers } from '../services/userService'
import { ElButton, ElContainer, ElMain } from 'element-plus'
import { Search, Moon, Sunny } from '@element-plus/icons-vue'


const isDark = ref(false)
const totalUsers = ref(0)

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

// Filter the users currently loaded from the API.
const filterTableData = computed(() => {
    const search = searchText.value.trim().toLowerCase()

    if (!search) {
        return users.value
    }

    return users.value.filter(user =>
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search)
    )
})

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


function handlePageChange(page) {
    currentPage.value = page
    loadUsers()
}

// Navigate to the Add Employee page
function gotoAddEmployee() {
    // Navigate to the Add Employee page
    router.push( '/employees/add' )
}

</script>


<template>
    <div class="dashboard" :class="{ 'dark-theme': isDark }">
        <!-- Header -->
        <div class="header-actions">
            <el-header class="dashboard-header">
                <div class="header-title">
                    <h1>Dashboard</h1>
                    <p>Registered Users</p>
                </div>

                <div class="search-section">
                    <el-input v-model="searchText" placeholder="Search by name or email..." clearable>
                        <template #prefix>
                            <el-icon>
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                </div>
                <el-button circle @click="isDark = !isDark" aria-label="Toggle dark mode">
                    <el-icon>
                        <Moon v-if="!isDark" />
                        <Sunny v-else />
                    </el-icon>
                </el-button>
            </el-header>
        </div>


        <!-- Main dashboard area -->
        <div class="dashboard-body">

            <!-- Sidebar -->
            <el-aside class="dashboard-sidebar" width="280px">
                <div class="sidebar-card">
                    <!-- User count -->
                    <div class="user-count">
                        <span>Users Shown:</span>
                        <p> {{ users.length }} </p>
                    </div>

                    <!-- Add User button -->
                    <el-button class="sidebar-button add-user-button" @click="addUser">
                        Add User
                    </el-button>
                    <el-button class="sidebar-button add-employee-button" @click="gotoAddEmployee">

                        Add Employee
                    </el-button>
                    <el-button class="sidebar-button employee-list-button" @click="employeeList">
                        Employee List
                    </el-button>

                    <!-- Logout button at the bottom -->
                    <el-button class="sidebar-button logout-button" type="danger" @click="logout">
                        Logout
                    </el-button>
                </div>
            </el-aside>



            <!-- Table content -->
            <main class="dashboard-content">
                <p v-if="loading" class="loading-message">
                    Loading users...
                </p>

                <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" />

                <el-table v-if="!loading && filterTableData.length > 0" :data="filterTableData" border stripe
                    class="users-table" style="width: 100%">
                    <el-table-column label="ID" prop="id" width="80" />

                    <el-table-column label="Name" prop="name" min-width="150" />

                    <el-table-column label="Email" prop="email" min-width="220" />

                    <el-table-column label="Age" prop="age" width="100" />
                </el-table>

                <el-empty v-if="!loading && !error && filterTableData.length === 0" description="No users found" />

                <!-- Pagination -->
                <div class="pagination">

                    <el-pagination background layout="prev, pager, next" :current-page="currentPage" :page-size="limit"
                        :total="50" @current-change="handlePageChange" />

                </div>
            </main>
        </div>

        <!-- Footer stays at the bottom -->
        <footer class="dashboard-footer">
            User Management Dashboard
        </footer>
    </div>
</template>


<style scoped>
/* Full-page dashboard layout */
.dashboard {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f5f7fa;
    color: #303133;
}

/* Top header */
.dashboard-header {
    height: auto;
    min-height: 100px;
    padding: 24px 32px;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    gap: 24px;

    background: white;
    border-bottom: 1px solid #e4e7ed;
}

/* Title and subtitle */
.header-title h1 {
    margin: 0 0 8px;
    font-size: 28px;
}

.header-title p {
    margin: 0;
    color: #606266;
}

.header-actions {
    display: block;
    width: 100%;
}

.search-input {
    width: 320px;
}

.theme-toggle {
    flex-shrink: 0;
    margin: 0;
}

/* Search field */
.search-section {
    display: flex;
    width: 320px;
    max-width: 100%;
    margin-left: auto;
}

/* Sidebar and main content */
.dashboard-body {
    flex: 1;
    display: flex;
    align-items: stretch;
    gap: 24px;
    padding: 28px 32px 0;
}

/* Sidebar */
.dashboard-sidebar {
    flex: 0 0 280px;
    width: 280px;
    min-width: 280px;
    align-self: stretch;
    display: flex;
}

.sidebar-card {
    width: 100%;
    padding: 20px;
    background: white;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    box-sizing: border-box;
    min-height: 100%;
    display: flex;
    flex-direction: column;
}

/* User count */
.user-count {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    font-size: 14px;
}

/* Sidebar buttons */
.sidebar-button {
    width: 100%;
    margin: 0 0 12px !important;
}

/* Add User: white background */
.add-user-button {
    color: #0b0c0e !important;
    background: white !important;
    border: 1px solid #e4effa !important;
}

/* Hover effect for Add User */
.add-user-button:hover {
    color: #409eff !important;
    background: #ecf5ff !important;
    border-color: #409eff !important;
}

/* Logout moves to the bottom */
.logout-button {
    margin-top: auto !important;
    margin-bottom: 0 !important;
}

.sidebar-button:last-child {
    margin-bottom: 0;
}

/* Main table section */
.dashboard-content {
    flex: 1;
    min-width: 0;
    padding: 20px;
    background: white;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    box-sizing: border-box;
}

/* Table */
.users-table {
    width: 100%;
}

/* Loading message */
.loading-message {
    color: #606266;
    padding: 12px 0;
}

/* Pagination */
.pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 24px;
}

/* Footer stays at bottom when content is short */
.dashboard-footer {
    margin-top: auto;
    padding: 18px 32px;
    text-align: center;
    font-size: 13px;
    color: #909399;
    background: white;
    border-top: 1px solid #e4e7ed;
}

/* Dark theme styles */
/* Smooth color transition */
.dashboard,
.dashboard-header,
.sidebar-card,
.dashboard-content,
.dashboard-footer {
    transition: background-color 0.3s ease, color 0.3s ease;
}

/* Main dashboard background and text */
.dashboard.dark-theme {
    background: #181a1b;
    color: #e4e7ed;
}

/* Header */
.dashboard.dark-theme .dashboard-header {
    background: #242526;
    color: #e4e7ed;
    border-bottom-color: #414243;
}

/* Dashboard title and subtitle */
.dashboard.dark-theme .header-title p {
    color: #c0c4cc;
}

/* Sidebar */
.dashboard.dark-theme .sidebar-card {
    background: #242526;
    color: #e4e7ed;
    border-color: #414243;
}

/* Main table area */
.dashboard.dark-theme .dashboard-content {
    background: #242526;
    color: #e4e7ed;
    border-color: #414243;
}

/* Footer */
.dashboard.dark-theme .dashboard-footer {
    background: #242526;
    color: #c0c4cc;
    border-top-color: #414243;
}

/* Table background, text, and borders */
.dashboard.dark-theme :deep(.el-table),
.dashboard.dark-theme :deep(.el-table tr),
.dashboard.dark-theme :deep(.el-table th.el-table__cell),
.dashboard.dark-theme :deep(.el-table td.el-table__cell) {
    background-color: #242526;
    color: #e4e7ed;
    border-color: #414243;
}

/* Table row hover */
.dashboard.dark-theme :deep(.el-table__body tr:hover > td.el-table__cell) {
    background-color: #343638;
}

/* Table's outer border */
.dashboard.dark-theme :deep(.el-table--border::after),
.dashboard.dark-theme :deep(.el-table--border::before),
.dashboard.dark-theme :deep(.el-table__inner-wrapper::before) {
    background-color: #414243;
}

/* Search input */
.dashboard.dark-theme :deep(.el-input__wrapper) {
    background-color: #303234;
    box-shadow: 0 0 0 1px #505256 inset;
}

.dashboard.dark-theme :deep(.el-input__inner) {
    color: #e4e7ed;
}

.dashboard.dark-theme :deep(.el-input__inner::placeholder) {
    color: #a8abb2;
}

/* Theme toggle button */
.dashboard.dark-theme .theme-toggle {
    background: #303234;
    color: #e4e7ed;
    border-color: #505256;
}

/* Loading and empty-state text */
.dashboard.dark-theme .loading-message {
    color: #c0c4cc;
}



/* Responsive layout for smaller screens */
@media (max-width: 700px) {
    .dashboard-header {
        align-items: stretch;
        flex-direction: column;
        padding: 20px;
    }

    .search-section {
        width: 100%;
    }

    .dashboard-body {
        flex-direction: column;
        padding: 20px;
    }

    .dashboard-sidebar {
        width: 100%;
    }

    .dashboard-content {
        width: 100%;
        padding: 12px;
    }

    .pagination {
        justify-content: center;
        flex-wrap: wrap;
    }
}
</style>