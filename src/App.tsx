import './app.css'
import React from 'react';
import { Routes, Route, Link} from 'react-router-dom';
import Home from './Home';
import About from './About';
import SideBar from './SideBar';

function App() {
  const [isOpen, setIsOpen] = React.useState(false);

  return(
    <div id="view">
      <header id="header">
        <nav>
          <div id="tabbar">
            <Link to="/"><img src="/logo.png" alt="logo" id="logo"></img></Link>
            <button onClick={() => setIsOpen(!isOpen)}id="menu"><img src="/menu.png" alt="menu" id="menu"></img></button>
          </div>
        </nav>
      </header>
      <aside className={`sidebar-container ${isOpen ? "is-open" : ""}`}>
        <SideBar/>
      </aside>
      <Routes>\
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <div id="foot">
        <div id="line"></div>
          <p>&copy; 2026 Seojoon Lee | All assets hand made.</p>
        </div>
    </div>
  );
}

export default App
