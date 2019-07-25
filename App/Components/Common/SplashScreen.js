/* eslint-disable no-unused-vars */

import React, { Component }
  from 'react'
import { View, Image, ImageBackground }
  from 'react-native'
import * as Constants from '../../Themes/Constants'
import Animation
  from 'lottie-react-native'
import * as Animatable
  from 'react-native-animatable'
import anim
  from '../../../assets/animationFiles/v9_3stroke.json'
import Colors from '../../Themes/Colors'

export default class SplashScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      textLoaded: false,
      loaded: false
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({textLoaded: true}, () => {
        try {
          this.refs.textView.fadeIn(700)
        } catch (e) {
          console.log('error', e)
        }
      })
      setTimeout(() => {
        try {
          this.refs.splashView.fadeOut(500).then(() => {
            this.setState({loaded: true})
          })
        } catch (e) {
          console.log('error', e)
          this.setState({loaded: true})
        }
      }, 2000)
    }, 3000)
  }
  render () {
    if (this.state.loaded) return null
    let imgWidth = Constants.screen.width - 160
    let imgHeight = imgWidth * 0.2976744186
    return (
      <Animatable.View useNativeDriver ref={'splashView'} style={{position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, backgroundColor: '#2C78F9'}}>
        <ImageBackground
          source={require('../../../Img/splashScreen/background.png')}
          style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}
        >
          <Image source={require('../../../Img/splashScreen/logo.png')} style={{height: imgHeight, width: imgWidth, backgroundColor: Colors.transparent}} />
        </ImageBackground>
      </Animatable.View>
    )
  }
}
