/* eslint-disable no-trailing-spaces */
/**
 * Created by victorchoudhary on 12/05/17.
 */

import {USER_ENTITIES} from '../Mapper/User'
import {CHILD_ENTITIES} from '../Mapper/Child'
import {GOAL_ENTITIES} from '../Mapper/Goal'
import {formatPrice}
  from './Converter'

/*
  From Auth0 we are getting UID in form 'auth0|{uid}'
  We need to fetch uid.

  @parameter authUID ID provided by Auth0
  @return UID UID we store in database
 */
export const parseAuthUID = (authUID) => authUID.replace('auth0|', '')

var componentForm = {
  street_number: {
    type: 'long_name',
    field: USER_ENTITIES.ADDRESS_LINE_1
  },
  route: {
    type: 'long_name',
    field: USER_ENTITIES.ADDRESS_LINE_2
  },
  locality: {
    type: 'long_name',
    field: USER_ENTITIES.CITY
  },
  administrative_area_level_1: {
    type: 'short_name',
    field: USER_ENTITIES.STATE
  },
  country: {
    type: 'long_name',
    field: 'country'
  },
  postal_code: {
    type: 'long_name',
    field: USER_ENTITIES.ZIP_CODE
  }
}

export const parseAddress = (place) => {
  let result = {}
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0]
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]['type']]
      result[componentForm[addressType]['field']] = val
    }
  }
  if (place['geometry'] && place['geometry']['location']) {
    result[USER_ENTITIES.LOCATION] = {
      latitude: place['geometry']['location']['lat'],
      longitude: place['geometry']['location']['lng']
    }
  }
  var addressString = place['formatted_address'].split(',')
  addressString.pop()
  result[USER_ENTITIES.FULL_ADDRESS] = addressString.join(',')

  return result
}

export const parsePlaidAction = (action) => {
  try {
    return action.substring(action.lastIndexOf(':') + 1)
  } catch (err) {
    console.log('error while parsing plaid action : ', err)
  }
  return undefined
}

function generateRecurringPresentationObject (childID, childName, goalID, goalName, recurringAmount, recurringDuration) {
  let result = {
    [CHILD_ENTITIES.CHILD_ID]: childID,
    [CHILD_ENTITIES.FIRST_NAME]: childName,
    [GOAL_ENTITIES.GID]: goalID,
    [GOAL_ENTITIES.NAME]: goalName,
    subheading: childName + '\'s ' + goalName + ' fund'
  }

  if (recurringAmount && recurringDuration) {
    result[GOAL_ENTITIES.RECURRING_AMOUNT] = recurringAmount
    result[GOAL_ENTITIES.RECURRING_FREQUENCY] = recurringDuration
    let frequency
    switch (recurringDuration) {
      case 0: frequency = 'ONE OFF'
        break
      case 1: frequency = 'EVERY WEEK'
        break
      case 2: frequency = 'EVERY TWO WEEK'
        break
      default: frequency = 'EVERY WEEK'
    }
    result.heading = formatPrice(recurringAmount) + ' ' + frequency.toLowerCase()
    return result
  }
}

export const parseRecurringInvestmentDetail = (data) => {
  let result = []
  for (var childIndex = 0; childIndex < data.length; childIndex++) {
    let child = data[childIndex]
    let goals = child['goal']
    for (var goalIndex = 0; goalIndex < goals.length; goalIndex++) {
      let goal = goals[goalIndex]
      let cube = generateRecurringPresentationObject(child['sproutid'], child['firstname'], goal['goalid'], goal['name'], goal['recurringinvestmentamount'], goal['recurringinvestmentfrequency'])
      cube && result.push(cube)
    }
  }
  return result
}
