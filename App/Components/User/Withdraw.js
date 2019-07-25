/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 10/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {View, Text, FlatList, Picker, Dimensions, Animated, TouchableWithoutFeedback}
  from 'react-native'
import {reduxForm, Field}
  from 'redux-form'
import styles
  from '../../Themes/ApplicationStyles'
import {FORM_TYPES}
  from '../../Config/contants'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES, BUTTON_TYPES}
  from '../../Utility/Mapper/Common'
import { connect }
  from 'react-redux'
import { CHILD_ENTITIES as CHILD_ENTITES }
  from '../../Utility/Mapper/Child'
import LWDropDown
  from '../Utility/LWDropDown'
import LWTextInput
  from '../Utility/LWTextInput'
import LWButton
  from '../Utility/LWButton'
import {KeyboardAwareScrollView}
  from 'react-native-keyboard-aware-scroll-view'

// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.WITHDRAW,
  destroyOnUnmount: false
})

const data = {
  'For Christmas': ['2017', '2018', '2019', '2020', '2021', '2022', '2023'],
  'In the year': ['2017', '2018', '2019', '2020', '2021', '2022', '2023'],
  'When Alex turns': ['1', '2', '3', '4', '5', '6', '7']
}

// ========================================================
// Core Component
// ========================================================

class Withdraw extends Component {

  // --------------------------------------------------------
  // lifecycle methods

  constructor (props) {
    super(props)
    this.state = {
      key: 'For Christmas'
    }
  }

  // --------------------------------------------------------
  // Action handlers

  setKey (title) {
    this.setState({key: title})
  }

  next () {
    const {handleLocalAction, localActions, childID, goalID, navigator, navigatorTitle} = this.props
    handleLocalAction({type: localActions.SET_DURATION, [CHILD_ENTITES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [COMMON_ENTITIES.NAVIGATOR]: navigator, [COMMON_ENTITIES.NAVIGATOR_TITLE]: navigatorTitle})
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    return (
      <View style={{...styles.screen.h1.containerStyle, marginTop: 50, marginBottom: 50}}>
        <Text style={{...styles.screen.h1.textStyle}}>
          Make a withdrawl
        </Text>
      </View>
    )
  }

  renderChoices () {
    return (
      <View>
        <View>
          <LWDropDown items={['Alex', 'Dave', 'Victor']} title={'Choose Child Account'} foo={(item) => this.setKey(item)} />
        </View>
        <View style={{marginTop: 30}}>
          <LWDropDown items={['Play football', 'Study', 'Travel']} title={'Choose Child Goal'} foo={(item) => this.setKey(item)} />
        </View>
      </View>
    )
  }

  renderDetail () {
    return (
      <View style={{marginTop: 60}}>
        <Text style={{fontFamily: 'Lato-Regular', fontSize: 14, color: '#4A4A4A', backgroundColor: 'transparent'}}>
          Show Available Fund to Withdraw
        </Text>
        <Text style={{fontFamily: 'Lato-Bold', fontSize: 36, color: '#4A4A4A', backgroundColor: 'transparent', marginTop: 15}}>
          $153.77
        </Text>
      </View>
    )
  }

  renderWithdrawInput () {
    return (
      <View style={{marginTop: 60}}>
        <Text style={{color: '#9B9B9B', fontFamily: 'Lato-Regular', fontSize: 14, backgroundColor: 'transparent'}}>
          Enter Withdrawal Amount
        </Text>
        <View style={{...styles.screen.textInput.parentContainerStyle, width: 180, marginTop: 10}}>
          <Field
            name={GOAL_ENTITIES.NAME}
            keyboardType='numeric'
            accessibilityLabel={'Name'}
            accessibilityRole={'keyboardkey'}
            component={LWTextInput} placeholderText='$0.00' />
        </View>
      </View>
    )
  }

  renderNextButton () {
    return (
      <View style={{position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', paddingLeft: 20, paddingRight: 20}}>
        <LWButton title='Withdraw' onPress={this.next.bind(this)} buttonType={BUTTON_TYPES.DECISION_BUTTON} extraStyle={{width: 300, height: 50, backgroundColor: 'rgb(0, 174, 112)'}} />
      </View>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    let values = data[this.state.key]
    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={false}
        keyboardDismissMode='interactive'
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{...styles.screen.containers.keyboard, paddingLeft: 40, paddingRight: 40, backgroundColor: '#FFF'}}>

        {this.renderHeading()}

        {this.renderChoices()}

        {this.renderDetail()}

        {this.renderWithdrawInput()}

        {this.renderNextButton()}

      </KeyboardAwareScrollView>
    )
  }
}

Withdraw.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  navigatorTitle: PropTypes.string.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // duration of goal
  duration: PropTypes.number.isRequired,

  childID: PropTypes.string.isRequired,
  goalID: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(Withdraw))

export default Screen
