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
import styles
  from '../../Themes/ApplicationStyles'
import _ from 'lodash'
import Colors from '../../Themes/Colors'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'
import Fonts from '../../Themes/Fonts'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { analytics } from '../../Config/AppConfig'
import {screens, events} from '../../Utility/Mapper/Tracking'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class BankAccountPending extends Component {

  // --------------------------------------------------------
  // Action handlers

  componentDidMount () {
    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.NOTIFY_MICRO_DEPOSIT_STATUS
    })
    // *********** Log Analytics ***********
  }

  componentWillMount () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.COMPLETE_ONBOARDING,
      [USER_ENTITIES.EMAIL_ID]: emailID
    })
  }

  navigateToHomepage () {
    // reset to homepage
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.NAVIGATE_TO_HOMEPAGE,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  // --------------------------------------------------------
  // Child Components

  renderMainComponent () {
    return (
      <View style={{alignSelf: 'center'}}>
        <Image style={{alignSelf: 'center', marginBottom: 23}} source={require('../../../Img/assets/onboard/verifyIdentity/verifyIdentity.png')} />
        <Text style={{ ...styles.text.mainHeader, fontFamily: Fonts.type.bold }}>
          Bank Account Pending
        </Text>
        <Text style={{ ...styles.text.title, color: Colors.blue, fontFamily: Fonts.type.book, marginVertical: 10 }}>
          {'In 2-3 business days, you will\nsee two small deposits in your\nbank account from Third Party.'}
        </Text>
        <Text style={{ ...styles.text.title, color: Colors.blue, fontFamily: Fonts.type.book, marginBottom: 41 }}>
          {'You will need to verify these\namounts to confirm your bank\naccount.'}
        </Text>
      </View>
    )
  }

  renderNextButton () {
    const isX = this.isX || false
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Ok'}
        accessibilityRole={'button'}
        style={{ 
          ...styles.bottomNavigator.containerStyle, 
          // shadowOpacity: 0.15, 
          // shadowRadius: 10, 
          // shadowOffset: {height: 3, width: 0}, 
          marginHorizontal: 20, 
          width: '50%' 
        }}
        onPress={_.debounce(_.bind(() => this.navigateToHomepage(), this), 500, {'leading': true, 'trailing': false})}
      >
        <Text style={styles.bottomNavigator.textStyle}>OK</Text>
      </TouchableOpacity>
    )
  }

  // --------------------------------------------------------
  // Core Render Component

  render () {
    return (
      <View style={{...styles.screen.containers.root, justifyContent: 'center', alignItems: 'center', marginHorizontal: '10%', marginTop: 100, marginBottom: 100, borderRadius: 10, shadowColor: Colors.black, shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.16}}>
        {this.renderMainComponent()}
        {this.renderNextButton()}
      </View>
    )
  }

}

BankAccountPending.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // email id
  emailID: PropTypes.string.isRequired,

  // user id
  userID: PropTypes.string.isRequired

}

// ========================================================
// Export
// ========================================================
export default BankAccountPending
