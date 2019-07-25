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
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
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

class IdentityVerification extends Component {

  constructor (props) {
    super(props)
    const {height, width} = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentWillMount () {
    this.updateCurrentOnboarding()
  }

  navigateToNextScreen () {
    const {localActions, handleLocalAction, navigator, childID, isAddingDesire, isAddingDream} = this.props
    handleLocalAction({type: localActions.NAVIGATE_TO_NEXT_SCREEN,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [CHILD_ENTITIES.IS_ADDING_DESIRE]: isAddingDesire,
      [CHILD_ENTITIES.IS_ADDING_DREAM]: isAddingDream,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
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
          <Image style={{alignSelf: 'center'}} source={require('../../../Img/assets/onboard/verifyIdentity/verifyIdentity.png')} />
          <Text style={{ fontFamily: Fonts.type.bold, marginTop: 41, color: Colors.white, fontSize: 22, alignSelf: 'center', lineHeight: 28 }}>
            Verifying your identities.
          </Text>
          <Text style={{ fontFamily: Fonts.type.book, color: Colors.white, fontSize: 16, textAlign: 'center', marginTop: 15, lineHeight: 20 }}>
            {'As an SEC registered investment \nadvisor, Loved is required by federal law \n(US Patriot Act) to collect some personal \ninformation about you and your family.'}
          </Text>
        </View>
        <View style={{height: 66, marginBottom: 10}}>
          <Text style={{ fontFamily: Fonts.type.book, fontSize: 16, textAlign: 'center', color: Colors.white }}>
            {'Loved encrypts and securely transmits\nyour information using SSL.'}
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
      <ImageBackground style={{...styles.screen.containers.root}} source={require('../../../Img/appBackground.png')}>
        {this.renderMainComponent()}
        {this.renderNextButton()}
      </ImageBackground>
    )
  }
}

IdentityVerification.propTypes = {
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

  // child id
  childID: PropTypes.string.isRequired,

  // is adding dream
  isAddingDream: PropTypes.bool,

  // is adding desire
  isAddingDesire: PropTypes.bool,

  // toast
  toast: PropTypes.bool,
  toastHeading: PropTypes.string,
  toastSubheading: PropTypes.string
}

// ========================================================
// Export
// ========================================================

export default IdentityVerification
