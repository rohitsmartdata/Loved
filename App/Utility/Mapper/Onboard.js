/* eslint-disable key-spacing,no-trailing-spaces */
/**
 * Created by demon on 16/3/18.
 */

// ========================================================
// User Entities
// ========================================================

export const ONBOARDING_ENTITIES = {

  // ----- BUSINESS entities -----

  // USER ID
  USER_ID   : 'userID',
  // is the profile completion done
  IS_PROFILE_COMPLETE: 'isProfileComplete',
  // profile data
  PROFILE_DATA: 'profileData',
  // current profile screen
  CURRENT_PROFILE_SCREEN: 'currentProfileScreen',
  // has the user accepted program agreement
  IS_AGREEMENT_ACCEPTED: 'isAgreementAccepted',
  // has push notification occurred
  IS_PUSH_NOTIFICATION_DONE: 'isPushNotificationDone',
  // has the user set passcode
  IS_PIN_SET: 'isPinSet'
}

export function path (ENTITIY) {
  switch (ENTITIY) {

    // ----- Business entity paths -----
    case ONBOARDING_ENTITIES.IS_PROFILE_COMPLETE:
      return (userID) => [userID, ONBOARDING_ENTITIES.IS_PROFILE_COMPLETE]

    case ONBOARDING_ENTITIES.PROFILE_DATA:
      return (userID) => [userID, ONBOARDING_ENTITIES.PROFILE_DATA]

    case ONBOARDING_ENTITIES.CURRENT_PROFILE_SCREEN:
      return (userID) => [userID, ONBOARDING_ENTITIES.CURRENT_PROFILE_SCREEN]

    case ONBOARDING_ENTITIES.IS_AGREEMENT_ACCEPTED:
      return (userID) => [userID, ONBOARDING_ENTITIES.IS_AGREEMENT_ACCEPTED]

    case ONBOARDING_ENTITIES.IS_PUSH_NOTIFICATION_DONE:
      return (userID) => [userID, ONBOARDING_ENTITIES.IS_PUSH_NOTIFICATION_DONE]

    case ONBOARDING_ENTITIES.IS_PIN_SET:
      return (userID) => [userID, ONBOARDING_ENTITIES.IS_PIN_SET]
  }
}
