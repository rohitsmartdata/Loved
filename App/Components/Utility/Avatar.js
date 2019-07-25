/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 30/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { View, Image, Text, TouchableOpacity, Animated, TouchableHighlight } from 'react-native'
import Fonts from '../../Themes/Fonts'
import ImagePicker from 'react-native-image-picker'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import { SETTINGS_ENTITIES } from '../../Utility/Mapper/Settings'
import { AUTH_ENTITIES } from '../../Utility/Mapper/Auth'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { GOAL_ENTITIES } from '../../Utility/Mapper/Goal'
import {limitText} from '../../Utility/Transforms/Converter'
import ShadowedContainer from '../../CommonComponents/ShadowedContainer'
import Colors from '../../Themes/Colors'
import { Icon } from 'react-native-elements'
import _ from 'lodash'

// ========================================================
// Core Component
// ========================================================

class Avatar extends Component {

  constructor (props) {
    super(props)

    const { handleLocalAction, localActions, email, token, imageType, image, imageUrl, imageId } = props
    this.state = {
      showLoaderImage: '',
      avatar: image
    }

    // get photo  if image url is present
    if (imageUrl && !image) {
      handleLocalAction({
        type: localActions.GET_PHOTO,
        [SETTINGS_ENTITIES.IMAGE_KEY]: imageUrl,
        [SETTINGS_ENTITIES.IMAGE_TYPE]: imageType,
        [AUTH_ENTITIES.EMAIL]: email,
        [AUTH_ENTITIES.ID_TOKEN]: token,
        [USER_ENTITIES.USER_ID]: imageId[0], // userId
        [CHILD_ENTITIES.CHILD_ID]: imageId[1], // childId,
        [GOAL_ENTITIES.GID]: imageId[2] // goalId
      })
    }
  }

