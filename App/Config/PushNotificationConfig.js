import { PushNotificationIOS } from 'react-native'
import {analytics, MIXPANEL_API_TOKEN} from './AppConfig'
import Mixpanel from 'react-native-mixpanel'

// Mixpanel PushNotification setup

export const setUpPushNotification = (userID, emailID, onNotificationReceive = onNotification) => {
  return new Promise((resolve, reject) => {
    // you could check the app state to respond differently to push notifications depending on if the app is running in the background or is currently active.
    PushNotificationIOS.addEventListener('register', token => {
      console.log('PushNotification Device Token: ', token)
      // Init Mixpanel SDK with your project token
      Mixpanel.sharedInstanceWithToken(MIXPANEL_API_TOKEN)
        .then(() => {
          // add iOS device token
          Mixpanel.addPushDeviceToken(token)
        })
      analytics.identify({
        userId: userID,
        traits: {
          $email: emailID
        },
        context: {
          device: {
            token: token
          }
        }
      })
    })
    PushNotificationIOS.removeEventListener('notification')
    PushNotificationIOS.addEventListener('notification', (notification) => onNotificationReceive(notification))
    return PushNotificationIOS.requestPermissions().then((response) => resolve(response)).catch((error) => reject(error))
  })
}

function onNotification (notification) {
  console.log('PushNotification Data: ', notification)
}
export const clearPushNotification = (userID, emailID) => {
  PushNotificationIOS.removeEventListener('notification')
  PushNotificationIOS.abandonPermissions()
}
