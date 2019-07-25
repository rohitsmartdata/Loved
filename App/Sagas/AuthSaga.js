/* eslint-disable no-unused-vars,no-trailing-spaces,no-multiple-empty-lines,padded-blocks,handle-callback-err */
/**
 * Created by viktor on 14/7/17.
 */

// ========================================================
// Import packages
// ========================================================

import { put, call } from 'redux-saga/effects'
import { AsyncStorage, Alert } from 'react-native'
import { AuthActions } from '../Redux/Reducers/AuthReducer'
import { UserActions } from '../Redux/Reducers/UserReducer'
import { SettingActions } from '../Redux/Reducers/SettingReducer'
import { InvestmentActions } from '../Redux/Reducers/InvestmentReducer'
import { ChildActions } from '../Redux/Reducers/ChildReducer'
import { LearnActions } from '../Redux/Reducers/LearnReducer'
import { OnboardingActions } from '../Redux/Reducers/OnboardingReducer'
import {
  encodePasscode,
  encodeCredentials,
  decodeCredentials,
  getCredentialLocalKey,
  decodePasscode,
  encodeOnboardingKey,
  encodeOnboarding
} from '../Utility/Transforms/Converter'
import jwt from 'jwt-decode'
import { AUTH_ENTITIES, PIN_ACTION_TYPE } from '../Utility/Mapper/Auth'
import { USER_ENTITIES } from '../Utility/Mapper/User'
import { SPROUT, LW_EVENTS, LW_EVENT_TYPE } from '../Utility/Mapper/Screens'
import { COMMON_ENTITIES } from '../Utility/Mapper/Common'
import { SETTINGS_ENTITIES } from '../Utility/Mapper/Settings'
import { GOAL_ENTITIES } from '../Utility/Mapper/Goal'
import { CHILD_ENTITIES } from '../Utility/Mapper/Child'
import DB_ATTRIBUTES from '../Utility/Mapper/LocalDB'
import AWS, {
  AuthCredentials,
  userPool,
  environmentVariable,
  CURRENT_ENVIRONMENT,
  analytics
} from '../Config/AppConfig'
import { ENVIRONMENT } from '../Config/contants'
import {
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoRefreshToken
} from '../Lib/aws-cognito-identity'
import { getS3FileNameAndMetadata } from '../Utility/Transforms/Generator'
import moment from 'moment'
import { events, errorKeywords } from '../Utility/Mapper/Tracking'
import { Sentry } from 'react-native-sentry'
import { clearPushNotification } from '../Config/PushNotificationConfig'
import branch from 'react-native-branch'
import { getAWSSession } from '../Services/AWSSession'

// ========================================================
// Utility Functions
// ========================================================

const loginEffect = (username, password) => {
  try {
    let credentialKey = getCredentialLocalKey(username)
    let credentialCode = encodeCredentials(username, password)
    AsyncStorage.multiSet(
      [
        [DB_ATTRIBUTES.LOGGED_IN_USERNAME, username],
        [credentialKey, credentialCode]
      ],
      err => {
        if (err) {
          console.log('error : ', err)
        }
      },
    )
  } catch (err) {
    console.log('error while registering pin : ', err)
  }
}

const logoutEffect = () => {
  try {
    AsyncStorage.setItem(DB_ATTRIBUTES.LOGGED_IN_USERNAME, 'undefined')
  } catch (err) {
    console.log('error while logging out user : ', err)
  }
}

async function injectIDToken (idToken, expiry, refreshToken) {
  try {
    await AsyncStorage.setItem(AUTH_ENTITIES.ID_TOKEN, idToken)
    await AsyncStorage.setItem(AUTH_ENTITIES.ID_TOKEN_EXPIRY, expiry)
    await AsyncStorage.setItem(AUTH_ENTITIES.REFRESH_TOKEN, refreshToken)
    return
  } catch (err) {
    console.log('error in id token storage :: ', err)
  }
}

async function getPasscodeByUsername (username) {
  try {
    let data = await AsyncStorage.getItem(username)
    return decodePasscode(data).passcode
  } catch (err) {
    console.log('---- no identity passcode present ---')
    return undefined
  }
}

