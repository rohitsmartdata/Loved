/* eslint-disable no-unused-vars */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Alert, Text, Animated, Easing, TouchableHighlight, Dimensions, NativeModules, KeyboardAvoidingView, Keyboard, ScrollView, TouchableOpacity, Image, ActivityIndicator }
  from 'react-native'
import { Field, reduxForm }
  from 'redux-form'
import { connect }
  from 'react-redux'
import Colors
  from '../../Themes/Colors'
import CustomNav
  from '../../Containers/Common/CustomNav'
import styles
  from '../../Themes/ApplicationStyles'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import LWFormInput
  from '../Utility/LWFormInput'
import { FORM_TYPES }
  from '../../Config/contants'
import ShadowedContainer
  from '../../CommonComponents/ShadowedContainer'
import Fonts
  from '../../Themes/Fonts'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import GravityCapsule
  from '../Utility/GravityCapsule'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import { SPROUT } from '../../Utility/Mapper/Screens'

// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.BANK_DETAILS,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class ResetBankAccount extends Component {

  constructor (props) {
    super(props)
    this.state = {
      showMessage: false
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormaliPhone = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
  }

  // --------------------------------------------------------
  // Action handlers
  resetBank () {
    const {handleLocalAction, localActions, userID, navigator, fundingSourceId} = this.props
    handleLocalAction({type: localActions.RESET_BANK, [USER_ENTITIES.USER_ID]: userID, [USER_ENTITIES.SOURCE_REFERENCE_ID]: fundingSourceId, 'resetLogin': true, [COMMON_ENTITIES.CALLBACK_FUCTION]: this.showSuccessMessage.bind(this), [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  componentWillMount () {
    this.resetBank()
  }

  showSuccessMessage (showMessage) {
    this.setState({showMessage})
  }

  renderHeading () {
    return (
      <View style={{ ...styles.screen.h2.containerStyle, marginTop: 27 }}>
        <Text style={{ ...styles.text.mainHeader, alignSelf: 'center', marginBottom: 7, fontFamily: Fonts.type.bold }}>
          Reset Bank Account
        </Text>
        {this.state.showMessage &&
          <Text style={{fontSize: 16, fontFamily: Fonts.type.book, color: Colors.blue, textAlign: 'center', marginTop: 50}}>
            Bank account has been successfully reset.
          </Text>
        }
      </View>
    )
  }

  render () {
    const { navigator } = this.props

    return (
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Reset Bank Account' />
        <View style={{flex: 1, paddingHorizontal: 32}}>
          {this.renderHeading()}
        </View>
      </View>
    )
  }

}

ResetBankAccount.propTypes = {
  // used for navigation, comes via react-navigation
  navigation: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func
}

// ========================================================
// Export
// ========================================================
// const Screen = connect()(form(ResetBankAccount))

export default ResetBankAccount

