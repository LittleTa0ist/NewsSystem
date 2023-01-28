import { legacy_createStore as createStore } from 'redux'
import isCollapsedReducer from './reducer/isCollapsedReducer'
import isLoadingReducer from './reducer/loadingReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// import thunk from 'redux-thunk'
// 引入此模块才能使用redux调试工具
// import { composeWithDevTools } from 'redux-devtools-extension'
// 用于引入所有的reducers
// import allReducer from './reducer/index'
import { combineReducers } from 'redux'


const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['isLoadingReducer']
}

// 整合所有的reducer
const allReducer = combineReducers({
    isCollapsedReducer,
    isLoadingReducer
})
const persistedReducer = persistReducer(persistConfig, allReducer)

let store = createStore(persistedReducer)
let persistor = persistStore(store)



export {
    store,
    persistor
}