// ========================================================
// Sagas
// ========================================================

export function* login (action) {
  const username = action[AUTH_ENTITIES.EMAIL]
  const password = action[AUTH_ENTITIES.PASSWORD]
  const authenticationData = { Username: username, Password: password }
  const authenticationDetails = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(
    authenticationData,
  )
  const userData = { Username: username, Pool: userPool }
  const cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(
    userData,
  )
  const isPasscodeLogin = action[AUTH_ENTITIES.IS_PASSCODE_LOGIN]

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: async function (p1) {
      let idToken = p1.idToken.jwtToken
      let refreshToken = p1.refreshToken.token

      let token = jwt(idToken)
      let userID = token['sub']
      let expiry = token['exp'].toString()
      let passCode

      let helpingSignup = action[AUTH_ENTITIES.HELPING_SIGNUP]
      // enable passcode & store username
      loginEffect(username, password)

      branch.setIdentity(userID)
      // store ID Token
      await injectIDToken(idToken, expiry, refreshToken)

      // check if login has passcode saved
      passCode = await getPasscodeByUsername(username)

      if (helpingSignup) {

        branch.userCompletedAction('sign_up')
        // analytics.alias({
        //   userId: userID,
        //   previousId: action['uid']
        // })

        // *********** Log Analytics ***********
        analytics.track({
          userId: userID,
          event: events.SIGNUP
        })
        analytics.identify({
          userId: userID,
          traits: {
            email: username,
            created: helpingSignup,
            child_created: false
          }
        })

      } else {
        analytics.track({
          userId: userID,
          event: events.LOGIN,
          properties: {
            method: isPasscodeLogin ? 'pin' : 'login'
          }
        })
        // *********** Log Analytics ***********
        analytics.identify({
          userId: userID,
          traits: {
            email: username,
            created: helpingSignup
          }
        })
      }

      // emit events
      if (helpingSignup) {
        action[COMMON_ENTITIES.DISPATCH](
          OnboardingActions.markCurrentOnboardingScreen(
            userID,
            SPROUT.USER_INPUT_DETAIL_1,
          ),
        )
        action[COMMON_ENTITIES.DISPATCH](
          AuthActions.signupSuccess(
            userID,
            action[COMMON_ENTITIES.NAVIGATOR],
            username,
            idToken,
          ),
        )
      } else {
        action[COMMON_ENTITIES.DISPATCH](UserActions.fetchUser(userID))
        action[COMMON_ENTITIES.DISPATCH](InvestmentActions.fetchProducts())
      }

      action[COMMON_ENTITIES.DISPATCH](LearnActions.fetchLearnModules())

      // dispatch successfull congnito response
      if (!helpingSignup) {
        action[COMMON_ENTITIES.DISPATCH](UserActions.setUsername(username))
        action[COMMON_ENTITIES.DISPATCH](
          AuthActions.loginSuccess(
            idToken,
            passCode,
            action[COMMON_ENTITIES.NAVIGATOR],
            isPasscodeLogin,
          ),
        )
      }

      if (CURRENT_ENVIRONMENT === ENVIRONMENT.PROD) {
        // // *********** Update FB sdk [START] ***********
        // AppEventsLogger.setUserID(userID)
        // AppEventsLogger.updateUserProperties({ emailID: username })
        // AppEventsLogger.logEvent('LOGIN')
        // // *********** Update FB sdk [END] ***********

        // *********** Update GOOGLE sdk [START] ***********
        // let tracker1 = new GoogleAnalyticsTracker('UA-104319416-4')
        // tracker1.allowIDFA(true)
        // tracker1.setUser(userID)
        // const payload = {
        //   utmCampaignUrl:
        //     'https://click.google-analytics.com/redirect?tid=UA-104319416-4&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid1274368588&aid=com.app.lovedwealth&idfa={idfa}&cs=google&cm=cpc&cn=loved-test&cc=This%20will%20be%20test%20ad&ck=Loved%20Test&anid=admob&hash=md5'
        // }
        // tracker1.trackEvent('LOGIN', 'active', null, payload)
        // *********** Update GOOGLE sdk [END] ***********
      }

      // register the user
      // for sentry logging.
      Sentry.setUserContext({
        id: userID,
        username: username,
        email: username
      })
    },

    onFailure: err => {
      let error = {
        status: '402',
        code: 'Login Error',
        message: err.message
      }
      // dispatch failure in congnito response
      action[COMMON_ENTITIES.DISPATCH](AuthActions.loginFailure(error))

      // the following parameters are used for
      // sentry message building
      let loginError =
        errorKeywords.LOGIN_ERROR +
        ', Username -> ' +
        username +
        ', [ERROR] -> ' +
        err.message
      Sentry.captureMessage(loginError) // capture & send message to sentry
    }
  })
}

