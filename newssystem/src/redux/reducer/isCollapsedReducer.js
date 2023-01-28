export default function isCollapsedReducer(preState = {
    isCollapsed: false
}, action) {
    const { type } = action
    switch (type) {
        case 'change_collapse':
            let newState = { ...preState }
            newState.isCollapsed = !preState.isCollapsed
            return newState
        default:
            return preState
    }
}