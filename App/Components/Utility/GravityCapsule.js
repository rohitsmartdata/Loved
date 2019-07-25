/**
 * Gravity Capsule.
 * This view has following properties :-
 * - sticks to bottom of screen at absolute position
 * - aligns itself to top of keyboard, when it appears.
 *
 * Created by viktor on 23/6/17.
 */

/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 21/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import { View, Text, Keyboard, LayoutAnimation }
  from 'react-native'

// ========================================================
// Stylesheet
// ========================================================

const styles = {
  container: {
    position: 'absolute',
    left: 0,
    right: 0
  }
}

// ========================================================
// Core Component
// ========================================================

class GravityCapsule extends Component {

  constructor (props) {
    super(props)
    this.state = {
      bottom: this.props.floatValue
    }
  }

  componentWillMount () {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
  }
  componentWillUnmount () {
    this.keyboardWillShowSub.remove()
    this.keyboardWillHideSub.remove()
  }

  keyboardWillShow (event) {
    LayoutAnimation.configureNext({duration: 200, update: {type: 'keyboard'}})
    this.setState({
      bottom: event.endCoordinates.screenX + event.endCoordinates.height
    })
  }
  keyboardWillHide () {
    LayoutAnimation.configureNext({duration: 200, update: {type: 'keyboard'}})
    this.setState({
      bottom: this.props.floatValue
    })
  }

  renderCapsule () {
    const {keyboardExtraGap} = this.props
    const extraGap = keyboardExtraGap || 0
    return (
      <View style={{...styles.container, bottom: this.state.bottom + extraGap + 0}} >
        {this.props.children}
      </View>
    )
  }

  render () {
    return this.renderCapsule()
  }

}

// ========================================================
// Export
// ========================================================

export default GravityCapsule
