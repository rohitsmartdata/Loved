/* eslint-disable no-unused-vars,no-trailing-spaces,no-useless-constructor,handle-callback-err,padded-blocks */

// ========================================================
// Import Packages
// ========================================================

import '../Config'
import React
  from 'react'
import {AsyncStorage, TouchableOpacity, Alert, Image, PushNotificationIOS, Text, TextInput, AppState}
  from 'react-native'
import {Provider}
  from 'react-redux'
import createStore
  from '../Redux'
import {registerScreens}
  from '../Navigation/Screens'
import {Navigation}
  from 'react-native-navigation'
import {SPROUT}
  from '../Utility/Mapper/Screens'
import {COMMON_ENTITIES}
  from '../Utility/Mapper/Common'
import DB_ATTRIBUTES
  from '../Utility/Mapper/LocalDB'
import {decodePasscode, encodeOnboardingKey, decodeOnboarding}
  from '../Utility/Transforms/Converter'
import {AUTH_ENTITIES, PIN_COMPONENT_TYPE, PIN_ACTION_TYPE}
  from '../Utility/Mapper/Auth'
import ApplicationStyles
  from '../Themes/ApplicationStyles'
import {AuthActions}
  from '../Redux/Reducers/AuthReducer'
import {UserActions}
  from '../Redux/Reducers/UserReducer'
import {InvestmentActions}
  from '../Redux/Reducers/InvestmentReducer'
import ReduxPersist
  from '../Config/ReduxPersist'
import moment from 'moment'
import {CURRENT_ENVIRONMENT}
  from '../Config/AppConfig'
import { Sentry }
  from 'react-native-sentry'

Sentry.config('https://6253d3d9730d45aca0824b4374397c48@sentry.io/1254570').install()
Sentry.setTagsContext({
  environment: CURRENT_ENVIRONMENT
})
GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest

let appState = 'active'
let lastActiveAt = moment()
let resumeDuration = 5

// ========================================================
// Utility
// ========================================================

// create a new store
let store = createStore()

// register screens
registerScreens(store, Provider)

let statusData = {
  'show_user_funding_status': true,
  'show_child_account_status': true,
  'show_child_funding_status': true
}

// ========================================================
// Core Module
// ========================================================

store.dispatch(AuthActions.fetchPin())
store.dispatch(UserActions.refreshHealth())

Text.defaultProps.allowFontScaling = false
TextInput.defaultProps.allowFontScaling = false

async function foo () {
  let keys = AsyncStorage.getAllKeys((err, keys) => {
    keys.map(k => {
      AsyncStorage.getItem(k, (err, value) => {
        console.log('k -> ', k, '\nvalue -> ', value)
      })
    })
  })
}

async function refreshApp () {
  const reducerVersion = ReduxPersist.reducerVersion || 1
  await AsyncStorage.clear()
  await AsyncStorage.setItem('reducerVersion', reducerVersion)          // very important step; otherwise next time it won't persist

  // re-instantiate store
  store = createStore()
  registerScreens(store, Provider)

  // await foo()
  // reset the whole store to initial state
  store.dispatch(UserActions.resetStore())
}

async function startPasswordApp () {
  // clear the local storage

  try {
    await refreshApp()
  } catch (err) {
    console.log('REFRESH OF APP FAILED')
  }
  // dispatch fetch pin failure
  store.dispatch(AuthActions.fetchPinFailure())

  AsyncStorage.setItem('SHOW_FUNDING_STATUS', JSON.stringify(statusData))

  Navigation.startSingleScreenApp({
    screen: {
      screen: SPROUT.AUTH_SELECTOR_SCREEN,
      navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#2948FF', statusBarHidden: false, statusBarTextColorScheme: 'light'}
    }
  })
}

function startPasscodeApp (passcodeEntry) {
  let passcode = passcodeEntry[DB_ATTRIBUTES.PASSCODE]
  let username = passcodeEntry[DB_ATTRIBUTES.USERNAME]
  store.dispatch(AuthActions.fetchPinSuccess(passcode))
  store.dispatch(UserActions.setUsername(username))
  store.dispatch(InvestmentActions.flushProducts())
  store.dispatch(UserActions.refreshHealth()) // refresh store health to avoid any recurring error popups or processing indicators

  AsyncStorage.setItem('SHOW_FUNDING_STATUS', JSON.stringify(statusData))

  Navigation.startSingleScreenApp({
    screen: {
      screen: SPROUT.LOGIN_PIN,
      title: 'LOGIN',
      navigatorStyle: {...ApplicationStyles.hiddenNavbar, statusBarTextColorScheme: 'light', screenBackgroundColor: '#2948FF'}
    },
    passProps: {
      [AUTH_ENTITIES.PIN_COMPONENT_TYPE]: PIN_COMPONENT_TYPE.VERIFY,
      [AUTH_ENTITIES.PIN_ACTION_TYPE]: PIN_ACTION_TYPE.LOGIN,
      titles: {
        [PIN_COMPONENT_TYPE.VERIFY]: 'Enter PIN',
        [PIN_COMPONENT_TYPE.CREATE]: 'Create a new PIN',
        [PIN_COMPONENT_TYPE.CONFIRM]: 'Re-enter PIN'
      }
    }
  })
}

