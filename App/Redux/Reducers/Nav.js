/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * Created by victorchoudhary on 04/05/17.
 */

// ========================================================
// Import Entity mapping
// ========================================================

import {Alert}
  from 'react-native'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {SETTINGS_ENTITIES}
  from '../../Utility/Mapper/Settings'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {AUTH_ENTITIES, PIN_ACTION_TYPE, PIN_COMPONENT_TYPE}
  from '../../Utility/Mapper/Auth'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {LEARN_ENTITIES}
  from '../../Utility/Mapper/Learn'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import ApplicationStyles
  from '../../Themes/ApplicationStyles'

// ========================================================
// Import Reducers
// ========================================================

import {ChildTypes}
  from './ChildReducer'
import {AuthTypes}
  from './AuthReducer'
import {GoalTypes}
  from './GoalReducer'
import {UserTypes}
  from './UserReducer'
import {SettingTypes}
  from './SettingReducer'
import {OnboardingTypes}
  from './OnboardingReducer'
import {InvestmentTypes}
  from './InvestmentReducer'

export function nav (state = {}, action) {
  switch (action.type) {

    case AuthTypes.NAVIGATE: {
      if (action[AUTH_ENTITIES.AUTH_TYPE]) {
        let screen = (action[AUTH_ENTITIES.AUTH_TYPE] === AUTH_ENTITIES.SIGNUP) ? SPROUT.AUTHENTICATION_SCREEN : SPROUT.LOGIN
        let navigator = action[COMMON_ENTITIES.NAVIGATOR]
        navigator.push({
          screen,
          navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
          passProps: {
            [AUTH_ENTITIES.AUTH_TYPE]: action[AUTH_ENTITIES.AUTH_TYPE]
          }
        })
      } else {
        let navigator = action[COMMON_ENTITIES.NAVIGATOR]
        navigator.push({
          screen: SPROUT.AUTHENTICATION_SCREEN,
          navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
          passProps: {
            [AUTH_ENTITIES.EMAIL]: action[AUTH_ENTITIES.EMAIL]
          }
        })
      }
    }
      break

    case AuthTypes.NAVIGATE_TO_SIGNUP: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.AUTHENTICATION_SCREEN,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [AUTH_ENTITIES.EMAIL]: action[AUTH_ENTITIES.EMAIL]
        }
      })
    }
      break

    case UserTypes.POP_SCREEN: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.pop()
    }
      break

    case AuthTypes.PROMPT_AUTH: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.dismissModal()
      navigator.resetTo({
        screen: SPROUT.AUTH_SELECTOR_SCREEN,
        backButtonTitle: '',
        animated: true,
        animationType: 'fade',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#2948FF'}
      })
    }
      break

    case AuthTypes.SIGNUP_SUCCESS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]

      navigator.resetTo({
        screen: SPROUT.USER_INPUT_DETAIL_1,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [USER_ENTITIES.USER_ID]: action[USER_ENTITIES.USER_ID]
        }
      })
    }
      break

    case ChildTypes.SUBMIT_CHILD_SSN: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.SELECT_GOAL_SCREEN,
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [CHILD_ENTITIES.FIRST_NAME]: action[CHILD_ENTITIES.FIRST_NAME],
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [COMMON_ENTITIES.CAN_POP]: false
        }
      })
    }
      break

    case GoalTypes.NOTIFY_RISK_ASSESSMENT: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.RISK_NOTIFICATION,
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.NAME]: action[GOAL_ENTITIES.NAME],
          [GOAL_ENTITIES.PORTFOLIO_RISK]: action[GOAL_ENTITIES.PORTFOLIO_RISK],
          [GOAL_ENTITIES.DURATION]: action[GOAL_ENTITIES.DURATION],
          [GOAL_ENTITIES.GOAL_AMOUNT]: action[GOAL_ENTITIES.GOAL_AMOUNT],
          [GOAL_ENTITIES.RECURRING_AMOUNT]: action[GOAL_ENTITIES.RECURRING_AMOUNT],
          [GOAL_ENTITIES.RECURRING_FREQUENCY]: action[GOAL_ENTITIES.RECURRING_FREQUENCY],
          [USER_ENTITIES.IS_PLAID_LINKED]: action[USER_ENTITIES.IS_PLAID_LINKED],
          [GOAL_ENTITIES.SUGGESTED_RISK]: action[GOAL_ENTITIES.SUGGESTED_RISK]
        }
      })
    }
      break

    case ChildTypes.CONFIRM_CHILD_SSN: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.CHILD_SSN_SCREEN,
        title: 'Taking their first steps',
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [USER_ENTITIES.USER_ID]: action[USER_ENTITIES.USER_ID],
          [CHILD_ENTITIES.FIRST_NAME]: action[CHILD_ENTITIES.FIRST_NAME],
          [CHILD_ENTITIES.LAST_NAME]: action[CHILD_ENTITIES.LAST_NAME],
          [CHILD_ENTITIES.DOB]: action[CHILD_ENTITIES.DOB],
          [USER_ENTITIES.IDENTITY_DATA]: action[USER_ENTITIES.IDENTITY_DATA],
          [CHILD_ENTITIES.IS_ADDING_DREAM]: action[CHILD_ENTITIES.IS_ADDING_DREAM],
          [CHILD_ENTITIES.IS_ADDING_DESIRE]: action[CHILD_ENTITIES.IS_ADDING_DESIRE]
        }
      })
    }
      break

    case ChildTypes.NAVIGATE_TO_CHILD_SSN: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.CHILD_SSN_SCREEN,
        title: 'Taking their first steps',
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [USER_ENTITIES.USER_ID]: action[USER_ENTITIES.USER_ID],
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [CHILD_ENTITIES.IS_ADDING_DESIRE]: action[CHILD_ENTITIES.IS_ADDING_DESIRE],
          [CHILD_ENTITIES.IS_ADDING_DREAM]: action[CHILD_ENTITIES.IS_ADDING_DREAM],
          [COMMON_ENTITIES.CAN_POP]: true,
          [COMMON_ENTITIES.IS_ONBOARDING_FLOW]: true
        }
      })
    }
      break

    case GoalTypes.GOAL_TYPE_SELECTED: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.ADD_GOAL_SCREEN,
        title: 'Set a new goal',
        backButtonTitle: '',
        navigatorStyle: ApplicationStyles.header.containerStyle,
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID]
        }
      })
    }
      break

    case GoalTypes.ADD_CUSTOM_GOAL_SUCCESS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let title = action[COMMON_ENTITIES.NAVIGATOR_TITLE]
      let riskSelected = action[GOAL_ENTITIES.RISK_SELECTED]

      navigator.resetTo({
        screen: SPROUT.SELECT_RISK_SCREEN,
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID],
          [COMMON_ENTITIES.NAVIGATOR_TITLE]: title
        }
      })
    }
      break

    case GoalTypes.GOAL_SELECTED: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.GOAL_AMOUNT_SCREEN,
        title: action[GOAL_ENTITIES.NAME],
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [COMMON_ENTITIES.CAN_POP]: true
        }
      })
    }
      break

    case GoalTypes.GOAL_DURATION_SELECTION_NEEDED: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let title = action[COMMON_ENTITIES.NAVIGATOR_TITLE]
      navigator.push({
        screen: SPROUT.GOAL_DURATION_SELECTION_SCREEN,
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID],
          [COMMON_ENTITIES.NAVIGATOR_TITLE]: title,
          [GOAL_ENTITIES.GOAL_DURATION_TYPE]: action[GOAL_ENTITIES.GOAL_DURATION_TYPE]
        }
      })
    }
      break

    case GoalTypes.GOAL_DURATION_SELECTED: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let title = action[COMMON_ENTITIES.NAVIGATOR_TITLE]

      navigator.push({
        screen: SPROUT.COST_EXPECTED,
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID],
          [COMMON_ENTITIES.NAVIGATOR_TITLE]: title
        }
      })
    }
      break

    case GoalTypes.SELECT_RISK: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let title = action[COMMON_ENTITIES.NAVIGATOR_TITLE]

      navigator.push({
        screen: SPROUT.PORTFOLIO_DETAIL,
        title: '',
        backButtonTitle: '',
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID],
          [COMMON_ENTITIES.NAVIGATOR_TITLE]: title
        }
      })
    }
      break
    case GoalTypes.HIDE_RISK: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.dismissModal()
    }
      break

    case GoalTypes.ADD_RISK: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let title = action[COMMON_ENTITIES.NAVIGATOR_TITLE]
      navigator.push({
        screen: SPROUT.GOAL_AMOUNT_SCREEN,
        title: title,
        backButtonTitle: '',
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID],
          [COMMON_ENTITIES.NAVIGATOR_TITLE]: title,
          [COMMON_ENTITIES.CAN_POP]: true
        }
      })
    }
      break

    case GoalTypes.COST_EXPECTED_SELECTED: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let title = action[COMMON_ENTITIES.NAVIGATOR_TITLE]
      navigator.push({
        screen: SPROUT.SELECT_RISK_SCREEN,
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID],
          [COMMON_ENTITIES.NAVIGATOR_TITLE]: title
        }
      })
    }
      break

    case GoalTypes.CUSTOMIZE_PORTFOLIO: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let title = action[COMMON_ENTITIES.NAVIGATOR_TITLE]
      navigator.showModal({
        screen: SPROUT.SELECT_RISK_SCREEN,
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {}
      })
    }
      break

    case GoalTypes.TRANSFER_SUCCESS: {
      // let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      // navigator.resetTo({
      //   screen: SPROUT.CHILD_HOMEPAGE_CONTAINER_SCREEN,
      //   animation: true,
      //   animationType: 'fade',
      //   navigatorStyle: ApplicationStyles.hiddenNavbar,
      //   passProps: {
      //     [USER_ENTITIES.SHOULD_REFRESH]: true
      //   }
      // })
    }
      break

    case GoalTypes.GOAL_AMOUNT_SELECTED: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let title = action[COMMON_ENTITIES.NAVIGATOR_TITLE]

      navigator.push({
        screen: SPROUT.RECURRING_AMOUNT_SCREEN,
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID],
          [COMMON_ENTITIES.NAVIGATOR_TITLE]: title
        }
      })
    }
      break

    case GoalTypes.SHOW_INVEST: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.showLightBox({
        screen: SPROUT.INVEST,
        passProps: {
          [USER_ENTITIES.USER_ID]: action[USER_ENTITIES.USER_ID],
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID],
          [GOAL_ENTITIES.RECURRING_AMOUNT]: action[GOAL_ENTITIES.RECURRING_AMOUNT],
          [GOAL_ENTITIES.RECURRING_FREQUENCY]: action[GOAL_ENTITIES.RECURRING_FREQUENCY],
          [COMMON_ENTITIES.PARENT_NAVIGATOR]: navigator,
          [COMMON_ENTITIES.IS_STALE]: false
        },
        style: {
          backgroundBlur: 'light',
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }
      })
    }
      break

    case GoalTypes.HIDE_INVEST: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.dismissLightBox()
    }
      break

    case AuthTypes.LOGIN_SUCCESS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let isPasscodeLogin = action[AUTH_ENTITIES.IS_PASSCODE_LOGIN]
      let pinActionType = PIN_ACTION_TYPE.ON_BOARDING
      let goToHomepage = true
      if (!isPasscodeLogin) {
        navigator.resetTo({
          screen: SPROUT.LOGIN_PIN,
          title: '',
          backButtonTitle: '',
          navigatorStyle: {...ApplicationStyles.hiddenNavbar},
          passProps: {
            [AUTH_ENTITIES.PIN_COMPONENT_TYPE]: PIN_COMPONENT_TYPE.CREATE,
            [AUTH_ENTITIES.PIN_ACTION_TYPE]: pinActionType,
            [AUTH_ENTITIES.GO_TO_HOMEPAGE]: goToHomepage,
            titles: {
              [PIN_COMPONENT_TYPE.CREATE]: 'Create PIN',
              [PIN_COMPONENT_TYPE.CONFIRM]: 'Re-enter PIN'
            }
          }
        })
      }
    }
      break

    case SettingTypes.SHOW_ABOUT_US: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.ABOUT_US,
        title: '',
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar}
      })
    }
      break

    case AuthTypes.PASSCODE_LOGIN_SUCCESS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.resetTo({
        screen: SPROUT.CHILD_HOMEPAGE_CONTAINER_SCREEN,
        title: '',
        backButtonTitle: '',
        animated: true,
        animationType: 'fade',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#2948FF'}
      })
    }
      break

    case SettingTypes.NAVIGATE_TO_BROKER_DEALER_INFO: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.BROKER_DEALER_PAGE,
        title: '',
        backButtonTitle: '',
        navigatorStyle: ApplicationStyles.hiddenNavbar
      })
    }
      break

    case ChildTypes.SHOW_BROKER_DEALER_CHILD_INFO: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let childID = action[CHILD_ENTITIES.CHILD_ID]
      navigator.push({
        screen: SPROUT.CHILD_INFO_PAGE,
        title: '',
        backButtonTitle: '',
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID]
        }
      })
    }
      break

    case InvestmentTypes.ADD_NEW_INVESTMENT: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.showModal({
        screen: SPROUT.LI_SELECT_INVESTMENT,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          closeModal: true
        }
      })
    }
      break

    case ChildTypes.ADD_NEW_GOAL: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.showModal({
        screen: SPROUT.LI_SELECT_INVESTMENT,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          closeModal: true,
          initiateGoal: true
        }
      })
    }
      break

    // case ChildTypes.ADD_CHILD_SUCCESS: {
    //   let navigator = action[COMMON_ENTITIES.NAVIGATOR]
    //   const isAddingDesire = action[CHILD_ENTITIES.IS_ADDING_DESIRE] || false
    //   const isAddingDream = action[CHILD_ENTITIES.IS_ADDING_DREAM] || false
    //   if (isAddingDream) {
    //     navigator.resetTo({
    //       screen: SPROUT.INVEST_AMOUNT,
    //       title: '',
    //       backButtonTitle: '',
    //       animated: true,
    //       animationType: 'fade',
    //       navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF', statusBarTextColorScheme: 'light'},
    //       passProps: {
    //         [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
    //         [COMMON_ENTITIES.CAN_POP]: false
    //       }
    //     })
    //   } else if (isAddingDesire) {
    //     navigator.resetTo({
    //       screen: SPROUT.GOAL_AMOUNT_SCREEN,
    //       title: action[GOAL_ENTITIES.NAME],
    //       backButtonTitle: '',
    //       animated: true,
    //       animationType: 'fade',
    //       navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF', statusBarTextColorScheme: 'light'},
    //       passProps: {
    //         [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
    //         [COMMON_ENTITIES.CAN_POP]: false
    //       }
    //     })
    //   } else {
    //     navigator.resetTo({
    //       screen: SPROUT.ADD_INVESTMENT,
    //       animated: true,
    //       animationType: 'fade',
    //       navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF', statusBarTextColorScheme: 'light'},
    //       passProps: {
    //         [CHILD_ENTITIES.FIRST_NAME]: action[CHILD_ENTITIES.FIRST_NAME],
    //         [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
    //         [COMMON_ENTITIES.CAN_POP]: false,
    //         'isAddingNewDream': true
    //       }
    //     })
    //   }
    // }
    //   break

    case ChildTypes.ADD_CHILD_SUCCESS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      const isAddingDesire = action[CHILD_ENTITIES.IS_ADDING_DESIRE] || false
      const isAddingDream = action[CHILD_ENTITIES.IS_ADDING_DREAM] || false
      const isSSNAdded = action[USER_ENTITIES.IS_SSN_ADDED] || false
      const isOnBoardingFlow = action[COMMON_ENTITIES.IS_ONBOARDING_FLOW] || false

      if (isOnBoardingFlow) {
        navigator.resetTo({
          screen: SPROUT.IDENTITY_VERIFICATION,
          title: '',
          navigatorStyle: {...ApplicationStyles.hiddenNavbar},
          passProps: {
            [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
            [CHILD_ENTITIES.IS_ADDING_DESIRE]: action[CHILD_ENTITIES.IS_ADDING_DESIRE],
            [CHILD_ENTITIES.IS_ADDING_DREAM]: action[CHILD_ENTITIES.IS_ADDING_DREAM],
            [COMMON_ENTITIES.CAN_POP]: false
          }
        })
      } else {
        if (isSSNAdded) {
          navigator.resetTo({
            screen: SPROUT.CHILD_SSN_SCREEN,
            title: 'Taking their first steps',
            navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
            passProps: {
              [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
              [CHILD_ENTITIES.IS_ADDING_DESIRE]: action[CHILD_ENTITIES.IS_ADDING_DESIRE],
              [CHILD_ENTITIES.IS_ADDING_DREAM]: action[CHILD_ENTITIES.IS_ADDING_DREAM],
              [COMMON_ENTITIES.CAN_POP]: false
            }
          })
        } else {
          navigator.resetTo({
            screen: SPROUT.USER_SSN,
            title: '',
            backButtonTitle: '',
            navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
            passProps: {
              [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
              [CHILD_ENTITIES.IS_ADDING_DREAM]: isAddingDream,
              [CHILD_ENTITIES.IS_ADDING_DESIRE]: isAddingDesire,
              [COMMON_ENTITIES.CAN_POP]: false
            }
          })
        }
      }
    }
      break

    case ChildTypes.NAVIGATE_TO_IDENTITY_ADDRESS_SCREEN: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      const isAddingDesire = action[CHILD_ENTITIES.IS_ADDING_DESIRE] || false
      const isAddingDream = action[CHILD_ENTITIES.IS_ADDING_DREAM] || false
      navigator.push({
        screen: SPROUT.USER_INPUT_DETAIL_3,
        title: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [CHILD_ENTITIES.IS_ADDING_DESIRE]: isAddingDesire,
          [CHILD_ENTITIES.IS_ADDING_DREAM]: isAddingDream,
          [COMMON_ENTITIES.CAN_POP]: false
        }
      })
    }
      break

    case ChildTypes.NAVIGATE_TO_USER_SSN_SCREEN: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      const isAddingDesire = action[CHILD_ENTITIES.IS_ADDING_DESIRE] || false
      const isAddingDream = action[CHILD_ENTITIES.IS_ADDING_DREAM] || false
      navigator.push({
        screen: SPROUT.USER_SSN,
        title: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [CHILD_ENTITIES.IS_ADDING_DESIRE]: isAddingDesire,
          [CHILD_ENTITIES.IS_ADDING_DREAM]: isAddingDream,
          [COMMON_ENTITIES.CAN_POP]: false
        }
      })
    }
      break

    case ChildTypes.NAVIGATE_TO_INPUT_MANUAL_ADDRESS_SCREEN: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      const isAddingDesire = action[CHILD_ENTITIES.IS_ADDING_DESIRE] || false
      const isAddingDream = action[CHILD_ENTITIES.IS_ADDING_DREAM] || false
      const addressData = action['addressData'] || false

      navigator.push({
        screen: SPROUT.USER_INPUT_MANUAL_ADDRESS,
        title: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [CHILD_ENTITIES.IS_ADDING_DESIRE]: isAddingDesire,
          [CHILD_ENTITIES.IS_ADDING_DREAM]: isAddingDream,
          addressData,
          [COMMON_ENTITIES.CAN_POP]: false
        }
      })
    }
      break

    case ChildTypes.SUBMIT_CHILD_ACCOUNT_SUCCESS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let nextScreen = action[COMMON_ENTITIES.IS_ONBOARDING_FLOW] ? SPROUT.CONFIRM_PUSH_NOTIFICATION : SPROUT.LI_SELECT_INVESTMENT
      navigator.resetTo({
        screen: nextScreen,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [COMMON_ENTITIES.IS_ONBOARDING_FLOW]: action[COMMON_ENTITIES.IS_ONBOARDING_FLOW] || false
        }
      })
    }
      break

    case ChildTypes.AUTO_NAVIGATE_ONBOARDING: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let nextScreen = SPROUT.CONFIRM_PUSH_NOTIFICATION
      navigator.push({
        screen: nextScreen,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [COMMON_ENTITIES.IS_ONBOARDING_FLOW]: action[COMMON_ENTITIES.IS_ONBOARDING_FLOW] || false
        }
      })
    }
      break

    case ChildTypes.NAVIGATE_TO_CHILD_INVESTING: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      // navigator.resetTo({
      //   screen: SPROUT.CHILD_INVESTING,
      //   navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF', statusBarTextColorScheme: 'light'},
      //   passProps: {
      //     [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
      //     [COMMON_ENTITIES.IS_ONBOARDING_FLOW]: true
      //   }
      // })
      navigator.resetTo({
        screen: SPROUT.LI_SELECT_INVESTMENT,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [COMMON_ENTITIES.IS_ONBOARDING_FLOW]: true
        }
      })
    }
      break

    case InvestmentTypes.SELECT_INVESTMENT: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.LI_SELECT_INVESTMENT,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID]
        }
      })
    }
      break

    case InvestmentTypes.SHOW_INVESTMENT_DETAIL: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.LI_SHOW_INVESTMENT_DETAIL,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#2948FF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [INVESTMENT_ENTITIES.INVESTMENT_ID]: action[INVESTMENT_ENTITIES.INVESTMENT_ID]
        }
      })
    }
      break

    case InvestmentTypes.SHOW_INVESTMENT_FUND: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]

      navigator.push({
        screen: SPROUT.LI_SHOW_INVESTMENT_FUND,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID] || undefined
        }
      })
    }
      break

    case GoalTypes.SELECT_GOAL: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.LI_SELECT_GOAL,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID]
        }
      })
    }
      break

    case GoalTypes.SELECT_GOAL_AMOUNT: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.LI_SELECT_GOAL_AMOUNT,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#2948FF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID]
        }
      })
    }
      break

    case GoalTypes.PREPARE_INVESTMENT: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.LI_PREPARE_INVESTMENT,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID]
        }
      })
    }
      break

    case GoalTypes.SELECT_START_INVESTING: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      // navigator.push({
      //   screen: SPROUT.LI_START_INVESTING,
      //   navigatorStyle: {...ApplicationStyles.hiddenNavbar, statusBarTextColorScheme: 'light'},
      //   passProps: {
      //     [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID]
      //   }
      // })
      navigator.push({
        screen: SPROUT.LI_SELECT_INVESTMENT,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID]
        }
      })
    }
      break

    case GoalTypes.SELECT_GOAL_DURATION: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.LI_SELECT_GOAL_DURATION,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID]
        }
      })
    }
      break

    case GoalTypes.SELECT_GOAL_PORTFOLIO: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.LI_SELECT_GOAL_PORTFOLIO,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID]
        }
      })
    }
      break

    case GoalTypes.SELECT_GOAL_FUND: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.LI_SELECT_GOAL_FUND,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID]
        }
      })
    }
      break

    case GoalTypes.CONFIRM_GOAL: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.LI_CONFIRM_GOAL,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [INVESTMENT_ENTITIES.IS_INVESTMENT]: action[INVESTMENT_ENTITIES.IS_INVESTMENT],
          [GOAL_ENTITIES.GOAL_DATA]: action[GOAL_ENTITIES.GOAL_DATA]
        }
      })
    }
      break

    case ChildTypes.SHOW_GOAL: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.showModal({
        screen: SPROUT.LI_GOAL_DETAIL,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID]
        }
      })
    }
      break

    case GoalTypes.NAVIGATE_TO_WITHDRAW: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]

      navigator.push({
        screen: SPROUT.WITHDRAW,
        title: '',
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID],
          [CHILD_ENTITIES.FIRST_NAME]: action[CHILD_ENTITIES.FIRST_NAME],
          [GOAL_ENTITIES.NAME]: action[GOAL_ENTITIES.NAME],
          [GOAL_ENTITIES.BALANCE]: action[GOAL_ENTITIES.BALANCE]
        }
      })
    }
      break

    // case GoalTypes.WITHDRAW_SUCCESS: {
    //   let navigator = action[COMMON_ENTITIES.NAVIGATOR]
    //   Alert.alert('Withdraw Success', 'Your request has been put successfully.', [
    //     {text: 'OK', onPress: () => navigator.pop()}
    //   ])
    // }
    //   break

    // case GoalTypes.WITHDRAW_FAILURE: {
    //   let navigator = action[COMMON_ENTITIES.NAVIGATOR]
    //   Alert.alert('Withdraw Failure', 'Please try later.')
    // }
    //   break

    case InvestmentTypes.SHOW_INVESTMENT: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.showModal({
        screen: SPROUT.LI_SHOW_INVESTMENT_DETAIL,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [INVESTMENT_ENTITIES.INVESTMENT_ID]: action[INVESTMENT_ENTITIES.INVESTMENT_ID],
          closeModal: true
        }
      })
    }
      break

    case InvestmentTypes.BUY_INVESTMENT: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.LI_BUY,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID]
        }
      })
    }
      break

    case InvestmentTypes.SELL_INVESTMENT: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.LI_SELL,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID]
        }
      })
    }
      break

    case InvestmentTypes.UPDATE_RECURRING: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.LI_EDIT_RECURRING,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID]
        }
      })
    }
      break

    case InvestmentTypes.UPDATE_GOAL: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.LI_EDIT_GOAL,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID]
        }
      })
    }
      break

    case ChildTypes.SHOW_CHILD: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.CHILD_VIEW_SCREEN,
        title: '',
        backButtonTitle: '',
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID]
        }
      })
    }
      break

    case ChildTypes.POP_CHILD_VIEW: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.pop()
    }
      break

    case ChildTypes.HIDE_GOAL: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.dismissModal()
    }
      break
    case GoalTypes.NAVIGATE_TO_EDIT_GOAL: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.NAVIGATE_TO_EDIT_GOAL,
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID]
        }
      })
    }
      break

    case GoalTypes.INVEST_ON_GOAL: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]

      navigator.push({
        screen: SPROUT.RECURRING_AMOUNT_SCREEN,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, backgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID],
          [GOAL_ENTITIES.IS_ONE_OFF_INVESTMENT_ONLY]: true,
          [GOAL_ENTITIES.NAME]: action[GOAL_ENTITIES.NAME]
        }
      })
    }
      break

    case GoalTypes.NAVIGATE_TO_EDIT_RECURRING_AMOUNT: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.EDIT_RECURRING_AMOUNT,
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID]
        }
      })
    }
      break

    case GoalTypes.SHOW_DISCLAIMER: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.DISCLAIMER,
        title: '',
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, backgroundColor: '#FFF'},
        animated: true,
        animationType: 'fade'
      })
    }
      break

    case UserTypes.NAVIGATE_TO_DASHBOARD: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.resetTo({
        screen: SPROUT.CHILD_HOMEPAGE_CONTAINER_SCREEN,
        title: 'Loved Wealth',
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#2948FF'},
        animated: true,
        animationType: 'fade',
        passProps: {
          [USER_ENTITIES.SHOULD_REFRESH]: true
        }
      })
    }
      break

    case ChildTypes.NAVIGATE_TO_REQUEST_SSN_SCREEN: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.SSN_REQUEST_CONTACT,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [USER_ENTITIES.SSN]: action[USER_ENTITIES.SSN],
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [CHILD_ENTITIES.SHOULD_STORE_USER_SSN]: action[CHILD_ENTITIES.SHOULD_STORE_USER_SSN] || true
        }
      })
    }
      break

    case UserTypes.STORE_USER_SSN_SUCCESS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      if (navigator) {
        navigator.resetTo({
          screen: SPROUT.CHILD_SSN_SCREEN,
          navigatorStyle: {...ApplicationStyles.hiddenNavbar},
          animated: true,
          animationType: 'fade',
          passProps: {
            [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
            [COMMON_ENTITIES.IS_ONBOARDING_FLOW]: action[COMMON_ENTITIES.IS_ONBOARDING_FLOW]
          }
        })
      }
    }
      break

    case UserTypes.MARK_SSN_REQUEST_SUCCESS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let isOnboardingFlow = action[COMMON_ENTITIES.IS_ONBOARDING_FLOW]

      if (!isOnboardingFlow) {
        navigator.resetTo({
          screen: SPROUT.LI_SELECT_INVESTMENT,
          navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
          passProps: {
            [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
            [COMMON_ENTITIES.IS_ONBOARDING_FLOW]: false
          }
        })
      }
    }
      break

    case GoalTypes.NAVIGATE_TO_HOMEPAGE: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let childID = action[CHILD_ENTITIES.CHILD_ID]
      let shouldRefresh = action[USER_ENTITIES.SHOULD_REFRESH] === undefined ? true : action[USER_ENTITIES.SHOULD_REFRESH]
      navigator.resetTo({
        screen: SPROUT.CHILD_HOMEPAGE_CONTAINER_SCREEN,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#2948FF'},
        animated: true,
        animationType: 'fade',
        passProps: {
          [USER_ENTITIES.SHOULD_REFRESH]: shouldRefresh,
          [CHILD_ENTITIES.CHILD_ID]: childID
        }
      })
    }
      break

    case GoalTypes.NAVIGATE_TO_ACTION_SCREEN: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let childID = action[CHILD_ENTITIES.CHILD_ID]
      navigator.resetTo({
        screen: SPROUT.ACTION_SCREEN,
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        animated: true,
        animationType: 'fade',
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: childID
        }
      })
    }
      break

    case SettingTypes.SHOW_WEB_WINDOW: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.WEB_WINDOW,
        title: 'Loved Wealth',
        backButtonTitle: '',
        statusBarHidden: true,
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        animated: true,
        animationType: 'fade',
        passProps: {
          [SETTINGS_ENTITIES.URL]: action[SETTINGS_ENTITIES.URL],
          [SETTINGS_ENTITIES.HEADING]: action[SETTINGS_ENTITIES.HEADING]
        }
      })
    }
      break

    case GoalTypes.SKIP_GOAL: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.resetTo({
        screen: SPROUT.CHILD_HOMEPAGE_CONTAINER_SCREEN,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#2948FF'},
        animated: true,
        animationType: 'fade',
        passProps: {
          [USER_ENTITIES.SHOULD_REFRESH]: true
        }
      })
    }
      break

    case ChildTypes.ADD_NEW_CHILD: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.ADD_CHILD_SCREEN,
        title: 'Taking their first steps',
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, backgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.IS_ADDING_DREAM]: action[CHILD_ENTITIES.IS_ADDING_DREAM],
          [CHILD_ENTITIES.IS_ADDING_DESIRE]: action[CHILD_ENTITIES.IS_ADDING_DESIRE],
          [CHILD_ENTITIES.SHOULD_UPDATE_ONBOARDING]: action[CHILD_ENTITIES.SHOULD_UPDATE_ONBOARDING],
          [COMMON_ENTITIES.IS_ONBOARDING_FLOW]: action[COMMON_ENTITIES.IS_ONBOARDING_FLOW]
        }
      })
    }
      break

    case UserTypes.NAVIGATE_TODO: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let screen = action[COMMON_ENTITIES.SCREEN_TYPE]
      navigator.push({
        screen: screen,
        title: 'new title',
        backButtonTitle: '',
        navigatorStyle: ApplicationStyles.header.containerStyle,
        passProps: {
          [USER_ENTITIES.USER_ID]: action[USER_ENTITIES.USER_ID]
        }
      })
    }
      break

    case UserTypes.SELECT_BANK_ACCOUNT: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let screen = action[COMMON_ENTITIES.SCREEN_TYPE]
      navigator.push({
        screen: screen,
        title: '',
        backButtonTitle: '',
        navigatorStyle: ApplicationStyles.hiddenNavbar
      })
    }
      break

    case ChildTypes.NOTIFY_AGE_LIMITATION: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.CHILD_AGE_LIMITATION,
        title: 'Error',
        backButtonTitle: '',
        navigatorStyle: ApplicationStyles.hiddenNavbar
      })
    }
      break

    case ChildTypes.ADD_CHILD_BIRTH_DATE: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.ADD_CHILD_BIRTH_DATE,
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [CHILD_ENTITIES.FIRST_NAME]: action[CHILD_ENTITIES.FIRST_NAME],
          [CHILD_ENTITIES.LAST_NAME]: action[CHILD_ENTITIES.LAST_NAME],
          [CHILD_ENTITIES.IMAGE_META_DATA]: action[CHILD_ENTITIES.IMAGE_META_DATA],
          [CHILD_ENTITIES.SHOULD_UPDATE_ONBOARDING]: action[COMMON_ENTITIES.IS_ONBOARDING_FLOW],
          [COMMON_ENTITIES.IS_ONBOARDING_FLOW]: action[COMMON_ENTITIES.IS_ONBOARDING_FLOW]
        }
      })
    }
      break

    case UserTypes.NAVIGATE_TO_AGREEMENT: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.ACCEPT_TERMS_CONDITIONS,
        title: 'Your Account',
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'}
      })
    }
      break

    case UserTypes.NAVIGATE_TO_AMOUNT_VERIFICATION_SCREEN: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let screen = action[COMMON_ENTITIES.SCREEN_TYPE]
      navigator.push({
        screen: screen,
        title: 'Your Account',
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'}
      })
    }
      break

    case UserTypes.AGREE_TC: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.resetTo({
        screen: SPROUT.CREATE_CHILD_NOTIFICATION,
        title: '',
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#2948FF'}
      })
    }
      break

    case UserTypes.DISAGREE_TC: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.dismissModal({
        animationType: 'slide-down'
      })
    }
      break

    case UserTypes.CLOSE_TC: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.dismissModal({
        animationType: 'slide-down'
      })
    }
      break

    case UserTypes.DISMISS_ALL_MODEL: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.dismissAllModals()
    }
      break

    case UserTypes.SET_PASSCODE: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let pinActionType = action[AUTH_ENTITIES.PIN_ACTION_TYPE] || PIN_ACTION_TYPE.ON_BOARDING
      let goToHomepage = action[AUTH_ENTITIES.GO_TO_HOMEPAGE] || false

      if (pinActionType === PIN_ACTION_TYPE.ON_BOARDING) {
        navigator.push({
          screen: SPROUT.LOGIN_PIN,
          title: '',
          backButtonTitle: '',
          navigatorStyle: {...ApplicationStyles.hiddenNavbar},
          passProps: {
            [AUTH_ENTITIES.PIN_COMPONENT_TYPE]: PIN_COMPONENT_TYPE.CREATE,
            [AUTH_ENTITIES.PIN_ACTION_TYPE]: pinActionType,
            [AUTH_ENTITIES.GO_TO_HOMEPAGE]: goToHomepage,
            navigationPresent: true,
            titles: {
              [PIN_COMPONENT_TYPE.CREATE]: 'Create PIN',
              [PIN_COMPONENT_TYPE.CONFIRM]: 'Re-enter PIN'
            }
          }
        })
      } else {
        navigator.push({
          screen: SPROUT.LOGIN_PIN,
          title: '',
          backButtonTitle: '',
          navigatorStyle: ApplicationStyles.header.containerStyle,
          passProps: {
            [AUTH_ENTITIES.PIN_COMPONENT_TYPE]: PIN_COMPONENT_TYPE.CREATE,
            [AUTH_ENTITIES.PIN_ACTION_TYPE]: pinActionType,
            [AUTH_ENTITIES.GO_TO_HOMEPAGE]: goToHomepage,
            titles: {
              [PIN_COMPONENT_TYPE.CREATE]: 'Create PIN',
              [PIN_COMPONENT_TYPE.CONFIRM]: 'Re-enter PIN'
            }
          }
        })
      }
    }
      break

    case AuthTypes.REGISTER_PIN_SUCCESS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let pinActionType = action[AUTH_ENTITIES.PIN_ACTION_TYPE]
      const goToHomepage = action[AUTH_ENTITIES.GO_TO_HOMEPAGE] || false
      if (goToHomepage) {
        navigator.resetTo({
          screen: SPROUT.CHILD_HOMEPAGE_CONTAINER_SCREEN,
          title: 'Loved Wealth',
          backButtonTitle: '',
          navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#2948FF'},
          animated: true,
          animationType: 'fade',
          passProps: {
            [USER_ENTITIES.SHOULD_REFRESH]: true
          }
        })
      } else {
        switch (pinActionType) {
          case PIN_ACTION_TYPE.ON_BOARDING:
            navigator.push({
              screen: SPROUT.CONFIRM_INVESTOR_PROFILE,
              title: '',
              backButtonTitle: '',
              navigatorStyle: {...ApplicationStyles.hiddenNavbar}
            })
            break
          case PIN_ACTION_TYPE.RESET_PASSWORD:
            navigator.pop()
            break
          case PIN_ACTION_TYPE.SET_NEW_PIN:
            navigator.pop()
            break
        }
      }
    }
      break

    case UserTypes.NAVIGATE_USER_DETAIL_INPUT: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let residencyType = action[USER_ENTITIES.RESIDENCY_TYPE] || undefined
      let screenType = action[COMMON_ENTITIES.SCREEN_TYPE]
      let canPop = action[COMMON_ENTITIES.CAN_POP]
      let isDecleration = screenType === SPROUT.USER_INPUT_DETAIL_9
      navigator.push({
        screen: action[COMMON_ENTITIES.SCREEN_TYPE],
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        title: isDecleration ? 'Your Account' : '',
        passProps: {
          [USER_ENTITIES.RESIDENCY_TYPE]: residencyType,
          [COMMON_ENTITIES.CAN_POP]: canPop
        }
      })
    }
      break

    case UserTypes.INITIATE_PLAID: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.PLAID_CONNECT,
        title: '',
        backButtonTitle: '',
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID],
          [COMMON_ENTITIES.PARENT_NAVIGATOR]: navigator
        }
      })
    }
      break

    case GoalTypes.NAVIGATE_TO_TRANSFER_SCREEN: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      const showBankLinked = action[COMMON_ENTITIES.SHOW_BANK_LINKED] || false
      navigator.resetTo({
        screen: SPROUT.INVEST_UNDERWAY,
        title: '',
        backButtonTitle: '',
        animated: true,
        animationType: 'fade',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID],
          [GOAL_ENTITIES.NAME]: action[GOAL_ENTITIES.NAME],
          [GOAL_ENTITIES.RECURRING_AMOUNT]: action[GOAL_ENTITIES.RECURRING_AMOUNT],
          [GOAL_ENTITIES.IS_WITHDRAW]: action[GOAL_ENTITIES.IS_WITHDRAW],
          [COMMON_ENTITIES.SHOW_BANK_LINKED]: showBankLinked
        }
      })
    }
      break

    case GoalTypes.CONFIRM_BANK_CONNECTION: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.resetTo({
        screen: SPROUT.INVEST_READY,
        title: '',
        animated: true,
        animationType: 'fade',
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID],
          [GOAL_ENTITIES.NAME]: action[GOAL_ENTITIES.NAME],
          [GOAL_ENTITIES.RECURRING_AMOUNT]: action[GOAL_ENTITIES.RECURRING_AMOUNT],
          [INVESTMENT_ENTITIES.IS_INVESTMENT]: action[INVESTMENT_ENTITIES.IS_INVESTMENT]
        }
      })
    }
      break

    case InvestmentTypes.INVESTMENT_CONFIRM: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.LI_CONFIRM,
        title: '',
        animated: true,
        animationType: 'fade',
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID],
          [INVESTMENT_ENTITIES.INVESTMENT_NAME]: action[INVESTMENT_ENTITIES.INVESTMENT_NAME],
          [GOAL_ENTITIES.RECURRING_AMOUNT]: action[GOAL_ENTITIES.RECURRING_AMOUNT],
          [GOAL_ENTITIES.RECURRING_FREQUENCY]: action[GOAL_ENTITIES.RECURRING_FREQUENCY],
          [GOAL_ENTITIES.IS_WITHDRAW]: action[GOAL_ENTITIES.IS_WITHDRAW],
          'tickerName': action['tickerName'],
          [COMMON_ENTITIES.NAVIGATOR]: action[COMMON_ENTITIES.NAVIGATOR],
          'setScreen': 1,
          'isScreen': true
        }
      })
    }
      break

    case GoalTypes.SKIP_BANK_CONNECTION: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.SKIP_CONFIRM,
        title: '',
        backButtonTitle: '',
        navigatorStyle: ApplicationStyles.hiddenNavbar
      })
    }
      break

    case UserTypes.SHOW_PENDING_VERIFICATION_ALERT: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.resetTo({
        screen: SPROUT.BANK_ACCOUNT_PENDING,
        navigatorStyle: ApplicationStyles.hiddenNavbar
      })
    }
      break

    case GoalTypes.POP_SCREEN: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.pop({})
    }
      break

    case UserTypes.DISMISS_PLAID: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.dismissModal({
        animationType: 'slide-down'
      })
    }
      break

    case AuthTypes.SHOW_TOUCH_ID: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.showLightBox({
        screen: SPROUT.TOUCH_ID,
        passProps: {
          [COMMON_ENTITIES.PARENT_NAVIGATOR]: navigator
        },
        style: {
          backgroundBlur: 'light',
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }
      })
    }
      break

    case AuthTypes.HIDE_TOUCH_ID: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.dismissLightBox()
    }
      break

    case SettingTypes.SHOW_SETTINGS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.SETTINGS_PANEL,
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        animated: true,
        animationType: 'fade'
      })
    }
      break

    case InvestmentTypes.INVESTMENT_COMPLETED: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let IS_MODEL = action['IS_MODEL']
      navigator.dismissModal()
      if (IS_MODEL) {
        navigator.resetTo({
          screen: SPROUT.CHILD_HOMEPAGE_CONTAINER_SCREEN,
          title: 'Loved Wealth',
          backButtonTitle: '',
          navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#2948FF'},
          animated: true,
          animationType: 'fade',
          passProps: {
            [USER_ENTITIES.SHOULD_REFRESH]: true
          }
        })
      }
    }
      break

    case SettingTypes.HIDE_SETTINGS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.dismissModal({
        animationType: 'none'
      })
    }
      break

    case SettingTypes.OPEN_SETTINGS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.SETTING,
        navigatorStyle: ApplicationStyles.hiddenNavbar
      })
    }
      break

    case SettingTypes.SHOW_ACADEMY: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.CHAT_ROOM,
        navigatorStyle: ApplicationStyles.hiddenNavbar
      })
    }
      break

    case SettingTypes.NAVIGATE_TO_SETTING_DETAIL_SCREEN: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let screen = action[COMMON_ENTITIES.SCREEN_TYPE]
      navigator.push({
        screen: screen,
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        animated: true
      })
    }
      break

    case SettingTypes.SHOW_DOCUMENTS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.STATEMENTS,
        navigatorStyle: ApplicationStyles.hiddenNavbar
      })
    }
      break

    case SettingTypes.SHOW_CONFIRMATIONS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.CONFIRMATIONS,
        navigatorStyle: ApplicationStyles.hiddenNavbar
      })
    }
      break

    case SettingTypes.VIEW_TRANSFERS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.VIEW_TRANSFERS,
        navigatorStyle: ApplicationStyles.hiddenNavbar
      })
    }
      break

    case SettingTypes.SHOW_REGULAR_TRANSFERS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.REGULAR_TRANSFERS,
        navigatorStyle: ApplicationStyles.hiddenNavbar
      })
    }
      break

    case SettingTypes.NAVIGATE_TO_ABOUT_US: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.REGULAR_TRANSFERS,
        navigatorStyle: ApplicationStyles.hiddenNavbar
      })
    }
      break

    case SettingTypes.VIEW_ACTIVITY: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.ACTIVITY,
        title: 'User Activity',
        backButtonTitle: '',
        animated: true,
        animationType: 'fade',
        navigatorStyle: ApplicationStyles.header.containerStyle
      })
    }
      break

    case SettingTypes.SHOW_CONFIG: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.SHOW_CONFIG,
        title: 'Configuration',
        backButtonTitle: '',
        animated: true,
        animationType: 'fade',
        navigatorStyle: ApplicationStyles.header.containerStyle
      })
    }
      break

    case UserTypes.OPEN_ARTICLE: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.showModal({
        screen: SPROUT.ARTICLE,
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: 'transparent'},
        passProps: {
          [LEARN_ENTITIES.MODULE]: action[LEARN_ENTITIES.MODULE]
        }
      })
    }
      break

    case UserTypes.DISCONNECT_BANK_SUCCESS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      // navigator.showModal({
      //   screen: SPROUT.BANK_DISCONNECT_NOTIFICATION,
      //   navigatorStyle: {...ApplicationStyles.hiddenNavbar,
      //     screenBackgroundColor: 'transparent',
      //     navBarBackgroundColor: 'transparent',
      //     statusBarTextColorScheme: 'light',
      //     statusBarColor: '#9B9B9B'}
      // })
    }
      break

    case UserTypes.CLOSE_ARTICLE: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.dismissModal()
    }
      break

    case SettingTypes.SHOW_PROFILE: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.EDIT_PROFILE,
        navigatorStyle: ApplicationStyles.hiddenNavbar
      })
    }
      break

    case SettingTypes.NAVIGATE_TO_PROFILE: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.toggleDrawer()
      setTimeout(() => navigator.handleDeepLink({
        link: SPROUT.PROFILE,
        payload: '' // (optional) Extra payload with deep link
      }), 200)
    }
      break

    case SettingTypes.NAVIGATE_TO: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let screen = action[COMMON_ENTITIES.SCREEN_TYPE]
      if (screen === SPROUT.AUTH_SELECTOR_SCREEN) {
        navigator.resetTo({
          screen: screen,
          backButtonTitle: '',
          animated: true,
          animationType: 'fade',
          navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#2948FF'}
        })
      } else if (screen === SPROUT.STATEMENTS) {
        navigator.push({
          screen: screen,
          backButtonTitle: '',
          animated: true,
          animationType: 'fade',
          navigatorStyle: ApplicationStyles.hiddenNavbar
        })
      } else {
        navigator.push({
          screen: screen,
          title: 'Profile',
          backButtonTitle: '',
          animated: true,
          animationType: 'fade',
          navigatorStyle: ApplicationStyles.header.containerStyle
        })
      }
    }
      break

    case SettingTypes.NAVIGATE_DEEP: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let screen = action[COMMON_ENTITIES.SCREEN_TYPE]
      setTimeout(() => navigator.handleDeepLink({
        link: screen,
        payload: '' // (optional) Extra payload with deep link
      }), 200)
    }
      break

    case SettingTypes.CHANGE_PIN: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.LOGIN_PIN,
        title: 'Profile',
        backButtonTitle: '',
        navigatorStyle: ApplicationStyles.hiddenNavbar,
        passProps: {
          [COMMON_ENTITIES.CAN_POP]: true,
          [AUTH_ENTITIES.PIN_COMPONENT_TYPE]: PIN_COMPONENT_TYPE.VERIFY,
          [AUTH_ENTITIES.PIN_ACTION_TYPE]: PIN_ACTION_TYPE.RESET_PASSWORD,
          title: 'Change Pin',
          titles: {
            [PIN_COMPONENT_TYPE.VERIFY]: 'Enter existing PIN',
            [PIN_COMPONENT_TYPE.CREATE]: 'Enter new PIN',
            [PIN_COMPONENT_TYPE.CONFIRM]: 'Re-enter new PIN'
          },
          isLogout: false,
          isTouchID: false
        }
      })
    }
      break

    case SettingTypes.CHANGE_PASSWORD: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.CHANGE_PASSWORD,
        title: 'Change Password',
        backButtonTitle: '',
        navigatorStyle: ApplicationStyles.hiddenNavbar
      })
    }
      break

    case SettingTypes.PROCESS_CHANGE_PASSWORD_SUCCESS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.pop()
    }
      break

    case SettingTypes.SHOW_RECURRING_WIDGET: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]

      navigator.push({
        screen: SPROUT.RECURRING_AMOUNT_SCREEN,
        title: 'Set Recurring Amount',
        backButtonTitle: '',
        navigatorStyle: ApplicationStyles.header.containerStyle,
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GID]: action[GOAL_ENTITIES.GID],
          [GOAL_ENTITIES.RECURRING_AMOUNT]: action[GOAL_ENTITIES.RECURRING_AMOUNT],
          [COMMON_ENTITIES.IS_STALE]: true
        }
      })
    }
      break

    case SettingTypes.SHOW_INVESTOR_QUESTIONS: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]

      navigator.push({
        screen: SPROUT.INVESTOR_QUESTIONS,
        title: 'Investor Questions',
        backButtonTitle: '',
        navigatorStyle: ApplicationStyles.header.containerStyle
      })
    }
      break

    case SettingTypes.FORGOT_PASSWORD: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.FORGOT_PASSWORD,
        navigatorStyle: ApplicationStyles.hiddenNavbar
      })
    }
      break

    case ChildTypes.ASK_SSN: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.SSN_POPUP,
        title: '',
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.GOAL_DATA]: action[GOAL_ENTITIES.GOAL_DATA],
          [INVESTMENT_ENTITIES.IS_INVESTMENT]: action[INVESTMENT_ENTITIES.IS_INVESTMENT]
        }
      })
    }
      break

    // ----------------------------------------------------------------
    // investment related navigation
    case InvestmentTypes.INVESTMENT_SELECTED: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      let displayOnly = action[INVESTMENT_ENTITIES.IS_DISPLAY_ONLY] || false
      navigator.push({
        screen: SPROUT.PORTFOLIO_DETAIL,
        title: '',
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [INVESTMENT_ENTITIES.IS_DISPLAY_ONLY]: displayOnly,
          [INVESTMENT_ENTITIES.INVESTMENT_NAME]: action[INVESTMENT_ENTITIES.INVESTMENT_NAME],
          [INVESTMENT_ENTITIES.PRODUCT]: action[INVESTMENT_ENTITIES.PRODUCT],
          [INVESTMENT_ENTITIES.INVESTMENT_ID]: action[INVESTMENT_ENTITIES.INVESTMENT_ID],
          [INVESTMENT_ENTITIES.INVESTMENT_AMOUNT]: action[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT],
          [INVESTMENT_ENTITIES.INVESTMENT_RECURRING_AMOUNT]: action[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_AMOUNT],
          [INVESTMENT_ENTITIES.IS_RECURRENCE_INVESTMENT_EXIST]: action[INVESTMENT_ENTITIES.IS_RECURRENCE_INVESTMENT_EXIST]
        }
      })
    }
      break

    case InvestmentTypes.SELECT_INVESTMENT_AMOUNT: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.INVEST_AMOUNT,
        title: action[INVESTMENT_ENTITIES.INVESTMENT_NAME],
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [INVESTMENT_ENTITIES.INVESTMENT_NAME]: action[INVESTMENT_ENTITIES.INVESTMENT_NAME],
          [GOAL_ENTITIES.IS_ADD_RECURRING]: action[GOAL_ENTITIES.IS_ADD_RECURRING],
          [INVESTMENT_ENTITIES.PRODUCT]: action[INVESTMENT_ENTITIES.PRODUCT]
        }
      })
    }
      break

    case InvestmentTypes.INVESTMENT_AMOUNT_SELECTED: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.INVEST_FREQUENCY,
        title: action[INVESTMENT_ENTITIES.INVESTMENT_NAME],
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
          [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
          [GOAL_ENTITIES.IS_ADD_RECURRING]: action[GOAL_ENTITIES.IS_ADD_RECURRING],
          [INVESTMENT_ENTITIES.PRODUCT]: action[INVESTMENT_ENTITIES.PRODUCT]
        }
      })
    }
      break

    case UserTypes.NAVIGATE_TO_CONNECT_BANK: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.CONNECT_BANK,
        title: '',
        backButtonTitle: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'},
        passProps: {
        }
      })
    }
      break

    case UserTypes.NAVIGATE_TO_DEBUG_WINDOW: {
      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator.push({
        screen: SPROUT.DEBUG_LOG,
        title: '',
        navigatorStyle: {...ApplicationStyles.hiddenNavbar, screenBackgroundColor: '#FFF'}
      })
    }
      break

  }
  return state
}
