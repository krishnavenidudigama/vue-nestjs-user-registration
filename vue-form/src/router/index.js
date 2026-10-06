
import { createRouter, createWebHistory } from 'vue-router';

import RegistrationPage from '../views/RegistrationPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import LoginPage from '../views/LoginPage.vue';

const routes = [
    {
        path: '/',
        redirect: '/register',
    },
    {
        path: '/register',
        component: RegistrationPage,
    },
    {
        path: '/login',
        component: LoginPage,
    },
    {
        path: '/dashboard',
        component: DashboardPage,

        // This route requires an authenticated session.
        meta: {
            requiresAuth: true,
        },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Run this check before navigating to a route.
router.beforeEach((to) => {

    // Does this route require login?
    if (to.meta.requiresAuth) {

        // Check whether a JWT exists in this browser tab.
        const token = sessionStorage.getItem('token');

        // No token? Redirect to the login page.
        if (!token) {
            return '/login';
        }
    }

    // Otherwise, allow navigation.
    return true;
});

export default router;