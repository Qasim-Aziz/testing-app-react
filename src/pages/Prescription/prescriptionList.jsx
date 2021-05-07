/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable */
// import Authorize from '../LayoutComponents/Authorize'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Divider, Drawer, Table, Tag } from 'antd'
import { DRAWER } from 'assets/styles/globalStyles'
import gql from 'graphql-tag'
import moment from 'moment'
import { useQuery, useMutation, useLazyQuery } from 'react-apollo'
import LoadingComponent from 'components/LoadingComponent'
import JsPDF from 'jspdf'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actionPrescription from '../../redux/prescriptions/actions'
import EditPrescription from './editPrescriptionComponent'
import PrescriptionPdf from './prescriptionPdf'
import AddPrescriptionForm from './addPrescriptionForm'
import './index.scss'

const PRES = gql`
  query($student: ID, $last: Int) {
    getPrescriptions(student: $student, last: $last) {
      edges {
        node {
          id
          createddate
          height
          weight
          temperature
          headCircumference
          advice
          nextVisit
          nextVisitDate
          testDate
          createdby {
            id
            username
          }
          student {
            id
            firstname
            lastname
          }
          complaints {
            edges {
              node {
                id
                name
              }
            }
          }

          diagnosis {
            edges {
              node {
                id
                name
              }
            }
          }

          tests {
            edges {
              node {
                id
                name
              }
            }
          }
          medicineItems {
            edges {
              node {
                id
                name
                medicineType
                dosage
                unit
                when
                frequency
                duration
                qty
              }
            }
          }
        }
      }
    }
  }
`