  openImagePicker = () => {
    const { handleLocalAction, localActions, email, token, imageId, imageType, autoUpload } = this.props
    var options = {
      title: 'Select',
      quality: 0.1,
      mediaType: 'photo',
      maxWidth: 200,
      maxHeight: 200,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        // console.log('User cancelled image picker')
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton)
      } else {
        if (autoUpload) {
          handleLocalAction({
            type: localActions.UPLOAD_PHOTO,
            [SETTINGS_ENTITIES.IMAGE_METADATA]: response,
            [SETTINGS_ENTITIES.IMAGE_TYPE]: imageType,
            [AUTH_ENTITIES.EMAIL]: email,
            [AUTH_ENTITIES.ID_TOKEN]: token,
            [USER_ENTITIES.USER_ID]: imageId[0], // userId
            [CHILD_ENTITIES.CHILD_ID]: imageId[1], // childId,
            [GOAL_ENTITIES.GID]: imageId[2] // goalId
          })
        } else {
          handleLocalAction({
            type: localActions.SET_IMAGE_METADATA,
            [SETTINGS_ENTITIES.IMAGE_METADATA]: response
          })
          this.setState({
            avatar: response.uri
          })
        }
      }
    })
  }

  renderAvatar (image) {
    let source = { uri: image }
    const {avatarSize, isSelected, name, imageRadius, touchFoo, showAddButton, borderWidth, bottomMargin, padding, canEdit, marked} = this.props
    if (showAddButton) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            activeOpacity={1}
            accessible
            accessibilityLabel={'Set new avatar'}
            accessibilityRole={'button'}
            style={{borderBottomLeftRadius: imageRadius, borderRadius: imageRadius, overflow: 'hidden'}} onPress={_.debounce(_.bind(() => this.openImagePicker(), this), 700, {'leading': true, 'trailing': false})}>
            <Animated.View style={{
              height: avatarSize,
              width: avatarSize,
              borderRadius: avatarSize / 2,
              backgroundColor: 'transparent'
            }}>
              <Animated.Image
                source={source}
                style={{
                  alignSelf: 'center',
                  height: '100%',
                  width: '100%',
                  borderRadius: avatarSize / 2,
                  borderWidth: borderWidth || 0,
                  borderColor: '#FFF'
                }}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View>
          { (canEdit) &&
          <View style={{opacity: isSelected ? 1 : 0.7, justifyContent: 'center', alignItems: 'center', marginHorizontal: 8}}>
            <Animated.View style={{
              padding: padding || 2.5,
              height: avatarSize,
              width: avatarSize,
              borderColor: isSelected ? '#FFF' : 'rgb(255, 208, 23)',
              borderRadius: 100,
              borderWidth: isSelected ? borderWidth : 0,
              shadowOpacity: 0.16,
              shadowColor: Colors.black,
              shadowOffset: {width: 0, height: 3}
            }}>
              <Animated.Image
                source={source}
                style={{
                  alignSelf: 'center',
                  height: '100%',
                  width: '100%',
                  borderRadius: imageRadius
                }}
              />
              <ShadowedContainer size={26} style={{position: 'absolute', bottom: -5, right: -5, borderRadius: 20}} onPress={_.debounce(_.bind(() => this.openImagePicker(), this), 700, {'leading': true, 'trailing': false})} accessible accessibilityLabel={'Open Image Picker'} accessibilityRole={'button'}>
                <Icon name='edit-3' type='feather' color={Colors.fontGray} size={11} />
              </ShadowedContainer>
            </Animated.View>
          </View> ||
          <Animated.View style={{
            height: avatarSize,
            width: avatarSize,
            borderColor: isSelected ? '#FFF' : 'rgb(255, 208, 23)',
            borderRadius: 1000,
            borderWidth,
            shadowOpacity: 0.16,
            shadowColor: Colors.black,
            shadowOffset: {width: 0, height: 3}
          }}>
            <Animated.Image
              source={source}
              style={{
                alignSelf: 'center',
                height: '100%',
                width: '100%',
                borderRadius: avatarSize / 2
              }}
            />
            {
              (marked) && <View style={{ position: 'absolute', right: 0, top: 0, height: 8, width: 8, borderRadius: 4, backgroundColor: Colors.switchOff }} />
            }
          </Animated.View>
          }
        </View>
      )
    }
  }

  renderImageButton (floating) {
    const {handleLocalAction, isSelected, borderWidth, marked, bottomMargin, touchFoo, name, localActions, email, token, imageId, imageType, autoUpload, avatarSize, showAddButton, initials, disabled} = this.props
    if (!showAddButton && initials) {
      return (
        <Animated.View disabled onPress={() => touchFoo && touchFoo()} style={{
          height: avatarSize,
          width: avatarSize,
          backgroundColor: 'transparent',
          borderRadius: 100,
          borderColor: isSelected ? '#FFF' : 'rgb(255, 208, 23)',
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          shadowOpacity: 0.16,
          shadowColor: Colors.black,
          shadowOffset: {width: 0, height: 3}
        }}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: avatarSize / 2, color: '#FFF', backgroundColor: 'transparent'}}>
            {initials}
          </Text>
          {
            (marked) && <View style={{ position: 'absolute', right: 0, top: 0, height: 8, width: 8, borderRadius: 4, backgroundColor: Colors.switchOff }} />
          }
        </Animated.View>
      )
    } else {
      if (floating) {
        return (
          <TouchableOpacity
            activeOpacity={1}
            accessible
            accessibilityLabel={'Upload new Image'}
            accessibilityRole={'button'}
            style={{position: 'absolute', bottom: -5, right: -5, borderRadius: 20}}
            onPress={_.debounce(_.bind(() => this.openImagePicker(), this), 700, {'leading': true, 'trailing': false})}>
            <Image source={require('../../../Img/dashboardIcons/dashboardAddPhoto.png')} style={{height: 30, width: 30}} />
          </TouchableOpacity>
        )
      } else {
        return (
          <TouchableOpacity
            activeOpacity={1}
            disabled={!!disabled}
            onPress={_.debounce(_.bind(() => this.openImagePicker(), this), 700, {'leading': true, 'trailing': false})}>
            <Image source={require('../../../Img/dashboardIcons/dashboardAddPhoto.png')} style={{height: avatarSize || 62, width: avatarSize || 62, opacity: 0.7}} resizeMode={'contain'} />
          </TouchableOpacity>
        )
      }
    }
  }

  renderImageContainer () {
    const {avatar} = this.state // temp holder for preview
    const {image, imageUrl} = this.props
    let avatarImage = (avatar && avatar.indexOf('file:///') > -1) ? avatar : undefined
    const imageIdentifierObject = image || avatarImage
    return (
      <View>
        {imageIdentifierObject ? this.renderAvatar(imageIdentifierObject) : this.renderImageButton()}
      </View>
    )
  }

  render () {
    return this.renderImageContainer()
  }
}

Avatar.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // custom style for avatar component
  customStyle: PropTypes.object,

  imageId: PropTypes.array,
  imageType: PropTypes.array,
  image: PropTypes.string,
  email: PropTypes.string,
  token: PropTypes.string,
  imageUrl: PropTypes.any,
  autoUpload: PropTypes.bool,

  avatarSize: PropTypes.number,
  imageRadius: PropTypes.number,
  showAddButton: PropTypes.bool,
  initials: PropTypes.string,
  name: PropTypes.string,
  isSelected: PropTypes.bool,
  // function to call when user presses the avatar image/initials
  touchFoo: PropTypes.func
}

Avatar.defaultProps = {
  autoUpload: true,
  avatarSize: 50,
  imageRadius: 25,
  showAddButton: true,
  initials: '',
  touchFoo: undefined,
  isSelected: false
}

// ========================================================
// Export
// ========================================================

export default Avatar
