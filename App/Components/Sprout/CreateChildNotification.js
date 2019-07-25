/* eslint-disable no-unused-vars,no-trailing-spaces */
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
import { View, Alert, Text, ImageBackground, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, TouchableOpacity, TouchableHighlight, Image, ActivityIndicator }
  from 'react-native'
import Modal
  from 'react-native-modal'
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
import { analytics }
  from '../../Config/AppConfig'
import {screens, events}
  from '../../Utility/Mapper/Tracking'
import GravityCapsule
  from '../Utility/GravityCapsule'
import Colors
  from '../../Themes/Colors'
import CustomNav
  from '../../Containers/Common/CustomNav'
import CustodialInfo
  from './CustodialInfo'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class CreateChildNotification extends Component {

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.state = {
      showModal: false
    }
  }

  componentDidMount () {
    this.updateCurrentOnboarding()
  }

  // --------------------------------------------------------
  // Action handlers

  toggleModal (visible) {
    this.setState({
      showModal: visible
    })

    const {userID} = this.props
    if (visible) {
      // *********** Log Analytics ***********
      analytics.track({
        userId: userID,
        event: events.VIEWED_WHAT_IS_CUSTODIAL_ACCOUNT
      })
      // *********** Log Analytics ***********
    }
  }

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  next () {
    const { handleLocalAction, localActions, navigator, userID } = this.props
    handleLocalAction({ type: localActions.NEXT, [COMMON_ENTITIES.NAVIGATOR]: navigator, [USER_ENTITIES.USER_ID]: userID, [COMMON_ENTITIES.IS_ONBOARDING_FLOW]: true })
  }

  skip () {
    const {handleLocalAction, localActions, navigator, userID, emailID} = this.props
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.SKIPPED_CHILD_NOTIFICATION_SCREEN
    })
    // *********** Log Analytics ***********

    handleLocalAction({type: localActions.SKIP, [COMMON_ENTITIES.NAVIGATOR]: navigator, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  renderModal () {
    const {showModal} = this.state
    if (!showModal) {
      return null
    } else {
      return (
        <Modal
          keyboardShouldPersistTaps='always'
          style={{justifyContent: 'flex-end', marginVertical: 100, marginHorizontal: 32}}
          backdropColor='black'
          animationOut='slideOutDown'
          backdropOpacity={0.6}
          isVisible={showModal}>

          <CustodialInfo toggleModal={this.toggleModal.bind(this)} />

        </Modal>
      )
    }
  }

  // --------------------------------------------------------
  // Child Components

  renderMainComponent () {
    return (
      <View style={{flex: 1, marginBottom: 110}}>
        <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
          <Image style={{alignSelf: 'center'}} source={require('../../../Img/assets/onboard/createCustodial/createCustodial.png')} />
          <Text style={{ fontFamily: Fonts.type.bold, marginTop: 18, textAlign: 'center', color: Colors.white, fontSize: 22, alignSelf: 'center', lineHeight: 28 }}>
            Now, time to focus on the lucky little loved one.
          </Text>
          <Text style={{fontFamily: Fonts.type.book, textAlign: 'center', marginTop: 15, color: Colors.white, fontSize: 16, alignSelf: 'center', lineHeight: 20}}>
            To create the child’s custodial account, we’ll need to collect some of their information.
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          accessible
          accessibilityLabel={'custodial account'}
          accessibilityRole={'button'}
          onPress={() => this.toggleModal(true)}>
          <Text
            style={{fontSize: 18, lineHeight: 23, textAlign: 'center', fontFamily: Fonts.type.book, color: Colors.white}}>
            {'What’s a custodial account?'}
          </Text>
        </TouchableOpacity>
        <Text style={{fontSize: 12, lineHeight: 15, textAlign: 'center', fontFamily: Fonts.type.book, color: Colors.white, opacity: 0.7, marginTop: 15}}>Loved encrypts and securely transmits your {'\n'}information using SSL.</Text>
      </View>
    )
  }

  renderNextButton () {
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
          onPress={_.debounce(_.bind(() => this.next(), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={[styles.bottomNavigator.textStyle, {color: Colors.darkBlue}]}>Continue</Text>
        </TouchableHighlight>
      </GravityCapsule>
    )
  }

  // --------------------------------------------------------
  // Core Render Component
  render () {
    const { height, width } = Dimensions.get('window')
    return (
      <ImageBackground style={{flex: 1, backgroundColor: Colors.white}} source={require('../../../Img/appBackground.png')}>
        <View style={{flex: 1, paddingHorizontal: 32}}>
          {this.renderMainComponent()}
          {this.renderNextButton()}
        </View>
        {this.renderModal()}
      </ImageBackground>
    )
  }
}

CreateChildNotification.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  userID: PropTypes.string.isRequired,

  emailID: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

export default CreateChildNotification
