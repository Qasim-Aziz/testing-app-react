/* eslint-disable */

import actions from './actions.js'

const initialState = {
  ExpensesList: [],
  SpecificExpense: null, // 👈Details of a particular "Expense"
  loading: false,
  isSpecificExpense: false, //👈 if Details of a particular "Expense" then it will be true
  TotalExpenses: 0, // Should be done by graphene django pagination
  PageInfo: null, // Should be done by graphene django pagination
  CurrentPage: 1, // Should be done by graphene django pagination
  ItemPerPage: 10, // Should be done by graphene django pagination
  CurrentStatus: 'active',
  loadingExpenses: false,
  ExpenseCreated: false,
}

export default function useReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.UPDATE_EXPENSES_LIST:
      console.log('THE UPDATED EXPENSE', action.payload.object)
      return {
        ...state,
        ExpensesList: [
          ...state.ExpensesList.map(item => {
            if (item.id === action.payload.object.id) {
              return action.payload.object
            }
            return item
          }),
        ],
      }
    case actions.APPEND_EXPENSES_LIST:
      return {
        ...state,
        ExpensesList: [...state.ExpensesList, action.payload.expense],
        ExpenseCreated: 'Created',
      }
    default:
      return state
  }
}
