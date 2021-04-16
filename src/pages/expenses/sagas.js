/* eslint-disable no-plusplus */
/* eslint-disable object-shorthand */
/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable */

import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification, message } from 'antd'
import { getExpenses, createExpense, updateExpense } from 'services/expenses'
// import axios from 'axios'
import actions from './actions'

export function* GET_DATA() {
  yield put({
    type: 'expenses/SET_STATE',
    payload: {
      loading: true,
      ExpensesList: [],
      SpecificExpense: null, // UserProfile
      isSpecificExpense: false, // isUserProfile
      TotalNumberOfExpense: 0, // TotalLeaders
      PageInfo: null, // Should be done with pagination
    },
  })

  yield put({
    type: 'expenses/GET_EXPENSES',
    payload: {
      isActive: true,
      first: 10,
      after: null,
      before: null,
    },
  })

  yield put({
    type: 'expenses/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* GET_EXPENSES({ payload }) {
  yield put({
    type: 'expenses/SET_STATE',
    payload: {
      loadingExpenses: true,
    },
  })

  const response = yield call(getExpenses, payload)
  if (response) {
    let expenses = []
    console.log('response', response.data.expenses)
    expenses = response.data.expenses
    console.log('response', expenses)
    console.log('LENGTH OF EXPENSE', expenses.length)
    yield put({
      type: 'expenses/SET_STATE',
      payload: {
        ExpensesList: response.data.expenses,
        // 👇 "TotalExpenses" will begive from the API right now it is an arbitary value
        TotalExpenses: 6,
        // 👇 "PageInfo" will be provided with graphene django pagination
        PageInfo: 'I dont know what this is',
      },
    })
  }
  yield put({
    type: 'expenses/SET_STATE',
    payload: {
      loadingExpenses: false,
    },
  })
}

export function* CREATE_EXPENSE({ payload }) {
  console.log('THE PAYLOAD', payload)
  const response = yield call(createExpense, payload)
  console.log('THE RESPONSE ONCE THE Expense IS CREATED', response)
  if (response && response.data) {
    notification.success({
      message: 'Expense Created Successfully',
    })
    // Destructuring the all the values from the response
    var created_expense = response.data.createExpense.expense
    console.log('THE created_expense', created_expense)
    yield put({
      type: 'expenses/APPEND_EXPENSES_LIST',
      payload: {
        expense: created_expense,
      },
    })
  }
}

export function* EDIT_EXPENSE({ payload }) {
  const response = yield call(updateExpense, payload)

  if (response && response.data) {
    notification.success({
      message: 'Expense UPDATED SUCCESSFULLY',
    })
    let updatedExpense = response.data.updateExpense.expense
    console.log('THE UPDATED EXPENSE', updatedExpense)
    yield put({
      type: 'expenses/UPDATE_EXPENSES_LIST',
      payload: {
        object: updatedExpense,
      },
    })
    yield put({
      type: 'expenses/SET_STATE',
      payload: {
        SpecificExpense: updatedExpense,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_DATA, GET_DATA),
    takeEvery(actions.GET_EXPENSES, GET_EXPENSES),
    takeEvery(actions.CREATE_EXPENSE, CREATE_EXPENSE),
    takeEvery(actions.EDIT_EXPENSE, EDIT_EXPENSE),
  ])
}
