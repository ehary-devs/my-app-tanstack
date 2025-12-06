import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: true,
  minimum: 0.1,
  trickleSpeed: 200,
});

export const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// router events
router.subscribe("onBeforeLoad", ({ fromLocation, pathChanged }) => {
  if (fromLocation && pathChanged) {
    NProgress.start();
  }
});

router.subscribe("onLoad", ({ fromLocation, pathChanged }) => {
  if (fromLocation && pathChanged) {
    NProgress.done();
  }
});
