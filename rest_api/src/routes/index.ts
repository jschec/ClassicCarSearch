import express, { Router } from 'express';
import carListingRoutes from './car-listing';
import carSellerRoutes from './car-seller';
import carRoutes from './car';
import searchForecastRoutes from './search-forecast';
import searchRoutes from './search';
import subscriptionRoutes from './subscription';
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
    prefix: "/car-listings",
    routes: carListingRoutes
  },
  {
    prefix: "/cars",
    routes: carRoutes
  },
  {
    prefix: "/car-sellers",
    routes: carSellerRoutes
  },
  {
    prefix: "/search-forecasts",
    routes: searchForecastRoutes
  },
  {
    prefix: "/searches",
    routes: searchRoutes
  },
  {
    prefix: "/subscriptions",
    routes: subscriptionRoutes
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