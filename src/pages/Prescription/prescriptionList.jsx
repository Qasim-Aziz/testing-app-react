/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react'
// import { renderToString } from 'react-dom/server'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'
import JsPDF from 'jspdf'
import { Button, Table, Drawer, Divider, Tag, notification } from 'antd'
// import Authorize from '../LayoutComponents/Authorize'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { COLORS } from 'assets/styles/globalStyles'
import actionPrescription from '../../redux/prescriptions/actions'

import './index.scss'
import EditPrescription from './editPrescriptionComponent'

// Every individual prescription
export const History = props => {
  const dispatchOfPrescription = useDispatch()
  console.log('EACH HISTORY PROP', props)
  const [editPrescription, setEditPrescription] = useState(false)

  const labelHead = {
    minWidth: 160,
    fontWeight: 700,
    color: 'black',
  }
  // const medicineTableData = props.data.node.medicineItems.edges
  if (props.data.node) {
    const medicineTableData = props.data.node.medicineItems.edges
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

    const prescriptionPfd = () => {
      console.log('THE PDF PROPS', columns)
      const tableData = medicineTableData
      console.log('THE TABLE DATA', medicineTableData)
      const unit = 'pt'
      const size = 'A4' // Use A1, A2, A3 or A4
      const orientation = 'landscape' // portrait or landscape

      const doc = new JsPDF(orientation, unit, size)

      doc.setFontSize(10)

      const title = 'Prescription List'
      const headers = [['#', 'name', 'Type', 'qty', 'unit', 'dosage', 'when', 'frequency']]

      const data = tableData.map((e, i) => [
        i + 1,
        e.node.name,
        e.node.medicineType,
        e.node.qty,
        e.node.unit,
        e.node.dosage,
        e.node.when,
        e.node.frequency,
        e.node.duration,
      ])

      const content = {
        startY: 50,
        head: headers,
        body: data,
      }
      console.log('THE PROPS>NUMBER', props.number)
      doc.text(title, 10, 10)
      doc.autoTable(content)
      console.log('CHECKED 🤞')
      doc.html(document.querySelector(`#content${props.number}`), {
        callback: function(doc) {
          // doc.save()
          console.log('HEYA')
          doc.addPage()
          doc.save('prescription.pdf')
        },
        x: 10,
        y: doc.autoTable.previous.finalY + 30, // 10,
      })
      // doc.save('prescription.pdf')
    }

    return (
      <>
        <div>
          <div className="mainCard" style={{ marginBottom: '28px' }}>
            <div className="mainCard-child right-border">
              <div style={{ fontSize: '22px', color: 'black', marginBottom: '12px' }}>
                Personal Information
                {/* ❗ THE AUTHORIZATION for specific roles will be allowed to edit/delete prescription */}
                {/* <Authorize roles={['admin']} redirect to="/dashboard/beta"> */}
                <Button
                  type="link"
                  onClick={() => {
                    console.log('PERSONAL INFO CLICKED EDIT BUTTON CLICK')
                    setEditPrescription(true)
                  }}
                  style={{
                    paddingRight: 0,
                    fontSize: '16px',
                    float: 'right',
                  }}
                >
                  <EditOutlined />
                </Button>
                <Button
                  type="link"
                  onClick={() => {
                    console.log('PERSONAL INFO CLICKED DELETE BUTTON CLICK')
                    dispatchOfPrescription({
                      type: actionPrescription.DELETE_PRESCRIPTION,
                      payload: {
                        value: props.data.node.id,
                      },
                    })
                  }}
                  style={{
                    paddingRight: 0,
                    fontSize: '16px',
                    float: 'right',
                  }}
                >
                  <DeleteOutlined />
                </Button>
                {/* </Authorize> */}
                <Button
                  type="link"
                  onClick={() => {
                    console.log(' ******************PDF****************** ')
                    prescriptionPfd()
                  }}
                  style={{
                    paddingRight: 0,
                    fontSize: '16px',
                    float: 'right',
                  }}
                >
                  PDF
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
            <div id={`content${props.number}`} className="mainCard-child">
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
            </div>
          </div>
          {/* Table of medicines */}
          <Table columns={columns} rowKey={props.data.node.id} dataSource={medicineTableData} />
        </div>
        <Drawer
          width="90%"
          title="Edit Prescription"
          closable={true}
          visible={editPrescription}
          onClose={() => setEditPrescription(false)}
          destroyOnClose
        >
          <EditPrescription details={props.data.node} learners={props.learners} />
        </Drawer>
      </>
    )
  } else {
    return <>loading</>
  }
}

/**@props ==> here in this component I am receiving a particular students details
 * All the prescription regarding a particular student will be listed in a drawer component
 */

export default props => {
  const prescriptions = useSelector(state => state.prescriptions)
  const dispatch = useDispatch()
  console.log('PROPS', props)
  /**When the component first mounts it should render all the details regarding a learner's prescriptions */
  useEffect(() => {
    // console.log('THE USE_EFFCE ')
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
            // console.log('THE PRESCRIPTION 👉', item)
            return (
              <div key={index}>
                <Divider orientation="left">Prescription No.{index + 1}</Divider>
                <History number={index + 1} data={item} learners={props.details} />
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
