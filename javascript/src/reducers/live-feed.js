const Actions = require('./actions')();
import _ from 'lodash';
import resemble from 'resemblejs'


function getInitialState() {
    const time = new Date();
    return {
        isMoving: false,
        isRunning: false,
        oldImage: '',
        refreshRate: "2",
        sensitivity: "10",
        feedFrequency: "1",
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

    if (isMoving && isRunning && time.getTime() - lastSaved > Number(feedFrequency) * 1000) {
        const seconds = time.getSeconds(),
            minutes = time.getMinutes(),
            hour = time.getHours(),
            day = time.getDate(),
            month = time.getMonth(),
            year = time.getFullYear(),
            file = dataURLtoFile(state.oldImage, `${hour}:${minutes}:${seconds}_${day}-${month}-${year}`);
        state.capturedMovement.push(file);
        state.lastSaved = time.getTime();
        return state;
    }

    return state;
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
}

function saveAllMovement(state) {
    const {capturedMovement} = state;

    for (let i = 0; i < capturedMovement.length(); i++) {

    }
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

        case Actions.liveFeed.setFeedFrequency:
            return Object.assign({}, state, {
                feedFrequency: action.value
            });


        case Actions.liveFeed.saveAllMovement:
            saveAllMovement(state);
            return state;

        default:
            return state;
    }
};
