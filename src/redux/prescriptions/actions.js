const actions = {
  SET_STATE: 'prescriptions/SET_STATE',
  GET_DATA: 'prescriptions/GET_DATA',
  EDIT_PRESCRIPTION: 'prescriptions/EDIT_PRESCRIPTION',
  CREATE_PRESCRIPTION: 'prescriptions/CREATE_PRESCRIPTION',
  DELETE_PRESCRIPTION: 'prescriptions/DELETE_PRESCRIPTION',
  /* If a prescription is edited and save that prescription
   * will be updated into the global reducer of prescription list
   */
  UPDATE_PRESCRIPTIONS_LIST: 'prescriptions/UPDATE_PRESCRIPTIONS_LIST',
  // Once a new prescription is generated that prescription will be added into prescription list
  APPEND_PRESCRIPTIONS_LIST: 'prescriptions/APPEND_PRESCRIPTIONS_LIST',
  // once a single prescription is deleted that prescription will be removed from prescription list
  DELETE_PRESCRIPTION_IN_LIST: 'prescriptions/DELETE_PRESCRIPTION_IN_LIST',
  GET_PRESCRIPTIONS: 'prescriptions/GET_PRESCRIPTIONS',
  PAGE_CHANGED: 'prescriptions/PAGE_CHANGED',
  ROWS_CHANGED: 'prescriptions/ROWS_CHANGED',
  GET_LASTEST_PRESCRIPTIONS: 'prescriptions/GET_LASTEST_PRESCRIPTIONS',
  GET_DETAILS_PRESCRIPTIONS: 'prescriptions/GET_DETAILS_PRESCRIPTIONS',
  SET_SPECIFIC_LEARNER: 'prescriptions/SET_SPECIFIC_LEARNER',
}

export default actions
