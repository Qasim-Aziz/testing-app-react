/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { Button, Drawer, Form, Input, Select, DatePicker, notification } from 'antd'
import DataTable from 'react-data-table-component'
import Authorize from 'components/LayoutComponents/Authorize'
import { PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import client from '../../apollo/config'
import { FORM, SUBMITT_BUTTON } from '../../assets/styles/globalStyles'

import '../../components/Calander.scss'

const { Option } = Select

const { TextArea } = Input
const dateFormat = 'YYYY-MM-DD'

const customStyles = {
  header: {
    style: {
      maxHeight: '50px',
    },
  },
  headRow: {
    style: {
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: '#ddd',
      backgroundColor: '#f5f5f5',
    },
  },
  headCells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: '#ddd',
      },
      fontWeight: 'bold',
      fontSize: '13px',
    },
  },
  cells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: '#ddd',
      },
      fontSize: '12px',
    },
  },
  pagination: {
    style: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      borderTopStyle: 'none',
      minHeight: '35px',
    },
  },
  table: {
    style: {
      paddingBottom: '40px',
      top: '40px',
    },
  },
}

const GET_ACTIVITIES_QUERY = gql`
  query {
    getActivity {
      edges {
        node {
          activityType {
            id
            name
          }
          id
          user {
            id
            firstName
            lastName
          }
          subject
          date
          length
          addNote
        }
      }
    }
  }
`

const GET_ACTIVITY_TYPES_QUERY = gql`
  query {
    getActivityType {
      id
      name
    }
  }
`

