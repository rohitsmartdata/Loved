/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces */
/**
 * User Input Detail Number 3.
 * - SSN
 *
 * Created by viktor on 27/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, KeyboardAvoidingView, Keyboard, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import { reduxForm } from 'redux-form'
import CustomNav from '../../Containers/Common/CustomNav'
import { connect } from 'react-redux'
import { FORM_TYPES } from '../../Config/contants'
import styles from '../../Themes/ApplicationStyles'
import Fonts from '../../Themes/Fonts'
import CustomButton from '../Utility/CustomButton'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { COMMON_ENTITIES, BUTTON_TYPES } from '../../Utility/Mapper/Common'
import Toast
  from '../Common/Toast'
import _
  from 'lodash'
import { analytics } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'

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

class InputUserDetail_4 extends Component {
  // --------------------------------------------------------
  // Action Handlers

  componentWillMount () {
    this.updateCurrentOnboarding()
  }

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  navigateToNextScreen (residencyType) {
    const { localActions, handleLocalAction, navigator, nextScreen, userID } = this.props
    handleLocalAction({
      type: localActions.NAVIGATE_TO_NEXT_SCREEN,
      [COMMON_ENTITIES.SCREEN_TYPE]: nextScreen,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [USER_ENTITIES.RESIDENCY_TYPE]: residencyType,
      form: FORM_TYPES.ADD_USER,
      field: USER_ENTITIES.RESIDENCY_TYPE,
      value: residencyType,
      [USER_ENTITIES.USER_ID]: userID
    })
  }

  componentDidMount () {
    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.USER_RESIDENCY_TYPE
    })
    // *********** Log Analytics ***********
  }

  // --------------------------------------------------------
  // Inner components render

  renderHeading () {
    return (
      <View style={{ ...styles.screen.h2.containerStyle, paddingHorizontal: 16 }}>
        <Text style={{ ...styles.screen.h2.textStyle, fontFamily: Fonts.type.semibold, color: '#000000', fontSize: 20 }}>
          I live in the USA as a:
        </Text>
        <Text style={{ marginTop: 10, fontFamily: Fonts.type.regular, color: '#000', fontSize: 14, backgroundColor: 'transparent' }}>
          We are required to collect this information under Federal Law.
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const { residencyType } = this.props
    return (
      <View style={{flex: 1, justifyContent: 'center', bottom: 20}}>
        {this.renderList('U.S. Citizen', USER_ENTITIES.CITIZEN, true, false)}
        {this.renderList('Green Card Holder', USER_ENTITIES.GREENCARD, true, false)}
        {this.renderList('Other', USER_ENTITIES.OTHER_RESIDENCY, true, true)}
      </View>
    )
  }

  renderList (title, residencyType, showTopBorder, showBottomBorder) {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={title}
        accessibilityRole={'button'}
        style={{borderColor: '#D7D7D7', borderTopWidth: showTopBorder ? 1 : 0, borderBottomWidth: showBottomBorder ? 1 : 0}} onPress={_.debounce(_.bind(() => this.navigateToNextScreen(residencyType), this), 500, {'leading': true, 'trailing': false})}>
        <View style={{justifyContent: 'center', alignItems: 'center'}} >
          <Text style={{ color: '#10427E', backgroundColor: 'transparent', fontSize: 20, fontFamily: Fonts.type.regular, marginVertical: 25 }}>{title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderNextButton () {
    const { handleSubmit } = this.props
    return (
      <View style={{ marginTop: 16 }}>
        <CustomButton title='NEXT' onClick={handleSubmit(data => this.navigateToNextScreen())} />
      </View>
    )
  }

  // --------------------------------------------------------
  // Core component render

  render () {
    const {navigator, popButton, toast, toastHeading, toastSubheading} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <Toast toast={toast} heading={toastHeading} subheading={toastSubheading} shouldFloat />
        <CustomNav navigator={navigator} leftButtonPresent={popButton} titlePresent title='Your Account' />
        <ScrollView scrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={{ ...styles.screen.containers.root }}>
          {this.renderHeading()}
          {this.renderFormContainer()}
        </ScrollView>
      </View>
    )
  }
}

InputUserDetail_4.propTypes = {
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

  // pop Button
  popButton: PropTypes.bool,

  // toast
  toast: PropTypes.bool,
  toastHeading: PropTypes.string,
  toastSubheading: PropTypes.string
}

InputUserDetail_4.defaultProps = {
  residencyType: USER_ENTITIES.CITIZEN,
  popButton: true
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(InputUserDetail_4))

export default Screen
