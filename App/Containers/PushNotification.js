/**
 * Created by demon on 3/4/18.
 */

import PushNotification from 'react-native-push-notification'
import { PushNotificationIOS, Alert } from 'react-native'

const configure = () => {
  PushNotification.configure({

    onRegister: function (token) {
      // process token
      console.log('****************** token ****************** ', token)
      Alert.alert('Push success ', token)
    },

    onNotification: function (notification) {
      // process the notification
      // required on iOS only
      notification.finish(PushNotificationIOS.FetchResult.NoData)
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true
    },

    popInitialNotification: true,
    requestPermissions: true

  })
}

export {
  configure
}

