/* eslint-disable no-else-return */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-closing-bracket-location */
import React, { useEffect, useState } from 'react'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { useDispatch } from 'react-redux'
import { Table, Layout, Typography, Button, Drawer, Tabs, Tooltip, Dropdown, Icon, Menu, Popconfirm, Input, Select } from 'antd'
import DataTable from 'react-data-table-component'
import { CheckSquareFilled, ExclamationCircleFilled, PauseOutlined, PlayCircleOutlined, PlusOutlined, DeleteOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import CreateAssignmentForm from './CreateAssignmentForm'
import { STUDNET_INFO } from './query'
import PeakTargets from './PeakTargets'
import EquivalenceTargets from './EquivalenceTarget'

const { TabPane } = Tabs

const { Content } = Layout
const { Text } = Typography

const PEAK_PROGRAMS = gql`
  query($studentId: ID!) {
    peakPrograms(student: $studentId) {
      edges {
        node {
          id
          title
          category
          notes
          date
          status
          submitpeakresponsesSet {
            total
            totalAttended
          }
        }
      }
    }
  }
`
const customStyles = {
  title: {
    style: {
      fontSize: '15px'
    }
  },
  header: {
    style: {
      minHeight: '30px'
    }
  },
  headRow: {
    style: {
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: '#ddd',
      backgroundColor: '#f5f5f5',
      minHeight: '30px'
    }
  },
  rows: {
    style: {
      minHeight: '30px' // override the row height
    }
  },
  headCells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: '#ddd',
        minHeight: '30px'
      },
      fontWeight: 'bold'
    }
  },
  cells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: '#ddd',
        minHeight: '30px'
      },
      '.ebCczK:not(:last-of-type)': {
        minHeight: '30px'
      },
      fontSize: '11px'
    }
  },
  pagination: {
    style: {
      position: 'absolute',
      top: '41px',
      right: '5px',
      borderTopStyle: 'none',
      minHeight: '35px'
    }
  },
  table: {
    style: {
      paddingBottom: '40px',
      marginTop: '30px'
    }
  }
}

