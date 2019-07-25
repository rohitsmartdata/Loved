/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 9/6/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Alert, Text, Animated, Easing, Dimensions, NativeModules, KeyboardAvoidingView, Keyboard, ScrollView, TouchableOpacity, Image, ActivityIndicator }
  from 'react-native'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import CustomNav
  from '../../Containers/Common/CustomNav'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import GravityCapsule
  from '../Utility/GravityCapsule'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import Options from '../../CommonComponents/Options'
import Colors from '../../Themes/Colors'
import _ from 'lodash'
import { FORM_TYPES } from '../../Config/contants'
import { SPROUT } from '../../Utility/Mapper/Screens'
import connect from 'react-redux/es/connect/connect'
import { reduxForm } from 'redux-form'
import { analytics } from '../../Config/AppConfig'
import {screens, events} from '../../Utility/Mapper/Tracking'
var PlaidBridgeModule = NativeModules.PlaidBridgeModule

const optionData = [
  {
    detail: 'Checking',
    value: 'checking'
  },
  {
    detail: 'Savings',
    value: 'savings'
  }
]

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.BANK_DETAILS,
  destroyOnUnmount: false
})

class SelectAccountType extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _showPlaid: !props.isPlaidLinked,
      selectedIndex: undefined
    }
    this._isPlaidVisible = false
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormaliPhone = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
  }

  componentDidMount () {
    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.SELECT_ACCOUNT_TYPE
    })
    // *********** Log Analytics ***********
  }

  // --------------------------------------------------------
  // Action handlers

  onBack () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.RESET_FORM, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  navigateToNextScreen (accountType, index) {
    this.setState({ selectedIndex: index }, () => {
      setTimeout(() => {
        const {localActions, handleLocalAction, navigator} = this.props
        handleLocalAction({
          type: localActions.SELECT_ACCOUNT_TYPE,
          form: FORM_TYPES.BANK_DETAILS,
          field: USER_ENTITIES.BANK_ACCOUNT_TYPE,
          value: accountType,
          [COMMON_ENTITIES.SCREEN_TYPE]: SPROUT.ADD_ROUTING_NUMBER,
          [COMMON_ENTITIES.NAVIGATOR]: navigator
        })
      }, 100)
    })
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading (heading) {
    return (
      <View style={{...styles.screen.h2.containerStyle, marginTop: 74, marginBottom: 65, alignItems: 'center'}}>
        <Text style={{ ...styles.text.mainHeader }}>
          {'What type of account would\nyou like to connect?'}
        </Text>
      </View>
    )
  }

  renderOptions () {
    const { selectedIndex } = this.state
    return (
      <View style={{paddingHorizontal: 37}}>
        {
          optionData.map((item, index) => {
            if (selectedIndex !== undefined && selectedIndex === index) {
              return (
                <Options
                  buttonText={item.detail}
                  style={{ backgroundColor: Colors.blue }}
                  buttonTextStyle={{ color: Colors.white }}
                  onPress={_.debounce(_.bind(() => this.navigateToNextScreen(item.value, index), this), 500, {'leading': true, 'trailing': false})}
                />
              )
            }
            return (
              <Options
                buttonText={item.detail}
                onPress={_.debounce(_.bind(() => this.navigateToNextScreen(item.value, index), this), 500, {'leading': true, 'trailing': false})}
              />
            )
          })
        }
      </View>
    )
  }

  // --------------------------------------------------------
  // Core Render Component

  render () {
    const {isPlaidLinked, navigator, isProcessing} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: Colors.white}}>
        <CustomNav navigator={navigator} leftButtonPresent leftFoo={this.onBack.bind(this)} popManually titlePresent title='Bank Setup' />
        {this.renderHeading()}
        {this.renderOptions()}
      </View>
    )
  }

}

SelectAccountType.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // is plaid connected
  isPlaidLinked: PropTypes.bool.isRequired,

  // userAccount
  userAccount: PropTypes.string,

  // is processing
  isProcessing: PropTypes.bool.isRequired
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(SelectAccountType))

export default Screen
