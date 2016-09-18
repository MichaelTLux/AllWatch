const Actions = require('./actions')();
import _ from 'lodash';
import resemble from 'resemblejs';
import {saveAs} from "file-saver";

function getInitialState() {
    const time = new Date();
    return {
        isMoving: false,
        isRunning: false,
        showCaptured: false,
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

function getTimeStamp(time) {
    const minutes = time.getMinutes(),
    hour = time.getHours(),
    day = time.getDate(),
    month = time.getMonth(),
    year = time.getFullYear();
    return `${hour}:${minutes}-${month}/${day}/${year}`;
}

function saveMovement(state) {
    const {isRunning, isMoving, lastSaved, feedFrequency} = state,
        time = new Date();

    if (isMoving && isRunning && time.getTime() - lastSaved > Number(feedFrequency) * 1000) {
        const capturedItem = {
            image: state.oldImage,
            timeStamp: getTimeStamp(time)
        };
        state.capturedMovement.push(capturedItem);
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

function saveCapturedImage(state, index) {
    const file = dataURLtoFile(state.capturedMovement[index].image, state.capturedMovement[index].timeStamp);
    saveAs(file);
}

function removeElementFromArray(array, index) {
    return [
        ...array.slice(0, index),
        ...array.slice(index + 1)
    ];
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

        case Actions.liveFeed.toggleShowCaptured:
            return Object.assign({}, state, {
                showCaptured: !state.showCaptured
            });

        case Actions.liveFeed.saveCapturedImage:
            saveCapturedImage(state, action.value);
            return state;

        case Actions.liveFeed.deleteCapturedImage:
            return Object.assign({}, state, {
                capturedMovement: removeElementFromArray(state.capturedMovement, action.value)
            });

        case Actions.liveFeed.deleteAllImages:
            console.log('here');
            return Object.assign({}, state, {
                capturedMovement: []
            });

        default:
            return state;
    }
};
