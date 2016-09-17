import React from 'react';
import Webcam from "react-user-media";
import resemble from 'resemblejs'
require('../css/main.css');
require('../sass/live-feed.scss');

import {Card, CardTitle, CardText, Grid, Cell, Button} from 'react-mdl';

let oldimage,
    newimage;

function saveImage(){
    oldimage =newimage;
    newimage = this.refs.webcam.captureScreenshot();
}

function getScreenShot(){
    var diff = resemble(oldimage).compareTo(newimage).ignoreColors().onComplete(function(data){
        console.log(data);
    });

    console.log('diff', diff);
}

export default class LiveFeed extends React.Component {
    render() {
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
                        <Button onClick={getScreenShot.bind(this)}>Compare Images</Button>
                        <Button onClick={saveImage.bind(this)}>Save</Button>
                    </Grid>
                </CardText>
            </Card>
        );
    }
}
