/* eslint-disable no-trailing-spaces */
/**
 * Created by viktor on 31/5/17.
 */

import colors from '../../../Themes/Colors'
import fonts from '../../../Themes/Fonts'

export default {

  // Root container
  container: {
    flex: 1
  },

  // navigator header style
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

  // Top level containers
  ImageContainerArea: {
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  TitleContainer: {
    marginTop: 28,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  AddCustomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  primaryGoalsContainer: {
    marginTop: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  primaryGoal: {
    height: 120,
    marginBottom: 10
  },
  primaryGoalInnerLayerStyle: {
    borderRadius: 8,
    height: undefined,
    width: undefined,
    flex: 1
  },
  secondaryGoalContainer: {
    marginTop: 28,
    justifyContent: 'center',
    alignItems: 'center'
  },
  secondaryGoalRowContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10
  },
  secondaryGoal: {
    backgroundColor: 'rgba(1, 86, 79, 0.36)',
    borderRadius: 6,
    height: 280
  },

  // Utility styles
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
  titleStyle: {
    fontSize: 28,
    color: '#FFF',
    fontFamily: 'Helvetica',
    textAlign: 'center'
  },
  primaryGoalsContainerHeading: {
    fontSize: 14,
    fontFamily: 'helvetica',
    color: '#FFF',
    marginTop: 20,
    marginBottom: 20
  },
  primaryGoalTextStyle: {
    fontFamily: 'helvetica',
    fontSize: 22,
    color: '#FFF'
  },
  secondaryGoalHeader: {
    backgroundColor: 'transparent',
    fontFamily: 'helvetica',
    fontSize: 22,
    color: '#FFF'
  },
  secondaryGoalImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6
  },
  secondaryGoalHeading: {
    fontSize: 16,
    fontFamily: 'helvetica',
    color: '#FFF',
    backgroundColor: 'transparent',
    marginBottom: 10
  }
}
