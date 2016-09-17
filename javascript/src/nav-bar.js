import React from 'react';

export default class Navbar extends React.Component {
    render() {
        return (
            <header className="mdl-layout__header">
                <div className="mdl-layout__header-row">
                    <span className="mdl-layout-title">AllWatch</span>
                    <div className="mdl-layout-spacer"></div>
                    <nav className="mdl-navigation mdl-layout--large-screen-only">
                        <a href="#CameraFeed" className="mdl-navigation__link navLink paddingBefore">Camera Feed</a>
                    </nav>
                </div>
            </header>
        );
    }
}

