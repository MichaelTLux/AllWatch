import React from 'react';
import '../sass/nav-bar.scss';

export default class Navbar extends React.Component {
    render() {
        return (
            <header className="mdl-layout__header mdl-layout__header--scroll">
                <div className="mdl-layout__header-row">
                    <span className="mdl-layout-title">AllWatch</span>
                </div>
            </header>
        );
    }
}

