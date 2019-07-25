/* eslint-disable key-spacing,no-trailing-spaces */
import { combineReducers } from 'redux'
import { persistReducer, purgeStoredState } from 'redux-persist'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'
import {nav} from './Reducers/Nav'
import {reducer as formReducer} from 'redux-form'
import {reducer as UserReducer} from './Reducers/UserReducer'
import {reducer as GoalReducer} from './Reducers/GoalReducer'
import {reducer as InvestmentReducer} from './Reducers/InvestmentReducer'
import {reducer as ChildrenReducer} from './Reducers/ChildReducer'
import {reducer as AuthReducer} from './Reducers/AuthReducer'
import {reducer as OnboardingReducer} from './Reducers/OnboardingReducer'
import {reducer as SettingReducer} from './Reducers/SettingReducer'
import {reducer as LearnReducer} from '../Redux/Reducers/LearnReducer'
import {AuthTypes} from '../Redux/Reducers/AuthReducer'
import ReduxPersist, {FORM_CONFIG} from '../Config/ReduxPersist'
import { AsyncStorage } from 'react-native'

const formR = persistReducer(FORM_CONFIG.storeConfig, formReducer)

/* ------------- Assemble The Reducers ------------- */
export const appReducer = combineReducers({
  form: formR,
  auth: AuthReducer,
  nav: nav,
  util: SettingReducer,
  onboard: OnboardingReducer,
  root: combineReducers({
    u: UserReducer,
    children: ChildrenReducer,
    goals: GoalReducer,
    investments: InvestmentReducer,
    learn: LearnReducer
  })
})

async function flushStore () {
  AsyncStorage.removeItem(`persist:primary`)
  AsyncStorage.removeItem(`persist:form`)
}

export default () => {
  let finalReducers = appReducer
  // If rehydration is on use persistReducer otherwise default combineReducers

  let persistConfig
  if (ReduxPersist.active) {
    persistConfig = ReduxPersist.storeConfig
    finalReducers = persistReducer(persistConfig, appReducer)
  }

  const rootReducer = function (state, action) {
    if (action.type === AuthTypes.LOGOUT) {
      const reducerVersion = ReduxPersist.reducerVersion || 1

      // step 1. clear using purge function
      purgeStoredState(persistConfig)

      // step 2. explicitly purge persist entries
      flushStore()

      // step 3. clear whole storage.
      AsyncStorage.clear()
      AsyncStorage.setItem('reducerVersion', reducerVersion)          // very important step; otherwise next time it won't persist

      // return empty object
      let flushedObj = Object.assign({}, state, {
        auth: {},
        nav: {},
        util: {},
        onboard: {},
        root: {
          u: {},
          children: {},
          goals: {},
          investments: {}
        }
      })
      let r = finalReducers(flushedObj, action)
      return r
    }
    return finalReducers(state, action)
  }

  const store = configureStore(rootReducer, rootSaga)

  return store
}
