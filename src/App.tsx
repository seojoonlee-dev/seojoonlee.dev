import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './components/Home';
import About from './components/About';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />
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
