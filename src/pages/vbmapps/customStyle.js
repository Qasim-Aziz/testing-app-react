/* eslint-disable import/prefer-default-export */

import { COLORS } from 'assets/styles/globalStyles'

const leftDivStyle = {
  padding: 10,
  background: COLORS.palleteLight,
  height: 'calc(100vh - 100px)',
}

const rightDivStyle = {
  height: 'fit-content',
  padding: '0 10px',
  overflow: 'auto',
}

const assessmentCompletedBlockStyle = {
  boxShadow:
    '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.08)',
  paddingTop: 10,
  paddingBottom: 10,
  paddingLeft: 20,
  paddingRight: 20,
  borderRadius: 2,
  flex: 1,
  marginTop: 10,
  backgroundColor: '#21af16',
  color: 'white',
  textAlign: 'center',
}

const defaultDivStyle = {
  boxShadow:
    '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.08)',
  padding: '5px 20px',
  borderRadius: 2,
  marginTop: 10,
}

const leftListBoxStyle = {
  cursor: 'pointer',
  boxShadow:
    '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
  padding: '5px 20px',
  borderRadius: 0,
  flex: 1,
  margin: '5px 5px 0px',
}

const recordResponseButtonStyle = {
  marginVertical: 10,
  display: 'flex',
  width: 40,
  height: 40,
  padding: 5,
  borderRadius: 10,
  marginRight: 5,
  marginTop: 10,
  justifyContent: 'center',
  alignItems: 'center',
}

export {
  leftDivStyle,
  rightDivStyle,
  assessmentCompletedBlockStyle,
  defaultDivStyle,
  leftListBoxStyle,
  recordResponseButtonStyle,
}
