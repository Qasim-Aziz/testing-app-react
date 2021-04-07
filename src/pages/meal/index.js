import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import {
  Row,
  Col,
  Button,
  Table,
  Layout,
  Typography,
  Drawer,
  Form,
  Icon,
  Input,
  Popconfirm,
  notification,
} from 'antd'
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { MdFilterNone, MdAddCircleOutline } from 'react-icons/md'
import moment from 'moment'
import { useQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import { DRAWER } from 'assets/styles/globalStyles'
import MealCard from './MealCard'
import MealForm from './Mealform'
import UpdateMealForm from './UpdateForm'
import FilterCard from './FilterCard'
import FilterComp from '../../components/FilterCard/FilterComp'
import './styles.scss'

const { Content } = Layout
const { Title } = Typography
const { Search } = Input

const MEAL = gql`
  query getFood(
    $studentId: ID!
    $startDate: Date!
    $mealType: String
    $endDate: Date!
    $mealNameContain: String
  ) {
    getFood(
      student: $studentId
      mealType: $mealType
      date_Gte: $startDate
      date_Lte: $endDate
      mealName_Icontains: $mealNameContain
    ) {
      edges {
        node {
          id
          mealType
          mealName
          waterIntake
          date
          mealTime
          note
          foodType {
            id
            name
          }
        }
      }
    }
  }
`
const DELETE_MEAL = gql`
  mutation deleteFood($id: ID!) {
    deleteFood(input: { pk: $id }) {
      status
      message
    }
  }
`

const STUDNET_INFO = gql`
  query student($studentId: ID!) {
    student(id: $studentId) {
      firstname
    }
  }
`

// note: need to refector. This page code coppy from meal form so their are many unnassary code. I am on time limite now

const MealDataPage = props => {
  // const [filter, setFilter] = useState(false)
  const [startDate, setStartDate] = useState(
    moment()
      .subtract(4, 'weeks')
      .format('YYYY-MM-DD'),
  )
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
  const [mealType, setMealType] = useState('All')
  const [mealNameSearchContent, setMealNameSerchContent] = useState('')
  const [newMealDate, setNewMealDate] = useState(moment().format('YYYY-MM-DD'))
  const [newMeal, setNewMeal] = useState(false)
  const [mealDeleted, setMealDeleted] = useState(false)
  const [updateMealId, setUpdateMealId] = useState()
  const [mealList, setMealList] = useState([])
  const [updateMeal, setUpdateMeal] = useState()
  const [updateMealForm, setUpdateMealForm] = useState()
  const [showDrawerForm, updateDrawerForm] = useState(false)
  const [searchText, setSearchText] = useState()
  const { openRightdrawer, closeDrawer, handleFilterToggle, filter, TabCheck, openDrawer } = props

  const studentId = localStorage.getItem('studentId')

  const { data: mealData, loading: mealLoading, error: mealError, refetch: refetchMeal } = useQuery(
    MEAL,
    {
      variables: {
        studentId,
        startDate,
        endDate,
        mealType: mealType === 'All' ? '' : mealType,
        mealNameContain: mealNameSearchContent,
      },
    },
  )

  const [deleteMeal, { data: deleteData, error: deleteError }] = useMutation(DELETE_MEAL)

  useEffect(() => {
    if (mealData) {
      const mealTableData = mealData.getFood.edges.map(item => item.node)
      setMealList(mealTableData)
    }
  }, [mealData])

  useEffect(() => {
    if (updateMealId) {
      setUpdateMealForm(true)
    } else {
      setUpdateMealForm(false)
    }
  }, [updateMealId])

  useEffect(() => {
    if (deleteError) {
      notification.error({
        message: 'Something went wrong',
        description: 'Unable to delete meal record',
      })
    }
    if (deleteData) {
      notification.success({
        message: 'Meal Data',
        description: 'Meal Data Deleted Successfully',
      })
      refetchMeal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteData])

  useEffect(() => {
    if (moment(newMealDate).isBetween(startDate, endDate, undefined, []) && newMeal) {
      console.log('new meal created--->', newMealDate)
      setMealList(state => {
        if (state.length) {
          setMealList([...state, newMeal])
        }
        return [newMeal]
      })
      setNewMeal(null)
    }
  }, [newMealDate, mealData, startDate, newMeal])

  useEffect(() => {
    if (updateMeal) {
      setMealList(state => {
        return state.map(item => {
          if (item.id === updateMeal.id) {
            item = updateMeal
          }
          return item
        })
      })
      setUpdateMealId(null)
    }
  }, [updateMeal])

  useEffect(() => {
    if (mealDeleted) {
      refetchMeal()
      setMealDeleted(false)
    }
  }, [mealDeleted, mealError])

  useEffect(() => {
    updateDrawerForm(openRightdrawer)
  }, [openRightdrawer])

  const MealColumns = [
    {
      title: 'Meal Name',
      dataIndex: 'mealName',
      render: (text, row) => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text}
        />
      ),
    },
    {
      title: 'Meal Type',
      dataIndex: 'mealType',
      width: 150,
    },
    {
      title: 'Food Type',
      dataIndex: 'foodType',
      width: 200,
      render: (text, row) => (
        <span style={{ color: row?.foodType?.name === 'Junk Food' ? 'red' : 'green' }}>
          {row?.foodType?.name}
        </span>
      ),
    },
    {
      title: 'Water',
      dataIndex: 'waterIntake',
      width: 120,
    },
    {
      title: 'Time',
      dataIndex: 'mealTime',
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
              onClick={() => handleUpdateMeal(record.id)}
            />
            <Popconfirm
              placement="top"
              title="Delete Meal?"
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

  const handleUpdateMeal = id => {
    setUpdateMealId(id)
    openDrawer()
  }

  const confirmDelete = id => {
    deleteMeal({
      variables: {
        id,
      },
    })
  }

  const searchMeal = e => {
    // Update Text
    const text = e.target.value
    setSearchText(text)

    // Filter Meals
    if (mealData) {
      const filteredMeals = mealData.getFood.edges.filter(x =>
        x.node.mealName.toLowerCase().includes(text.toLowerCase()),
      )
      const temp = filteredMeals.map(edge => edge.node)
      setMealList(temp)
    }
  }

  const handleSelectDate = newDate => {
    setStartDate(moment(newDate[0]).format('YYYY-MM-DD'))
    setEndDate(moment(newDate[1]).format('YYYY-MM-DD'))
  }

  const handleFilterMealType = value => {
    setMealType(value)
  }

  const handleMealNameSearch = value => {
    setMealNameSerchContent(value)
  }

  return (
    <Authorize roles={['school_admin', 'parents', 'therapist']} redirect to="/dashboard/beta">
      <Helmet title="Dashboard Alpha" />
      <FilterComp
        handleSelectDate={handleSelectDate}
        startDate={startDate}
        endDate={endDate}
        searchText={searchText}
        onTextChange={searchMeal}
        rangePicker
      />
      <Row>
        <Col className="mealData">
          <div>
            <div
              style={{
                marginTop: 17,
              }}
            >
              <Table
                loading={mealLoading}
                className="mealTable"
                rowKey="id"
                columns={MealColumns}
                dataSource={mealList}
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
        </Col>
        <Layout style={{ padding: '0px' }}>
          <Content
            style={{
              padding: '0px 10px',
              maxWidth: 1300,
              width: '100%',
              margin: '0px auto',
            }}
          >
            <Drawer
              title="New Meal"
              width={DRAWER.widthL2}
              placement="right"
              closable
              visible={showDrawerForm && TabCheck === 'Meal Data'}
              onClose={closeDrawer}
            >
              {updateMealForm ? (
                <UpdateMealForm
                  handleNewMealDate={newDate => {
                    setNewMealDate(newDate)
                  }}
                  setNewMeal={setNewMeal}
                  updateMealId={updateMealId}
                  setUpdateMealId={setUpdateMealId}
                  setUpdateMeal={setUpdateMeal}
                  closeDrawer={closeDrawer}
                />
              ) : (
                <MealForm
                  handleNewMealDate={newDate => {
                    setNewMealDate(newDate)
                  }}
                  setNewMeal={setNewMeal}
                  closeDrawer={closeDrawer}
                />
              )}
            </Drawer>
          </Content>
        </Layout>
      </Row>
    </Authorize>
  )
}

export default MealDataPage
