/* eslint-disable no-unused-vars,no-trailing-spaces,no-multiple-empty-lines */
/**
 * Created by demon on 24/11/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {
  View, Text, ActionSheetIOS, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, TouchableOpacity, Image,
  ActivityIndicator, PushNotificationIOS, ImageBackground, TouchableHighlight
}
  from 'react-native'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION }
  from '../../Utility/Mapper/Common'
import _
  from 'lodash'
import Communications
  from 'react-native-communications'
import { analytics } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'
import {setUpPushNotification} from '../../Config/PushNotificationConfig'
import CustomNav from '../../Containers/Common/CustomNav'
import Colors from '../../Themes/Colors'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import * as Constants from '../../Themes/Constants'

// ========================================================
// Core Component
// ========================================================

class ConfirmPushNotification extends Component {
  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }

  componentDidMount () {
    this.updateCurrentOnboarding()
  }

  // --------------------------------------------------------
  // Action handlers

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  confirm () {
    const { handleLocalAction, localActions, navigator, userID, emailID, childID } = this.props
    setUpPushNotification(userID, emailID)
      .finally(() => {
        handleLocalAction({ type: localActions.CONFIRM, [COMMON_ENTITIES.NAVIGATOR]: navigator, [USER_ENTITIES.USER_ID]: userID, [CHILD_ENTITIES.CHILD_ID]: childID })
      })
  }

  skip () {
    const { handleLocalAction, localActions, navigator, userID } = this.props
    handleLocalAction({ type: localActions.SKIP, [COMMON_ENTITIES.NAVIGATOR]: navigator, [USER_ENTITIES.USER_ID]: userID })
  }

  showActionSheet () {
    const {goal} = this.props
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Email us'],
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 1:
          Communications.email(['support@loved.com'], null, null, 'Your topic here...', 'Your concern here...')
          break
      }
    })
  }

  // --------------------------------------------------------  // Child Components
  renderNextButton () {
    const isX = this.isX || false
    return (
      <View>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Yes'}
          accessibilityRole={'button'}
          style={{ 
            ...styles.bottomNavigator.containerStyle, 
            // shadowOpacity: 0.15, 
            // shadowRadius: 10, 
            // shadowOffset: {height: 10, width: 0}, 
            marginHorizontal: 42 
          }}
          onPress={_.debounce(_.bind(() => this.confirm(), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={{...styles.bottomNavigator.textStyle, color: Colors.darkBlue}}>Yes Please</Text>
        </TouchableHighlight>
        <TouchableOpacity
          activeOpacity={1}
          accessible
          accessibilityLabel={'Not Now'}
          accessibilityRole={'button'}
          onPress={_.debounce(_.bind(() => this.skip(), this), 500, {'leading': true, 'trailing': false})}>
          <Text
            style={{ ...styles.text.title, color: Colors.white, fontWeight: 'normal', fontFamily: Fonts.type.book, fontSize: 16, lineHeight: 20, marginTop: 13, marginBottom: 30 }}>Not now
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderMainComponent () {
    const isX = this.isX || false
    const { width } = Dimensions.get('window')
    const marginTop = (Constants.screen.height * 108) / 812
    return (
      <View style={{flex: 1, marginTop}}>
        <Image style={{height: 154, width: 149, alignSelf: 'center', marginBottom: 33}} source={require('../../../Img/Images/onBoarding/confirmNotification.png')} />
        <Text style={{ ...styles.text.mainHeader, color: Colors.white }}>
          {'Can we keep you up \nto date?\n'}
        </Text>
        <Text style={{ ...styles.text.header, color: Colors.white, fontWeight: 'normal' }}>
          {'We’ll notify you of investment \nupdates, interesting news or when \nlessons are ready to be completed.'}
        </Text>
      </View>
    )
  }
  // --------------------------------------------------------
  // Core Render Component

  render () {
    const { navigator } = this.props
    return (
      <ImageBackground style={{...styles.screen.containers.root}} source={require('../../../Img/appBackground.png')}>
        {this.renderMainComponent()}
        {this.renderNextButton()}
      </ImageBackground>
    )
  }
}

ConfirmPushNotification.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // user id
  userID: PropTypes.string.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // email id
  emailID: PropTypes.string.isRequired,

  // toast
  toast: PropTypes.bool,
  toastHeading: PropTypes.string,
  toastSubheading: PropTypes.string
}

// ========================================================
// Export
// ========================================================

export default ConfirmPushNotification
