/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 23/6/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Alert, Text, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, TouchableOpacity, Image, ActivityIndicator }
  from 'react-native'
import styles
  from '../../Themes/ApplicationStyles'
import CustomNav
  from '../../Containers/Common/CustomNav'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class DebugLog extends Component {

  // --------------------------------------------------------
  // Action handlers

  // --------------------------------------------------------
  // Child Components

  // --------------------------------------------------------
  // Core Render Component

  render () {
    const {userID, detailID, numberOfChildrenAtStart} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={this.props.navigator} leftButtonPresent titlePresent title='DEBUG LOG' />

        <View style={{paddingHorizontal: 16, paddingVertical: 16}}>
          <Text>
            User ID
          </Text>
          <Text>
            {userID}
          </Text>
        </View>
        <View style={{paddingHorizontal: 16, paddingVertical: 16}}>
          <Text>
            Detail ID
          </Text>
          <Text>
            {detailID}
          </Text>
        </View>
        <View style={{paddingHorizontal: 16, paddingVertical: 16}}>
          <Text>
            Number of Children at start
          </Text>
          <Text>
            {numberOfChildrenAtStart}
          </Text>
        </View>

      </View>
    )
  }

}

DebugLog.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // detail id
  detailID: PropTypes.string.isRequired,

  // number of children at start
  numberOfChildrenAtStart: PropTypes.number
}

// ========================================================
// Export
// ========================================================

export default DebugLog