export function* signup (action) {
  let username = action[AUTH_ENTITIES.EMAIL]
  let password = action[AUTH_ENTITIES.PASSWORD]

  const userPool = new CognitoUserPool(AuthCredentials)
  const attributeList = [
    new CognitoUserAttribute({ Name: 'email', Value: username })
  ]
  userPool.signUp(username, password, attributeList, null, (err, result) => {
    if (err) {
      let error = {
        status: '402',
        code: 'Signup Error',
        message: err.message
      }
      action[COMMON_ENTITIES.DISPATCH](AuthActions.signupFailure(error))

      // the following parameters are used for
      // sentry message building
      let signupError =
        errorKeywords.SIGNUP_ERROR +
        ', Username -> ' +
        username +
        ', [ERROR] -> ' +
        err.message
      Alert.alert('Sign up error', err.message)
      Sentry.captureMessage(signupError) // capture & send message to sentry
      return
    }
    action[COMMON_ENTITIES.DISPATCH](
      AuthActions.login(
        action[AUTH_ENTITIES.EMAIL],
        action[AUTH_ENTITIES.PASSWORD],
        action[COMMON_ENTITIES.NAVIGATOR],
        action[COMMON_ENTITIES.DISPATCH],
        true,
        null,
        action['uid'],
      ),
    )
  })
}

export function* logout (action) {
  let isPasscodeLogout = action[AUTH_ENTITIES.IS_PASSCODE_LOGOUT]

  try {
    logoutEffect()
    clearPushNotification()
    branch.logout()
    // Navigation.dismissAllModals()
    yield put(
      AuthActions.logoutSuccess(
        action[COMMON_ENTITIES.NAVIGATOR],
        isPasscodeLogout,
      ),
    )
  } catch (err) {
    yield put(
      AuthActions.logoutFailure(
        action[COMMON_ENTITIES.NAVIGATOR],
        isPasscodeLogout,
      ),
    )
  }
}

export function* logoutSuccess (action) {
  let isPasscodeLogout = action[AUTH_ENTITIES.IS_PASSCODE_LOGOUT]

  if (isPasscodeLogout) {
    yield put(AuthActions.promptAuth(action[COMMON_ENTITIES.NAVIGATOR]))
  } else {
    yield put(
      SettingActions.navigateDeep(
        SPROUT.AUTH_SELECTOR_SCREEN,
        action[COMMON_ENTITIES.NAVIGATOR],
      ),
    )
  }
}

export function* passcodeLogin (action) {
  let username = action[USER_ENTITIES.EMAIL_ID]
  let navigator = action[COMMON_ENTITIES.NAVIGATOR]
  let dispatch = action[COMMON_ENTITIES.DISPATCH]

  try {
    AsyncStorage.getItem(getCredentialLocalKey(username), (err, result) => {
      if (err) {
        console.log('error in passcode credential retrieval : ', err)
      }
      const credentials = decodeCredentials(result)
      dispatch(
        AuthActions.login(
          credentials[AUTH_ENTITIES.EMAIL],
          credentials[AUTH_ENTITIES.PASSWORD],
          action[COMMON_ENTITIES.NAVIGATOR],
          dispatch,
          false,
          true,
        ),
      )
      dispatch(
        AuthActions.passcodeLoginSuccess(action[COMMON_ENTITIES.NAVIGATOR]),
      )
    })
  } catch (error) {
    console.log('error in passcode credential retrieval : ', error)
  }
}