export const History = props => {
  const authUser = useSelector(state => state.user)
  const dispatchOfPrescription = useDispatch()
  const [editPrescription, setEditPrescription] = useState(false)
  const [prescriptionPdf, setPrescriptionPdf] = useState(false)
  const [currentPrescription, setCurrentPrescription] = useState(null)

  console.log(props, 'ther se arepr')
  const labelHead = {
    minWidth: 180,
    fontWeight: 700,
    color: 'black',
  }

  if (props.data.node) {
    const medicineTableData = props.data.node.medicineItems.edges
    const columns = [
      {
        title: '#',
        render: row => {
          return medicineTableData.indexOf(row) + 1
        },
      },
      {
        title: 'Name',
        dataIndex: 'node.name',
      },
      {
        title: 'Type',
        dataIndex: 'medicineType',
      },
      {
        title: 'Qty',
        dataIndex: 'node.qty',
      },
      {
        title: 'Unit',
        dataIndex: 'node.unit',
      },
      {
        title: 'Dosage',
        dataIndex: 'node.dosage',
      },
      {
        title: 'when',
        dataIndex: 'node.when',
      },
      {
        title: 'Frequency',
        dataIndex: 'node,frequency',
      },
      {
        title: 'Duration',
        dataIndex: 'node.duration',
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
      doc.text(title, 10, 10)
      doc.autoTable(content)
      doc.html(document.querySelector(`#content${props.number}`), {
        callback: function(doc) {
          console.log('HEYA')
          doc.addPage()
          doc.save('prescription.pdf')
        },
        x: 10,
        y: doc.autoTable.previous.finalY + 30, // 10,
      })
    }

    return (
      <>
        <div>
          <div className="mainCard" style={{ marginBottom: '28px' }}>
            <div className="mainCard-child right-border">
              <div style={{ fontSize: '22px', color: 'black', marginBottom: '12px' }}>
                Personal Information
                {authUser.authorized && authUser.role === 'therapist' ? (
                  <>
                    <Button
                      type="link"
                      onClick={() => {
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
                  </>
                ) : null}
                <Button
                  type="link"
                  onClick={() => setPrescriptionPdf(true)}
                  style={{ paddingRight: 0, fontSize: '16px', float: 'right' }}
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
                <p style={labelHead}>Advice</p>
                <p> : {props.data.node.advice ? props.data.node.advice : ''}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <p style={labelHead}>Next Visit</p>
                <p> : {props.data.node.nextVisit}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <p style={labelHead}>Next Visit Date</p>
                <p> : {props.data.node.nextVisitDate}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <p style={labelHead}>Test Date</p>
                <p> : {props.data.node.testDate}</p>
              </div>
            </div>
            <div id={`content${props.number}`} className="mainCard-child">
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <p style={labelHead}>Diagnosis </p>
                <p>
                  :{' '}
                  {props.data.node.diagnosis.edges.map((item, index) => (
                    <Tag style={{ marginTop: '6px' }} key={item.node.id}>
                      {item.node.name}
                    </Tag>
                  ))}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <p style={labelHead}>Tests </p>
                <p>
                  :{' '}
                  {props.data.node.tests.edges.map((item, index) => (
                    <Tag style={{ marginTop: '6px' }} key={item.node.id}>
                      {item.node.name}
                    </Tag>
                  ))}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <p style={labelHead}>Complaints </p>
                <p>
                  :{' '}
                  {props.data.node.complaints.edges.map((item, index) => (
                    <Tag style={{ marginTop: '6px' }} key={item.node.id}>
                      {item.node.name}
                    </Tag>
                  ))}
                </p>
              </div>
            </div>
          </div>
          <Table
            columns={columns}
            rowKey={props.data.node.id}
            dataSource={medicineTableData}
            pagination={false}
          />
        </div>
        <Drawer
          width={DRAWER.widthL1}
          title="Edit Prescription"
          closable={true}
          visible={editPrescription}
          onClose={() => setEditPrescription(false)}
          destroyOnClose
        >
          <AddPrescriptionForm
            details={props.learners}
            closeAddDrawer={() => setEditPrescription(false)}
            prescriptionObj={props.data.node}
            addPrescription={false}
          />
        </Drawer>
        <Drawer
          width={DRAWER.widthL2}
          title="Prescription PDF"
          closable={true}
          onClose={() => setPrescriptionPdf(false)}
          destroyOnClose
          visible={prescriptionPdf}
        >
          <PrescriptionPdf data={props} closeDrawer={() => setPrescriptionPdf(false)} />
        </Drawer>
      </>
    )
  } else {
    return <LoadingComponent />
  }
}

export default props => {
  const selectedLearner = props.details
  const [first, setFirst] = useState(2)
  const [data, setData] = useState(null)
  const [fetchPrescriptions, { data: prescriptions, loading: prescriptionsLoading }] = useLazyQuery(
    PRES,
  )

  useEffect(() => {
    if (selectedLearner) {
      fetchPrescriptions({
        variables: {
          student: selectedLearner.id,
          last: first,
        },
      })
    }
  }, [selectedLearner, first])

  useEffect(() => {
    if (prescriptions) {
      prescriptions.getPrescriptions.edges.sort(
        (a, b) => new Date(b.node.createddate) - new Date(a.node.createddate),
      )
      setData(prescriptions)
    }
  }, prescriptions)

  if (prescriptionsLoading && data === null) {
    return <LoadingComponent />
  }

  return (
    <div>
      {data?.getPrescriptions.edges.length === 0 ? (
        <div style={{ fontSize: 16, fontWeight: 700, width: '100%', textAlign: 'center' }}>
          No history found
        </div>
      ) : (
        <>
          <div>
            {data?.getPrescriptions.edges.map((item, index) => {
              console.log(moment(item.node.createddate).format('YYYY-MM-DD hh:mm:ss'), 'nd')
              return (
                <div key={index}>
                  <Divider orientation="left">Prescription No.{index + 1}</Divider>
                  <History number={index + 1} data={item} learners={props.details} />
                </div>
              )
            })}
          </div>
          {first !== null && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
              <Button
                loading={prescriptionsLoading}
                style={{ fontSize: 20 }}
                onClick={() => setFirst(null)}
                type="link"
              >
                ...More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
