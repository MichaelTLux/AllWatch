import React from 'react';
import {Card, CardTitle, CardText, Grid, Cell, IconButton, CardMenu} from 'react-mdl';
require('../sass/captured-image.scss');

function isInRightColumn(isRight) {
    if (isRight) {
        return " right-column";
    }

    return "";
}

export default class CapturedImage extends React.Component {
    render() {
        const {image, timeStamp, index, saveImage, deleteImage} = this.props,
            isRight = index % 2 == 1;

        return (
            <Card shadow={1} className={`section-card${isInRightColumn.call(null, isRight)}`}>
                <CardTitle>
                    {timeStamp}
                </CardTitle>
                <CardMenu>
                    <IconButton onClick={saveImage.bind(null, index)} name="save"/>
                    <IconButton onClick={deleteImage.bind(null, index)} name="close"/>
                </CardMenu>
                <CardText>
                   <Grid>
                       <Cell col={11}>
                           <img src={image} alt={`image${index}`}/>
                       </Cell>
                   </Grid>

                </CardText>
            </Card>
        );
    }
}