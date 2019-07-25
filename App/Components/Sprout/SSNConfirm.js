/* eslint-disable no-unused-vars,no-trailing-spaces,no-multiple-empty-lines */
/**
 * Created by demon on 8/1/18.
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
import Fonts
  from '../../Themes/Fonts'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import LinearGradient
  from 'react-native-linear-gradient'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class SSNConfirm extends Component {

  // --------------------------------------------------------
  // Action handlers

  confirm () {
    const {localActions, handleLocalAction, navigator, firstName, lastName, DOB, userID, identityData} = this.props
    handleLocalAction({
      type: localActions.CONFIRM,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [CHILD_ENTITIES.FIRST_NAME]: firstName,
      [CHILD_ENTITIES.LAST_NAME]: lastName,
      [CHILD_ENTITIES.DOB]: DOB,
      [USER_ENTITIES.USER_ID]: userID,
      [USER_ENTITIES.IDENTITY_DATA]: identityData
    })
  }

  skip () {
    const {localActions, handleLocalAction, navigator, firstName, lastName, DOB, emailID, userID, identityData} = this.props
    handleLocalAction({
      type: localActions.SKIP,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [CHILD_ENTITIES.FIRST_NAME]: firstName,
      [CHILD_ENTITIES.LAST_NAME]: lastName,
      [CHILD_ENTITIES.DOB]: DOB,
      [USER_ENTITIES.USER_ID]: userID,
      [USER_ENTITIES.EMAIL_ID]: emailID,
      [USER_ENTITIES.IDENTITY_DATA]: identityData
    })
  }

  // --------------------------------------------------------
  // Child Components

  renderTextComponent () {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', paddingLeft: 45, paddingRight: 45, marginTop: 30}}>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 16, color: '#9B9B9B', textAlign: 'center', backgroundColor: 'transparent'}}>
          There’s tax benefits by adding these details now. Otherwise you can update these details later.
        </Text>
      </View>
    )
  }

  renderHeading () {
    return (
      <View style={{paddingLeft: 30, paddingRight: 30}}>
        <Text style={{textAlign: 'center', fontFamily: Fonts.type.regular, fontSize: 30, color: '#4A4A4A', backgroundColor: 'transparent'}}>
          Do you have your child’s SSN?
        </Text>
      </View>
    )
  }

  renderImage () {
    return (
      <Image source={require('../../../Img/intermediateScreen/childSSN2.png')} style={{height: 210, width: 330, right: 10, bottom: 60}} />
    )
  }
  renderDecisionButtons () {
    return (
      <View style={{flexDirection: 'row', height: 50}}>

        <TouchableOpacity
          accessible
          accessibilityLabel={'Skip'}
          accessibilityRole={'button'}
          onPress={() => this.skip()}
          style={{flex: 5, height: 50, backgroundColor: '#F1F1F1', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: '#00CBCE', fontSize: 16, fontFamily: 'Lato-Bold', backgroundColor: 'transparent'}}>
            SKIP
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Next'}
          accessibilityRole={'button'}
          onPress={() => this.confirm()}
          style={{flex: 5, height: 50, backgroundColor: '#F1F1F1'}}>
          <LinearGradient colors={['#00CBCE', '#6BEAC0']} start={{x: 0, y: 0}} end={{x: 3, y: 1}} locations={[0, 0.7]} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#FFF', fontSize: 16, fontFamily: 'Lato-Bold', backgroundColor: 'transparent'}}>
              NEXT
            </Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    )
  }


  // --------------------------------------------------------
  // Core Render Component

  render () {
    const {isProcessing} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <ProcessingIndicator isProcessing={isProcessing} />
        <View style={{flex: 5, justifyContent: 'flex-end', alignItems: 'center'}}>
          {this.renderImage()}
        </View>
        <View style={{flex: 5, justifyContent: 'flex-start'}}>
          <View style={{flex: 1}}>
            {this.renderHeading()}
            {this.renderTextComponent()}
          </View>
          {this.renderDecisionButtons()}
        </View>
      </View>
    )
  }

}

SSNConfirm.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // is add child processing
  isProcessing: PropTypes.bool.isRequired,

  userID: PropTypes.string.isRequired,
  identityData: PropTypes.object,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  DOB: PropTypes.string.isRequired,
  emailID: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

export default SSNConfirm
