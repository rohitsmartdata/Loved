/* eslint-disable no-unused-vars,no-trailing-spaces,operator-linebreak */
/**
 * Created by demon on 9/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {
  View, Text, LayoutAnimation, Dimensions, TextInput, ActivityIndicator, TouchableOpacity, Image, ScrollView,
  AsyncStorage
}
  from 'react-native'
import Fonts
  from '../../Themes/Fonts'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import LinearGradient
  from 'react-native-linear-gradient'
import { LEARN_ENTITIES }
  from '../../Utility/Mapper/Learn'
import moment
  from 'moment'
import {limitText}
  from '../../Utility/Transforms/Converter'
import globalStyle from '../../Themes/ApplicationStyles'
import { CachedImage }
  from 'react-native-cached-image'

// ========================================================
// UTILITY
// ========================================================

// ========================================================
// Core Component
// ========================================================

class GrowHomepage extends Component {

  // --------------------------------------------------------
  // Lifecycle methods

  constructor (props) {
    super(props)
    this.state = {
      _goalNameError: false,
      _selectedChild: props.selectedChild
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentWillMount () {
    this.fetchLearningModules()
    // AsyncStorage.setItem('LAST_SCREEN', 'grow')
  }

  fetchLearningModules () {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.FETCH_MODULES})
  }

  openArticle (datum) {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.OPEN_ARTICLE, [COMMON_ENTITIES.NAVIGATOR]: navigator, [LEARN_ENTITIES.MODULE]: datum})
  }

  // --------------------------------------------------------
  // Action handlers

  renderData () {
    const {modules} = this.props
    let values = modules && Object.values(modules)
    if (values) {
      values.shift()
      return (
        <View>
          <ScrollView contentContainerStyle={{paddingBottom: 80}}>
            {this.renderHeader()}
            {
              values.map(v => this.renderDataCube(v))
            }
          </ScrollView>
        </View>
      )
    } else {
      return (
        null
      )
    }
  }

  renderDataCube (datum) {
    let updateAt = datum[LEARN_ENTITIES.MODULE_UPDATED_AT]
    let image = datum[LEARN_ENTITIES.MODULE_IMAGE]
    let desc = datum[LEARN_ENTITIES.MODULE_DESCRIPTION]
    let m = updateAt && moment(updateAt).format('MMM D, h:MM a')
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Open Article'}
        accessibilityRole={'button'}
        onPress={() => this.openArticle(datum)}
        style={{flexDirection: 'row', backgroundColor: 'transparent', borderBottomWidth: 0.5}}>
        <View style={{overflow: 'hidden', paddingTop: 16, paddingLeft: 16, paddingBottom: 16, paddingRight: 16}} >
          {
            image
              ?
                <CachedImage source={{uri: image}} resizeMode='cover' style={{height: 100, width: 100, borderRadius: 50}} />
                :
                <View style={{height: 100, width: 100, backgroundColor: 'transparent'}} />
          }
        </View>
        <View style={{flex: 1, justifyContent: 'center', paddingLeft: 12, paddingRight: 16}}>
          <Text style={{fontSize: 18, fontFamily: Fonts.type.bold, color: '#000', marginBottom: 3}}>
            {datum[LEARN_ENTITIES.MODULE_NAME]}
          </Text>
          <Text style={{fontSize: 14.5, fontFamily: Fonts.type.medium, lineHeight: 19, color: '#4A4A4A'}}>
            {desc && limitText(desc, 110)}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  // --------------------------------------------------------
  // Child Components

  renderHeader () {
    const {modules} = this.props
    let values = modules && Object.values(modules)
    if (values) {
      let hero = values[0]
      let title = hero && hero[LEARN_ENTITIES.MODULE_NAME]
      let description = hero && hero[LEARN_ENTITIES.MODULE_DESCRIPTION]
      let backdrop = hero && hero[LEARN_ENTITIES.MODULE_BACKDROP]
      const isX = this.isX
      const {width, height} = Dimensions.get('window')
      return (
        <LinearGradient
          start={{x: 0.0, y: 0.25}} end={{x: 0.0, y: 1.0}}
          locations={[0.2, 0.5, 1]}
          colors={['#10437F', '#2373B1']}
          style={{...globalStyle.screen.containers.root, backgroundColor: '#FFF'}}>
          <TouchableOpacity
            accessible
            accessibilityLabel={'Open Article'}
            accessibilityRole={'button'}
            onPress={() => this.openArticle(hero)}
            style={{paddingHorizontal: 16, paddingVertical: 16, marginTop: 16}}>
            <Text style={{textAlign: 'center', fontFamily: Fonts.type.bold, fontSize: 20.5, color: '#fff'}}>
              {title}
            </Text>
            {
              backdrop &&
              <View style={{marginHorizontal: 16, height: 190, marginTop: 10, marginBottom: 20, shadowOpacity: 0.8, shadowOffset: {width: 0, height: 4}, shadowRadius: 4}}>
                <CachedImage source={{uri: backdrop}} resizeMode='cover' style={{flex: 1, height: undefined, widht: undefined}} />
              </View>
            }
            <Text style={{textAlign: 'center', fontFamily: Fonts.type.medium, lineHeight: 19, fontSize: 14.5, color: '#fff'}}>
              {description}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      )
    } else {
      return (
        null
      )
    }
  }

  renderHead () {
    const isX = this.isX
    return (
      <View style={{flexDirection: 'row', paddingTop: isX ? 30 : 22, height: isX ? 80 : 70, backgroundColor: 'rgb(255, 205, 0)', shadowOpacity: 1, shadowOffset: {width: 0, height: 1}, shadowColor: '#000', zIndex: 500}}>
        <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 10}}>
          <Text style={{fontFamily: Fonts.type.semibold, fontSize: 18, color: '#000'}}>
            Educate
          </Text>
        </View>
      </View>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const {isProcessing, childArr, modules} = this.props
    return (
      <View style={{flex: 1, backgroundColor: '#F7FBFF'}}>
        {this.renderHead()}
        {this.renderData()}
      </View>
    )
  }

}

GrowHomepage.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  childArr: PropTypes.array.isRequired,
  defaultIndex: PropTypes.number.isRequired,
  selectedChild: PropTypes.object.isRequired,

  modules: PropTypes.object.isRequired
}

// ========================================================
// Export
// ========================================================

export default GrowHomepage
