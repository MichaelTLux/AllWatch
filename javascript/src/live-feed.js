import React from 'react';
import {connect} from 'react-redux';
import Webcam from "react-user-media";
import {saveAs} from "file-saver";
import CapturedImage from "./captured-image";
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

function renderShowCaptureText(showCaptured) {
    if (showCaptured) {
        return "Hide Captured Images";
    }
    return "Show Captured Images";
}

function renderRecordingBorder(isRunning) {
    if (isRunning) {
        return " live";
    }

    return "";
}

function renderCapturedImages() {
    const {capturedMovement, showCaptured, deleteCapturedImage, saveCapturedImage} = this.props;

    if (showCaptured) {
        return capturedMovement.map((image, index) =>
            <Cell col={6}>
                <CapturedImage
                    image={image}
                    index={index}
                    deleteImage={deleteCapturedImage}
                    saveImage={saveCapturedImage}
                    key={index}
                />
            </Cell>
        );
    }
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
}

function saveScreenShot() {
    var file = dataURLtoFile(this.props.oldImage, 'a.png');
    saveAs(file);
}

export class LiveFeed extends React.Component {
    componentWillMount() {
        const refreshRate = this.props.refreshRate * 1000;
        interval = window.setInterval(checkMovement.bind(this), refreshRate);
    }

    componentWillReceiveProps(nextProps) {
        const oldRefresh = this.props.refreshRate,
            newRefresh = nextProps.refreshRate;

        if (oldRefresh !== newRefresh) {
            const newRate = nextProps.refreshRate * 1000;
            clearInterval(interval);
            interval = window.setInterval(checkMovement.bind(this), newRate);
        }
    }

    render() {
        const {
            isRunning,
            toggleIsRunning,
            refreshRate,
            sensitivity,
            handleChange,
            feedFrequency,
            showCaptured,
            toggleShowCaptured
        } = this.props;

        return (
            <Card shadow={1} className="section-card">
                <CardTitle>
                    Camera Feed
                </CardTitle>
                <CardText>
                    <Grid>
                        <Cell col={2}/>
                        <Cell col={8}>
                            <div className={`webcam-container${renderRecordingBorder.call(null, isRunning)}`}>
                                <Webcam
                                    ref="webcam"
                                    audio={false}
                                />
                            </div>
                        </Cell>
                    </Grid>
                    <Grid>
                        <Cell col={9}>
                            <div className="video-feed-button-container">
                                <Button onClick={toggleIsRunning}>{getOnOffText.call(null, isRunning)}</Button>
                                <Button onClick={saveScreenShot.bind(this)}>Save screen shot</Button>
                                <Button onClick={toggleShowCaptured}>{renderShowCaptureText(showCaptured)}</Button>
                            </div>
                        </Cell>
                    </Grid>
                    <Grid>
                        <Cell col={4} className="video-feed-input">
                            <label>Refresh Rate</label>
                            <br/>
                            <input
                                type="text"
                                className="mousetrap"
                                value={refreshRate}
                                name="Refresh"
                                onChange={handleChange.bind(null, "Refresh")}
                            />
                        </Cell>
                        <Cell col={4} className="video-feed-input">
                            <label>Sensitivity</label>
                            <br/>
                            <input
                                type="text"
                                value={sensitivity}
                                name="Sensitivity"
                                onChange={handleChange.bind(null, "Sensitivity")}
                            />
                        </Cell>
                        <Cell col={4} className="video-feed-input">
                            <label>Pictures/Second</label>
                            <br/>
                            <input
                                type="text"
                                value={feedFrequency}
                                name="FeedFrequency"
                                onChange={handleChange.bind(null, "FeedFrequency")}
                            />
                        </Cell>
                    </Grid>
                    <Grid className="captured-images">
                        {renderCapturedImages.call(this)}
                    </Grid>
                </CardText>
            </Card>
        );
    }
}

export function mapStateToProps(state) {
    const {isRunning, isMoving, refreshRate, sensitivity, oldImage, feedFrequency, capturedMovement, showCaptured} = state.liveFeed;
    return {
        isRunning,
        isMoving,
        refreshRate,
        sensitivity,
        oldImage,
        feedFrequency,
        showCaptured,
        capturedMovement
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
        },
        toggleShowCaptured() {
            const action = {
                type: Actions.liveFeed.toggleShowCaptured
            };

            dispatch(action);
        },
        deleteCapturedImage(index) {
            const action = {
                type: Actions.liveFeed.deleteCapturedImage,
                value: index
            };

            dispatch(action);
        },
        saveCapturedImage(index) {
            const action = {
                type: Actions.liveFeed.saveCapturedImage,
                value: index
            };

            dispatch(action);
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LiveFeed);
