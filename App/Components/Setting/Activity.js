/* eslint-disable no-trailing-spaces,no-unused-vars */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, ActivityIndicator, ActionSheetIOS, Text, ScrollView, Dimensions }
  from 'react-native'
import Colors from '../../Themes/Colors'
import CustomNav
  from '../../Containers/Common/CustomNav'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {getFrequencyShortTitle, COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import { formatPrice, convertDateStringToMonthDay }
  from '../../Utility/Transforms/Converter'

// ========================================================
// Core Component
// ========================================================

function jsUcfirst (string) {
  return string && (string.toLowerCase().charAt(0).toUpperCase() + string.slice(1).toLowerCase())
}

class Activity extends Component {

  componentWillMount () {
    this.fetchUserInstructions()
  }

  fetchUserInstructions () {
    const {handleLocalAction, localActions, userID} = this.props
    handleLocalAction({type: localActions.FETCH_USER_INSTRUCTIONS, [USER_ENTITIES.USER_ID]: userID})
  }

  renderHeading () {
    return (
      <View style={{ ...styles.screen.h2.containerStyle, marginTop: 20 }}>
        <Text style={{ ...styles.text.mainHeader, alignSelf: 'center', marginBottom: 10, fontFamily: Fonts.type.bold }}>
          Account Activity
        </Text>
        <Text style={{ ...styles.text.subTitle, alignSelf: 'center', fontWeight: 'normal', color: Colors.blue, fontFamily: Fonts.type.bold }}>
          {'This includes all your transfers and\ninvestments to date.'}
        </Text>
      </View>
    )
  }

  renderTitle (title) {
    return (
      <View style={{paddingVertical: 12, backgroundColor: '#FFF', paddingLeft: 24, marginBottom: 7}}>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 20, textAlign: 'left', color: '#1C3C70', backgroundColor: 'transparent'}}>
          {jsUcfirst(title)}
        </Text>
      </View>
    )
  }

  renderBox (item, isInstruction) {
    const {isDebugMode} = this.props
    // first name of child
    const firstname = item && item[CHILD_ENTITIES.FIRST_NAME]
    // goal id
    const goalID = item && item[GOAL_ENTITIES.GID]
    // goal name
    const goalName = item && item[GOAL_ENTITIES.NAME]
    // transaction amount
    const amount = item && (isInstruction ? item[GOAL_ENTITIES.INSTRUCTION_AMOUNT] : item[GOAL_ENTITIES.TRANSACTION_AMOUNT])
    // transaction time
    const transactionDate = item && (isInstruction ? item[GOAL_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE] : item[GOAL_ENTITIES.TRANSACTION_TIME])
    // transaction status
    const status = item && (isInstruction ? item[GOAL_ENTITIES.INSTRUCTION_STATUS] : item[GOAL_ENTITIES.TRANSACTION_STATUS])
    // transaction type
    const type = item && (isInstruction ? item[GOAL_ENTITIES.INSTRUCTION_TYPE] : item[GOAL_ENTITIES.TRANSACTION_TYPE])
    const typeString = type && (type === 'transfer' ? 'buy ' : 'sell ')
    // progress status
    const title = (isInstruction ? jsUcfirst(typeString) : '') + jsUcfirst(status) + ' for ' + jsUcfirst(firstname)
    let date = convertDateStringToMonthDay(transactionDate)
    return (
      <View style={{borderRadius: 4, marginHorizontal: 7, marginBottom: 7, paddingHorizontal: 19, paddingVertical: 10, backgroundColor: '#FFF'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{ ...styles.text.title, fontSize: 18, textAlign: 'left', color: Colors.black, fontFamily: Fonts.type.bold }}>
            {goalName}
          </Text>
          <Text style={{ ...styles.text.title, fontSize: 18, textAlign: 'left', color: Colors.black, fontFamily: Fonts.type.bold }}>
            {formatPrice(amount)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ ...styles.text.subTitle, fontSize: 14, textAlign: 'left', color: 'rgba(5, 13, 19, 0.4)', fontFamily: Fonts.type.book }}>
            {title}
          </Text>
          <Text style={{ ...styles.text.subTitle, fontSize: 14, textAlign: 'left', color: 'rgba(5, 13, 19, 0.4)', fontFamily: Fonts.type.book }}>
            {date}
          </Text>
        </View>
        {
          isDebugMode && goalID && this.renderID(goalID)
        }
      </View>
    )
  }

  renderID (ID) {
    return (
      <View style={{marginTop: 5, opacity: 0.7}}>
        <Text style={{ ...styles.text.subTitle, fontSize: 11, textAlign: 'left', color: Colors.fontGray, fontFamily: Fonts.type.book }}>
          Transfer ID
        </Text>
        <Text style={{ ...styles.text.title, fontSize: 14, textAlign: 'left', color: Colors.blue, fontFamily: Fonts.type.book }}>
          {ID}
        </Text>
      </View>
    )
  }

  renderMainComponent () {
    const {transfers, instructionsArray} = this.props
    if ((!transfers || Object.keys(transfers).length === 0) && (!instructionsArray || instructionsArray.length === 0)) {
      return this.renderBlankState()
    }
    return Object.keys(transfers).map((title) => {
      return (
        <View style={{backgroundColor: '#F5F6FA'}}>
          {this.renderTitle(title)}
          {
            transfers[title].map((item) => this.renderBox(item, false))
          }
        </View>
      )
    })
  }

  renderBlankState () {
    const {width, height} = Dimensions.get('window')
    return (
      <View style={{flex: 1, height: height - 70, width: width, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 18, fontFamily: Fonts.type.medium, color: 'rgba(0, 0, 0, 0.46)'}}>
          No Activity
        </Text>
      </View>
    )
  }

  renderProcessingCube () {
    return (
      <View style={{height: 50, backgroundColor: '#F5F6FA', justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size='small' color='#2948FF' />
      </View>
    )
  }

  renderPendingInvestments () {
    const {instructionsArray} = this.props
    if (!instructionsArray || instructionsArray.length === 0) {
      return null
    } else {
      return (
        <View style={{backgroundColor: '#F5F6FA'}}>
          {this.renderTitle('pending')}
          {instructionsArray.map(i => this.renderBox(i, true))}
        </View>
      )
    }
  }

  render () {
    const {navigator} = this.props
    return (
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Activity' blueBackdrop />
        <ScrollView style={{flex: 1, paddingBottom: 50}} showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor: Colors.white}}>
          {this.renderPendingInvestments()}
          {this.renderMainComponent()}
        </ScrollView>
      </View>
    )
  }

}

Activity.propTypes = {
  // used for navigation, comes via react-navigation
  navigation: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // user id
  userID: PropTypes.string.isRequired,

  // regular transfers
  transfers: PropTypes.array.isRequired,

  // boost transfer
  boostTransfer: PropTypes.array.isRequired,

  // instructions array
  instructionsArray: PropTypes.array.isRequired,

  // boost withdrawl
  boostWithdrawals: PropTypes.array.isRequired,

  // is processing
  isProcessing: PropTypes.bool.isRequired,

  // is debug mode
  isDebugMode: PropTypes.bool.isRequired
}

// ========================================================
// Export
// ========================================================

export default Activity
