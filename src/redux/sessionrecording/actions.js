const actions = {
  SET_STATE: 'sessionrecording/SET_STATE',
  LOAD_SESSION: 'sessionrecording/LOAD_SESSION',
  START_SESSION: 'sessionrecording/START_SESSION',
  PAUSE_SESSION: 'sessionrecording/PAUSE_SESSION',
  RESUME_SESSION: 'sessionrecording/RESUME_SESSION',
  END_SESSION: 'sessionrecording/END_SESSION',
  GET_CHILD_SESSION_DATA: 'sessionrecording/GET_CHILD_SESSION_DATA',
  UPDATE_FIRST_TARGET_RESPONSE: 'sessionrecording/UPDATE_FIRST_TARGET_RESPONSE',
  // recording target data
  TARGET_CORRECT: 'sessionrecording/TARGET_CORRECT',
  // updating target end time
  TARGET_UPDATE: 'sessionrecording/TARGET_UPDATE',
  // create new target skill instance
  CREATE_NEW_TARGET_INSTANCE: 'sessionrecording/CREATE_NEW_TARGET_INSTANCE',
  // update target trial object
  UPDATE_TARGET_TRIAL: 'sessionrecording/UPDATE_TARGET_TRIAL',
  // update target trails counts
  SET_PREVIOUS_COUNTS: 'sessionrecording/SET_PREVIOUS_COUNTS',
  // move to next stimulus
  CHANGE_STIMULUS: 'sessionrecording/CHANGE_STIMULUS',
  // recording target stimulus data
  TARGET_SD_CORRECT: 'sessionrecording/TARGET_SD_CORRECT',
  // recording target stimulus data
  UPDATE_TARGET_SD_TRIAL: 'sessionrecording/UPDATE_TARGET_SD_TRIAL',
  // move to next step
  CHANGE_STEP: 'sessionrecording/CHANGE_STEP',
  // recording target step data
  TARGET_STEP_CORRECT: 'sessionrecording/TARGET_STEP_CORRECT',
  // recording target step data
  UPDATE_TARGET_STEP_TRIAL: 'sessionrecording/UPDATE_TARGET_STEP_TRIAL',
  // updating duration on every data recording api call
  UPDATE_DURATION: 'sessionrecording/UPDATE_DURATION',

  UPDATE_BLOCK_ENDTIME: 'sessionrecording/UPDATE_BLOCK_ENDTIME',
  CREATE_NEW_BLOCK: 'sessionrecording/CREATE_NEW_BLOCK',
  RECORD_BLOCK_TRIAL: 'sessionrecording/RECORD_BLOCK_TRIAL',
  UPDATE_BLOCK_TRIAL: 'sessionrecording/UPDATE_BLOCK_TRIAL',

  GET_SD_COMBINATIONS: 'sessionrecording/GET_SD_COMBINATIONS',
  EQUIVALENCE_RESPONSE: 'sessionrecording/EQUIVALENCE_RESPONSE',
  EQUIVALENCE_RESPONSE_UPDATE: 'sessionrecording/EQUIVALENCE_RESPONSE_UPDATE',

  MOVE_TO_NEXT_TARGET: 'sessionrecording/MOVE_TO_NEXT_TARGET',
}

export default actions
