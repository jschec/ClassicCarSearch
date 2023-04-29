import express, { Router } from 'express';
import listingRoutes from './listing';
import searchRoutes from './search';
import userRoutes from './user';
import watchListRoutes from './watch-list';

const router = express.Router();

interface IRoute {
  prefix: string;
  routes: Router;
}

// Definition of route collections
const routeCollections: IRoute[] = [
  {
    prefix: "/listings",
    routes: listingRoutes
  },
  {
    prefix: "/searches",
    routes: searchRoutes
  },
  {
    prefix: "/users",
    routes: userRoutes
  },
  {
    prefix: "/watch-lists",
    routes: watchListRoutes
  }
];

// Add collections of routes to the express application router
routeCollections.forEach((routeCollection) => {
  router.use(routeCollection.prefix, routeCollection.routes);
});

export default router;