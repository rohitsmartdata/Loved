/* eslint-disable no-unused-vars */
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
import { View, Text, TouchableOpacity }
  from 'react-native'
import { Icon }
  from 'react-native-elements'

const styles = {
  horizontalButton: {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: 0.4,
    borderColor: 'rgba(256, 256, 256, 0.4)'
  },
  horizontalButtonTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 8
  },
  horizontalButtonIconContainer: {
    width: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  horizontalButtonTextStyle: {
    fontSize: 16,
    backgroundColor: 'transparent',
    color: '#FFF'
  }
}

// ========================================================
// Left Header Button Component
// ========================================================

class ArrowButton extends Component {

  // ------------------------------------------------------------
  // child render methods

  renderTouchArea () {
    const {title, onPress, showArrow} = this.props
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={title}
        onPress={onPress}>
        <View style={styles.horizontalButton}>
          <View style={styles.horizontalButtonTextContainer}>
            <Text style={styles.horizontalButtonTextStyle}>
              {title}
            </Text>
          </View>
          {
            showArrow &&
            <View style={styles.horizontalButtonIconContainer}>
              <Icon name='keyboard-arrow-right' color='#FFF' />
            </View>
          }
        </View>
      </TouchableOpacity>
    )
  }

  render = () => this.renderTouchArea()
}

ArrowButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  showArrow: PropTypes.bool
}

ArrowButton.defaultProps = {
  title: 'button',
  onPress: () => console.log('button pressed'),
  showArrow: true
}

export default ArrowButton