function showLogInPinModal (passcodeEntry) {
  let passcode = passcodeEntry[DB_ATTRIBUTES.PASSCODE]
  let username = passcodeEntry[DB_ATTRIBUTES.USERNAME]
  store.dispatch(AuthActions.fetchPinSuccess(passcode))
  store.dispatch(UserActions.setUsername(username))
  // store.dispatch(InvestmentActions.flushProducts())
  // store.dispatch(UserActions.refreshHealth()) // refresh store health to avoid any recurring error popups or processing indicators

  Navigation.showModal({
    screen: SPROUT.LOGIN_PIN, // unique ID registered with Navigation.registerScreen
    title: '', // title of the screen as appears in the nav bar (optional)
    passProps: {
      [AUTH_ENTITIES.PIN_COMPONENT_TYPE]: PIN_COMPONENT_TYPE.VERIFY,
      [AUTH_ENTITIES.PIN_ACTION_TYPE]: PIN_ACTION_TYPE.LOGIN,
      [AUTH_ENTITIES.IS_PASSCODE_MODAL]: true,
      titles: {
        [PIN_COMPONENT_TYPE.VERIFY]: 'Enter PIN',
        [PIN_COMPONENT_TYPE.CREATE]: 'Create a new PIN',
        [PIN_COMPONENT_TYPE.CONFIRM]: 'Re-enter PIN'
      }
    },
    navigatorStyle: {...ApplicationStyles.hiddenNavbar, statusBarTextColorScheme: 'light', screenBackgroundColor: '#2948FF'},
    animationType: 'none' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
  })
}

function startOnboardingApp (screenType, username, props = {}) {
  const toastSubheading = 'Using email: ' + username
  store.dispatch(AuthActions.fetchPinFailure())

  AsyncStorage.setItem('SHOW_FUNDING_STATUS', JSON.stringify(statusData))

  Navigation.startSingleScreenApp({
    screen: {
      screen: screenType,
      navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#2948FF', statusBarTextColorScheme: 'light'}
    },
    passProps: {
      popButton: false,
      toast: true,
      [COMMON_ENTITIES.IS_ONBOARDING_FLOW]: true,
      toastHeading: 'Continue Onboarding',
      toastSubheading: toastSubheading,
      [AUTH_ENTITIES.PIN_COMPONENT_TYPE]: PIN_COMPONENT_TYPE.CREATE,
      [AUTH_ENTITIES.PIN_ACTION_TYPE]: PIN_ACTION_TYPE.ON_BOARDING,
      titles: {
        [PIN_COMPONENT_TYPE.CREATE]: 'Create PIN',
        [PIN_COMPONENT_TYPE.CONFIRM]: 'Re-enter PIN'
      },
      ...props
    }
  })
}

function initializeApp (isFromAppState = false) {
  AsyncStorage.getItem(DB_ATTRIBUTES.LOGGED_IN_USERNAME, (err, username) => {
    // if username present, then we get few possibilities
    // available
    if (username && username !== 'undefined') {
      let onboardingKey = encodeOnboardingKey(username)
      AsyncStorage.getItem(onboardingKey, (err, onboardingEntry) => {
        let considerNormalFlow = false
        if (err) {
          considerNormalFlow = true
        }

        let onboard = decodeOnboarding(onboardingEntry)
        if (onboard && onboard[DB_ATTRIBUTES.CURRENT_ONBOARDING_SCREEN]) {
          startOnboardingApp(onboard[DB_ATTRIBUTES.CURRENT_ONBOARDING_SCREEN], username, onboard[DB_ATTRIBUTES.CURRENT_ONBOARDING_SCREEN_PROPS])
        } else {
          considerNormalFlow = true
        }

        if (considerNormalFlow) {
          AsyncStorage.getItem(username, (err, passcodeEntry) => {
            let P = decodePasscode(passcodeEntry)
            if (P) {
              if (!isFromAppState) {
                startPasscodeApp(P)
              } else {
                showLogInPinModal(P)
              }
            } else {
              if (!isFromAppState) {
                startPasswordApp()
              }
            }
          })
        }
      })
    } else {
      // start with login username/password screen
      // dispatch pin register  failure
      if (!isFromAppState) {
        startPasswordApp()
      }
    }
  })
}

function handleAppStateChange (nextAppState) {
  if (appState.match(/inactive|background/) && nextAppState === 'active') {
    AsyncStorage.setItem('active', JSON.stringify(true), (err) => {
      if (err) {
        console.log('@@@ Error in App.js', err)
      }
    })
    var seconds = moment().diff(lastActiveAt, 'seconds')
    if (seconds > resumeDuration) {
      initializeApp(true)
    }
  } else if (nextAppState.match(/inactive|background/)) {
    AsyncStorage.setItem('active', JSON.stringify(false), (err) => {
      if (err) {
        console.log('@@@ Error in App.js', err)
      }
    })
    lastActiveAt = moment()
  }
  appState = nextAppState
}

let c = (function () {
  AppState.addEventListener('change', handleAppStateChange)
  initializeApp()
})()
