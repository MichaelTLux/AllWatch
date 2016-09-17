const Actions = require('./actions')();
import _ from 'lodash';
import resemble from 'resemblejs'


function getInitialState() {
    const time = new Date();
    return {
        isMoving: false,
        isRunning: false,
        oldImage: '',
        refreshRate: "1",
        sensitivity: "10",
        feedFrequency: "10",
        lastSaved: time.getTime(),
        capturedMovement: []
    };
}

function updatePhotos(state, screenShot) {
    let newState = _.cloneDeep(state);

    newState.oldImage = screenShot;

    resemble(state.oldImage).compareTo(screenShot).ignoreColors().onComplete(function (result) {
        newState.isMoving = result.misMatchPercentage > Number(state.sensitivity);
    });

    newState.oldImage = screenShot;

    newState = saveMovement(newState);

    return newState;
}

function saveMovement(state) {
    const {isRunning, isMoving, lastSaved, feedFrequency} = state,
        time = new Date();

    console.log('time.getTime()-lastSaved', time.getTime() - lastSaved);
    console.log('Number(feedFrequency)', Number(feedFrequency));

    if (isMoving && isRunning && time.getTime() - lastSaved > Number(feedFrequency) * 1000) {
        console.log('here');
        state.capturedMovement.push(state.oldImage);
        state.lastSaved = time.getTime();
        return state;
    }

    return state;
}

export default (state = getInitialState(), action) => {
    switch (action.type) {
        case Actions.liveFeed.updatePhotos:
            return updatePhotos(state, action.value);

        case Actions.liveFeed.toggleIsRunning:
            return Object.assign({}, state, {
                isRunning: !state.isRunning
            });

        case Actions.liveFeed.setRefresh:
            return Object.assign({}, state, {
                refreshRate: action.value
            });

        case Actions.liveFeed.setSensitivity:
            return Object.assign({}, state, {
                sensitivity: action.value
            });

        case Actions.liveFeed.setFeedFrequency: {
            return Object.assign({}, state, {
                feedFrequency: action.value
            });
        }
        default:
            return state;
    }
};