export function* registerPIN (action) {
  let pin = action[AUTH_ENTITIES.PIN]
  let username = action[USER_ENTITIES.EMAIL_ID]
  let pinActionType = action[AUTH_ENTITIES.PIN_ACTION_TYPE]
  let navigator = action[COMMON_ENTITIES.NAVIGATOR]
  let dispatch = action[COMMON_ENTITIES.DISPATCH]
  let goToHomepage = action[AUTH_ENTITIES.GO_TO_HOMEPAGE] || false
  try {
    let passcode = encodePasscode(username, pin)
    AsyncStorage.setItem(username, passcode, () => {
      dispatch &&
        dispatch(
          AuthActions.registerPinSuccess(
            pinActionType,
            navigator,
            pin,
            goToHomepage,
          ),
        )
    })
  } catch (err) {
    console.log('error while registering pin : ', err)
  }
}

export function* onBoardingStarted (action) {
  let username = action[USER_ENTITIES.EMAIL_ID]

  try {
    let onboardingValue = encodeOnboarding(true, undefined)
    let onboardingKey = encodeOnboardingKey(username)
    AsyncStorage.setItem(onboardingKey, onboardingValue, err => {
      if (err) {
        console.log('Failure in saving onboarding started')
      } else {
        AsyncStorage.getItem(onboardingKey, (err, value) => {
          if (err) {
            console.log(
              'error in getting onboarding completed - value :: ',
              err,
            )
          } else {
            // console.log('onboarding started - value :: ', value)
          }
        })
      }
    })
  } catch (err) {
    console.log('error while registering pin : ', err)
  }
}

export function* onBoardingCompleted (action) {
  let username = action[USER_ENTITIES.EMAIL_ID]

  try {
    let onboardingValue = encodeOnboarding(false, undefined)
    let onboardingKey = encodeOnboardingKey(username)
    AsyncStorage.setItem(onboardingKey, onboardingValue, err => {
      if (err) {
        console.log('Failure in saving onboarding completed')
      } else {
        AsyncStorage.getItem(onboardingKey, (err, value) => {
          if (err) {
            console.log(
              'error in getting onboarding completed - value :: ',
              err,
            )
          } else {
            // console.log('onboarding completed - value :: ', value)
          }
        })
      }
    })
  } catch (err) {
    console.log('error while registering pin : ', err)
  }
}

export function* updateCurrentOnboarding (action) {
  try {
    let username = action[USER_ENTITIES.EMAIL_ID]
    let screen = action[SPROUT.SCREEN_TYPE]
    let navigationProps = action[COMMON_ENTITIES.PROPS]
    try {
      let onboardingValue = encodeOnboarding(true, screen, navigationProps)
      let onboardingKey = encodeOnboardingKey(username)
      AsyncStorage.setItem(onboardingKey, onboardingValue, err => {
        if (err) {
          console.log('Failure in saving onboarding update')
        } else {
          AsyncStorage.getItem(onboardingKey, (err, value) => {
            if (err) {
              console.log(
                'error in getting onboarding completed - value :: ',
                err,
              )
            } else {
              // console.log('updating onboarding - value :: ', value)
            }
          })
        }
      })
    } catch (err) {
      console.log('error while registering pin : ', err)
    }
  } catch (er) {
    console.log('double err:: ', er)
  }
}

