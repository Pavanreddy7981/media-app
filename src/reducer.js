export const initialState = ({
    user : null
})

export const reducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return{
                ...state,
                user : action.user
            }
        case "SET_LOGOUT":
            return{
                ...state,
                user : null
            }
        default:
            return state
    }
}
export default reducer