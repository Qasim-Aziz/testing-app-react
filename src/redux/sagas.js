import { all } from 'redux-saga/effects'
import user from './user/sagas'
import menu from './menu/sagas'
import tasks from './tasks/sagas'
import tickets from './tickets/sagas'
import goals from './goals/sagas'
import family from './family/sagas'
import staffs from './staffs/sagas'
import student from './student/sagas'
import feedback from './feedback/sagas'
import learners from './learners/sagas'
import settings from './settings/sagas'
import screening from './screening/sagas'
import payor from './payor/sagas'
import authorizationCode from './authorizationCodes/sagas'
import learnersprogram from './learnersprogram/sagas'
import peakequivalence from './peakequivalence/sagas'
import sessionrecording from './sessionrecording/sagas'
import cogniableassessment from './cogniableassessment/sagas'
import iisaassessment from './iisaassessment/sagas'
import sessiontargetallocation from './sessiontargetallocation/sagas'
import appointments from './appointments/sagas'

export default function* rootSaga() {
  yield all([
    user(),
    menu(),
    tasks(),
    tickets(),
    goals(),
    staffs(),
    family(),
    student(),
    feedback(),
    learners(),
    settings(),
    screening(),
    payor(),
    authorizationCode(),
    learnersprogram(),
    peakequivalence(),
    sessionrecording(),
    iisaassessment(),
    cogniableassessment(),
    sessiontargetallocation(),
    appointments(),
  ])
}
