function getInitialState() {
    return {
        isMoving: false
    };
}

export default (state = getInitialState(), action) => {
    switch (action.type) {
        default:
            return state;
    }
};
