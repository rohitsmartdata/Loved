/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 2/8/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import CustomNav from '../../Containers/Common/CustomNav'
import { FORM_TYPES } from '../../Config/contants'
import styles from '../../Themes/ApplicationStyles'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'
import Fonts from '../../Themes/Fonts'
import Toast
  from '../Common/Toast'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_USER,
  destroyOnUnmount: false
})

let visaTypes = [
  { key: 'B-1 Business', value: 'B1' },
  { key: 'C-1 Transit', value: 'C1' },
  { key: 'E-1 Trader', value: 'E1' },
  { key: 'E-2 Investor', value: 'E2' },
  { key: 'E-3 Worker', value: 'E3' },
  { key: 'F-1 Student', value: 'F1' },
  { key: 'H-1B Worker', value: 'H1B' },
  { key: 'H-2B Working', value: 'H2B' },
  { key: 'H-3 Training', value: 'H3' },
  { key: 'K-1 Fiance', value: 'K1' },
  { key: 'L-1 Foreign Worker', value: 'L1' }
]

// ========================================================
// Core Component
// ========================================================

class InputVisaType extends Component {
  componentDidMount () {
    this.updateCurrentOnboarding()
  }

  // --------------------------------------------------------
  // Action handlers

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  navigateToNextScreen (visaType) {
    const { localActions, handleLocalAction, navigator, nextScreen, userID } = this.props
    handleLocalAction({
      type: localActions.NAVIGATE_TO_NEXT_SCREEN,
      [USER_ENTITIES.USER_ID]: userID,
      [COMMON_ENTITIES.SCREEN_TYPE]: nextScreen,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      form: FORM_TYPES.ADD_USER,
      field: USER_ENTITIES.VISA_TYPE,
      value: visaType
    })
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    return (
      <View style={{ ...styles.screen.h2.containerStyle, paddingHorizontal: 20 }}>
        <Text style={{ ...styles.screen.h2.textStyle, fontFamily: Fonts.type.semibold, color: '#000000', fontSize: 20 }}>
          What visa do you currently hold?
        </Text>
      </View>
    )
  }

  renderCapsule (key, value, index) {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={key}
        accessibilityRole={'button'}
        onPress={() => this.navigateToNextScreen(value)} style={capsuleStyle.capsuleContainer}>
        <View style={[capsuleStyle.capsuleBodyContainer, index === 0 ? capsuleStyle.borderTop : '']}>
          <Text style={capsuleStyle.capsuleTextStyle}>{key}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const {navigator, popButton, toastHeading, toastSubheading, toast} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <Toast toast={toast} heading={toastHeading} subheading={toastSubheading} shouldFloat />
        <CustomNav navigator={navigator} leftButtonPresent={popButton} titlePresent title='Your Account' />

        {this.renderHeading()}

        <View style={{ flex: 1, marginTop: 50 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={visaTypes}
            renderItem={({ item, index }) => this.renderCapsule(item.key, item.value, index)}
          />
        </View>
      </View>
    )
  }
}

InputVisaType.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // next screen to navigate
  nextScreen: PropTypes.string.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // email id
  emailID: PropTypes.string.isRequired,

  popButton: PropTypes.bool,

  // toast
  toast: PropTypes.bool,
  toastHeading: PropTypes.string,
  toastSubheading: PropTypes.string
}

InputVisaType.defaultProps = {
  popButton: true
}

const capsuleStyle = {
  container: {
    flex: 1
  },

  searchBarContainer: {
    marginBottom: 24
  },
  capsuleContainer: {
    flexDirection: 'row'
  },
  capsuleHeader: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 40
  },
  capsuleBodyContainer: {
    borderBottomWidth: 1,
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    borderColor: '#E6E6E6'
  },
  borderTop: {
    borderTopWidth: 1
  },

  listViewContainer: {
    flex: 1
  },
  capsuleTextStyle: {
    fontSize: 18,
    backgroundColor: 'transparent',
    color: '#10427E',
    fontFamily: 'Lato-Regular',
    textAlign: 'center'
  },
  capsuleHeaderStyle: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(256, 256, 256, 0.4)',
    borderRadius: 40
  }
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(InputVisaType))

export default Screen
