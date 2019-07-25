/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 9/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, TouchableOpacity, Image, ActivityIndicator }
  from 'react-native'
import {reduxForm, Field}
  from 'redux-form'
import { connect }
  from 'react-redux'
import {FORM_TYPES}
  from '../../Config/contants'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES, BUTTON_TYPES}
  from '../../Utility/Mapper/Common'
import LinearGradient
  from 'react-native-linear-gradient'
import LWButton
  from '../Utility/LWButton'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class BankSetup extends Component {

  // --------------------------------------------------------
  // Action handlers

  next () {
    const {handleLocalAction, localActions, navigator, userID} = this.props
    handleLocalAction({type: localActions.NEXT, [COMMON_ENTITIES.NAVIGATOR]: navigator, [USER_ENTITIES.USER_ID]: userID})
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 30, paddingRight: 30}}>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 34, color: '#006B58', textAlign: 'center', backgroundColor: 'transparent'}}>
          Connect your bank account to start building wealth for your children
        </Text>
      </View>
    )
  }

  renderImage () {
    return (
      <Image source={require('../../../Img/icons/editBank.png')} style={{height: 200, width: 300, marginTop: 40}} />
    )
  }

  renderDecisionButtons () {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 60}}>
        <LWButton title='Add Bank Account' onPress={() => console.log('add account')} buttonType={BUTTON_TYPES.DECISION_BUTTON} extraStyle={{width: 300, height: 50, backgroundColor: 'rgb(0, 174, 112)'}} />
      </View>
    )
  }
  // --------------------------------------------------------
  // Bank Setting Components

  renderBankSettingHeading () {
    return (
      <View style={{padding: 40}}>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 20, color: '#006B58', backgroundColor: 'transparent', textAlign: 'center'}}>
          Funds are transfered to and from this account as directed by you for Loved Wealth customers account
        </Text>
      </View>
    )
  }

  renderBankDetailPanel () {
    return (
      <View style={{height: 100, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#D7D7D7', paddingLeft: 20, paddingRight: 20}}>
        <View style={{justifyContent: 'center'}}>
          <Text style={{fontSize: 16, fontFamily: Fonts.type.regular, color: '#4A4A4A', backgroundColor: 'transparent'}}>
            Bank of America - 39058
          </Text>
        </View>

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity>
            <Text style={{fontSize: 16, fontFamily: Fonts.type.regular, color: '#38AA75', backgroundColor: 'transparent'}}>
              Replace
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderSettingState () {
    return (
      <View style={{flex: 1}}>
        {this.renderBankSettingHeading()}
        {this.renderBankDetailPanel()}
      </View>
    )
  }

  // --------------------------------------------------------
  // Core Render Component

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        {this.renderSettingState()}
      </View>
    )
  }

}

BankSetup.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  userID: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

export default BankSetup
