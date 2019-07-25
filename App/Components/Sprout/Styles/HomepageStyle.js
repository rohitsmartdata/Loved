/* eslint-disable no-trailing-spaces */
/**
 * Created by viktor on 10/7/17.
 */

import colors from '../../../Themes/Colors'
import fonts from '../../../Themes/Fonts'

export default {
  // Root Container
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Header Related Style
  headerStyle: {
    backgroundColor: colors.background,
    marginBottom: 0
  },
  headerTitleStyle: {
    color: colors.navigationTitle,
    fontWeight: fonts.weight.Semibold,
    fontSize: fonts.size.navigationTitle
  },
  headerTintColor: colors.navigationBackButton,

  // Top Level containers
  ImageContainerArea: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  AddGoalContainer: {
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  AddGoalStyle: {
  },
  ChildNameContainer: {
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  goalHeaderContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  goalComponentStyle: {
    backgroundColor: 'transparent',
    position: 'absolute'
  },
  staticCircularContainers: {
    position: 'absolute',
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(256, 256, 256, 0.4)',
    borderRadius: 100
  },
  upArrowContainer: {
    position: 'absolute',
    bottom: 16
  },

  ImageButtonContainer: {
    width: 128,
    height: 128,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1
  },
  ChildNameStyle: {
    fontSize: 16,
    backgroundColor: 'transparent',
    color: 'white'
  },
  goalHeaderNameStyle: {
    fontSize: 14,
    fontWeight: fonts.weight.Semibold,
    backgroundColor: 'transparent',
    color: '#FFF'
  },
  goalHeaderAmountStyle: {
    fontSize: 20,
    marginTop: 5,
    backgroundColor: 'transparent',
    color: '#FFF'
  }
}
