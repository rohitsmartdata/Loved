/* eslint-disable no-unused-vars,no-multi-spaces,no-trailing-spaces,indent,spaced-comment */
/**
 * Created by viktor on 26/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {View, Text, FlatList, Picker, TouchableOpacity, Dimensions, Animated, TouchableWithoutFeedback}
  from 'react-native'
import {reduxForm}
  from 'redux-form'
import CustomNav
  from '../../Containers/Common/CustomNav'
import { KeyboardAwareScrollView }
  from 'react-native-keyboard-aware-scroll-view'
import styles
  from '../../Themes/ApplicationStyles'
import {FORM_TYPES}
  from '../../Config/contants'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES, GOAL_DURATION_TYPE, BUTTON_TYPES}
  from '../../Utility/Mapper/Common'
import { connect }
  from 'react-redux'
import { CHILD_ENTITIES as CHILD_ENTITES }
  from '../../Utility/Mapper/Child'
import LWButton
  from '../Utility/LWButton'

// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_GOAL,
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

class GoalDuration extends Component {

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

  next () {
    const {handleLocalAction, localActions, childID, goalID, navigator, navigatorTitle} = this.props
    handleLocalAction({type: localActions.SET_DURATION, [CHILD_ENTITES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [COMMON_ENTITIES.NAVIGATOR]: navigator, [COMMON_ENTITIES.NAVIGATOR_TITLE]: navigatorTitle})
  }

  goalSelectionNeeded (durationType) {
    const {handleLocalAction, localActions, childID, goalID, navigator, navigatorTitle} = this.props
    handleLocalAction({type: localActions.GOAL_DURATION_SELECTION_NEEDED, [CHILD_ENTITES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [COMMON_ENTITIES.NAVIGATOR]: navigator, [COMMON_ENTITIES.NAVIGATOR_TITLE]: navigatorTitle, [GOAL_ENTITIES.GOAL_DURATION_TYPE]: durationType})
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    const {goalName, firstName} = this.props
    return (
      <View style={{...styles.screen.h1.containerStyle, marginBottom: 0, alignItems: 'flex-start'}}>
        <Text style={{fontFamily: 'Lato-Light', fontSize: 20, color: '#00CBCE', backgroundColor: 'transparent'}}>
          {goalName}
        </Text>
        <Text style={{...styles.screen.h1.textStyle, color: '#4A4A4A', fontSize: 30, fontFamily: 'Kefa', textAlign: 'left', marginTop: 5}}>
          When do you want this for {firstName}?
        </Text>
      </View>
    )
  }

  renderNextButton () {
    return (
      <View style={{position: 'absolute', bottom: 28, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', paddingLeft: 20, paddingRight: 20}}>
        <LWButton title='Next' onPress={this.next.bind(this)} buttonType={BUTTON_TYPES.DECISION_BUTTON} />
      </View>
    )
  }

  renderDecisionButtons () {
    return (
      <View style={{flex: 1, justifyContent: 'space-around'}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Select Age'}
          accessibilityRole={'button'}
          style={{flex: 1, marginTop: 30}}
          onPress={() => this.goalSelectionNeeded(GOAL_DURATION_TYPE.AGE)}>
          <Text style={{fontFamily: 'Lato-Light', fontSize: 30, color: '#4A4A4A', backgroundColor: 'transparent'}}>
            Age
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Select Birthday'}
          accessibilityRole={'button'}
          style={{flex: 1, marginTop: 30}}
          onPress={() => this.goalSelectionNeeded(GOAL_DURATION_TYPE.BIRTHDAY)}>
          <Text style={{fontFamily: 'Lato-Light', fontSize: 30, color: '#4A4A4A', backgroundColor: 'transparent'}}>
            Birthday
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Select Christmas'}
          accessibilityRole={'button'}
          style={{flex: 1, marginTop: 30}}
          onPress={() => this.goalSelectionNeeded(GOAL_DURATION_TYPE.CHRISTMAS)}>
          <Text style={{fontFamily: 'Lato-Light', fontSize: 30, color: '#4A4A4A', backgroundColor: 'transparent'}}>
            Christmas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Select Soon'}
          accessibilityRole={'button'}
          style={{flex: 1, marginTop: 30}} onPress={() => this.goalSelectionNeeded(GOAL_DURATION_TYPE.SOON)}>
          <Text style={{fontFamily: 'Lato-Light', fontSize: 30, color: '#4A4A4A', backgroundColor: 'transparent'}}>
            Soon
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Select End of school year'}
          accessibilityRole={'button'}
          style={{flex: 1, marginTop: 30}}
          onPress={() => this.goalSelectionNeeded(GOAL_DURATION_TYPE.END_OF_SCHOOL_YEAR)}>
          <Text style={{fontFamily: 'Lato-Light', fontSize: 30, color: '#4A4A4A', backgroundColor: 'transparent'}}>
            End of School year
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Select College'}
          accessibilityRole={'button'}
          style={{flex: 1, marginTop: 30}}
          onPress={() => this.goalSelectionNeeded(GOAL_DURATION_TYPE.COLLEGE)}>
          <Text style={{fontFamily: 'Lato-Light', fontSize: 30, color: '#4A4A4A', backgroundColor: 'transparent'}}>
            College
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    let values = data[this.state.key]
    return (
      <View style={{flex: 1}}>
        <CustomNav navigator={this.props.navigator} titlePresent title='CREATE INVESTMENT' />
        <KeyboardAwareScrollView style={{flex: 0, paddingLeft: 40, paddingRight: 40}} extraScrollHeight={32} resetScrollToCoords={{x: 0, y: 0}} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} >

          {this.renderHeading()}
          {this.renderDecisionButtons()}

        </KeyboardAwareScrollView>
      </View>
    )
  }
}

GoalDuration.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  navigatorTitle: PropTypes.string.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // duration of goal
  duration: PropTypes.number.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // goal id
  goalID: PropTypes.string.isRequired,

  // goal name
  goalName: PropTypes.string.isRequired,

  // first name
  firstName: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(GoalDuration))

export default Screen