export function* changePassword (action) {
  const oldPassword = action[AUTH_ENTITIES.PASSWORD]
  const newPassword = action[AUTH_ENTITIES.NEW_PASSWORD]
  let dispatch = action[COMMON_ENTITIES.DISPATCH]
  let navigator = action[COMMON_ENTITIES.NAVIGATOR]

  try {
    var authenticationData = {
      Username: action[AUTH_ENTITIES.EMAIL],
      Password: action[AUTH_ENTITIES.PASSWORD]
    }
    var authenticationDetails = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(
      authenticationData,
    )
    var userData = { Username: authenticationData.Username, Pool: userPool }

    var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(
      userData,
    )

    let error = {
      status: '402',
      code: 'Change Password Error'
    }

    // get current session
    cognitoUser.getSession((err, session) => {
      if (err) {
        error.message = err.message
        dispatch(SettingActions.processChangePasswordFailure(error))
        return
      }

      cognitoUser.changePassword(oldPassword, newPassword, function (
        err,
        result,
      ) {
        if (err) {
          error.message = err.message
          dispatch(SettingActions.processChangePasswordFailure(error))
          return
        }
        if (result === 'SUCCESS') {
          dispatch(SettingActions.processChangePasswordSuccess(navigator))
          loginEffect(authenticationData.Username, newPassword)
        }
      })
    })
  } catch (err) {
    let error = {
      status: '402',
      code: 'Change Password Error'
    }
    dispatch(SettingActions.processChangePasswordFailure(error))
  }
}

export function* forgotPassword (action) {
  let dispatch = action[COMMON_ENTITIES.DISPATCH]
  let userID = action[USER_ENTITIES.USER_ID]
  let navigator = action[COMMON_ENTITIES.NAVIGATOR]

  var authenticationData = {
    Username: action[AUTH_ENTITIES.EMAIL]
  }
  var userData = { Username: authenticationData.Username, Pool: userPool }
  var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(
    userData,
  )

  let error = {
    status: '402',
    code: 'Forgot Password Error'
  }

  // call forgotPassword on cognitoUser
  cognitoUser.forgotPassword({
    onSuccess: function (result) {
      // *********** Log Analytics ***********
      // analytics.track({
      //   userId: userID,
      //   event: events.PASSWORD_RECOVERED
      // })
      // *********** Log Analytics ***********
      dispatch(SettingActions.processForgotPasswordSuccess(userData.Username))
    },
    onFailure: function (err) {
      error.message = err.message
      dispatch(SettingActions.processForgotPasswordFailure(error))
    }
  })
}

export function* confirmPassword (action) {
  let dispatch = action[COMMON_ENTITIES.DISPATCH]
  let navigator = action[COMMON_ENTITIES.NAVIGATOR]

  var authenticationData = {
    Username: action[SETTINGS_ENTITIES.VERIFIED_EMAIL],
    VerificationCode: action[SETTINGS_ENTITIES.VERIFICATION_CODE],
    NewPassword: action[SETTINGS_ENTITIES.PASSWORD]
  }
  var userData = { Username: authenticationData.Username, Pool: userPool }

  var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(
    userData,
  )

  let error = {
    status: '402',
    code: 'Forgot Password Error'
  }
  // call forgotPassword on cognitoUser
  cognitoUser.confirmPassword(
    authenticationData.VerificationCode,
    authenticationData.NewPassword,
    {
      onFailure (err) {
        error.message = err.message
        if (err.message) {
          Alert.alert('Error', err.message)
        }
        dispatch(SettingActions.processConfirmPasswordFailure(error))
      },
      onSuccess () {
        dispatch(SettingActions.processConfirmPasswordSuccess())
        dispatch(
          AuthActions.login(
            authenticationData.Username,
            authenticationData.NewPassword,
            action[COMMON_ENTITIES.NAVIGATOR],
            dispatch,
            false,
          ),
        )
      }
    },
  )
}

