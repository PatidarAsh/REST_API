const express = require('express');

const planRoute = require('./plan.route');
const rootRoute = require('./root.route');

const router = express.Router();

const routes = [{
        path: '/plan',
        route: planRoute,
    },
    {
        path: '/',
        route: rootRoute
    }
];


routes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;