/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * Created by demon on 16/10/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {View, Text, Picker, Dimensions, TouchableOpacity, Modal}
  from 'react-native'
import {Icon}
  from 'react-native-elements'
import styles
  from '../../Themes/ApplicationStyles'
import Metrics
  from '../../Themes/Metrics'
import Fonts
  from '../../Themes/Fonts'
import LinearGradient
  from 'react-native-linear-gradient'

// ========================================================
// Core Component
// ========================================================

class LWDropDown extends Component {

  // --------------------------------------------------------
  // lifecycle methods

  constructor (props) {
    super(props)

    const {title} = this.props
    this.state = {
      modalVisible: false,
      title: title,
      currentItem: title
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({title: nextProps.title, currentItem: nextProps.title})
  }

  // --------------------------------------------------------
  // Action handlers

  toggleModal (open) {
    this.setState({modalVisible: open})
  }

  // set current item on movement
  // of the item list
  setCurrentItem (item) {
    this.setState({currentItem: item})
  }

  setTitle () {
    const {foo} = this.props
    // set the title of the picker as current item
    this.setState(prevState => { return {title: prevState.currentItem} })
    this.toggleModal(false)
    // if callback provided, call the callback with selected item
    foo && foo(this.state.currentItem)
  }

  // --------------------------------------------------------
  // Child components

  renderModal () {
    const {height} = Dimensions.get('window')
    const {items} = this.props
    let modalHeight = Math.ceil(height * 0.35)
    return (
      <Modal
        animationType='slide'
        visible={this.state.modalVisible}
        transparent
      >
        <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: modalHeight, backgroundColor: '#FFF'}}>

          <TouchableOpacity
            accessible
            accessibilityLabel={'Done'}
            accessibilityRole={'button'}
            onPress={() => this.setTitle()}
            style={{height: Metrics.button.height.thick, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: 'rgb(91, 185, 115)', paddingRight: 20, borderTopWidth: 2, borderBottomWidth: 2, borderColor: '#FFF'}}>
            <Text style={{color: '#FFF', fontFamily: Fonts.type.semibold, fontSize: Fonts.size.button}}>
              Done
            </Text>
          </TouchableOpacity>

          <LinearGradient
            colors={['rgba(0, 167, 118, 0.6)', 'rgba(0, 167, 118, 1)', 'rgba(0, 167, 118, 1)', 'rgba(0, 167, 118, 0.6)']}
            start={{x: 0.0, y: 0}} end={{x: 0, y: 1}}
            locations={[0, 0.4, 0.7, 1]}
            style={styles.screen.containers.root}
            >
            <Picker
              selectedValue={this.state.currentItem}
              onValueChange={(itemValue) => this.setCurrentItem(itemValue)}
              >
              {items && items.map(item => <Picker.Item label={item} value={item} />)}
            </Picker>
          </LinearGradient>

        </View>
      </Modal>
    )
  }

  renderButton () {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={this.state.title}
        accessibilityRole={'button'}
        onPress={() => this.toggleModal(true)} style={{height: Metrics.button.height.thick, backgroundColor: 'transparent', borderWidth: 0.5, borderColor: '#9B9B9B', flexDirection: 'row', borderRadius: 8}}>
        <View style={{flex: 1, justifyContent: 'center', paddingLeft: 10, borderRadius: 8}}>
          <Text style={{fontFamily: Fonts.type.light, fontSize: Fonts.size.h4, color: '#9B9B9B'}}>
            {this.state.title}
          </Text>
        </View>
        <View style={{width: 30, justifyContent: 'center', alignItems: 'flex-start', borderRadius: 8}}>
          <Icon name='keyboard-arrow-down' color='#9B9B9B' size={28} />
        </View>
      </TouchableOpacity>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    return (
      <View>
        {this.renderModal()}
        {this.renderButton()}
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

LWDropDown.propTypes = {
  // array of items to be displayed
  // in the picker
  items: PropTypes.array.isRequired,
  // item to be displayed as title
  // initially
  title: PropTypes.string.isRequired,
  // function to be called when item
  // is selected by user
  foo: PropTypes.func.isRequired
}

LWDropDown.defaultProps = {
  title: 'no item',
  foo: () => console.log('no item injected')
}

// ========================================================
// Export
// ========================================================

export default LWDropDown