// upload image to s3
export function* uploadPhoto (action) {
  const dispatch = action[COMMON_ENTITIES.DISPATCH]
  const imageType = action[SETTINGS_ENTITIES.IMAGE_TYPE]
  const isUpdatingChildImage = action[CHILD_ENTITIES.IS_UPDATING_CHILD_IMAGE]
  var data = {
    imageMetadata: action[SETTINGS_ENTITIES.IMAGE_METADATA],
    username: action[AUTH_ENTITIES.EMAIL],
    token: action[AUTH_ENTITIES.ID_TOKEN],
    userId: action[USER_ENTITIES.USER_ID],
    childId: action[CHILD_ENTITIES.CHILD_ID],
    goalId: action[GOAL_ENTITIES.GID]
  }

  getAWSSession(data.username)
    .then(() => {
      let s3 = new AWS.S3()
      const { imageMetadata, userId, childId, goalId } = data
      const ext =
        (imageMetadata.fileName && imageMetadata.fileName.split('.')[1]) ||
        imageMetadata.uri.split('.')[1]
      const typeLevel = imageType[imageType.length - 1]
      const s3Payload = getS3FileNameAndMetadata(
        typeLevel,
        userId,
        childId,
        goalId,
        ext,
      )
      const fileName = s3Payload.fileName
      const body = imageMetadata.data
      const Metadata = s3Payload.metadata
      const s3obj = new AWS.S3({
        params: {
          Bucket: environmentVariable.S3_BUCKET,
          Key: environmentVariable.S3_KEY + fileName,
          Metadata
        }
      })
      // to buffer 10 megabyte chunks and reduce concurrency down to 2
      const opts = {
        queueSize: 2,
        partSize: 1024 * 1024 * 10,
        leavePartsOnError: true
      }
      if (isUpdatingChildImage) {
        dispatch(ChildActions.updateChildImage(true))
      }
      if (typeLevel === 'USER') {
        // update processing image true
        dispatch(UserActions.updateUserImageProcessing(true))
      }

      s3obj.upload({ Body: body }, opts, (uploadErr, uploadResponse) => {
        if (isUpdatingChildImage) {
          dispatch(ChildActions.updateChildImage(false))
        }
        if (typeLevel === 'USER') {
          // update processing image false
          dispatch(UserActions.updateUserImageProcessing(false))
        }
        if (uploadErr) {
          console.log(
            '@@@@@@@@@@@@ ERROR OCCURRED IN UPLOADIN PHOTO @@@@@@@@@@@@@ --> ',
            uploadErr,
          )
        }
        const params = {
          Bucket: environmentVariable.S3_BUCKET,
          Key: (uploadResponse && uploadResponse.Key) || ''
        }

        // flush image meta data
        // it might populate different child's
        // image, event if user doesn't select one
        dispatch(SettingActions.flushImageMetadata())

        s3.getObject(params, (getErr, getResponse) => {
          if (getErr != null) {
            console.log('err', getErr)
            // error dispatch, todo
          } else {
            const objectData = getResponse.Body.toString('utf-8')
            if (objectData.indexOf('<?xml ') === -1) {
              const imgSrc = `data:image/${ext};base64,${objectData}`
              if (typeLevel === 'USER') {
                dispatch(UserActions.setUserImage(imgSrc))
              } else if (typeLevel === 'CHILD') {
                dispatch(ChildActions.setChildImage(imgSrc, data.childId))
              }
            } else {
              console.log(
                'XXXXXXXXXXXXXXXXXXXXX GOT XML RESPONSE FOR IMAGE XXXXXXXXXXXXXXXXXXXXX',
                getResponse.Body,
              )
            }
          }
        })
      })
    })
    .catch(error => console.log(error))
}

export function* getPhoto (action) {
  let dispatch = action[COMMON_ENTITIES.DISPATCH]
  const imageType = action[SETTINGS_ENTITIES.IMAGE_TYPE]
  const data = {
    imageKey: action[SETTINGS_ENTITIES.IMAGE_KEY],
    username: action[AUTH_ENTITIES.EMAIL],
    token: action[AUTH_ENTITIES.ID_TOKEN],
    userId: action[USER_ENTITIES.USER_ID],
    childId: action[CHILD_ENTITIES.CHILD_ID],
    goalId: action[GOAL_ENTITIES.GID]
  }

  getAWSSession(data.username)
    .then(() => {
      const s3 = new AWS.S3()
      const params = {
        Bucket: environmentVariable.S3_BUCKET,
        Key: data.imageKey
      }
      const ext = data.imageKey.split('.')[1]
      const typeLevel = imageType[imageType.length - 1]
      s3.getObject(params, (s3Error, response) => {
        if (s3Error != null) {
          // error dispatch, todo
        } else {
          const objectData = response.Body.toString('utf-8')
          if (objectData.indexOf('<?xml ') === -1) {
            const imgSrc = `data:image/${ext};base64,${objectData}`
            if (typeLevel === 'USER') {
              dispatch(UserActions.setUserImage(imgSrc))
            } else if (typeLevel === 'CHILD') {
              dispatch(ChildActions.setChildImage(imgSrc, data.childId))
            }
          } else {
            console.log(
              'XXXXXXXXXXXXXXXXXXXXX GOT XML RESPONSE FOR IMAGE XXXXXXXXXXXXXXXXXXXXX',
              response.Body,
            )
          }
        }
      })
    })
    .catch(error => console.log(error))
}

