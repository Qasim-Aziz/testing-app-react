/* eslint-disable import/prefer-default-export */

import { remove } from 'ramda'

const modifierActions = {
  ADD_MODIFIER: 'ADD_MODIFIER',
  REMOVE_MODIFIER: 'REMOVE_MODIFIER',
  UPDATE_MODIFIER: 'UPDATE_MODIFIER',
  UPDATE_RATE: 'UPDATE_RATE',
  UPDATE_AGREED_RATE: 'UPDATE_AGREED_RATE',
}

const modifierDispatch = (actionType, payload, modifierRates) => {
  switch (actionType) {
    case modifierActions.ADD_MODIFIER: {
      modifierRates = [
        ...modifierRates,
        {
          modifier: null,
          rate: null,
          agreedRate: null,
        },
      ]
      break
    }

    case modifierActions.REMOVE_MODIFIER: {
      modifierRates = remove(payload.index, 1, modifierRates)
      break
    }

    case modifierActions.UPDATE_MODIFIER: {
      modifierRates[payload.index].modifier = payload.modifier
      break
    }

    case modifierActions.UPDATE_RATE: {
      modifierRates[payload.index].rate = payload.rate
      break
    }

    case modifierActions.UPDATE_AGREED_RATE: {
      modifierRates[payload.index].agreedRate = payload.agreedRate
      break
    }

    default: {
      console.error(`Unknown action type: ${actionType}`)
    }
  }

  return modifierRates
}

export { modifierActions, modifierDispatch }
