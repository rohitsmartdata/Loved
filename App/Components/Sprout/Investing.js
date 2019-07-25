/* eslint-disable no-trailing-spaces,no-unused-vars,camelcase */
/**
 * Created by demon on 23/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import CustomNav from '../../Containers/Common/CustomNav'
import { Button, FormInput, Icon } from 'react-native-elements'
import { FORM_TYPES, ANALYTIC_PROPERTIES } from '../../Config/contants'
import styles from '../../Themes/ApplicationStyles'
import Fonts from '../../Themes/Fonts'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { AUTH_ENTITIES, PIN_ACTION_TYPE } from '../../Utility/Mapper/Auth'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import { SETTINGS_ENTITIES } from '../../Utility/Mapper/Settings'
import ProcessingIndicator from '../Utility/ProcessingIndicator'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION } from '../../Utility/Mapper/Common'
import { LW_SCREEN, LW_EVENT_TYPE } from '../../Utility/Mapper/Screens'
import GoalBase
  from '../../Containers/Goals/GoalBase'
import LI_InvestmentBase
  from '../../Containers/Invest/LI_InvestmentBase'
import {events, errorKeywords}
  from '../../Utility/Mapper/Tracking'
import { analytics }
  from '../../Config/AppConfig'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class Investing extends Component {

  constructor (props) {
    super(props)
    this.state = {
      goalVisible: false,
      investmentVisible: false
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentWillMount () {
    const {isOnboardingFlow} = this.props
    isOnboardingFlow && this.updateCurrentOnboarding()
  }

  // --------------------------------------------------------
  // Action handlers

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  skip () {
    const { localActions, handleLocalAction, navigator, emailID } = this.props
    handleLocalAction({type: localActions.SKIP, [USER_ENTITIES.EMAIL_ID]: emailID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  toggleGoal (visibility) {
    this.setState({
      goalVisible: visibility
    })
  }

  toggleInvestment (visibility) {
    this.setState({
      investmentVisible: visibility
    })
  }

  selectInvestment () {
    const {handleLocalAction, localActions, userID, childID, navigator} = this.props
    handleLocalAction({type: localActions.SELECT_INVESTMENT, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  selectGoal () {
    const {handleLocalAction, localActions, userID, childID, navigator} = this.props
    handleLocalAction({type: localActions.SELECT_GOAL, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // --------------------------------------------------------
  // Child Components

  renderGoalComponent () {
    const {goalVisible} = this.state
    const { navigator, childID } = this.props
    if (goalVisible) {
      return <GoalBase navigator={navigator} childID={childID} isVisible={goalVisible} foo={this.toggleGoal.bind(this)} />
    } else {
      return null
    }
  }

  renderInvestmentComponent () {
    const {investmentVisible} = this.state
    const { navigator } = this.props
    if (investmentVisible) {
      return <LI_InvestmentBase navigator={navigator} isVisible={investmentVisible} foo={this.toggleInvestment.bind(this)} />
    } else {
      return null
    }
  }

  renderGoalButton () {
    const {width} = Dimensions.get('window')
    const buttonWidth = width - 40
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Create Goal'}
        accessibilityRole={'button'}
        style={{flexDirection: 'row', marginTop: 30, height: 160, width: buttonWidth, backgroundColor: '#385480', borderRadius: 10}}
        onPress={() => this.selectGoal()}>
        <View style={{flex: 6.2, margin: 20}}>
          <Text style={{fontFamily: Fonts.type.bold, color: '#FFF', fontSize: 22}}>
            Create a Goal
          </Text>
          <Text style={{fontFamily: Fonts.type.book, color: '#FFF', fontSize: 18, marginTop: 5}}>
            Smart investing to achieve something for the future.
          </Text>
        </View>
        <View style={{flex: 3.8, alignItems: 'center', paddingTop: 5, overflow: 'hidden'}}>
          <Image source={require('../../../Img/assets/onboard/createGoal/createGoal.png')} style={{left: -20}} />
        </View>
      </TouchableOpacity>
    )
  }

  renderInvestmentButton () {
    const {width} = Dimensions.get('window')
    const buttonWidth = width - 40
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Create Portfolio'}
        accessibilityRole={'button'}
        style={{flexDirection: 'row', marginTop: 20, height: 160, width: buttonWidth, backgroundColor: '#2C78F9', borderRadius: 10}}
        onPress={() => this.selectInvestment()}>
        <View style={{flex: 6.2, margin: 20}}>
          <Text style={{fontFamily: Fonts.type.bold, color: '#FFF', fontSize: 22}}>
            Build a Portfolio
          </Text>
          <Text style={{fontFamily: Fonts.type.book, color: '#FFF', fontSize: 18, marginTop: 5}}>
            Invest in companies and ETFs with as little as $5.
          </Text>
        </View>
        <View style={{flex: 3.8, justifyContent: 'center'}}>
          <Image source={require('../../../Img/assets/goal/startInvesting/startInvesting.png')} style={{left: -20}} />
        </View>
      </TouchableOpacity>
    )
  }

  renderTitle () {
    const {firstname} = this.props
    return (
      <View style={{marginTop: 60, marginBottom: 32, paddingHorizontal: 20}}>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 22, color: '#1C3C70', textAlign: 'center'}}>
          How would you like to start {firstname} off investing?
        </Text>
      </View>
    )
  }

  renderButtons () {
    return (
      <View style={{flex: 1}}>
        {this.renderTitle()}
        {this.renderInvestmentButton()}
        {this.renderGoalButton()}
      </View>
    )
  }

  renderSkipButton () {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Hold off for now'}
        accessibilityRole={'button'}
        onPress={() => this.skip()}
        style={{position: 'absolute', bottom: 32, left: 0, right: 0}}>
        <Text style={{color: '#9FB0C5', fontFamily: Fonts.type.book, fontSize: 16, textAlign: 'center'}}>
          I’ll hold off for now
        </Text>
      </TouchableOpacity>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const { navigator } = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav leftButtonPresent={false} navigator={navigator} titlePresent title='Investing' />
        <View style={{flex: 1, paddingHorizontal: 20}}>
          {this.renderButtons()}
          {this.renderGoalComponent()}
          {this.renderInvestmentComponent()}
        </View>
      </View>
    )
  }

}

// ========================================================
// Prop verifiers
// ========================================================

Investing.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // user id
  userID: PropTypes.string.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // email id
  emailID: PropTypes.string.isRequired,

  // first name
  firstname: PropTypes.string.isRequired,

  // is onboarding flow or not
  isOnboardingFlow: PropTypes.bool.isRequired
}

// ========================================================
// Export
// ========================================================

export default Investing