export default () => {
  const [open, setOpen] = useState(false)
  const [suggestTarget, setSuggestTarget] = useState()
  const [suggestEquiTarget, setSuggestEquiTarget] = useState()
  const studentId = localStorage.getItem('studentId')
  const [updateModel, setUpdateModel] = useState(false)
  const [originalData, setOriginalData] = useState([])
  const [pdata, setPdata] = useState([])
  const [cdata, setCdata] = useState([])
  const history = useHistory()
  const dispatch = useDispatch()
  const [filterTitle, setFilterTitle] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const { data: studnetInfo } = useQuery(STUDNET_INFO, {
    variables: {
      studentId
    }
  })

  const { data, error, loading } = useQuery(PEAK_PROGRAMS, {
    fetchPolicy: 'network-only',
    variables: {
      studentId
    }
  })

  useEffect(() => {
    if (data) {
      setOriginalData(data?.peakPrograms?.edges)
      const p = []
      const c = []
      console.log(data, '..............')
      const d = data?.peakPrograms?.edges?.forEach(element => {
        if (element?.node?.status === 'PROGRESS'
          && element.node.title.toLowerCase().includes(filterTitle)
          // &&  element.node.category === filterCategory
        ) {
          p.push(element)
        }
        if (element?.node?.status === 'COMPLETED'
          && element.node.title.toLowerCase().includes(filterTitle)
          // && element.node.category === filterCategory 
        ) {
          c.push(element)
        }
      })
      setPdata(p)
      setCdata(c)
    }
  }, [data, filterTitle, filterCategory])

  const menu = (
    <Menu style={{ zIndex: 1001 }}>
      <Menu.Item>
        <Tooltip placement='topRight' title='Edit'>
          Activate
        </Tooltip>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>Deactivate</Menu.Item>
    </Menu>
  )

  const startPeakEquivalence = node => {
    dispatch({
      type: 'peakequivalence/SET_STATE',
      payload: {
        ProgramId: node.id
      }
    })
    window.location.href = '/#/peakEqvi'
    // console.log(node)
  }

  const makeInactive = id => {
    console.log(id)
    const c = []
    const p = []
    const newData = originalData?.filter(item => item.node.id !== id)
    newData.forEach(element => {
      if (element?.node?.status === 'PROGRESS') {
        p.push(element)
      }
      if (element?.node?.status === 'COMPLETED') {
        c.push(element)
      }
    })
    setPdata(p)
    setCdata(c)
    setOriginalData(newData)
  }

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  const columns = [
    {
      name: 'Date',
      selector: 'node.date'
    },
    {
      name: 'Category',
      selector: 'node.category',
      minWidth: '170px',
      maxWidth: '170px'
    },
    {
      name: 'Title',
      selector: 'node.title'
    },
    {
      name: 'Note',
      selector: 'node.notes'
    },
    {
      name: 'Response',
      cell: obj => (
        <>
          {obj.node.submitpeakresponsesSet.totalAttended > 0
            ? Number(
              (obj.node.submitpeakresponsesSet.totalAttended / obj.node.submitpeakresponsesSet.total) *
              100
            ).toFixed(2)
            : 0}%
        </>
      )
    },
    {
      name: 'Status',
      width: '140px',
      cell: obj => (
        <span style={{ color: obj.node.status === 'PROGRESS' ? '#f5222d' : 'green' }}>
          {obj.node.status === 'PROGRESS' ? 'IN-PROGRESS' : obj.node.status} &nbsp;
        </span>
      )
    },
    {
      name: 'Action',
      width: '300px',
      cell: obj => {
        if (obj.node.category === 'TRANSFORMATION') {
          return <p>Under development</p>
        } else {
          return (
            <>
              {obj.node.status === 'COMPLETED'
                ? <>

                  <Tooltip placement='topRight' title='See Assessment'>
                    <Button
                      style={{ borderRight: '1px solid #ddd', borderRadius: 0 }}
                      onClick={() => {
                        localStorage.setItem('peakId', obj.node.id)
                        localStorage.setItem('peakType', obj.node.category)
                        history.push('/peakReport')
                      }}
                      type='link'
                    >
                      <CheckSquareFilled />
                    </Button>
                  </Tooltip>
                  <Tooltip placement='topRight' title='See Report'>
                    <Button
                      style={{ borderRight: '1px solid #ddd', borderRadius: 0 }}
                      onClick={() => {
                        localStorage.setItem('peakId', obj.node.id)
                        localStorage.setItem('reportDate', obj.node.date)
                        localStorage.setItem('peakType', obj.node.category)
                        if (obj.node.category === 'EQUIVALANCE') {
                          history.push('/peakEquivalenceReport')
                        } else {
                          history.push('/peakReport')
                        }
                        // history.push('/peakReport')
                      }}
                      type='link'
                    >
                      <Icon type='snippets' />
                    </Button>
                  </Tooltip>
                  <Button
                    style={{ borderRight: '1px solid #ddd', borderRadius: 0 }}
                    type='link'
                    onClick={() => {
                      setSuggestTarget(obj.node.id)
                    }}
                  >
                    Suggest Target
                  </Button>

                </>
                : <>
                  {obj.node.submitpeakresponsesSet.totalAttended > 0
                    ? <>
                      <Tooltip placement='topRight' title='Resume Assessment'>
                        <Button
                          style={{ borderRight: '1px solid #ddd', borderRadius: 0 }}
                          onClick={() => {
                            localStorage.setItem('peakId', obj.node.id)
                            localStorage.setItem('peakType', obj.node.category)
                            if (obj.node.category === 'TRANSFORMATION') {
                              history.push('/classPage')
                            } else if (obj.node.category === 'EQUIVALANCE') {
                              startPeakEquivalence(obj.node)
                            } else {
                              history.push('/peakAssign')
                            }
                          }}
                          type='link'
                        >
                          <PauseOutlined />
                        </Button>
                      </Tooltip>
                      <Tooltip placement='topRight' title='Report'>
                        <Button
                          style={{ borderRight: '1px solid #ddd', borderRadius: 0 }}
                          onClick={() => {
                            localStorage.setItem('peakId', obj.node.id)
                            localStorage.setItem('reportDate', obj.node.date)
                            localStorage.setItem('peakType', obj.node.category)
                            if (obj.node.category === 'EQUIVALANCE') {
                              history.push('/peakEquivalenceReport')
                            } else {
                              history.push('/peakReport')
                            }
                            // history.push('/peakReport')
                          }}
                          type='link'
                        >
                          <Icon type='snippets' />
                        </Button>
                      </Tooltip>

                      <Button
                        type='link'
                        style={{ borderRight: '1px solid #ddd', borderRadius: 0 }}
                        onClick={() => {
                          setSuggestTarget(obj.node.id)
                        }}
                      >
                        Suggest Target
                      </Button>
                    </>
                    : <>
                      <Tooltip placement='topRight' title='Start Assessment'>
                        <Button
                          style={{ borderRight: '1px solid #ddd', borderRadius: 0 }}
                          onClick={() => {
                            localStorage.setItem('peakId', obj.node.id)
                            localStorage.setItem('peakType', obj.node.category)
                            if (obj.node.category === 'TRANSFORMATION') {
                              history.push('/classPage')
                            } else if (obj.node.category === 'EQUIVALANCE') {
                              startPeakEquivalence(obj.node)
                            } else {
                              history.push('/peakAssign')
                            }
                          }}
                          type='link'
                        >
                          <PlayCircleOutlined />

                        </Button>
                      </Tooltip>
                      {obj.node.category === 'EQUIVALANCE' && (
                        <Button
                          type='link'
                          style={{ borderRight: '1px solid #ddd', borderRadius: 0 }}
                          onClick={() => {
                            setSuggestEquiTarget(obj.node.id)
                          }}
                        >
                          Suggest Target
                      </Button>
                      )}


                    </>}
                </>}

              <div style={{ right: 15, position: 'absolute' }}>
                <Tooltip placement='topRight' title='Delete Assessment'>
                  <Popconfirm
                    // style={{marginBottom: '10px'}}
                    title="Are you sure you don't want this assessment?"
                    onConfirm={() => makeInactive(obj.node.id)}
                    // onCancel={cancel}
                    okText='Yes'
                    cancelText='No'
                  >
                    <Button type='link' style={{ color: 'red' }}>
                      <DeleteOutlined />
                    </Button>
                  </Popconfirm>
                </Tooltip>
              </div>
            </>

          )
        }
      }
    }
  ]

  const filters = <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
    {filterTitle ||
      filterCategory ? (
        <Button
          type="link"
          style={{ marginLeft: '10px', color: '#FEBB27' }}
          onClick={() => {
            setFilterTitle('')
            setFilterCategory('')
          }
          }
          size="small"
        >
          Clear Filters
          <CloseCircleOutlined />
        </Button>
      ) : null}
    <Input
      size="small"
      placeholder="Search Title"
      value={filterTitle}
      onChange={e => setFilterTitle(e.target.value)}
      style={{ width: 188, marginRight: 8, display: 'block' }}
    />
    <Select
      size="small"
      value={filterCategory}
      onSelect={value => setFilterCategory(value)}
      style={{ width: 188 }}
    >
      <Select.Option value="">Select Category</Select.Option>
      <Select.Option value="DIRECT">DIRECT</Select.Option>
      <Select.Option value="GENERALIZATION">GENERALIZATION</Select.Option>
      <Select.Option value="TRANSFORMATION">TRANSFORMATION</Select.Option>
      <Select.Option value="EQUIVALANCE">EQUIVALANCE</Select.Option>
    </Select>
  </div>;


  return (
    <Layout style={{ padding: '0px' }}>
      <Content
        style={{
          padding: '0px 20px',
          maxWidth: '86%',
          width: '100%',
          margin: '0px auto'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              marginBottom: 20,
              fontSize: 24,
              marginTop: 15,
              marginLeft: 5,
              color: '#000'
            }}
          >
            {`${studnetInfo?.student.firstname || ''}`} - PEAK Assessment
          </Text>
          <Button type='primary' size='large' onClick={() => setOpen(true)}>
            <PlusOutlined />
            Create New Assessment
          </Button>
        </div>

        <Tabs type='card' tabBarExtraContent={filters}>
          <TabPane tab='In Progress' key='1'>
            {/* <DataTable status="PROGRESS" /> */}
            {pdata.length > 0 && <DataTable
              // title="DIRECT TRAINING MODULE"
              columns={columns}
              theme='default'
              dense={true}
              pagination={true}
              data={pdata}
              customStyles={customStyles}
              noHeader={true}
              paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
            />}
          </TabPane>
          <TabPane tab='Completed' key='2'>
            {cdata.length > 0 && <DataTable
              // title="DIRECT TRAINING MODULE"
              columns={columns}
              theme='default'
              dense={true}
              pagination={true}
              data={cdata}
              customStyles={customStyles}
              noHeader={true}
              paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
            />}
            {/* <DataTable status="COMPLETED" /> */}
          </TabPane>
        </Tabs>
      </Content>
      <Drawer
        visible={open}
        onClose={() => {
          setOpen(false)
        }}
        width={400}
        title='Create New Assessment'
      >
        <div
          style={{
            padding: '0px 30px'
          }}
        >
          <CreateAssignmentForm setOpen={setOpen} PEAK_PROGRAMS={PEAK_PROGRAMS} />
        </div>
      </Drawer>
      <Drawer
        visible={suggestTarget}
        onClose={() => {
          setSuggestTarget(null)
          
        }}
        width={600}
        title='Target Allocation from PEAK Assessment'
      >
        {suggestTarget && <PeakTargets suggestTarget={suggestTarget} setOpen={setSuggestTarget} />}
        
      </Drawer>
      <Drawer
        visible={suggestEquiTarget}
        onClose={() => {
          setSuggestEquiTarget(null)
        }}
        width={600}
        title='Target Allocation from PEAK Equivalence Assessment'
      >
        
        {suggestEquiTarget && <EquivalenceTargets suggestTarget={suggestEquiTarget} setOpen={setSuggestEquiTarget} />}
      </Drawer>
    </Layout>
  )
}