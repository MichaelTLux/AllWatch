const Actions = require('./actions')();
import _ from 'lodash';
import resemble from 'resemblejs'

function getInitialState() {
    return {
        isMoving: false,
        oldImage: '',
        isRunning: false,
        refreshRate: "1",
        sensitivity: "10",
    };
}

function updatePhotos(state, screenShot) {
    const newState = _.cloneDeep(state);

    newState.oldImage = screenShot;

    resemble(state.oldImage).compareTo(screenShot).ignoreColors().onComplete(function (data) {
        newState.isMoving = data.misMatchPercentage > Number(state.sensitivity);
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

        case Actions.liveFeed.setRefresh:
            return Object.assign({}, state, {
                refreshRate: action.value
            });

        case Actions.liveFeed.setSensitivity:
            return Object.assign({}, state, {
                sensitivity: action.value
            });

        default:
            return state;
    }
};
