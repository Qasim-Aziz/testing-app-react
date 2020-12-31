import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row, Col, Button, Layout, Typography, Drawer, Tooltip } from 'antd'
import { MdFilterNone, MdAddCircleOutline } from 'react-icons/md'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import MealCard from './MealCard'
import MealForm from './Mealform'
import UpdateMealForm from './UpdateForm'
import FilterCard from './FilterCard'
import FilterComp from '../../components/FilterCard/FilterComp'

const { Content } = Layout
const { Title } = Typography

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
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const [mealType, setMealType] = useState('All')
  const [mealNameSearchContent, setMealNameSerchContent] = useState('')
  const [newMealDate, setNewMealDate] = useState(date)
  const [newMeal, setNewMeal] = useState(false)
  const [mealDeleted, setMealDeleted] = useState(false)
  const [updateMealId, setUpdateMealId] = useState()
  const [mealList, setMealList] = useState()
  const [updateMeal, setUpdateMeal] = useState()
  const [updateMealForm, setUpdateMealForm] = useState()
  const [showDrawerForm, updateDrawerForm] = useState(false)
  const { openRightdrawer, closeDrawer, handleFilterToggle, filter, TabCheck, openDrawer } = props

  const studentId = localStorage.getItem('studentId')

  const mealQuery = useQuery(MEAL, {
    variables: {
      studentId,
      startDate: date,
      endDate: date,
      mealType: mealType === 'All' ? '' : mealType,
      mealNameContain: mealNameSearchContent,
    },
  })

  const { data: studnetInfo } = useQuery(STUDNET_INFO, {
    variables: {
      studentId,
    },
  })

  useEffect(() => {
    if (mealQuery.data) {
      setMealList([...mealQuery.data.getFood.edges])
    }
  }, [mealQuery.data])

  useEffect(() => {
    if (updateMealId) {
      setUpdateMealForm(true)
    } else {
      setUpdateMealForm(false)
    }
  }, [updateMealId])

  useEffect(() => {
    if (newMealDate === date && newMeal) {
      setMealList(state => {
        if (state) {
          setMealList([{ node: newMeal }, ...state])
        }
        return [{ node: newMeal }]
      })
      setNewMeal(null)
    }
  }, [newMealDate, mealQuery, date, newMeal])

  useEffect(() => {
    if (updateMeal) {
      setMealList(state => {
        return state.map(item => {
          if (item.id === updateMeal.id) {
            item.node = updateMeal
          }
          return item
        })
      })
      setUpdateMealId(null)
    }
  }, [updateMeal])

  useEffect(() => {
    if (mealDeleted) {
      mealQuery.refetch()
      setMealDeleted(false)
    }
  }, [mealDeleted, mealQuery])

  useEffect(() => {
    updateDrawerForm(openRightdrawer)
  }, [openRightdrawer])

  // const handleFilterToggle = () => {
  //   setFilter(state => !state)
  // }

  const handleSelectDate = newDate => {
    setDate(moment(newDate).format('YYYY-MM-DD'))
  }

  const handleFilterMealType = value => {
    setMealType(value)
  }

  const handleMealNameSearch = value => {
    setMealNameSerchContent(value)
  }

  // const showDrawer = () => {
  //   updateDrawerForm(true)
  // }

  // const onClickClose = () => {
  //   updateDrawerForm(false)
  // }

  return (
    <Authorize roles={['school_admin', 'parents', 'therapist']} redirect to="/dashboard/beta">
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Content
          style={{
            padding: '0px 20px',
            maxWidth: 1300,
            width: '100%',
            margin: '0px auto',
          }}
        >
          <Row>
            <Col>
              <div>
                {filter && (
                  // <div style={{marginTop:"10px"}}>
                  //   <FilterCard
                  //     dateValue={date}
                  //     handleSelectDate={handleSelectDate}
                  //     mealTypeValue={mealType}
                  //     handleFilterMealType={handleFilterMealType}
                  //     mealNameSearchValue={mealNameSearchContent}
                  //     handleMealNameSearch={handleMealNameSearch}
                  //   />
                  // </div>
                  <FilterComp handleSelectDate={handleSelectDate} />
                )}
                <div
                  style={{
                    marginTop: 17,
                  }}
                >
                  {mealQuery.loading ? (
                    'Loading...'
                  ) : (
                    <>
                      {mealQuery.error && 'Opps their something wrong'}
                      {mealList?.map(({ node }, index) => {
                        return (
                          <MealCard
                            key={node.id}
                            id={node.id}
                            mealName={node.mealType}
                            time={node.mealTime}
                            foodType={node.foodType.name}
                            mealContent={node.mealName}
                            waterValue={node.waterIntake}
                            style={{ marginTop: index !== 0 ? 10 : 0 }}
                            setMealDeleted={setMealDeleted}
                            setUpdateMealId={setUpdateMealId}
                            openDrawer={openDrawer}
                            closeDrawer={closeDrawer}
                          />
                        )
                      })}
                    </>
                  )}
                </div>
              </div>
            </Col>

            <Drawer
              title="New Meal"
              width="52%"
              placement="right"
              closable="true"
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
                />
              )}
            </Drawer>

            {/* <Col span={8} style={{ display: 'none' }}>
              <Title
                style={{
                  marginLeft: '30px',
                  fontSize: '30px',
                  lineHeight: '41px',
                }}
              >
                New Meal
              </Title>
              <div
                style={{
                  background: '#F9F9F9',
                  borderRadius: 10,
                  padding: '30px',
                }}
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
              </div>
            </Col> */}
          </Row>
        </Content>
      </Layout>
    </Authorize>
  )
}

export default MealDataPage
