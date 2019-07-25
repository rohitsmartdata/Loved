/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 24/11/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, Alert, ActionSheetIOS, KeyboardAvoidingView, Keyboard, ScrollView, Image, ActivityIndicator, TouchableOpacity, TouchableHighlight, Dimensions, ImageBackground } from 'react-native'
import styles from '../../Themes/ApplicationStyles'
import Fonts from '../../Themes/Fonts'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION } from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import _
  from 'lodash'
import Communications
  from 'react-native-communications'
import { analytics } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'
import CustomNav from '../../Containers/Common/CustomNav'
import GravityCapsule from '../Utility/GravityCapsule'
import Colors from '../../Themes/Colors'

// ========================================================
// Core Component
// ========================================================

class ConfirmInvestorProfile extends Component {

  constructor (props) {
    super(props)
    const {height, width} = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentWillMount () {
    this.updateCurrentOnboarding()
  }

  componentDidMount () {
    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.USER_VERIFY_ID
    })
    // *********** Log Analytics ***********
  }

  navigateToNextScreen () {
    const {localActions, handleLocalAction, navigator, nextScreen, userID} = this.props
    handleLocalAction({type: localActions.NAVIGATE_TO_NEXT_SCREEN, [USER_ENTITIES.USER_ID]: userID, [COMMON_ENTITIES.SCREEN_TYPE]: nextScreen, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
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

  // --------------------------------------------------------
  // Inner components render

  renderNextButton () {
    const { handleSubmit } = this.props
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={27}>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{ 
            ...styles.bottomNavigator.containerStyle, 
            // shadowOpacity: 0.15, 
            // shadowRadius: 10, 
            // shadowOffset: {height: 10, width: 0}, 
            marginHorizontal: 42 
          }}
          onPress={_.debounce(_.bind(() => this.navigateToNextScreen(), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={[styles.bottomNavigator.textStyle, {color: Colors.darkBlue}]}>Continue</Text>
        </TouchableHighlight>
      </GravityCapsule>
    )
  }

  renderMainComponent () {
    return (
      <View style={{flex: 1, marginBottom: 80}}>
        <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
          <Image style={{alignSelf: 'center'}} source={require('../../../Img/assets/onboard/buildProfile/buildProfile.png')} />
          <Text style={{ fontFamily: Fonts.type.bold, marginTop: 26, color: Colors.white, fontSize: 22, alignSelf: 'center', textAlign: 'center', lineHeight: 28 }}>
            Now we’re all secure, let’s {'\n'}create your investor profile.
          </Text>
          <Text style={{fontFamily: Fonts.type.book, marginTop: 20, color: Colors.white, fontSize: 16, textAlign: 'center', marginHorizontal: 15, lineHeight: 20}}>
            We need some info to personalize your {'\n'}experience and to identify you, the adult, {'\n'}as the account’s custodian.
          </Text>
        </View>
        <View style={{height: 66}}>
          <Text style={{fontFamily: Fonts.type.book, fontSize: 12, textAlign: 'center', marginHorizontal: 20, color: Colors.white, opacity: 0.7, lineHeight: 15}}>
            {'Loved encrypts and securely transmits your information using SSL.'}
          </Text>
        </View>
      </View>
    )
  }

  // --------------------------------------------------------
  // Core component render

  render () {
    const { navigator } = this.props
    const { height, width } = Dimensions.get('window')
    return (
      <ImageBackground style={{...styles.screen.containers.root, paddingHorizontal: 20}} source={require('../../../Img/appBackground.png')}>
        {this.renderMainComponent()}
        {this.renderNextButton()}
      </ImageBackground>
    )
  }
}

ConfirmInvestorProfile.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // email id
  emailID: PropTypes.string.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // toast
  toast: PropTypes.bool,
  toastHeading: PropTypes.string,
  toastSubheading: PropTypes.string
}

// ========================================================
// Export
// ========================================================

export default ConfirmInvestorProfile
