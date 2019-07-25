/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 27/7/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation
} from 'react-native'
import { DEVICE_LOGICAL_RESOLUTION }
  from '../../Utility/Mapper/Common'
import {Icon}
  from 'react-native-elements'
import Modal
  from 'react-native-modal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import Fonts
  from '../../Themes/Fonts'
import styles
  from '../../Themes/ApplicationStyles'
import HTML
  from 'react-native-render-html'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class InfoTip extends Component {

  constructor (props) {
    super(props)
    this.state = {
      isGlossary: false
    }
    const { height, width } = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    const isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
    this.isX = isIPhoneX
    this.isNormal = isNormal
  }

  componentWillMount () {
    this.setGlossary(false)
  }

  componentDidMount () {
    const {glossary, isVisible} = this.props
    if (!glossary) {
      this.fetchGlossary()
    }
  }

  componentWillReceiveProps (nextProps) {
    const {isVisible} = nextProps
    const {isGlossary} = this.state
    if (!isVisible && isGlossary) {
      this.setGlossary(false)
    }
  }

  // --------------------------------------------------------
  // Action handlers

  setGlossary (flag) {
    LayoutAnimation.spring()
    this.setState({
      isGlossary: flag
    })
  }

  fetchGlossary () {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.FETCH_GLOSSARY})
  }

  hideModel () {
    const {foo} = this.props
    foo(false)
  }

  // --------------------------------------------------------
  // Child Components

  renderHeader () {
    const {glossary, code} = this.props
    let value = glossary && glossary[code] && glossary[code][USER_ENTITIES.GLOSSARY_HEADER]
    if (!value) {
      return null
    } else {
      return (
        <View style={{marginBottom: 20}}>
          <Text style={{fontFamily: Fonts.type.bold, color: '#10427E', fontSize: 20}}>
            {value}
          </Text>
        </View>
      )
    }
  }

  renderBody () {
    const {glossary, code} = this.props
    let value = glossary && glossary[code] && glossary[code][USER_ENTITIES.GLOSSARY_BODY]
    if (!value) {
      return null
    } else {
      return (
        <View>
          <HTML
            baseFontStyle={{fontSize: 16, fontFamily: Fonts.type.regular}}
            html={value}
          />
        </View>
      )
    }
  }

  renderButton () {
    const isX = this.isX
    return (
      <View style={{position: 'absolute', bottom: isX ? 32 : 20, right: 0, left: 0}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Open the Loved glossary'}
          accessibilityRole={'button'}
          style={{backgroundColor: '#10427E', marginHorizontal: 16, height: 50, justifyContent: 'center', alignItems: 'center'}}
          onPress={() => this.setGlossary(true)}>
          <Text style={[styles.bottomNavigator.textStyle, { color: '#FFF' }]}>Open the Loved glossary</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderGlossaryHeader () {
    return (
      <View style={{marginBottom: 32}}>
        <Text style={{textAlign: 'center', fontFamily: Fonts.type.bold, color: '#10427E', fontSize: 20}}>
          Glossary
        </Text>
      </View>
    )
  }

  renderGloassaryCube (a) {
    return (
      <View style={{marginBottom: 20}}>
        <HTML
          baseFontStyle={{fontSize: 16, fontFamily: Fonts.type.regular}}
          html={a[USER_ENTITIES.GLOSSARY_BODY]}
        />
      </View>
    )
  }

  renderGlossaryBody () {
    const {glossary} = this.props
    const arr = (glossary && Object.values(glossary)) || []
    return (
      <View>
        {arr.map(a => this.renderGloassaryCube(a))}
      </View>
    )
  }

  renderModalView () {
    const {height} = Dimensions.get('window')
    const isX = this.isX
    const {isGlossary} = this.state
    if (isGlossary) {
      return (
        <View style={{height: height, backgroundColor: '#FFF', borderTopRightRadius: 10, borderTopLeftRadius: 10, paddingTop: isX ? 32 : 20}}>
          <View style={{height: 40, alignItems: 'center', paddingTop: 10}}>
            <TouchableOpacity
              accessible
              accessibilityLabel={'Clear'}
              accessibilityRole={'button'}
              onPress={() => this.hideModel()}
              style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'flex-end', alignItems: 'center'}}>
              <Icon name='clear' color='#10427E' size={32} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{backgroundColor: 'transparent'}} contentContainerStyle={{paddingHorizontal: 16}}>
            {this.renderGlossaryHeader()}
            {this.renderGlossaryBody()}
            <TouchableOpacity style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }} />
          </ScrollView>
        </View>
      )
    } else {
      return (
        <View style={{backgroundColor: '#FFF', borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
          <View style={{height: 40, alignItems: 'center', paddingTop: 10}}>
            <Image source={require('../../../Img/iconImages/line.png')} />
            <TouchableOpacity
              accessible
              accessibilityLabel={'Clear'}
              accessibilityRole={'button'}
              onPress={() => this.hideModel()}
              style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'flex-end', alignItems: 'center'}}>
              <Icon name='clear' color='#10427E' size={32} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{backgroundColor: 'transparent'}} contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 122}}>
            {this.renderHeader()}
            {this.renderBody()}
            <TouchableOpacity style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }} />
          </ScrollView>
          {this.renderButton()}
        </View>
      )
    }
  }

  handleOnScroll = event => {
    this.setState({
      scrollOffset: event.nativeEvent.contentOffset.y
    })
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const {isVisible, code} = this.props
    return (
      <View>
        <Modal
          keyboardShouldPersistTaps='always'
          style={{justifyContent: 'flex-end', margin: 0}}
          onBackdropPress={() => this.hideModel()}
          onSwipe={() => this.hideModel()}
          swipeDirection='down'
          scrollTo={this.handleScrollTo}
          scrollOffset={this.state.scrollOffset}
          scrollOffsetMax={300} // content height - ScrollView height
          isVisible={isVisible}>
          {this.renderModalView()}
        </Modal>
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

InfoTip.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // is modal visible
  isVisible: PropTypes.bool.isRequired,

  // code of tip
  code: PropTypes.string.isRequired,

  // binded modal hide func
  foo: PropTypes.func.isRequired,

  // glossary
  glossary: PropTypes.object,

  // is processing
  isProcessing: PropTypes.bool.isRequired,

  // is glossary
  isGlossary: PropTypes.bool.isRequired
}

InfoTip.defaultProps = {
  isVisible: false,
  isGlossary: false
}

// ========================================================
// Export
// ========================================================

export default InfoTip
