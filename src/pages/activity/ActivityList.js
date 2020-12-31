/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { Button, Popconfirm, Drawer, Form, Input, Select, DatePicker, notification } from 'antd'
import DataTable from 'react-data-table-component'
import Authorize from 'components/LayoutComponents/Authorize'
import { CheckCircleOutlined, CloseCircleOutlined, PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import client from '../../apollo/config'

import '../../components/Calander.scss'

const { Option } = Select

const { TextArea } = Input
const dateFormat = 'YYYY-MM-DD'

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 12
  }
}
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 12
  }
}

const GET_ACTIVITIES_QUERY = gql`
  query {   
    getActivity {
           edges{
                    node{       
                      id         
                      user         
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


const ActivityList = () => {
  const { data, loading, error, refetch } = useQuery(GET_ACTIVITIES_QUERY);
  const { data: actTypes } = useQuery(GET_ACTIVITY_TYPES_QUERY);

  const [clinicsList, setClinicsList] = useState([])
  const [visible, setVisible] = useState(false)


  const [selectedActivity, setSelectedActivity] = useState();

  const [type, setType] = useState('');


  const [subject, setSubject] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [length, setLength] = useState('');


  useEffect(() => {
    if (data) {
      const learners = data.getActivity.edges.length > 0 &&
        data.getActivity.edges.map((i, index) => {
          return i.node;
        })
      setClinicsList(learners);
    }
  }, [data])

  console.log('clinicsList', clinicsList);
  const customStyles = {
    header: {
      style: {
        maxHeight: '50px'
      }
    },
    headRow: {
      style: {
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: '#ddd',
        backgroundColor: '#f5f5f5'
      }
    },
    headCells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: '#ddd'
        },
        fontWeight: 'bold'
      }
    },
    cells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: '#ddd'
        },
        fontSize: '11px'
      }
    },
    pagination: {
      style: {
        position: 'absolute',
        top: '5px',
        right: '5px',
        borderTopStyle: 'none',
        minHeight: '35px'
      }
    },
    table: {
      style: {
        paddingBottom: '40px',
        top: '40px'
      }
    }
  }

  const addActivity = (e) => {
    e.preventDefault();

    return client
      .mutate({
        mutation: gql`mutation {     
          addActivity (         
            input:{      
              activityType:"${type}",       
              subject: "${subject}",             
              date: "${date}",             
              length: ${length},             
              addNote: "${note}",         
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
            }`
      })
      .then(result => {
        refetch()
        setVisible(false);
        notification.success({
          message: "Activity Added",
          description: "Activity added successfully",
        })
      })
      .catch(error1 => error1)
  }

  const updateActivity = (e) => {
    e.preventDefault();
    return client
      .mutate({
        mutation: gql`mutation {     
          updateActivity (         
            input:{            
              pk: "${selectedActivity}", 
              activityType:"${type}", 
              subject: "${subject}",             
              date: "${date}",             
              length: ${length},             
              addNote: "${note}",         
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
            }`
      })
      .then(result => {
        refetch()
        setVisible(false);
        setSelectedActivity();
        notification.success({
          message: "Activity Updated",
          description: "Activity updated successfully",
        })
      })
      .catch(error1 => error1)
  }

  const setFields = (row) => {
    setSelectedActivity(row.id);
    setSubject(row.subject);
    setType(row.activityType);
    setDate(row.date);
    setNote(row.addNote);
    setLength(row.length);
    setVisible(true);
  }

  const columns = [
    {
      name: 'Subject',
      sortable: true,
      minWidth: '250px',
      cell: row => (
        <Button type='link' onClick={() => setFields(row)}>
          {row.subject}
        </Button>
      )
    },
    {
      name: 'Note',
      selector: 'addNote',
      sortable: true,

    },
    {
      name: 'User',
      selector: 'user',
      sortable: true,

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
      maxWidth: '100px',
      minWidth: '100px'
    },

  ]

  return (
    <Authorize roles={['school_admin']} redirect to='/dashboard/beta'>

      <Drawer
        title={selectedActivity ? 'Update Activity' : 'Create Activity'}
        width='40%'
        placement='right'
        closable='true'
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <Form {...layout} name='control-ref' onSubmit={e => selectedActivity ? updateActivity(e) : addActivity(e)}>
          <Form.Item label='Type' style={{ marginBottom: '5px' }} size='small'>
            <Select mode='default' placeholder='Select Status' onChange={e => setType(e)} allowClear size='small' style={{ borderRadius: 0 }}>
              <Option value=''>Select Type</Option>
              {actTypes && actTypes.getActivityType ? actTypes.getActivityType.map((item) => {
                return <Option value={item.id}>{item.name}</Option>
              }) : null}
            </Select>
          </Form.Item>
          <Form.Item label='Subject' style={{ marginBottom: '5px' }} size='small'>
            <Input size='small' style={{ borderRadius: 0 }} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder='Name this activity' />
          </Form.Item>
          <Form.Item label='Date' style={{ marginBottom: '5px' }} size='small'>
            {/* <Input size='small' style={{ borderRadius: 0 }} value={date} onChange={(e) => setDate(e.target.value)} placeholder='Date' /> */}
            <DatePicker
              style={{
                width: '190px', borderRadius: 0
              }}
              size='small'
              value={moment(date, dateFormat)}
              onChange={newDate => {
                setDate(newDate.format('YYYY-MM-DD'))
              }}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item label='Length' style={{ marginBottom: '5px' }} size='small'>
            <Input size='small' style={{ borderRadius: 0 }} value={length} onChange={(e) => setLength(e.target.value)} />
          </Form.Item>
          <Form.Item label='Add Note' style={{ marginBottom: '5px' }} size='small'>
            <TextArea style={{ borderRadius: 0 }} value={note} onChange={(e) => setNote(e.target.value)} />
          </Form.Item>
          {/* <Form.Item label='Type' style={{ marginBottom: '5px' }} size='small'>
            <Select mode='default' placeholder='Select Status' allowClear size='small' style={{ borderRadius: 0 }}>
              <Option value='private'>Private</Option>
              <Option value='public'>Public</Option>
            </Select>
          </Form.Item> */}
          <Form.Item {...tailLayout}>
            <Button type='primary' htmlType='submit' size='small'>
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
          padding: '0px 10px',
          backgroundColor: '#FFF',
          boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)'
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

      <div className='row'>
        <div className='col-sm-12'>
          <div style={{ margin: '5px', marginBottom: '50px' }}>
            <DataTable
              title='All Clinics List'
              columns={columns}
              theme='default'
              dense='true'
              pagination='true'
              data={clinicsList}
              customStyles={customStyles}
              noHeader='true'
              paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
            />
          </div>
        </div>

      </div>
    </Authorize>
  )
}

export default ActivityList
