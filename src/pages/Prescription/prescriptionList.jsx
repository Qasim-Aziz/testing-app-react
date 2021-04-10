/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Table, Card, Col, Row, List, Typography, Divider, Button, Tag } from 'antd'
import { CloseCircleOutlined, CheckCircleOutlined, EditOutlined } from '@ant-design/icons'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import actionPrescription from '../../redux/prescriptions/actions'
import './index.scss'

// const TagComponent = val => {
//   console.log('THE TTTAAAGGG', val)
//   return val.map((item, index) => <Tag key={item.node.id}>{item.node.name}</Tag>)
// }

export const History = props => {
  console.log('EACH HISTORY PROP', props)

  const customSpanStyle = {
    backgroundColor: COLORS.success,
    color: 'white',
    borderRadius: '3px',
    padding: '1px 5px',
  }
  const inActiveSpanStyle = {
    backgroundColor: COLORS.danger,
    color: 'white',
    borderRadius: '3px',
    padding: '1px 5px',
  }

  const labelHead = {
    minWidth: 160,
    fontWeight: 700,
    color: 'black',
  }
  const medicineTableData = props.data.node.medicineItems.edges
  // console.log('🔥🔥🔥🔥🧨🧨🧨🧯🧯🧯', medicineTableData)
  const columns = [
    {
      title: '#',
      render: row => {
        // console.log('THE ROW', row)
        return medicineTableData.indexOf(row) + 1
      },
    },
    {
      /* medicine name */

      title: 'name',
      render: row => {
        // console.log('THE ROW ITEM', row)
        return <span>{row.node.name ? row.node.name : ''}</span>
      },
    },
    {
      /* Medicine Type */
      title: 'Type',
      /* 🔴 NOTE: medicine type options are  - ['SYP', 'TAB', 'DRP', 'LIQ'] */
      render: row => <span>{row.node.medicineType ? row.node.medicineType : ''}</span>,
    },
    {
      title: 'qty',
      render: row => <span>{row.node.qty ? row.node.qty : ''}</span>,
    },
    {
      title: 'unit',
      render: row => <span>{row.node.unit ? row.node.unit : ''}</span>,
    },
    {
      title: 'dosage',
      render: row => <span>{row.node.dosage ? row.node.dosage : ''}</span>,
    },
    {
      title: 'when',
      render: row => <span>{row.node.when ? row.node.when : ''}</span>,
    },
    {
      title: 'frequency',
      render: row => <span>{row.node.frequency ? row.node.frequency : ''}</span>,
    },
    {
      title: 'duration',
      render: row => <span>{row.node.duration ? row.node.duration : ''}</span>,
    },
  ]
  return (
    <>
      <div className="mainCard" style={{ marginBottom: '28px' }}>
        <div className="mainCard-child right-border">
          <div style={{ fontSize: '22px', color: 'black', marginBottom: '12px' }}>
            Personal Information
            <Button
              type="link"
              onClick={() => {
                console.log('PERSONAL INFO CLICKED EDIT BUTTON CLICK')
              }}
              style={{
                paddingRight: 0,
                fontSize: '16px',
                float: 'right',
              }}
            >
              <EditOutlined />
            </Button>
          </div>
          {props.data.node ? (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>HEIGHT </p>
              <p> : {props.data.node.height}</p>
            </div>
          ) : null}
          {props.data.node ? (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>WEIGHT </p>
              <p> : {props.data.node.weight}</p>
            </div>
          ) : null}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>TEMPERATURE </p>
            <p> : {props.data.node.temperature ? props.data.node.temperature : ''}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>HEAD CIRCUMFERENCE </p>
            <p> : {props.data.node.headCircumference}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>advice</p>
            <p> : {props.data.node.advice ? props.data.node.advice : ''}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>nextVisit</p>
            <p> : {props.data.node.nextVisit}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>nextVisitDate</p>
            <p> : {props.data.node.nextVisitDate}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>testDate</p>
            <p> : {props.data.node.testDate}</p>
          </div>
        </div>
        <div className="mainCard-child">
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Diagnosis </p>
            <p>
              :{' '}
              {props.data.node.diagnosis.edges.map((item, index) => (
                <Tag key={item.node.id}>{item.node.name}</Tag>
              ))}
              {/* <TagComponent diagnosisList={props.data.node.diagnosis.edges} /> */}
              {/* 🔴 NOTE: create a list of tags for diagnosis */}
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Tests </p>
            <p>
              :{' '}
              {props.data.node.tests.edges.map((item, index) => (
                <Tag key={item.node.id}>{item.node.name}</Tag>
              ))}
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Complaints </p>
            <p>
              :{' '}
              {props.data.node.complaints.edges.map((item, index) => (
                <Tag key={item.node.id}>{item.node.name}</Tag>
              ))}
            </p>
          </div>
          {/* <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>SSN/Adhaar </p>
            <p> : {'whatever'}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Language </p>
            <p> : {'whatever'}</p>
          </div> */}
        </div>
      </div>
      {/* Table of medicines */}
      <Table columns={columns} dataSource={medicineTableData} />
    </>
  )
}

export default props => {
  const prescriptions = useSelector(state => state.prescriptions)
  const dispatch = useDispatch()
  console.log('PROPS', props)
  /**When the component first mounts it should render all the details regarding a learner's prescriptions */
  useEffect(() => {
    console.log('THE USE_EFFCE ')
    dispatch({
      type: actionPrescription.GET_PRESCRIPTIONS,
      payload: {
        value: props.details.id,
      },
    })
  }, [])

  console.log('🌟THE Prescription REDUCER STATE', prescriptions)
  return (
    <>
      {prescriptions.loadingPrescriptions ? (
        <>Loading</>
      ) : (
        <div>
          {prescriptions.PrescriptionsList.map((item, index) => {
            console.log('THE PRESCRIPTION 👉', item)
            return (
              <div key={index}>
                <Divider orientation="left">Prescription No.{index + 1}</Divider>
                <History number={index + 1} data={item} />
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
