/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces */
/**
 * Created by demon on 29/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation
} from 'react-native'
import { DEVICE_LOGICAL_RESOLUTION, COMMON_ENTITIES }
  from '../../Utility/Mapper/Common'
import { connect }
  from 'react-redux'
import { FormInput, Icon, Slider }
  from 'react-native-elements'
import Modal
  from 'react-native-modal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {FORM_TYPES}
  from '../../Config/contants'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import Fonts
  from '../../Themes/Fonts'
import styles
  from '../../Themes/ApplicationStyles'
import HTML
  from 'react-native-render-html'
import CustomNav
  from '../../Containers/Common/CustomNav'
import _
  from 'lodash'
import {formatPrice}
  from '../../Utility/Transforms/Converter'
import {reduxForm, Field}
  from 'redux-form'
import Colors
  from '../../Themes/Colors'
import ShadowedContainer
  from '../../CommonComponents/ShadowedContainer'
import EditableTextInput
  from '../../CommonComponents/editableTextInput'
import { analytics }
  from '../../Config/AppConfig'
import {screens}
  from '../../Utility/Mapper/Tracking'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_GOAL,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class LI_StartInvesting extends Component {

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
  }

  // --------------------------------------------------------
  // Action handlers

  nextScreen () {
    const {handleLocalAction, localActions, navigator, childID} = this.props
    handleLocalAction({type: localActions.CONTINUE, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // --------------------------------------------------------
  // Child Components

  renderBody () {
    const {firstName, goalName} = this.props
    return (
      <View style={{flex: 8, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32}}>
        <Image source={require('../../../Img/assets/goal/orderConfirming/orderConfirming.png')} />
        <Text style={{fontFamily: Fonts.type.bold, marginTop: 32, fontSize: 22, color: '#1C3C70', textAlign: 'center'}}>
          Well done. Let's start {firstName} off with their {'\n'} {goalName}!
        </Text>
      </View>
    )
  }

  renderNextButton () {
    const isX = this.isX || false
    return (
      <View style={{flex: 2, justifyContent: 'center'}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{ 
            ...styles.bottomNavigator.containerStyle 
            // shadowOpacity: 0.15,
            // shadowRadius: 10, 
            // shadowOffset: {height: 10, width: 0} 
          }}
          onPress={_.debounce(_.bind(() => this.nextScreen(), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableOpacity>
      </View>
    )
  }

// --------------------------------------------------------
// Core render method

  render () {
    const {isModal, navigator, firstName, goalName} = this.props
    let heading = firstName + '\'s ' + goalName + ' Fund'
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title={heading} />
        <View style={{flex: 1, paddingHorizontal: 20}}>
          {this.renderBody()}
          {this.renderNextButton()}
        </View>
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

LI_StartInvesting.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // is processing
  isProcessing: PropTypes.bool.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // child name
  firstName: PropTypes.string.isRequired,

  // goal name
  goalName: PropTypes.string.isRequired,

  // goal amount
  goalAmount: PropTypes.number.isRequired
}

LI_StartInvesting.defaultProps = {
  isProcessing: false
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(LI_StartInvesting))

export default Screen
