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

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, KeyboardAvoidingView, Keyboard, ScrollView, Image, ActivityIndicator, TouchableOpacity }
  from 'react-native'
import {reduxForm}
  from 'redux-form'
import CustomNav
  from '../../Containers/Common/CustomNav'
import { connect }
  from 'react-redux'
import {FORM_TYPES}
  from '../../Config/contants'
import styles
  from '../../Themes/ApplicationStyles'
import CustomButton
  from '../Utility/CustomButton'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
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
    const {residencyType} = this.props
  }

  navigateToNextScreen (residencyType) {
    const {localActions, handleLocalAction, navigator, nextScreen} = this.props
    handleLocalAction({
      type: localActions.NAVIGATE_TO_NEXT_SCREEN,
      [COMMON_ENTITIES.SCREEN_TYPE]: nextScreen,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [USER_ENTITIES.RESIDENCY_TYPE]: residencyType,
      form: FORM_TYPES.ADD_USER,
      field: USER_ENTITIES.RESIDENCY_TYPE,
      value: residencyType
    })
  }

  // --------------------------------------------------------
  // Inner components render

  renderHorizontalLine () {
    return (
      <View style={styles.screen.horizontalLine.containerStyle}>
        <View style={styles.screen.horizontalLine.lineStyle} />
      </View>
    )
  }

  renderHeading () {
    return (
      <View style={styles.screen.h2.containerStyle}>
        <Text style={{...styles.screen.h2.textStyle}}>
          I live in the US as a :
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const {residencyType} = this.props
    return (
      <View style={styles.screen.containers.spreadAndCenteringContainer}>
        {this.renderList('U.S. Citizen', USER_ENTITIES.CITIZEN)}
        {this.renderList('Green Card Holder', USER_ENTITIES.GREENCARD)}
        {this.renderList('Visa Holder', USER_ENTITIES.VISA)}
        {this.renderList('Other', USER_ENTITIES.OTHER_RESIDENCY)}
      </View>
    )
  }

  renderList (title, residencyType) {
    return (
      <View style={styles.screen.containers.centeringContainer}>
        <TouchableOpacity
          accessible
          accessibilityLabel={title}
          accessibilityRole={'button'}
          onPress={() => this.navigateToNextScreen(residencyType)}>
          <Text style={{color: '#00CBCE', fontSize: 24, fontWeight: 'bold', marginVertical: 25}}>
            {title}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderNextButton () {
    const {handleSubmit} = this.props
    return (
      <View style={{marginTop: 16}}>
        <CustomButton title='NEXT' onClick={handleSubmit(data => this.navigateToNextScreen())} />
      </View>
    )
  }

  // --------------------------------------------------------
  // Core component render

  render () {
    const {navigator} = this.props
    return (
      <View style={styles.screen.containers.root}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Your Account' />
        <ScrollView
          scrollEnabled={false}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{...styles.screen.containers.root}}
        >
          <View style={{...styles.screen.containers.root, paddingLeft: 20, paddingRight: 20, backgroundColor: '#FFF'}}>
            {this.renderHeading()}
          </View>
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
  handleSubmit: PropTypes.func
}

InputUserDetail_4.defaultProps = {
  residencyType: USER_ENTITIES.CITIZEN
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(InputUserDetail_4))

export default Screen
