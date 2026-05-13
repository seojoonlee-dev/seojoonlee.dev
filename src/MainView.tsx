import React from "react";
import SideBarOpened from "./SideBarOpened";

function MainView() {
    const [isOpen, setIsOpen] = React.useState(false);

    return(
        <div id="main">
            <header id="header">
                <nav>
                    <div id="tabbar">
                        <button><a href="/"><img src="/logo.png" alt="logo" id="logo"></img></a></button>
                        <button onClick={() => setIsOpen(!isOpen)}id="menu"><img src="/menu.png" alt="menu" id="menu"></img></button>
                    </div>
                </nav>
            </header>
            <div id="name">
                <h1>Seojoon Lee</h1>
                <div id="contacts">
                    <p>seojoonlee@korea.ac.kr</p>
                    <p>010-4161-1462</p>
                </div>
            </div>
            <aside className={`sidebar-container ${isOpen ? "is-open" : ""}`}>
                <SideBarOpened/>
            </aside>
            <div id="content">
                
            </div>
            <div id="foot">
                <div id="line"></div>
                <p>&copy; 2026 Seojoon Lee | All assets hand made.</p>
            </div>
        </div>
    );
}

export default MainView;