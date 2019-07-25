/* eslint-disable no-unused-vars,operator-linebreak */
/**
 * Created by demon on 3/5/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, WebView, Text, Alert, Image, LayoutAnimation, TouchableOpacity, Dimensions }
  from 'react-native'
import Fonts
  from '../../Themes/Fonts'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import {Icon}
  from 'react-native-elements'
import RNFetchBlob
  from 'react-native-fetch-blob'
import RNFS
  from 'react-native-fs'
import Share
  from 'react-native-share'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'

// ========================================================
// Core Component
// ========================================================

class WebWindow extends Component {

  constructor (props) {
    super(props)
    const {height, width} = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.state = {
      isLoading: false
    }
  }

  componentWillMount () {
    const {toast} = this.props
    if (toast) {
      this.toast()
    }
  }

  // ---------------------------------------------------------------
  // Action Handlers

  pop () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.POP, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  sharePDF () {
    const {url} = this.props
    if (url) {
      let filePath = null
      const path = RNFS.DocumentDirectoryPath + `/${encodeURIComponent(url)}`
      const configOptions = {
        fileCache: true,
        path
      }
      RNFetchBlob.config(configOptions)
        .fetch('GET', url)
        .then(async resp => {
          filePath = resp.path()
          let options = {
            type: 'application/pdf',
            url: filePath // (Platform.OS === 'android' ? 'file://' + filePath)
          }
          await Share.open(options)
          // remove the image or pdf from device's storage
          // await RNFS.unlink(filePath);
        })
    }
  }

  // ---------------------------------------------------------------
  // Top Containers

  renderWebview () {
    const {url} = this.props
    if (!url) {
      return (
        <View style={{flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontFamily: Fonts.type.regular, fontSize: 16, color: 'rgba(255, 255, 255, 0.5)'}}>
            Please provide correct url.
          </Text>
        </View>
      )
    } else {
      return (
        <View style={{flex: 1}}>
          <WebView
            style={{flex: 1, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderBottomWidth: 2}}
            onLoadStart={() => this.setState({isLoading: true})}
            onLoadEnd={() => this.setState({isLoading: false})}
            canGoBack
            canGoForward
            source={{uri: url}}
          />
        </View>
      )
    }
  }

  // ---------------------------------------------------------------
  // Core render method

  render () {
    const isX = this.isX || false
    const { url, heading } = this.props
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <View style={{flexDirection: 'row', backgroundColor: 'transparent', paddingTop: isX ? 30 : 22, height: isX ? 80 : 70}}>
          <TouchableOpacity
            accessible
            accessibilityLabel={'Go Back'}
            accessibilityRole={'button'}
            onPress={() => this.pop()} style={{width: 50, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../../../Img/iconImages/Back.png')} />
          </TouchableOpacity>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#9B9B9B', fontFamily: Fonts.type.bold, fontSize: 12.5}}>
              {heading}
            </Text>
          </View>
          {
            url ?
              <TouchableOpacity onPress={() => this.sharePDF()} style={{width: 50, justifyContent: 'center', alignItems: 'center'}} >
                <Icon name='share-alternative' type='entypo' />
              </TouchableOpacity>
              :
              <View style={{width: 50, justifyContent: 'center', alignItems: 'center'}} />
          }
        </View>
        <View style={{flex: 9}}>
          <ProcessingIndicator isProcessing={this.state.isLoading} />
          {this.renderWebview()}
        </View>
      </View>
    )
  }

}

WebWindow.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // navigator object
  navigator: PropTypes.object.isRequired,

  // web url
  url: PropTypes.string.isRequired,

  // heading
  heading: PropTypes.string
}

WebWindow.defaultProps = {

}

// ========================================================
// Export
// ========================================================

export default WebWindow
