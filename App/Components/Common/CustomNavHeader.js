/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 14/8/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, TouchableOpacity, Image }
  from 'react-native'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'

// ========================================================
// Left Header Button Component
// ========================================================

export class LeftHeader extends Component {

  toggleLeftPanel () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.TOGGLE_SETTINGS, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  render () {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Show or Hide left panel'}
        accessibilityRole={'button'}
        onPress={this.toggleLeftPanel.bind(this)}>
        <Image source={require('../../../Img/icons/menuB1.png')} style={{height: 18, width: 18}} />
      </TouchableOpacity>
    )
  }
}

LeftHeader.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // navigator object
  navigator: PropTypes.object.isRequired
}

// ========================================================
// Right Header Button Component
// ========================================================

export class RightHeader extends Component {
  handleRightButton () {
    const {handleLocalAction, localActions, navigator} = this.props
    // handleLocalAction({type: localActions.HANDLE_RIGHT_BUTTON, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }
  render () {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Settings'}
        accessibilityRole={'button'}
        onPress={this.handleRightButton.bind(this)} >
        <Image source={require('../../../Img/icons/menuB2.png')} style={{height: 18, width: 18}} />
      </TouchableOpacity>
    )
  }
}

RightHeader.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // navigator object
  navigator: PropTypes.object.isRequired
}
