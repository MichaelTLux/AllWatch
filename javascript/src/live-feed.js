import React from 'react';
import {connect} from 'react-redux';
import Webcam from "react-user-media";
require('../css/main.css');
require('../sass/live-feed.scss');

const Actions = require('./reducers/actions')();

import {Card, CardTitle, CardText, Grid, Cell, Button} from 'react-mdl';

function checkMovement() {
    const {isRunning, saveScreenShot} = this.props;

    if (isRunning) {
        saveScreenShot.call(this);
    }
}

function getOnOffText(isRunning){
    if (isRunning) {
        return "Turn Off"
    } else {
        return "Turn On"
    }
}

export class LiveFeed extends React.Component {
    componentWillMount() {
        window.setInterval(checkMovement.bind(this), 1000)
    }

    render() {
        const {isRunning, toggleIsRunning} = this.props;

        return (
            <Card shadow={1} className="section-card">
                <CardTitle>
                    Camera Feed
                </CardTitle>
                <CardText>
                    <Grid>
                        <Cell col={12}>
                                <Webcam ref="webcam"/>
                        </Cell>
                        <Cell col={12}>
                            This is the camera live feed
                        </Cell>
                        <Button onClick={toggleIsRunning}>{getOnOffText.call(null, isRunning)}</Button>
                    </Grid>
                </CardText>
            </Card>
        );
    }
}

export function mapStateToProps(state) {
    return {
        isRunning: state.liveFeed.isRunning,
        isMoving: state.liveFeed.isMoving
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        saveScreenShot() {
            const action = {
                type: Actions.liveFeed.updatePhotos,
                value: this.refs.webcam.captureScreenshot()
            };

            dispatch(action);
        },
        toggleIsRunning() {
            const action = {
                type: Actions.liveFeed.toggleIsRunning
            };

            dispatch(action);
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(LiveFeed);
