/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 19/2/19.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {View, Text, Image, StatusBar, Dimensions, ScrollView, TouchableHighlight, TouchableOpacity, Alert, ImageBackground}
  from 'react-native'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {Icon}
  from 'react-native-elements'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import Fonts
  from '../../Themes/Fonts'
import styles
  from '../../Themes/ApplicationStyles'
import Colors
  from '../../Themes/Colors'
import Share
  from 'react-native-share'
import branch from 'react-native-branch'

// ========================================================
// Core Component
// ========================================================

class ActionScreen extends Component {

  // --------------------------------------------------------
  // lifecycle methods

  componentWillMount () {
    this.refreshState()
  }

  // -------------------------------------------------------
  // action handlers

  refreshState () {
    const {handleLocalAction, localActions, userID} = this.props
    userID && handleLocalAction({type: localActions.FETCH_USER, [USER_ENTITIES.USER_ID]: userID})
  }

  navigateToDashboard () {
    const {handleLocalAction, localActions, childID, navigator} = this.props
    handleLocalAction({type: localActions.NAVIGATE_TO_DASHBOARD, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  addNewAccount () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.ADD_NEW_ACCOUNT, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  addNewInvestment () {
    const {handleLocalAction, localActions, childID, navigator} = this.props
    handleLocalAction({type: localActions.ADD_INVESTMENT, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  addNewGoal () {
    const {handleLocalAction, localActions, childID, navigator} = this.props
    handleLocalAction({type: localActions.ADD_GOAL, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // -------------------------------------------------------
  // child render methods

  renderCloseButton () {
    return (
      <View style={{position: 'absolute', top: 55, left: 0, right: 0, paddingHorizontal: 28, flexDirection: 'row'}}>
        <View style={{flex: 1.5}} />
        <View style={{flex: 7}} />
        <TouchableOpacity onPress={() => this.navigateToDashboard()} style={{flex: 1.5, paddingVertical: 5, paddingHorizontal: 5, alignItems: 'flex-end'}}>
          <Icon name='clear' color='#FFF' size={28} />
        </TouchableOpacity>
      </View>
    )
  }

  renderBody () {
    return (
      <View style={{flex: 5, justifyContent: 'flex-end', alignItems: 'center'}}>
        <Image source={require('../../../Img/assets/dashboard/whatNext/whatNext.png')} />
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 22, color: '#FFF', marginTop: 32}}>
          What's Next?
        </Text>
      </View>
    )
  }

  referAFriend = async () => {
    let branchUniversalObject = await branch.createBranchUniversalObject(
      'investment_complete_page_referral_link',
      {
        title: 'Check this out'
      },
    )
    let {
      channel,
      completed,
      error
    } = await branchUniversalObject.showShareSheet()
    branch.userCompletedAction('share_via_investment_complete_page', {
      channel
    })
  }

  renderActions () {
    return (
      <View style={{flex: 5}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle,
            marginTop: 42,
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 10, width: 0},
            marginHorizontal: 42
          }}
          onPress={this.referAFriend}
        >
          <Text style={styles.bottomNavigator.textStyle}>Refer a friend</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle,
            marginTop: 28,
            backgroundColor: 'transparent',
            borderColor: Colors.buttonYellow,
            borderWidth: 1,
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 10, width: 0},
            marginHorizontal: 42
          }}
          onPress={() => this.addNewAccount()}
        >
          <Text style={{...styles.bottomNavigator.textStyle, color: Colors.buttonYellow}}>
            Create Additional Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle,
            marginTop: 28,
            backgroundColor: 'transparent',
            borderColor: Colors.buttonYellow,
            borderWidth: 1,
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 10, width: 0},
            marginHorizontal: 42
          }}
          onPress={() => this.addNewInvestment()}
        >
          <Text style={{...styles.bottomNavigator.textStyle, color: Colors.buttonYellow}}>
            Discover Investments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle,
            marginTop: 28,
            backgroundColor: 'transparent',
            borderColor: Colors.buttonYellow,
            borderWidth: 1,
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 10, width: 0},
            marginHorizontal: 42
          }}
          onPress={() => this.addNewGoal()}
        >
          <Text style={{...styles.bottomNavigator.textStyle, color: Colors.buttonYellow}}>
            Create a Diversified Fund
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  // -------------------------------------------------------
  // main render methods

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#2948FF', justifyContent: 'space-around'}}>
        <StatusBar barStyle='light-content' />
        {this.renderBody()}
        {this.renderActions()}
        {this.renderCloseButton()}
      </View>
    )
  }
}

ActionScreen.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // user id
  userID: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

export default ActionScreen
