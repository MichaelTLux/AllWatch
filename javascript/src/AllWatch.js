import React from 'react';

import NavBar from './nav-bar';
import Drawer from './drawer';
import LiveFeed from './live-feed';
import '../sass/all-watch.scss';

export default class AllWatch extends React.Component {
    render() {
        return (
            <div className="all-watch">
                <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-color--grey-100">
                    <NavBar/>
                    <Drawer/>
                    <main className="mdl-layout__content">
                        <div className="header-space"/>
                        <div className="page-content">
                            <LiveFeed/>
                        </div>
                    </main>
                </div>
            </div>
        );
    }
}
