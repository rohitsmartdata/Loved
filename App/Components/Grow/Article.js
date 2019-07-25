/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 10/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { Animated, View, Text, Dimensions, TextInput, ActivityIndicator, TouchableOpacity, Image, ScrollView, ImageBackground }
  from 'react-native'
import {Icon}
  from 'react-native-elements'
import Fonts
  from '../../Themes/Fonts'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import {LEARN_ENTITIES}
  from '../../Utility/Mapper/Learn'
import {SETTINGS_ENTITIES}
  from '../../Utility/Mapper/Settings'
import HTML
  from 'react-native-render-html'
import globalStyle from '../../Themes/ApplicationStyles'
import LinearGradient from 'react-native-linear-gradient'
import { CachedImage }
  from 'react-native-cached-image'
// ========================================================
// UTILITY
// ========================================================

// ========================================================
// Core Component
// ========================================================

class Article extends Component {

  // --------------------------------------------------------
  // Lifecycle methods

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentWillMount () {
    this.fetchLearningModules()
  }

  // --------------------------------------------------------
  // Action handlers

  fetchLearningModules () {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.FETCH_MODULES})
  }

  closeArticle () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.CLOSE_ARTICLE, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  visitURL (url) {
    const {handleLocalAction, localActions, navigator} = this.props
    url && handleLocalAction({type: localActions.SHOW_URL, [SETTINGS_ENTITIES.URL]: url, [SETTINGS_ENTITIES.HEADING]: 'Article', [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // --------------------------------------------------------
  // Child Components

  renderHeader () {
    const {module} = this.props
    let heading = module && module[LEARN_ENTITIES.MODULE_NAME]
    let backdrop = module && module[LEARN_ENTITIES.MODULE_BACKDROP]
    let description = module && module[LEARN_ENTITIES.MODULE_DESCRIPTION]
    const isX = this.isX || false
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{textAlign: 'center', marginHorizontal: 16, paddingVertical: 32, fontFamily: Fonts.type.bold, fontSize: 21, color: '#fff'}}>
          {heading}
        </Text>
        {
          backdrop &&
          <View style={{height: 300, width: 335, marginBottom: 0, shadowOpacity: 0.5, shadowOffset: {width: 0, height: 3}, shadowRadius: 4}}>
            <CachedImage source={{uri: backdrop}} resizeMode='cover' style={{flex: 1, height: undefined, width: undefined}} />
          </View>
        }
      </View>
    )
  }
  renderArticle () {
    const {module} = this.props
    const content = module[LEARN_ENTITIES.MODULE_CONTENT]
    let description = module && module[LEARN_ENTITIES.MODULE_DESCRIPTION]
    return (
      <View style={{alignSelf: 'center', backgroundColor: '#fff', width: 335, paddingTop: 8, paddingHorizontal: 20}}>
        <Text style={{textAlign: 'center', fontFamily: Fonts.type.bold, lineHeight: 19, fontSize: 14.5, color: '#000'}}>
          {description}
        </Text>
        <View style={{paddingTop: 8}}>
          <HTML
            baseFontStyle={{fontSize: 17, lineHeight: 25, letterSpacing: 1, fontFamily: Fonts.type.regular}}
            onLinkPress={(event, value) => this.visitURL(value)}
            containerStyle={{paddingBottom: 70}}
            html={content}
            imagesMaxWidth={Dimensions.get('window').width} />
        </View>
      </View>
    )
  }

  renderHead () {
    const isX = this.isX
    return (
      <View style={{flexDirection: 'row', paddingTop: isX ? 30 : 22, height: isX ? 80 : 70, backgroundColor: 'rgb(255, 205, 0)', shadowOpacity: 1, shadowOffset: {width: 0, height: 1}, shadowColor: '#000', zIndex: 500}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Close Article'}
          accessibilityRole={'button'}
          onPress={() => this.closeArticle()}
          style={{width: 50, justifyContent: 'flex-end', paddingBottom: 9, alignItems: 'center'}}>
          <Icon name='clear' color='#000' size={26} />
        </TouchableOpacity>
        <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 10}}>
          <Text style={{fontFamily: Fonts.type.semibold, fontSize: 18, color: '#000'}}>
            Educate
          </Text>
        </View>
        <View style={{width: 50, justifyContent: 'center', alignItems: 'center'}} />
      </View>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const { popButton, navigator } = this.props
    const { height, width } = Dimensions.get('window')
    return (
      <View style={{flex: 1, backgroundColor: '#F7FBFF'}}>
        {this.renderHead()}
        <TouchableOpacity
          accessible
          accessibilityLabel={'Close Article'}
          accessibilityRole={'button'}
          onPress={() => this.closeArticle()}
          style={{position: 'absolute', top: 36, left: 10}}>
          <Icon name='clear' color='#000' size={20} />
        </TouchableOpacity>
        <LinearGradient
          start={{x: 0.0, y: 0.25}} end={{x: 0.0, y: 1.0}}
          locations={[0.2, 0.5, 1]}
          colors={['#10437F', '#2373B1']}
          style={{...globalStyle.screen.containers.root, backgroundColor: '#FFF'}}>
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor: 'transparent'}}>
            {this.renderHeader()}
            {this.renderArticle()}
          </ScrollView>
        </LinearGradient>
      </View>
    )
  }
}

Article.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // description of article
  description: PropTypes.string,

  module: PropTypes.object.isRequired,

  popButton: PropTypes.bool
}

Article.defaultProps = {
  popButton: true
}
// ========================================================
// Export
// ========================================================

export default Article
