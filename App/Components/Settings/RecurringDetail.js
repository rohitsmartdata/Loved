/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 17/8/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Alert, KeyboardAvoidingView, Keyboard, ScrollView, ActivityIndicator, FlatList, TouchableOpacity }
  from 'react-native'
import { Button, Icon }
  from 'react-native-elements'
import styles
  from './Styles/RecurringDetailStyle'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {parseRecurringInvestmentDetail}
  from '../../Utility/Transforms/Parsers'
import LinearGradient
  from 'react-native-linear-gradient'

// ========================================================
// Core Component
// ========================================================

class RecurringDetail extends Component {

  componentWillMount () {
    this.fetchRecurringData()
  }

  // ------------------------------------------------------------
  // action handlers

  fetchRecurringData () {
    const {handleLocalAction, localActions, navigator, userID} = this.props
    handleLocalAction({type: localActions.FETCH_RECURRING_DATA, [USER_ENTITIES.USER_ID]: userID})
  }

  showRecurringWidget (data) {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_RECURRING_WIDGET, [CHILD_ENTITIES.CHILD_ID]: data.childID, [GOAL_ENTITIES.GID]: data.goalID, [GOAL_ENTITIES.RECURRING_AMOUNT]: data[GOAL_ENTITIES.RECURRING_AMOUNT], [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // ------------------------------------------------------------
  // render child components

  renderRecurringInvestmentHeading () {
    return (
      <View style={{height: 50, justifyContent: 'center', borderBottomWidth: 0.4, borderColor: 'rgba(256, 256, 256, 0.4)'}}>
        <Text style={{fontSize: 16, fontWeight: '600', backgroundColor: 'transparent', color: '#FFF'}}>
          Recurring Investments
        </Text>
      </View>
    )
  }

  renderProcessing () {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating />
      </View>
    )
  }

  renderSectionCube (data) {
    if (data.heading && data.subheading) {
      return (
        <TouchableOpacity
          accessible
          accessibilityLabel={`Select: ${data.heading}`}
          style={styles.cubeContainer} onPress={() => this.showRecurringWidget(data)}>
          <View style={styles.cubeBufferContainer} />
          <View style={styles.cubeTextContainer}>
            <Text style={styles.cubeTextStyle}>{data.heading}</Text>
            <Text style={styles.cubeTextStyle}>{data.subheading}</Text>
          </View>
          <View style={styles.cubeArrayContainer}>
            <Icon name='keyboard-arrow-right' color='#FFF' />
          </View>
        </TouchableOpacity>
      )
    }
  }

  // ------------------------------------------------------------
  // render core component

  render () {
    const {isProcessing, recurringData} = this.props
    let cubes = recurringData && parseRecurringInvestmentDetail(recurringData)
    return (
      <LinearGradient
        colors={['rgb(222, 197, 251)', 'rgb(145, 191, 213)']}
        start={{x: 0.0, y: 0.3}} end={{x: 0.0, y: 0.7}}
        style={styles.container}>
        {this.renderRecurringInvestmentHeading()}
        <FlatList
          renderItem={({item}) => { return item ? this.renderSectionCube(item) : null }}
          keyExtractor={(item) => item.goalID}
          data={cubes}
          />
      </LinearGradient>
    )
  }

}

RecurringDetail.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-native-navigation
  navigator: PropTypes.object.isRequired,

  isProcessing: PropTypes.bool.isRequired,

  userID: PropTypes.string.isRequired,

  recurringData: PropTypes.array
}

// ========================================================
// Export
// ========================================================

export default RecurringDetail
