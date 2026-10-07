import { createBrowserRouter, RouterProvider } from 'react-router'
import Portfolio from './components/Portfolio';
import NotFound from './components/NotFound';
import Profile from './components/Profile';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Portfolio />,
    children: [
      { index: true },
      { path: "projects/:slug" },
    ],
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "*",
    element: <NotFound />
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