// get username of active user
export async function getUsername () {
  return await AsyncStorage.getItem(
    DB_ATTRIBUTES.LOGGED_IN_USERNAME,
    (err, username) => {
      if (err) {
        return undefined
      } else {
        return username
      }
    },
  )
}

// get credentials from local db for active user
export async function getCreds (username) {
  return await AsyncStorage.getItem(
    getCredentialLocalKey(username),
    (err, result) => {
      if (err) {
        return undefined
      } else {
        // ---- decode credentials as json ----
        return decodeCredentials(result)
      }
    },
  )
}

// get refresh token from current session
export async function refreshToken (obj) {
  let action = JSON.parse(obj)
  const username = action[AUTH_ENTITIES.EMAIL]
  const password = action[AUTH_ENTITIES.PASSWORD]

  try {
    var authenticationData = {
      Username: username,
      Password: password
    }
    var userData = { Username: authenticationData.Username, Pool: userPool }

    var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(
      userData,
    )

    let error = {
      status: '402',
      code: 'Change Password Error'
    }

    let refreshSessionToken
    // get current session
    return await cognitoUser.getSession((err, session) => {
      if (err) {
        console.log('got error inside --> ', err)
      } else {
        refreshSessionToken = session && session.getRefreshToken()
        return refreshSessionToken
        // let s = refreshSession(action, refreshSessionToken)
      }
    })
  } catch (err) {
    console.log('ERRORR HERE _--> ', err)
  }
}

// refresh current session
export function refreshSession (obj, refreshToken) {
  return new Promise((resolve, reject) => {
    let action = JSON.parse(obj)
    const username = action[AUTH_ENTITIES.EMAIL]
    const password = action[AUTH_ENTITIES.PASSWORD]

    try {
      var authenticationData = {
        Username: username,
        Password: password
      }
      var userData = { Username: authenticationData.Username, Pool: userPool }

      var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(
        userData,
      )

      let refreshSessionToken
      // get current session
      cognitoUser.refreshSession(refreshToken, async (err, session) => {
        if (err) {
          reject(err)
        } else {
          let idToken = session && session.idToken.jwtToken
          let refreshToken = session && session.refreshToken.token
          let token = jwt(idToken)
          let expiry = token['exp'].toString()
          await injectIDToken(idToken, expiry, refreshToken)
          resolve(idToken)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

// fetch new or previous idToken
export async function fetchAPIToken () {
  let token = await AsyncStorage.getItem(AUTH_ENTITIES.ID_TOKEN)
  let expiry = await AsyncStorage.getItem(AUTH_ENTITIES.ID_TOKEN_EXPIRY)
  let refreshedToken = await AsyncStorage.getItem(AUTH_ENTITIES.REFRESH_TOKEN)
  try {
    let expiryMoment = moment.unix(expiry)
    let currentMoment = moment()

    if (currentMoment.isSameOrAfter(expiryMoment)) {
      let username = await getUsername()
      let creds = await getCreds(username)
      // let rt = await refreshToken(creds)
      let newRefreshToken = new CognitoRefreshToken({
        RefreshToken: refreshedToken
      })
      let ss = await refreshSession(creds, newRefreshToken)
      return ss
    }
  } catch (err) {
    console.log('error while processing expiry')
  }
  return token
}
