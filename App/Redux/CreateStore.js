/* eslint-disable no-trailing-spaces,no-unused-vars */
import { createStore, applyMiddleware, compose } from 'redux'
// import Config from '../Config/DebugConfig'
import createSagaMiddleware from 'redux-saga'
import RehydrationServices from '../Services/RehydrationServices'
import ReduxPersist from '../Config/ReduxPersist'

// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */
  const middleware = []
  const enhancers = []

  /* ------------- Saga Middleware ------------- */

  const sagaMiddleware = createSagaMiddleware()
  middleware.push(sagaMiddleware)

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware))

  // if Reactotron is enabled (default for __DEV__), we'll create the store through Reactotron
  let store = createStore(rootReducer, compose(...enhancers))
  // if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  //   store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
  //     ...enhancers
  //   ))
  // }

  // configure persistStore and check reducer version number
  if (ReduxPersist.active) {
    RehydrationServices.updateReducers(store)
  }

  // kick off root saga
  sagaMiddleware.run(rootSaga)

  return store
}
