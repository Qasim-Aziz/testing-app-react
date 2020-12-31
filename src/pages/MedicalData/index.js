import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Row, Col, Layout, Typography, Drawer, Tooltip, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import Calendar from 'components/Calander'
import MedicalCard from './MedicalCard'
import MedicalForm from './Medicalform'
import { MEDICAL_DATA } from './query'
import UpdateMedicalForm from './UpdateMedicalForm'
import FilterComp from '../../components/FilterCard/FilterComp'

const { Content } = Layout
const { Title } = Typography

const STUDNET_INFO = gql`
  query student($studentId: ID!) {
    student(id: $studentId) {
      firstname
    }
  }
`

const MedicalDataPage = props => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const [newMediDate, setNewMediDate] = useState(date)
  const [newMediCreated, setNewMediCreated] = useState(false)
  const studentId = localStorage.getItem('studentId')
  const [updateMed, setUpdateMed] = useState()
  const [showDrawerForm, updateDrawerForm] = useState(false)
  const { openRightdrawer, closeDrawer, handleFilterToggle, filter, TabCheck, openDrawer } = props

  const { data, loading, error, refetch } = useQuery(MEDICAL_DATA, {
    variables: {
      student: studentId,
      date,
    },
  })

  const { data: studnetInfo } = useQuery(STUDNET_INFO, {
    variables: {
      studentId,
    },
  })

  useEffect(() => {
    if (newMediDate === date && newMediCreated) {
      refetch()
      setNewMediCreated(false)
    }
  }, [newMediDate, refetch, date, newMediCreated])

  const handleSelectDate = (newDate, value) => {
    setDate(moment(value).format('YYYY-MM-DD'))
  }

  const showDrawer = () => {
    updateDrawerForm(true)
  }

  const onClickClose = () => {
    updateDrawerForm(false)
  }
  useEffect(() => {
    updateDrawerForm(openRightdrawer)
  }, [openRightdrawer])
  return (
    <div>
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Content style={{ padding: '0px 20px', maxWidth: 1300, width: '100%', margin: '0px auto' }}>
          <Row gutter={[46, 0]}>
            <Col span={24}>
              {/* <Calendar value={date} handleOnChange={handleSelectDate} /> */}
              {filter && <FilterComp handleSelectDate={handleSelectDate} />}
              <div>
                <div style={{ marginTop: 17 }}>
                  {loading && 'Loading...'}
                  {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                  {data &&
                    data.getMedication.edges.map(({ node }, index) => (
                      <MedicalCard
                        key={node.id}
                        id={node.id}
                        condition={node.condition}
                        note={node.note}
                        startDate={moment(node.startDate).format('DD MMMM')}
                        endDate={moment(node.endDate).format('DD MMMM')}
                        style={{ marginTop: index === 0 ? 0 : 10 }}
                        date={date}
                        setUpdateMed={setUpdateMed}
                        refetch={refetch}
                        severity={node.severity.name}
                        openDrawer={openDrawer}
                      />
                    ))}
                </div>
              </div>
            </Col>
            <Drawer
              title={updateMed ? 'Update Medical Data' : 'New Medical Data'}
              width="52%"
              placement="right"
              closable="true"
              visible={showDrawerForm && TabCheck === 'Medical Data'}
              onClose={closeDrawer}
            >
              {updateMed ? (
                <UpdateMedicalForm
                  id={updateMed}
                  setOpen={setUpdateMed}
                  closeDrawer={closeDrawer}
                />
              ) : (
                <MedicalForm
                  handleNewMediDate={newDate => {
                    setNewMediDate(newDate)
                  }}
                  setNewMediCreated={setNewMediCreated}
                />
              )}
            </Drawer>
            <Col span={8} style={{ display: 'none' }}>
              <Title
                style={{
                  marginLeft: '30px',
                  fontSize: '30px',
                  lineHeight: '41px',
                }}
              >
                {updateMed ? 'Update Medical Data' : 'New Medical Data'}
              </Title>
              <div
                style={{
                  background: '#F9F9F9',
                  borderRadius: 10,
                  padding: '30px',
                }}
              >
                {updateMed ? (
                  <UpdateMedicalForm id={updateMed} setOpen={setUpdateMed} />
                ) : (
                  <MedicalForm
                    handleNewMediDate={newDate => {
                      setNewMediDate(newDate)
                    }}
                    setNewMediCreated={setNewMediCreated}
                  />
                )}
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  )
}

export default MedicalDataPage
