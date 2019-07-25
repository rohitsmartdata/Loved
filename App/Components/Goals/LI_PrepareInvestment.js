/* eslint-disable no-unused-vars,no-trailing-spaces,camelcase */
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

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_GOAL,
  destroyOnUnmount: false
})

const PROGRESS_BAR_CAP = [1, 2, 3, 4]

// ========================================================
// Core Component
// ========================================================

class LI_PrepareInvestment extends Component {

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
  }

  componentDidMount () {
    setTimeout(() => this.nextScreen(), 2000)
  }

  // --------------------------------------------------------
  // Action handlers

  nextScreen () {
    const {handleLocalAction, localActions, navigator, childID} = this.props
    handleLocalAction({type: localActions.CONTINUE, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // --------------------------------------------------------
  // Child Components

  renderGoalDescription () {
    const {payload, goalName, goalAmount, goalMaturityAge, firstName} = this.props
    return (
      <View>
        <Text style={{textAlign: 'center', fontFamily: Fonts.type.book, fontSize: 16, color: '#1C3C70'}}>
          Your plan for {firstName}'s
        </Text>
        <Text style={{marginTop: 12, textAlign: 'center', fontFamily: Fonts.type.bold, fontSize: 26, color: '#1C3C70'}}>
          {goalName}
        </Text>
        <Text style={{marginTop: 12, textAlign: 'center', fontFamily: Fonts.type.book, fontSize: 16, color: '#1C3C70'}}>
          To Reach
        </Text>
        <Text style={{marginTop: 12, textAlign: 'center', fontFamily: Fonts.type.bold, fontSize: 26, color: '#1C3C70'}}>
          {formatPrice(goalAmount)}
        </Text>
        <Text style={{marginTop: 12, textAlign: 'center', fontFamily: Fonts.type.book, fontSize: 16, color: '#1C3C70'}}>
          For when {firstName} is
        </Text>
        <Text style={{marginTop: 12, textAlign: 'center', fontFamily: Fonts.type.bold, fontSize: 26, color: '#1C3C70'}}>
          {goalMaturityAge} years old
        </Text>
      </View>
    )
  }

  renderPrepareInvestment () {
    return (
      <View style={{alignItems: 'center'}}>
        <Text style={{textAlign: 'center', marginBottom: 32, fontFamily: Fonts.type.bold, fontSize: 22, color: '#1C3C70'}}>
          We’re preparing your investment recommendation.
        </Text>
        <Image source={require('../../../Img/assets/goal/bull/bull.png')} />
      </View>
    )
  }

  renderBody () {
    const {firstName, goalName} = this.props
    return (
      <View style={{flex: 8, justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 16}}>
        {this.renderGoalDescription()}
        {this.renderPrepareInvestment()}
      </View>
    )
  }

  renderProgressCell (enabled) {
    return (
      <View style={{height: 10, flex: 1, marginHorizontal: 3, borderRadius: 3, borderWidth: enabled ? 0 : 1, borderColor: '#707070', backgroundColor: enabled ? '#397BDF' : '#FFF'}} />
    )
  }

  renderProgressBar () {
    return (
      <View style={{position: 'absolute', top: 10, left: 0, right: 0}}>
        <View style={{flexDirection: 'row'}}>
          {PROGRESS_BAR_CAP.map(index => {
            return this.renderProgressCell(index <= 3)
          })}
        </View>
      </View>
    )
  }

  renderFooter () {
    return (
      <View style={{flex: 2}}>
        {this.renderProgressBar()}
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
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent titlePresent title={heading} />
        <View style={{flex: 1, paddingHorizontal: 20}}>
          {this.renderBody()}
          {this.renderFooter()}
        </View>
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

LI_PrepareInvestment.propTypes = {
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

  // child name
  firstName: PropTypes.string.isRequired,

  // goal name
  goalName: PropTypes.string.isRequired,

  // goal amount
  goalAmount: PropTypes.number.isRequired,

  // goal maturity age
  goalMaturityAge: PropTypes.number.isRequired
}

LI_PrepareInvestment.defaultProps = {
  isProcessing: false
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(LI_PrepareInvestment))

export default Screen
