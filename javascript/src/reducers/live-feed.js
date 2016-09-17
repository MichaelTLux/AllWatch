const Actions = require('./actions')();
import _ from 'lodash';
import resemble from 'resemblejs'

function getInitialState() {
    return {
        isMoving: false,
        oldImage: '',
        isRunning: false
    };
}

function updatePhotos(state, screenShot){
    const newState = _.cloneDeep(state);

    newState.oldImage = screenShot;

    resemble(state.oldImage).compareTo(screenShot).ignoreColors().onComplete(function(data){
        if (data.misMatchPercentage>10) {
            console.log('Something Moved');
        }
    });

    newState.oldImage = screenShot;

    return newState;
}

export default (state = getInitialState(), action) => {
    switch (action.type) {
        case Actions.liveFeed.updatePhotos:
            return updatePhotos(state, action.value);

        case Actions.liveFeed.toggleIsRunning:
            return Object.assign({}, state, {
                isRunning: !state.isRunning
            });

        default:
            return state;
    }
};
