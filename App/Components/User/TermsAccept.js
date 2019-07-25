/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces */
/**
 * User Input Detail Number 1.
 * - First Name
 * - Last Name
 *
 * Created by viktor on 27/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, KeyboardAvoidingView, Alert, Dimensions, TouchableOpacity, TouchableHighlight, Keyboard, ScrollView, Image, ActivityIndicator } from 'react-native'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { FORM_TYPES } from '../../Config/contants'
import Fonts from '../../Themes/Fonts'
import styles from '../../Themes/ApplicationStyles'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION } from '../../Utility/Mapper/Common'
import { SETTINGS_ENTITIES } from '../../Utility/Mapper/Settings'
import Toast
  from '../Common/Toast'
import CustomNav
  from '../../Containers/Common/CustomNav'
import _ from 'lodash'
import { analytics } from '../../Config/AppConfig'
import {screens, events} from '../../Utility/Mapper/Tracking'
import Colors from '../../Themes/Colors'
import GravityCapsule from '../Utility/GravityCapsule'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_USER,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class TermsAccept extends Component {

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

  agreeTC () {
    const { handleLocalAction, localActions, navigator, userID, emailID, formData } = this.props
    handleLocalAction({
      type: localActions.AGREE,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [USER_ENTITIES.USER_ID]: userID,
      [USER_ENTITIES.EMAIL_ID]: emailID,
      [USER_ENTITIES.IDENTITY_DATA]: formData
    })
  }

  visitThirdParty () {
    const {handleLocalAction, localActions, navigator, userID} = this.props
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.CHECKED_THIRD_PARTY_TERMS
    })
    // *********** Log Analytics ***********

    handleLocalAction({type: localActions.SHOW_URL, [SETTINGS_ENTITIES.URL]: 'https://www.thirdparty.com/files/TPT_Customer_Agreement.pdf', [SETTINGS_ENTITIES.HEADING]: 'THIRD PARTY TRADE', [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  visitApex () {
    const {handleLocalAction, localActions, navigator, userID} = this.props
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.CHECKED_APEX_TERMS
    })
    // *********** Log Analytics ***********

    handleLocalAction({type: localActions.SHOW_URL, [SETTINGS_ENTITIES.URL]: 'https://www.thirdparty.com/files/Apex%20Clearing%20Corporation%20-%20Customer%20Account%20Agreement.pdf', [SETTINGS_ENTITIES.HEADING]: 'APEX CLEARING CORPORATION', [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  visitWrapProgram () {
    const {handleLocalAction, localActions, navigator, userID} = this.props
    handleLocalAction({type: localActions.SHOW_URL, [SETTINGS_ENTITIES.URL]: 'https://s3.amazonaws.com/www.loved.com/legal/20180207+ADV+Wrap+-+Elevated+Principles+Inc.pdf', [SETTINGS_ENTITIES.HEADING]: 'LOVED WRAP PROGRAM BROCHURE', [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  visitAdvisory () {
    const {handleLocalAction, localActions, navigator, userID} = this.props
    handleLocalAction({type: localActions.SHOW_URL, [SETTINGS_ENTITIES.URL]: 'https://s3.amazonaws.com/www.loved.com/legal/Investment+Advisory+Agreement.pdf', [SETTINGS_ENTITIES.HEADING]: 'LOVED ADVISORY AGREEMENT', [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  disagreeTC () {
    const { handleLocalAction, localActions, userID } = this.props
    handleLocalAction({type: localActions.DISAGREE, [USER_ENTITIES.USER_ID]: userID})
  }

  closeTC () {
    const { handleLocalAction, localActions, navigator } = this.props
    handleLocalAction({ type: localActions.CLOSE_TC, [COMMON_ENTITIES.NAVIGATOR]: navigator })
  }

  renderMessage () {
    return (
      <View style={{flex: 1}}>
        <Text style={{ fontFamily: Fonts.type.book, color: '#1C3C70', fontSize: 16, textAlign: 'center' }}>
          The agreements below detail our relationship with you, our client.
        </Text>
        <Text style={{ fontFamily: Fonts.type.book, color: '#1C3C70', fontSize: 16, textAlign: 'center', marginTop: 20 }}>
          By tapping “I Agree” you agree to the terms outlined in the following {'\n'}Agreements:
        </Text>
        <Text onPress={() => this.visitThirdParty()} style={{ fontFamily: Fonts.type.book, color: '#1C3C70', fontSize: 16, textAlign: 'center', marginTop: 20, textDecorationLine: 'underline' }}>
          Third Party Trade Agreement
        </Text>
        <Text onPress={() => this.visitApex()} style={{ fontFamily: Fonts.type.book, color: '#1C3C70', fontSize: 16, textAlign: 'center', marginTop: 20, textDecorationLine: 'underline' }}>
          Apex Clearing Agreement
        </Text>
        <Text onPress={() => this.visitWrapProgram()} style={{ fontFamily: Fonts.type.book, color: '#1C3C70', fontSize: 16, textAlign: 'center', marginTop: 20, textDecorationLine: 'underline' }}>
          Loved Wrap Program Brochure
        </Text>
        <Text onPress={() => this.visitAdvisory()} style={{ fontFamily: Fonts.type.book, color: '#1C3C70', fontSize: 16, textAlign: 'center', marginTop: 20, textDecorationLine: 'underline' }}>
          Loved Advisory Agreement
        </Text>
      </View>
    )
  }

  renderHeading () {
    return (
      <View style={{...styles.screen.h2.containerStyle, marginTop: 30, alignItems: 'center'}}>
        <Text style={{fontFamily: Fonts.type.bold, textAlign: 'center', color: '#1C3C70', fontSize: 22, alignSelf: 'center'}}>
          Review your account terms
        </Text>
        <Text style={{marginTop: 25, fontFamily: Fonts.type.book, textAlign: 'center', color: '#1C3C70', fontSize: 18, alignSelf: 'center'}}>
          We’re here for you and your kids, every step of their journey.
        </Text>
      </View>
    )
  }

  renderNextButton () {
    const { handleSubmit } = this.props
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={27}>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Agree'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle,
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 10, width: 0},
            marginHorizontal: 20
          }}
          onPress={_.debounce(_.bind(() => this.agreeTC(), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>Agree</Text>
        </TouchableHighlight>
      </GravityCapsule>
    )
  }

  render () {
    const {toast, toastHeading, popButton, toastSubheading, navigator} = this.props
    return (
      <View style={{ backgroundColor: '#FFF', flex: 1 }}>
        <Toast toast={toast} heading={toastHeading} subheading={toastSubheading} shouldFloat />
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent={popButton} titlePresent title='Profile' />
        <View style={{paddingHorizontal: 32, flex: 1}}>
          {this.renderHeading()}
          {this.renderMessage()}
          {this.renderNextButton()}
        </View>
      </View>
    )
  }
}

TermsAccept.propTypes = {
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

  // email id
  emailID: PropTypes.string.isRequired,

  // user identity form data
  formData: PropTypes.object.isRequired,

  popButton: PropTypes.bool,

  // toast
  toast: PropTypes.bool,
  toastHeading: PropTypes.string,
  toastSubheading: PropTypes.string
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(TermsAccept))

export default Screen
