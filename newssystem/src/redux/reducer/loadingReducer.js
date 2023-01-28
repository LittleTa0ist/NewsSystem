export default function isLoadingReducer(preState = {
    isLoading: false
}, action) {
    const { type } = action
    switch (type) {
        case 'onLoading':
            let onLoading = { ...preState }
            onLoading.isLoading = true
            return onLoading
        case 'offLoading':
            let offLoading = { ...preState }
            offLoading.isLoading = false
            return offLoading
        default:
            return preState
    }
}