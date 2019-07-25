/* eslint-disable no-unused-vars */
/**
 * Created by viktor on 13/8/17.
 */

import Fonts from '../../../Themes/Fonts'

export default {
  // Root Container
  container: {
    flex: 1
  },
  // Top Level containers
  topContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center'
  },
  padContainer: {
    flex: 1
  },
  bottomContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dotContainer: {
    flexDirection: 'row',
    marginTop: 16
  },
  dot: {
    height: 15,
    width: 15,
    borderRadius: 50,
    backgroundColor: '#E6E6E6',
    marginRight: 10,
    marginLeft: 10
  },
  buttonPadStyle: {
    backgroundColor: 'transparent'
  },
  buttonTextStyle: {
    fontSize: 36,
    fontFamily: Fonts.type.semibold,
    color: '#10427E'
  },
  verticalPadContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between'
  },
  horizontalPadContainer: {
    flexDirection: 'row',
    flex: 1
  },
  cubeStyle: {
    flex: 3.3,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#E6E6E6'
  },

  HeadingStyle: {
    fontSize: 16,
    backgroundColor: 'transparent',
    fontWeight: '600',
    color: '#FFF'
  },
  textStyle: {
    fontSize: 24,
    backgroundColor: 'transparent',
    color: '#FFF'
  }
}
