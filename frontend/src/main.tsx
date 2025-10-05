import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@fontsource/lato";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import BaseLayout from './layouts/base-layout';

import './index.css'
import HomeRoute from './routes/home-route';
import GameRoute from './routes/game-route';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRoute />,
  },
  {
    path: "/game/:gameId",
    element: <GameRoute />,
  }
]);

createRoot(document.getElementById("root")!).render(
  <BaseLayout>
    <RouterProvider router={router} />
  </BaseLayout>
);