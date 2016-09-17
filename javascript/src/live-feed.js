import React from 'react';
import {connect} from 'react-redux';
import Webcam from "react-user-media";
require('../css/main.css');
require('../sass/live-feed.scss');

const Actions = require('./reducers/actions')();

let interval;

import {Card, CardTitle, CardText, Grid, Cell, Button} from 'react-mdl';

function checkMovement() {
    const {isRunning, saveScreenShot} = this.props;

    if (isRunning) {
        saveScreenShot.call(this);
    }
}

function getOnOffText(isRunning) {
    if (isRunning) {
        return "Turn Off"
    } else {
        return "Turn On"
    }
}

function renderRecordingCircle(isRunning) {
    if (isRunning) {
        return (
            <div id="circle"></div>
        );
    } else {
        return <div/>;
    }
}

function renderMovingNotification(isMoving) {
    if (isMoving) {
        return (
            <Card col={9}>
                THERE IS MOVEMENT
            </Card>
        );
    } else {
        return <Card col={9}/>
    }
}

export class LiveFeed extends React.Component {
    componentWillMount() {
        const refreshRate = this.props.refreshRate * 1000;
        interval = window.setInterval(checkMovement.bind(this), );
    }

    componentWillReceiveProps(nextProps) {
        const oldRefresh = this.props.refreshRate,
            newRefresh = nextProps.refreshRate;

        if (oldRefresh !== newRefresh) {
            const newRate = nextProps.refreshRate * 1000;
            console.log('newRate', newRate);
            clearInterval(interval);
            interval = window.setInterval(checkMovement.bind(this), newRate);
        }
    }

    render() {
        const {isRunning, isMoving, toggleIsRunning, refreshRate, sensitivity, handleChange} = this.props;

        return (
            <Card shadow={1} className="section-card">
                <CardTitle>
                    Camera Feed
                </CardTitle>
                <CardText>
                    <Grid>
                        <Cell col={9}>
                            <Webcam ref="webcam"/>
                        </Cell>
                        <Cell col={3}>
                            {renderRecordingCircle.call(null, isRunning)}
                        </Cell>
                        <Cell col={3}>
                            This is the camera live feed
                            {renderMovingNotification.call(null, isMoving)}
                        </Cell>
                        <Cell col={9}>
                            <Button onClick={toggleIsRunning}>{getOnOffText.call(null, isRunning)}</Button>
                        </Cell>
                        <Cell col={6}>
                            RefreshRate(in seconds)
                            <input
                                type="text"
                                className="mousetrap"
                                value={refreshRate}
                                name="Refresh"
                                onChange={handleChange.bind(null, "Refresh")}
                            />
                        </Cell>
                        <Cell col={6}>
                            Sensitivity(0 is for catching fly movements, 100 would let an elephant run by
                            <input
                                type="text"
                                value={sensitivity}
                                name="Sensitivity"
                                onChange={handleChange.bind(null, "Sensitivity")}
                            />
                        </Cell>
                    </Grid>
                </CardText>
            </Card>
        );
    }
}

export function mapStateToProps(state) {
    const {isRunning, isMoving, refreshRate, sensitivity} = state.liveFeed;
    return {
        isRunning,
        isMoving,
        refreshRate,
        sensitivity
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
        },
        handleChange(name, event) {
            const value = event.target.value,
                action = {
                    type: Actions.liveFeed[`set${name}`],
                    value
                };

            dispatch(action);
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LiveFeed);
