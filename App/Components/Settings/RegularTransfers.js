/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * Created by demon on 28/5/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, ActionSheetIOS, Text, Alert, Image, KeyboardAvoidingView, Keyboard, ScrollView, ActivityIndicator, FlatList, TouchableOpacity }
  from 'react-native'
import { Button, Icon }
  from 'react-native-elements'
import CustomNav
  from '../../Containers/Common/CustomNav'
import {reduxForm, Field}
  from 'redux-form'
import { connect }
  from 'react-redux'
import {FORM_TYPES}
  from '../../Config/contants'
import styles
  from './Styles/RecurringDetailStyle'
import CustomFormInput
  from '../Utility/CustomFormInput'
import CustomButton
  from '../Utility/CustomButton'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {COMMON_ENTITIES, getFrequencyShortTitle}
  from '../../Utility/Mapper/Common'
import {parseRecurringInvestmentDetail}
  from '../../Utility/Transforms/Parsers'
import {formatPrice, limitText}
  from '../../Utility/Transforms/Converter'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import LinearGradient
  from 'react-native-linear-gradient'
import GravityCapsule
  from '../Utility/GravityCapsule'
import Fonts
  from '../../Themes/Fonts'

// ========================================================
// Core Component
// ========================================================

class RegularTransfers extends Component {

  // ------------------------------------------------------------
  // lifecycle methods

  componentWillMount () {
    this.refreshUserInstructions()
  }

  // ------------------------------------------------------------
  // action handlers

  refreshUserInstructions () {
    const {handleLocalAction, localActions, userID} = this.props
    handleLocalAction({type: localActions.REFRESH_INSTRUCTION, [USER_ENTITIES.USER_ID]: userID})
  }

  modifyInstruction (instruction) {
    let status = instruction[GOAL_ENTITIES.GOAL_RECURRING_STATUS]
    let textArray
    let foo
    if (status === 'stopped') {
      textArray = ['Cancel', 'Resume', 'Cancel']
      foo = () => this.resumeInstruction(instruction)
    } else {
      textArray = ['Cancel', 'Pause', 'Cancel']
      foo = () => this.pauseInstruction(instruction)
    }
    ActionSheetIOS.showActionSheetWithOptions({
      options: textArray,
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 1:
          foo()
          break
        case 2:
          this.cancelInstruction(instruction)
          break
      }
    })
  }

  pauseInstruction (instruction) {
    const {handleLocalAction, localActions, navigator, userID} = this.props
    handleLocalAction({
      type: localActions.MODIFY,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: instruction[CHILD_ENTITIES.CHILD_ID],
      [GOAL_ENTITIES.GID]: instruction[GOAL_ENTITIES.GID],
      [GOAL_ENTITIES.INSTRUCTION_ID]: instruction[GOAL_ENTITIES.GOAL_RECURRING_ID],
      [GOAL_ENTITIES.INSTRUCTION_ACTION]: 'stop'
    })
  }
  cancelInstruction (instruction) {
    const {handleLocalAction, localActions, navigator, userID} = this.props
    handleLocalAction({
      type: localActions.MODIFY,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: instruction[CHILD_ENTITIES.CHILD_ID],
      [GOAL_ENTITIES.GID]: instruction[GOAL_ENTITIES.GID],
      [GOAL_ENTITIES.INSTRUCTION_ID]: instruction[GOAL_ENTITIES.GOAL_RECURRING_ID],
      [GOAL_ENTITIES.INSTRUCTION_ACTION]: 'stop'
    })
  }
  resumeInstruction (instruction) {
    const {handleLocalAction, localActions, navigator, userID} = this.props
    handleLocalAction({
      type: localActions.MODIFY,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: instruction[CHILD_ENTITIES.CHILD_ID],
      [GOAL_ENTITIES.GID]: instruction[GOAL_ENTITIES.GID],
      [GOAL_ENTITIES.INSTRUCTION_ID]: instruction[GOAL_ENTITIES.GOAL_RECURRING_ID],
      [GOAL_ENTITIES.INSTRUCTION_ACTION]: 'resume'
    })
  }

  // ------------------------------------------------------------
  // render child components

  returnInstructionCube (i) {
    const {isDebugMode, isPlaidLinked} = this.props
    let firstname = i[CHILD_ENTITIES.FIRST_NAME]
    let goalName = i[GOAL_ENTITIES.NAME]
    let recurringAmount = i[GOAL_ENTITIES.GOAL_RECURRING_AMOUNT]
    let recurringFrequency = i[GOAL_ENTITIES.GOAL_RECURRING_FREQUENCY]
    let recurringNextDate = i[GOAL_ENTITIES.GOAL_RECURRING_NEXT_DATE]
    let recurringID = i[GOAL_ENTITIES.GOAL_RECURRING_ID]
    let recurringStatus = i[GOAL_ENTITIES.GOAL_RECURRING_STATUS]
    let frequencyTitle = recurringFrequency && getFrequencyShortTitle(recurringFrequency)

    let subTitle
    if (recurringStatus === 'stopped') {
      subTitle = 'Paused'
    } else {
      subTitle = 'Next transfer date: ' + recurringNextDate
    }

    if (recurringAmount && !isNaN(Number(recurringAmount))) {
      return (
        <View style={{paddingTop: 25, paddingBottom: 30, borderBottomWidth: 1, borderColor: '#D7D7D7', paddingHorizontal: 16}}>
          <Text style={{fontFamily: Fonts.type.medium, fontSize: 18, color: '#10427E'}}>
            {formatPrice(recurringAmount)} {frequencyTitle} for {firstname}'s {goalName}
          </Text>
          <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 14, color: '#10427E'}}>
              {subTitle}
            </Text>
            <TouchableOpacity
              accessible
              accessibilityLabel={'Modify'}
              accessibilityRole={'button'}
              onPress={() => this.modifyInstruction(i)} disabled={!isPlaidLinked}>
              <Text style={{fontFamily: Fonts.type.medium, fontSize: 14, color: (isPlaidLinked) && '#10427E' || 'rgba(16,66,126,0.3)'}}>
                Modify
              </Text>
            </TouchableOpacity>
          </View>
          {
            isDebugMode && recurringID && this.renderID(recurringID)
          }
        </View>
      )
    } else return null
  }

  renderID (ID) {
    return (
      <View>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
          Instruction ID
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {ID}
        </Text>
      </View>
    )
  }

  // ------------------------------------------------------------
  // render core component

  render () {
    const {navigator, regularTransfers, isProcessing, boostTransfer, boostWithdrawals} = this.props

    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Regular Transfers' />
        <ProcessingIndicator isProcessing={isProcessing} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {
            regularTransfers.map(r => this.returnInstructionCube(r))
          }
        </ScrollView>
      </View>
    )
  }

}

RegularTransfers.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-native-navigation
  navigator: PropTypes.object.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // is processing
  isProcessing: PropTypes.bool.isRequired,

  // regular transfer array
  regularTransfers: PropTypes.array.isRequired,

  // // boost transfer array
  // boostTransfer: PropTypes.array.isRequired,
  //
  // // boost withdrawal array
  // boostWithdrawals: PropTypes.array.isRequired,

  // debug mode or not
  isDebugMode: PropTypes.bool.isRequired
}

// ========================================================
// Export
// ========================================================

export default RegularTransfers
