import React from 'react';
import {connect} from 'react-redux';
import Webcam from "react-user-media";
import resemble from 'resemblejs'
require('../css/main.css');
require('../sass/live-feed.scss');

const Actions = require('./reducers/actions')();

import {Card, CardTitle, CardText, Grid, Cell, Button} from 'react-mdl';

export class LiveFeed extends React.Component {
    render() {
        const {saveScreenShot} = this.props;

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
                        <Button onClick={compareScreenShots.bind(this)}>Compare Images</Button>
                        <Button onClick={saveScreenShot.bind(this)}>Save</Button>
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
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(LiveFeed);
