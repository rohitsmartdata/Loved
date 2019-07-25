/* eslint-disable no-trailing-spaces,no-unused-vars,camelcase */
/**
 * User Input Detail 5
 * - Total user financial value
 *
 * Created by viktor on 28/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, KeyboardAvoidingView, Keyboard, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { FORM_TYPES } from '../../Config/contants'
import CustomNav from '../../Containers/Common/CustomNav'
import styles from '../../Themes/ApplicationStyles'
import Fonts from '../../Themes/Fonts'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'
import Toast
  from '../Common/Toast'
import _ from 'lodash'
import { analytics } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'
import Options from '../../CommonComponents/Options'
import Colors from '../../Themes/Colors'

const optionData = [
  {
    detail: 'Under $5k',
    value: '0-5000'
  },
  {
    detail: '$5k - $25k',
    value: '5001-25000'
  },
  {
    detail: '$25k - $50k',
    value: '25001-50000'
  },
  {
    detail: '$50k - $100k',
    value: '50001-100000'
  },
  {
    detail: 'Over $100k',
    value: '100001-200000'
  }
]

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_USER,
  destroyOnUnmount: false
})

const PROGRESS_BAR_CAP = [1, 2, 3, 4]

// ========================================================
// Core Component
// ========================================================

class InputUserDetail_7 extends Component {
  constructor (props) {
    super(props)
    this.state = { selectedIndex: undefined }
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

  navigateToNextScreen (userFinancialValue, index) {
    this.setState({ selectedIndex: index }, () => {
      setTimeout(() => {
        const { localActions, handleLocalAction, navigator, residencyType, nextScreen, userID } = this.props
        if (residencyType && residencyType === USER_ENTITIES.NO_RESIDENCY) {
          console.log('residency type :: ', residencyType)
        } else {
          handleLocalAction({
            type: localActions.NAVIGATE_TO_NEXT_SCREEN,
            form: FORM_TYPES.ADD_USER,
            field: USER_ENTITIES.USER_TOTAL_VALUE,
            value: userFinancialValue,
            [COMMON_ENTITIES.SCREEN_TYPE]: nextScreen,
            [COMMON_ENTITIES.NAVIGATOR]: navigator,
            [USER_ENTITIES.USER_ID]: userID
          })
        }
      }, 100)
    })
  }

  // --------------------------------------------------------
  // Child Components
  renderHeading () {
    return (
      <View style={{...styles.screen.h2.containerStyle, marginTop: 74, alignItems: 'center'}}>
        <Text style={{fontFamily: Fonts.type.bold, textAlign: 'center', color: '#1C3C70', fontSize: 22, alignSelf: 'center'}}>
          What is the total value of your assets less any debts?
        </Text>
      </View>
    )
  }

  renderOptions () {
    const { selectedIndex } = this.state
    return (
      <ScrollView style={{marginBottom: 70}} contentContainerStyle={{paddingTop: 30}} showsVerticalScrollIndicator={false} contentInset={{top: 30}}>
        {
          optionData.map((item, index) => {
            if (selectedIndex !== undefined && selectedIndex === index) {
              return (
                <Options
                  buttonText={item.detail}
                  style={{ backgroundColor: Colors.blue, paddingHorizontal: 37 }}
                  buttonTextStyle={{ color: Colors.white, fontFamily: Fonts.type.book, fontSize: 16 }}
                  onPress={_.debounce(_.bind(() => this.navigateToNextScreen(item.value, index), this), 500, {'leading': true, 'trailing': false})}
                />
              )
            }
            return (
              <Options
                buttonText={item.detail}
                buttonTextStyle={{ color: '#1C3C70', fontFamily: Fonts.type.book, fontSize: 16 }}
                onPress={_.debounce(_.bind(() => this.navigateToNextScreen(item.value, index), this), 500, {'leading': true, 'trailing': false})}
              />
            )
          })
        }
      </ScrollView>
    )
  }

  renderFormContainer () {
    return (
      <View style={{flex: 1, justifyContent: 'center', bottom: 20}}>
        {this.renderList('Under $50K', '0-50000', true, false)}
        {this.renderList('$50K-$100K', '50001-100000', true, false)}
        {this.renderList('$100K-$200K', '100001-200000', true, false)}
        {this.renderList('$200K-$500K', '200001-500000', true, false)}
        {this.renderList('Over $500K', '500001-1000000', true, true)}
      </View>
    )
  }

  renderList (userFinancialValue, valueCode, showTopBorder, showBottomBorder) {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={userFinancialValue}
        accessibilityRole={'button'}
        onPress={_.debounce(_.bind(() => this.navigateToNextScreen(valueCode), this), 500, {'leading': true, 'trailing': false})} style={{borderColor: '#D7D7D7', borderTopWidth: showTopBorder ? 1 : 0, borderBottomWidth: showBottomBorder ? 1 : 0}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}} >
          <Text style={{ color: '#10427E', backgroundColor: 'transparent', fontSize: 20, fontFamily: Fonts.type.regular, marginVertical: 25 }}>
            {userFinancialValue}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderProgressCell (enabled) {
    return (
      <View style={{height: 10, flex: 1, marginHorizontal: 3, borderRadius: 3, borderWidth: enabled ? 0 : 1, borderColor: '#707070', backgroundColor: enabled ? '#397BDF' : '#FFF'}} />
    )
  }

  renderProgressBar () {
    return (
      <View style={{position: 'absolute', bottom: 50, left: 0, right: 0, paddingHorizontal: 20}}>
        <View style={{flexDirection: 'row'}}>
          {PROGRESS_BAR_CAP.map(index => {
            return this.renderProgressCell(index <= 4)
          })}
        </View>
      </View>
    )
  }

  // --------------------------------------------------------
  // Core Render Component

  render () {
    const {navigator, popButton, toast, toastSubheading, toastHeading} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <Toast toast={toast} heading={toastHeading} subheading={toastSubheading} shouldFloat />
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent={popButton} titlePresent title='Profile' />
        <View style={{flex: 1, paddingHorizontal: 32}}>
          {this.renderHeading()}
          {this.renderOptions()}
          {this.renderProgressBar()}
        </View>
      </View>
    )
  }
}

InputUserDetail_7.propTypes = {
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

  // userid
  userID: PropTypes.string.isRequired,

  // email id
  emailID: PropTypes.string.isRequired,

  // residency type
  residencyType: PropTypes.string,

  popButton: PropTypes.bool,

  // toast
  toast: PropTypes.bool,
  toastHeading: PropTypes.string,
  toastSubheading: PropTypes.string
}

InputUserDetail_7.defaultProps = {
  popButton: true
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(InputUserDetail_7))

export default Screen
