import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import {
  Row,
  Col,
  Layout,
  Typography,
  Drawer,
  Tooltip,
  Button,
  Popconfirm,
  notification,
  Form,
  Input,
  Table,
} from 'antd'
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import moment from 'moment'
import { useQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import Calendar from 'components/Calander'
import { DRAWER } from 'assets/styles/globalStyles'
import MedicalCard from './MedicalCard'
import MedicalForm from './Medicalform'
import { MEDICAL_DATA, DELETE_MEDICAL } from './query'
import UpdateMedicalForm from './UpdateMedicalForm'
import FilterComp from '../../components/FilterCard/FilterComp'
import './styles.scss'

const { Content } = Layout
const { Title } = Typography
const { Search } = Input

const STUDNET_INFO = gql`
  query student($studentId: ID!) {
    student(id: $studentId) {
      firstname
    }
  }
`

const MedicalDataPage = props => {
  const [date, setDate] = useState({
    gte: moment()
      .subtract(4, 'weeks')
      .format('YYYY-MM-DD'),
    lte: moment().format('YYYY-MM-DD'),
  })
  const [medTableData, setMedTableData] = useState([])
  const [newMediDate, setNewMediDate] = useState(date)
  const [newMediCreated, setNewMediCreated] = useState(false)
  const studentId = localStorage.getItem('studentId')
  const [updateMed, setUpdateMed] = useState()
  const [medDataUpdated, setMedDataUpdated] = useState(false)
  const [showDrawerForm, updateDrawerForm] = useState(false)
  const [searchText, setSearchText] = useState()
  const { openRightdrawer, closeDrawer, handleFilterToggle, filter, TabCheck, openDrawer } = props

  const { data, loading, error, refetch } = useQuery(MEDICAL_DATA, {
    variables: {
      student: studentId,
      dateGte: date.gte,
      dateLte: date.lte,
    },
  })

  const { data: studnetInfo } = useQuery(STUDNET_INFO, {
    variables: {
      studentId,
    },
  })

  const [deleteMedData, { data: deleteData, error: deleteError }] = useMutation(DELETE_MEDICAL)

  useEffect(() => {
    if (moment(newMediDate).isBetween(date.gte, date.lte, undefined, []) && newMediCreated) {
      refetch()
      setNewMediCreated(false)
      setMedDataUpdated(false)
    }
  }, [newMediDate, date, newMediCreated])

  useEffect(() => {
    if (data) {
      const medData = data.getMedication.edges.map(item => item.node)
      setMedTableData(medData)
    }
  }, [data])

  useEffect(() => {
    console.log(deleteData)
    if (deleteData) {
      notification.success({
        message: 'Medical Data',
        description: 'Medical Data Deleted Successfully',
      })
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteData])

  useEffect(() => {
    if (medDataUpdated) refetch()
    setMedDataUpdated(false)
  }, [medDataUpdated])

  const MedColumns = [
    {
      title: 'Medical Condition',
      dataIndex: 'condition',
      render: (text, record) => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text}
        />
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      render: (text, record) => record.severity.name,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      width: 150,
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      width: 150,
    },
    {
      title: 'Action(s)',
      dataIndex: '',
      align: 'center',
      width: 100,
      render: (text, record) => (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <EditTwoTone
              style={{ cursor: 'pointer' }}
              onClick={() => handleUpdateMedData(record.id)}
            />
            <Popconfirm
              placement="top"
              title="Delete Medical data?"
              onConfirm={() => confirmDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteTwoTone />
            </Popconfirm>
          </div>
        </>
      ),
    },
  ]

  const handleUpdateMedData = id => {
    setUpdateMed(id)
    openDrawer()
  }

  const confirmDelete = id => {
    deleteMedData({
      variables: {
        id,
      },
    })
  }

  const handleSelectDate = (newDate, value) => {
    console.log(value)
    setDate({
      gte: moment(value[0]).format('YYYY-MM-DD'),
      lte: moment(value[1]).format('YYYY-MM-DD'),
    })
  }

  const showDrawer = () => {
    updateDrawerForm(true)
  }

  const onClickClose = () => {
    updateDrawerForm(false)
  }
  const header = () => (
    <Row>
      <Col span={14}>
        <Form layout="inline">
          <Form.Item label="Medical Condition" style={{ fontSize: '14px' }}>
            <Search
              placeholder="Search by medical condition"
              value={searchText}
              onChange={searchMedData}
            />
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )

  const searchMedData = e => {
    // Update Text
    const text = e.target.value
    setSearchText(text)

    // Filter Medical Data
    if (data) {
      const filteredMedData = data.getMedication.edges.filter(x =>
        x.node.condition.toLowerCase().includes(text.toLowerCase()),
      )
      const medData = filteredMedData.map(edge => edge.node)
      setMedTableData(medData)
    }
  }

  useEffect(() => {
    updateDrawerForm(openRightdrawer)
  }, [openRightdrawer])

  return (
    <div>
      <Helmet title="Dashboard Alpha" />
      <FilterComp
        handleSelectDate={handleSelectDate}
        startDate={date.gte}
        endDate={date.lte}
        searchText={searchText}
        onTextChange={searchMedData}
        searchLabel="Medical Condition"
        rangePicker
      />
      <Layout style={{ padding: '0px' }}>
        <Content style={{ maxWidth: 1300, width: '100%', margin: '0px auto' }}>
          <div className="medicalData">
            <div>
              <Table
                loading={loading}
                className="mealTable"
                rowKey="id"
                columns={MedColumns}
                dataSource={medTableData}
                pagination={{
                  position: 'bottom',
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '25', '50', '100'],
                }}
                size="small"
                bordered
              />
            </div>
          </div>
          <Drawer
            title={updateMed ? 'Update Medical Data' : 'New Medical Data'}
            width={DRAWER.widthL2}
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
                setMedDataUpdated={setMedDataUpdated}
              />
            ) : (
              <MedicalForm
                handleNewMediDate={newDate => {
                  setNewMediDate(newDate)
                }}
                closeDrawer={closeDrawer}
                setNewMediCreated={setNewMediCreated}
              />
            )}
          </Drawer>
          <Row>
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
