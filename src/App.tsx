import './style/App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './components/Home';
import Resume from './components/Resume';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/resume",
    element: <Resume />
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
