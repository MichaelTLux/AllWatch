import React from 'react';

export default class Drawer extends React.Component {
    render() {
        return (
            <div className="mdl-layout__drawer" ref="drawer">
                <span className="mdl-layout-title">Actions</span>
                <nav className="mdl-navigation">
                    <a className="mdl-navigation__link">
                        Export Days Files
                    </a>
                </nav>
            </div>
        );
    }
}
