import { Router } from 'express';
import express from 'express';
import autotempestRoute from './autotempest';

const router = express.Router();

interface IRoute {
    prefix: string;
    routes: Router;
}

// Definition of route collections
const routeCollections: IRoute[] = [
    {
        prefix: "/autotempest",
        routes: autotempestRoute
    }
];

// Add collections of routes to the express application router
routeCollections.forEach((routeCollection) => {
    router.use(routeCollection.prefix, routeCollection.routes);
});

export default router;