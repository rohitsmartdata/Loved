/* eslint-disable no-trailing-spaces,no-unused-vars, operator-linebreak */
/**
 * Created by demon on 22/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, ActivityIndicator, ScrollView, Dimensions, WebView, Modal, TouchableOpacity }
  from 'react-native'
import {Icon}
  from 'react-native-elements'
import CustomNav
  from '../../Containers/Common/CustomNav'
import {SETTINGS_ENTITIES}
  from '../../Utility/Mapper/Settings'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import Fonts
  from '../../Themes/Fonts'
import Pdf
  from 'react-native-pdf'
import Avatar
  from '../../Containers/Utility/Avatar'
import Share
  from 'react-native-share'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'

// ========================================================
// Core Component
// ========================================================

class Confirmations extends Component {

  // ------------------------------------------------------------
  // Lifecycle methods & event handlers

  constructor (props) {
    super(props)
    this.state = {
      translateX: 0,
      currentIndex: 0,
      pdfVisible: false,
      url: undefined,
      title: undefined,
      _selectedChild: props.selectedChild,
      _selectedTab: 0
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  // ------------------------------------------------------------
  // Action handlers

  visitURL (url) {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_URL, [SETTINGS_ENTITIES.URL]: url, [SETTINGS_ENTITIES.HEADING]: 'Tax Document', [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  setSelectedChild (childObj) {
    this.setState({_selectedChild: childObj})
  }

  showPDF () {
    this.setState({pdfVisible: true})
  }

  hidePDF () {
    this.setState({pdfVisible: false})
  }

  fetchPDF (url, title) {
    this.setState({url: url, title: title})
    this.showPDF()
  }

  // ------------------------------------------------------------
  // Child Components

  renderTextBlock (block, title, url) {
    const source = {uri: url || block['url'], cache: true}
    const {width} = Dimensions.get('window')
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Visit Trade'}
        accessibilityRole={'link'}
        onPress={() => this.visitURL(block['url'])} >
        <View style={{width: width, flexDirection: 'row', justifyContent: 'space-between', marginTop: 32, marginBottom: 32}}>
          <Text style={{flex: 5, fontFamily: Fonts.type.bold, fontSize: 18, color: '#4A4A4A', backgroundColor: 'transparent', marginBottom: 10, marginLeft: 16}}>
            Trade
          </Text>
          <Text style={{flex: 5, fontFamily: Fonts.type.bold, textAlign: 'left', fontSize: 18, color: '#4A4A4A', backgroundColor: 'transparent', marginBottom: 10}}>
            {block['date']}
          </Text>
        </View>
        <View style={{height: 1, backgroundColor: '#D7D7D7'}} />
      </TouchableOpacity>
    )
  }

  renderChildHomepage () {
    const {_selectedChild} = this.state
    const {confirmations} = this.props
    let childID = _selectedChild && _selectedChild.childID

    let docs = childID && confirmations[childID]
    if (docs) {
      return (
        <ScrollView style={{flex: 1}}>
          <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 32}}>
            {
              docs.map(doc => this.renderTextBlock(doc, 'Confirmations'))
            }
          </View>
        </ScrollView>
      )
    } else {
      return (
        <View style={{flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontFamily: Fonts.type.regular, fontSize: 18, color: '#4A4A4A', backgroundColor: 'transparent', paddingHorizontal: 30}}>
            Recent trade confirmation will be made available here
          </Text>
        </View>
      )
    }
  }

  renderChildBadge (c) {
    const {_selectedChild} = this.state
    const {imageUrl = '', childImage = '', childID} = c
    const {userID} = this.props
    const imageType = ['USER', 'CHILD']
    const imageId = [userID, c.childID]
    let initials = c.firstname && c.firstname.charAt(0)
    const isSelected = _selectedChild.childID === c.childID
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={`Select child ${c.firstName}`}
        accessibilityRole={'button'}
        onPress={() => this.setSelectedChild(c)} style={{marginHorizontal: 5}}>
        <Avatar isSelected={isSelected} borderWidth={isSelected ? 2 : 1.5} avatarSize={70} name={c.firstname} showAddButton={false} initials={initials} imageRadius={30} imageUrl={imageUrl} image={childImage} imageType={imageType} imageId={imageId} />
      </TouchableOpacity>
    )
  }

  renderChildPanel () {
    const {childArr} = this.props
    const singleChild = childArr.length === 1
    const {width} = Dimensions.get('window')
    if (singleChild) {
      return null
    }
    return (
      <View style={{backgroundColor: '#10427E', borderBottomWidth: 0.4, borderColor: '#979797', paddingTop: 0, shadowOpacity: 0.7, shadowOffset: {width: 0, height: 5}}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentInset={{left: 0}} contentOffset={{x: 0}} automaticallyAdjustContentInsets={false} contentContainerStyle={{flexGrow: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginVertical: 15}}>
          {childArr.map(c => this.renderChildBadge(c))}
        </ScrollView>
      </View>
    )
  }

  shareDocuments () {
    const {confirmations} = this.props
    const {_selectedChild} = this.state
    const childID = _selectedChild && _selectedChild[CHILD_ENTITIES.CHILD_ID]
    const confirmationArray = childID && confirmations[childID]
    let urlArray = []
    confirmationArray.map(c => {
      let url = c['url']
      urlArray.push(url)
    })

    const shareOptions = {
      title: 'Share via',
      message: 'Tax Documents',
      urls: urlArray
    }
    Share.open(shareOptions)
  }

  // ------------------------------------------------------------
  // Core Components

  render () {
    const {confirmations, isProcessing} = this.props
    return (
      <View style={{flex: 1}}>
        <CustomNav navigator={this.props.navigator} leftButtonPresent titlePresent title='Trade Confirmations' blueBackdrop />
        <ProcessingIndicator isProcessing={isProcessing} />
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.pdfVisible}
        >
          <PDFViewer url={this.state.url} foo={this.hidePDF.bind(this)} title={this.state.title} />
        </Modal>
        <View style={{flex: 1, backgroundColor: '#FFF'}}>
          {this.renderChildPanel()}
          {this.renderChildHomepage()}
        </View>
      </View>
    )
  }

}

class PDFViewer extends Component {

  render () {
    const {url, foo, title} = this.props
    const source = {uri: url, cache: true}

    return (
      <View style={{flex: 1}}>
        <View style={{marginTop: 20, marginBottom: 20, justifyContent: 'center', alignItems: 'center'}}>
          <Icon name='close' size={32} style={{position: 'absolute', left: 0}} onPress={() => foo()} />
          <Text style={{fontFamily: Fonts.type.medium, fontSize: 20}}>
            {title}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Pdf
            source={source}
            onLoadComplete={(pageCount, filePath) => {
              console.log(`total page count: ${pageCount}`)
            }}
            onPageChanged={(page, pageCount) => {
              console.log(`current page: ${page}`)
            }}
            onError={(error) => {
              console.log(error)
            }}
            style={{flex: 1, width: Dimensions.get('window').width}}
          />
        </View>
      </View>
    )
  }
}

PDFViewer.propTypes = {
  url: PropTypes.string.isRequired,
  foo: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

Confirmations.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // confirmations
  confirmations: PropTypes.object,

  // child array
  childArr: PropTypes.array.isRequired,

  // selected child
  selectedChild: PropTypes.object.isRequired,

  // is processing
  isProcessing: PropTypes.bool.isRequired,

  // default index
  defaultIndex: PropTypes.number.isRequired
}

// ========================================================
// Export
// ========================================================

export default Confirmations
