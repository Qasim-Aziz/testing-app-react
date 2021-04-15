import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import user from './user/reducers'
import menu from './menu/reducers'
import tasks from './tasks/reducers'
import tickets from './tickets/reducers'
import goals from './goals/reducers'
import family from './family/reducers'
import staffs from './staffs/reducers'
import student from './student/reducers'
import feedback from './feedback/reducers'
import settings from './settings/reducers'
import learners from './learners/reducers'
// THE LEADERS REDUCER BELOW
import leaders from './leads/reducer'
// THE EXPENSE REDUCER BELOW
import expenses from './expenses/reducers'
// THE ASSETS REDUCER BELOW
// import assets from './assets_redux/reducers'
import assets from './assets_redux/reducers'
import prescriptions from './prescriptions/redux'
import screening from './screening/reducers'
import payor from './payor/reducers'
import authorizationCode from './authorizationCodes/reducers'
import learnersprogram from './learnersprogram/reducers'
import peakequivalence from './peakequivalence/reducers'
import sessionrecording from './sessionrecording/reducers'
import iisaassessment from './iisaassessment/reducers'
import cogniableassessment from './cogniableassessment/reducers'
import sessiontargetallocation from './sessiontargetallocation/reducers'
import celerationChartReducer from './celerationchart/panel.reducer'
import appointments from './appointments/reducers'

export default history =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    tasks,
    tickets,
    goals,
    staffs,
    family,
    student,
    feedback,
    learners,
    // LEADER REDUCER
    leaders,
    // EXPENSE REDUCER
    expenses,
    // ASSET REDUCER
    assets,
    // PRESCRIPTION REDUCER
    prescriptions,
    settings,
    screening,
    payor,
    authorizationCode,
    learnersprogram,
    peakequivalence,
    sessionrecording,
    iisaassessment,
    cogniableassessment,
    sessiontargetallocation,
    celerationChartReducer,
    appointments,
  })