const ActivityList = ({ form }) => {
  const { data, loading, error, refetch } = useQuery(GET_ACTIVITIES_QUERY)
  const { data: actTypes } = useQuery(GET_ACTIVITY_TYPES_QUERY)

  const [clinicsList, setClinicsList] = useState([])
  const [visible, setVisible] = useState(false)

  const [selectedActivity, setSelectedActivity] = useState()
  const [type, setType] = useState('')
  const [subject, setSubject] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(moment())
  const [length, setLength] = useState('')

  useEffect(() => {
    if (data) {
      const learners =
        data.getActivity.edges.length > 0 &&
        data.getActivity.edges.map((i, index) => {
          return i.node
        })
      setClinicsList(learners)
    }
  }, [data])

  const addActivity = e => {
    e.preventDefault()
    form.validateFields((formError, values) => {
      if (!formError) {
        console.log(formError, values)
        client
          .mutate({
            mutation: gql`mutation {
            addActivity (
              input:{
                activityType:"${values.type}",
                subject: "${values.subject}",
                date: "${moment(values.date).format('YYYY-MM-DD')}",
                length: ${values.length},
                addNote: "${values.addNote}",
              })
              {
                act{
                  id
                  subject
                  date
                  length
                  addNote
                }
              }
            }`,
          })
          .then(result => {
            console.log(result, 'te')
            refetch()
            resetFields()
            setVisible(false)
            notification.success({
              message: 'Activity Added',
              description: 'Activity added successfully',
            })
          })
          .catch(error1 => {
            notification.error({
              message: 'Something went wrong',
              description: 'Unable to add activity',
            })
          })
      }
    })
  }

  const updateActivity = e => {
    e.preventDefault()
    form.validateFields((formError, values) => {
      console.log(formError, values)
      if (!formError) {
        client
          .mutate({
            mutation: gql`mutation {     
          updateActivity (         
            input:{            
              pk: "${selectedActivity}", 
              activityType:"${values.type}", 
              subject: "${values.subject}",             
              date: "${moment(values.date).format('YYYY-MM-DD')}",             
              length: ${values.length},             
              addNote: "${values.addNote}",         
            })
            {         
              act{             
                id             
                subject            
                date             
                length             
                addNote         
              }     
            } 
          }`,
          })
          .then(result => {
            refetch()
            setVisible(false)
            resetFields()
            setSelectedActivity()
            notification.success({
              message: 'Activity Updated',
              description: 'Activity updated successfully',
            })
          })
          .catch(error1 => {
            notification.error({
              message: 'Something went wrong',
              description: 'Unable to update activity',
            })
          })
      }
    })
  }

  const resetFields = () => {
    setSubject('')
    setType('')
    setDate(moment())
    setLength('')
    setNote('')
  }

  const setFields = row => {
    setSelectedActivity(row.id)
    setSubject(row.subject)
    setType(row.activityType.id)
    setDate(row.date)
    setNote(row.addNote)
    setLength(row.length)
    setVisible(true)
  }

  const columns = [
    {
      name: 'Subject',
      sortable: true,
      minWidth: '250px',
      cell: row => (
        <Button type="link" onClick={() => setFields(row)}>
          {row.subject}
        </Button>
      ),
    },
    {
      name: 'Note',
      selector: 'addNote',
      sortable: true,
    },
    {
      name: 'User',
      selector: 'user.firstName',
      sortable: true,
      cell: row => (
        <span>
          {row.user?.firstName} {row.user?.lastName}
        </span>
      ),
    },
    {
      name: 'Date',
      selector: 'date',
      sortable: true,
    },
    {
      name: 'Length',
      selector: 'length',
      sortable: true,
      width: '200px',
    },
  ]

  return (
    <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
      <Drawer
        destroyOnClose
        title={selectedActivity ? 'Update Activity' : 'Create Activity'}
        width="80%"
        placement="right"
        closable="true"
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <Form
          {...FORM.layout}
          name="control-ref"
          onSubmit={e => (selectedActivity ? updateActivity(e) : addActivity(e))}
          style={{ marginRight: '6em' }}
        >
          <Form.Item required label="Type" style={{ marginBottom: '8px' }}>
            {form.getFieldDecorator('type', {
              initialValue: type,
              rules: [{ required: true, message: 'Please select a customer!' }],
            })(
              <Select
                mode="default"
                placeholder="Select Status"
                allowClear
                style={{ borderRadius: 0 }}
              >
                {actTypes && actTypes.getActivityType
                  ? actTypes.getActivityType.map(item => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      )
                    })
                  : null}
              </Select>,
            )}
          </Form.Item>
          <Form.Item required label="Subject" style={{ marginBottom: '8px' }}>
            {form.getFieldDecorator('subject', {
              initialValue: subject,
              rules: [{ required: true, message: 'Please select a customer!' }],
            })(<Input style={{ borderRadius: 0 }} placeholder="Name this activity" />)}
          </Form.Item>
          <Form.Item required label="Date" style={{ marginBottom: '8px' }}>
            {form.getFieldDecorator('date', {
              initialValue: moment(date),
              rules: [{ required: true, message: 'Please select a customer!' }],
            })(
              <DatePicker
                style={{
                  width: '190px',
                  borderRadius: 0,
                }}
                allowClear={false}
              />,
            )}
          </Form.Item>
          <Form.Item required label="Length" style={{ marginBottom: '8px' }}>
            {form.getFieldDecorator('length', {
              initialValue: length,
              rules: [{ required: true, message: 'Please select a customer!' }],
            })(<Input style={{ borderRadius: 0 }} />)}
          </Form.Item>
          <Form.Item required label="Add Note" style={{ marginBottom: '8px' }}>
            {form.getFieldDecorator('addNote', {
              initialValue: note,
              rules: [{ required: true, message: 'Please select a customer!' }],
            })(<TextArea style={{ borderRadius: 0 }} />)}
          </Form.Item>
          <Form.Item {...FORM.tailLayout}>
            <Button type="primary" htmlType="submit" style={SUBMITT_BUTTON}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '5px 10px',
          backgroundColor: '#FFF',
          boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)',
        }}
      >
        <div style={{ padding: '5px 0px' }}>
          {/* <Button onClick={() => this.showDrawerFilter()} size="large">
            <FilterOutlined />
          </Button>

          {this.state.filterName ||
            this.state.filterCaseManager ||
            this.state.filterGender ||
            this.state.filterCategory ||
            this.state.filterLocation ? (
              <Button
                type="link"
                style={{ marginLeft: '10px', color: '#FEBB27' }}
                onClick={() =>
                  this.setState({
                    filterName: '',
                    filterCaseManager: '',
                    filterGender: '',
                    filterCategory: '',
                    filterLocation: '',
                  })
                }
                size="small"
              >
                Clear Filters
                <CloseCircleOutlined />
              </Button>
            ) : null} */}
        </div>
        <div>
          <span style={{ fontSize: '25px', color: '#000' }}>Activity List</span>
        </div>
        <div style={{ padding: '5px 0px' }}>
          {/* <Dropdown overlay={menu} trigger={['click']}>
            <Button style={{ marginRight: '10px' }} type="link" size="large">
              <CloudDownloadOutlined />{' '}
            </Button>
          </Dropdown> */}

          <Button onClick={() => setVisible(true)} type="primary">
            <PlusOutlined /> ADD ACTIVITY
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div
            style={{ margin: '5px', marginBottom: '50px' }}
            className="modify-activity-data-table"
          >
            <DataTable
              title="All Clinics List"
              columns={columns}
              keyField="id"
              theme="default"
              pagination
              data={clinicsList}
              customStyles={customStyles}
              noHeader
              paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
            />
          </div>
        </div>
      </div>
    </Authorize>
  )
}

export default Form.create()(ActivityList)
