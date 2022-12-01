export const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false
            }
        case "EXIT":
            return {
                user: action.payload,
                isFetching: false,
                error: false
            }
        default:
            return state;
    }
}
