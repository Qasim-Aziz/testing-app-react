/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-shadow */
import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Typography, Tabs, Button, Card } from 'antd'
import profileImg from './img/profile.jpg'
import brainImg from '../../images/brain.png'
import mandImg from '../../images/mand.png'
import mealImg from '../../images/meal.png'
import toiletImg from '../../images/toilet.png'
import medicalImg from '../../images/medical.png'
import MealDataPage from '../meal'
import MandDataPage from '../mandData'
import MedicalDataPage from '../MedicalData'
import ToiletDataPage from '../ToiletData'
import BehaviourDataPage from '../BehaviourData'
import AbcDataPage from '../abcData'

const { TabPane } = Tabs

const { Title, Text } = Typography

const DailyVitalsCard = props => {
  const {
    openRightdrawer,
    closeDrawer,
    filterToggle,
    handleFilterToggle,
    TabCheck,
    setTabCheck,
    openDrawer,
  } = props

  const cardStyle = {
    background: '#F9F9F9',
    height: 500,
    overflow: 'auto',
  }
  const parentCardStyle = {
    background: '#F9F9F9',
    borderRadius: 10,
    padding: '20px',
    margin: '20px 10px 20px 10px',
    display: 'none',
  }
  const targetMappingStyle = {
    background: '#FFFFFF',
    border: '1px solid #E4E9F0',
    boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
    borderRadius: 10,
    padding: '16px 12px',
    // display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  }
  const funcData = check => {
    if (check === 'Meal Data') {
      return (
        <MealDataPage
          openRightdrawer={openRightdrawer}
          closeDrawer={closeDrawer}
          filter={filterToggle}
          handleFilterToggle={handleFilterToggle}
          TabCheck={TabCheck}
          openDrawer={openDrawer}
        />
      )
    }
    if (check === 'Mand Data') {
      return (
        <MandDataPage
          openRightdrawer={openRightdrawer}
          closeDrawer={closeDrawer}
          filter={filterToggle}
          handleFilterToggle={handleFilterToggle}
          TabCheck={TabCheck}
        />
      )
    }
    if (check === 'Medical Data') {
      return (
        <MedicalDataPage
          openRightdrawer={openRightdrawer}
          closeDrawer={closeDrawer}
          filter={filterToggle}
          handleFilterToggle={handleFilterToggle}
          TabCheck={TabCheck}
          openDrawer={openDrawer}
        />
      )
    }
    if (check === 'Toilet Data') {
      return (
        <ToiletDataPage
          openRightdrawer={openRightdrawer}
          closeDrawer={closeDrawer}
          filter={filterToggle}
          handleFilterToggle={handleFilterToggle}
          TabCheck={TabCheck}
          openDrawer={openDrawer}
        />
      )
    }
    if (check === 'Behaviour Data') {
      return (
        <BehaviourDataPage
          openRightdrawer={openRightdrawer}
          closeDrawer={closeDrawer}
          filter={filterToggle}
          handleFilterToggle={handleFilterToggle}
          TabCheck={TabCheck}
          openDrawer={openDrawer}
        />
      )
    }
    if (check === 'ABC Data') {
      return (
        <AbcDataPage
          openRightdrawer={openRightdrawer}
          closeDrawer={closeDrawer}
          filter={filterToggle}
          handleFilterToggle={handleFilterToggle}
          TabCheck={TabCheck}
          openDrawer={openDrawer}
        />
      )
    }
    return null
  }

  // styleBlock
  const BlockStyle = {
    background: '#FFF',
    borderBottom: '1px solid #bcbcbc',
    cursor: 'pointer',
    padding: '30px 20px',
    borderRadius: 0,
    width: '100%',
    height: 50,
    display: 'flex',
    alignItems: 'center',
    minWidth: '200px',
  }
  const ActiveStyle = {
    ...BlockStyle,
    background: '#a7a6a6',
  }
  const HeadStyle = {
    color: '#000',
    fontSize: 16,
    lineHeight: '25px',
    display: 'inline',
    margin: 0,
    fontWeight: '500',
  }
  const SetTabFunction = val => {
    closeDrawer()
    setTabCheck(val)
  }
  const SideBarHeading = {
    fontSize: '24px',
    fontWeight: 'bold',
    lineHeight: '33px',
    marginBottom: '25px',
  }

  return (
    <div style={{ display: 'flex' }}>
      <Card
        style={{
          background: '#F1F1F1',
          borderRadius: 0,
          minHeight: '100vh',
          minWidth: '290px',
          maxWidth: '350px',
        }}
      >
        <div style={SideBarHeading}>Daily Vitals</div>
        <div
          style={TabCheck === 'Meal Data' ? ActiveStyle : BlockStyle}
          onClick={() => SetTabFunction('Meal Data')}
        >
          <span style={HeadStyle}>Meal Data</span>
        </div>
        <div
          style={TabCheck === 'Mand Data' ? ActiveStyle : BlockStyle}
          onClick={() => SetTabFunction('Mand Data')}
        >
          <span style={HeadStyle}>Mand Data</span>
        </div>
        <div
          style={TabCheck === 'Medical Data' ? ActiveStyle : BlockStyle}
          onClick={() => SetTabFunction('Medical Data')}
        >
          <span style={HeadStyle}>Medical Data</span>
        </div>
        <div
          style={TabCheck === 'Toilet Data' ? ActiveStyle : BlockStyle}
          onClick={() => SetTabFunction('Toilet Data')}
        >
          <span style={HeadStyle}>Toilet Data</span>
        </div>
        <div
          style={TabCheck === 'Behaviour Data' ? ActiveStyle : BlockStyle}
          onClick={() => SetTabFunction('Behaviour Data')}
        >
          <span style={HeadStyle}>Behaviour Data</span>
        </div>
        <div
          style={TabCheck === 'ABC Data' ? ActiveStyle : BlockStyle}
          onClick={() => SetTabFunction('ABC Data')}
        >
          <span style={HeadStyle}>ABC Data</span>
        </div>
      </Card>
      <div>{funcData(TabCheck)}</div>
    </div>
  )
}

export default DailyVitalsCard
