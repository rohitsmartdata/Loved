/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 31/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, FlatList, Animated, LayoutAnimation, TouchableOpacity, TouchableHighlight }
  from 'react-native'
import styles
  from './Styles/AnimatedBoxListStyle'
import Fonts from '../../Themes/Fonts'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import Colors from '../../Themes/Colors'
import globalStyles from '../../Themes/ApplicationStyles'
import LinearGradient from 'react-native-linear-gradient'

// ========================================================
// Core Component
// ========================================================

class AnimatedBoxList extends Component {

  componentWillMount () {
    this.state = {
      open: false,
      height: new Animated.Value(0)
    }
  }

  componentWillReceiveProps () {
    this._propAnalyser()
  }

  // -------------------------------------------------------
  // action handlers

  _propAnalyser () {
    const {data} = this.props
    if (data.length > 0 && !this.state.open) {
      this.setState({open: true})
      Animated.timing(
        this.state.height,
        {
          toValue: 150,
          duration: 200
        }
      ).start()
    } else if (data.length === 0 && this.state.open) {
      this.setState({open: false})
      Animated.timing(
        this.state.height,
        {
          toValue: 0,
          duration: 200
        }
      ).start()
    }
  }

  // -------------------------------------------------------
  // render inner component
  /*
                <Text style={{...styles.rowCapsuleText, fontWeight: 'bold', color: '#000'}}>
            {item['structured_formatting']['main_text']}
            {item['structured_formatting']['secondary_text']}
          </Text>
   */
  renderCapsule (item, index) {
    var addressString = item['description'].split(',')
    addressString.pop()
    addressString = addressString.join(',')

    const {touchHandler} = this.props
    return (
      <TouchableHighlight onPress={() => touchHandler(item)} style={{ ...styles.capsuleContainer, paddingTop: index === 0 ? 15 : 5 }} underlayColor={'#F0F0F0'}>
        <Text style={{...globalStyles.text.title, color: Colors.blue, textAlign: 'left'}}>
          {addressString}
        </Text>
      </TouchableHighlight>
    )
  }

  renderListBox () {
    const {data} = this.props
    if (data.length === 0 && this.state.open) {
      this._propAnalyser()
    }
    return (
      <FlatList
        data={data}
        keyboardShouldPersistTaps='always'
        keyExtractor={item => item.description}
        showsVerticalScrollIndicator
        renderItem={({item, index}) => { return this.renderCapsule(item, index) }}
      />
    )
  }

  // -------------------------------------------------------
  // render core component

  render () {
    if (this.props.data && this.props.data.length) {
      return (
        <Animated.View style={{
          backgroundColor: Colors.white,
          borderRadius: 5,
          shadowOpacity: 0.16,
          shadowOffset: ({x: 0, y: 3}),
          shadowColor: Colors.black,
          maxHeight: 207
        }}>
          {this.renderListBox()}
        </Animated.View>
      )
    }
    return null
  }
}

// ========================================================
// Export
// ========================================================

AnimatedBoxList.propTypes = {
  data: PropTypes.array.isRequired,
  shouldClose: PropTypes.bool.isRequired,
  touchHandler: PropTypes.func.isRequired
}
AnimatedBoxList.defaultProps = {
  data: [],
  shouldClose: true,
  touchHandler: undefined
}

export default AnimatedBoxList
