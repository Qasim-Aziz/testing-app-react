/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-const */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */
/* eslint-disable no-restricted-syntax */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-prototype-builtins */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-boolean-value */

import React from 'react'
import { Helmet } from 'react-helmet'
import { Button, Drawer, Input, Select, Checkbox, Affix, Tabs } from 'antd'
import Sortable from 'react-sortablejs'
import { connect } from 'react-redux'
import { PlusOutlined } from '@ant-design/icons'
import style from './style.module.scss'
import Authorize from '../../components/LayoutComponents/Authorize'
import SessionDetails from './sessiondetails'
import TargetCard from './TargetCard'
import DeleteACard from './DeleteACard'

const { TabPane } = Tabs;
const { Search } = Input;

@connect(({ user, sessiontargetallocation }) => ({ user, sessiontargetallocation }))
class TargetAllocationToSession extends React.Component {
  state = {
    visible: false,
    searchTargetText: '',
    top: 10
  }

  componentWillMount() {
    if (localStorage.getItem('studentId')) {
      const { dispatch } = this.props

      dispatch({
        type: 'user/GET_STUDENT_NAME',
      })

      dispatch({
        type: 'sessiontargetallocation/GET_ALLOCATED_TARGETS',
        payload: {
          studentId: JSON.parse(localStorage.getItem('studentId')),
        },
      })
    } else {
      window.location.href = '/'
    }
  }

  clearAll = session => {
    // console.log('session==>', session)
  }

  showDrawer = session => {
    const { dispatch } = this.props
    dispatch({
      type: 'sessiontargetallocation/SET_STATE',
      payload: {
        CurrentSession: session,
      },
    })

    this.setState({
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  saveSessionTargets = session => {
    const {
      dispatch,
      sessiontargetallocation: {
        MorningSession,
        AfternoonSession,
        EveningSession,
        CurrentSession,
        MorningSessionId,
        AfternoonSessionId,
        EveningSessionId,
      },
    } = this.props
    let id = null
    let rawString = []
    if (session === 'Morning') {
      rawString = localStorage.getItem('Morning').split('|')
      id = MorningSession.id
    }
    if (session === 'Afternoon') {
      rawString = localStorage.getItem('Afternoon').split('|')
      id = AfternoonSession.id
    }
    if (session === 'Evening') {
      rawString = localStorage.getItem('Evening').split('|')
      id = EveningSession.id
    }

    dispatch({
      type: 'sessiontargetallocation/UPDATE_SESSION',
      payload: {
        session: session,
        id: id,
        targetList: rawString,
      },
    })
  }

  handleChangeSearchText = ({ target: { value } }) => {
    this.setState({
      searchTargetText: value,
    })
  }

  filterAllocatedTarget = value => {
    const { dispatch } = this.props

    dispatch({
      type: 'sessiontargetallocation/FILTER_TARGETS',
      payload: {
        statusId: value,
        studentId: JSON.parse(localStorage.getItem('studentId')),
      },
    })
  }

  // searchTarget = value => {
  //   // console.log('searchTarget==>', value)
  // }

  sortTargetInDesiredFormat = targetList => {
    const baseline = 'U3RhdHVzVHlwZTox'
    const intherapy = 'U3RhdHVzVHlwZToz'
    const mastered = 'U3RhdHVzVHlwZTo0'
    const inmaintainence = 'U3RhdHVzVHlwZTo1'
    const onhold = 'U3RhdHVzVHlwZTo2'
    const deleted = 'U3RhdHVzVHlwZTo3'
    const desiredListOrder = [mastered, inmaintainence, intherapy, baseline, deleted]
    const newList = []
    for (let i = 0; i < desiredListOrder.length; i++) {
      for (let j = 0; j < targetList.length; j++) {
        if (desiredListOrder[i] === targetList[j].node.targetStatus.id) {
          newList.push(targetList[j])
        }
      }
    }

    return newList
  }

  sortSession = (sessionName, isChecked) => {
    const { dispatch } = this.props
    if (sessionName === 'Morning') {
      dispatch({
        type: 'sessiontargetallocation/SET_STATE',
        payload: {
          MorningSortTargetTrue: isChecked,
          MorningSessionRandomKey: Math.random(),
        },
      })
    } else if (sessionName === 'Afternoon') {
      dispatch({
        type: 'sessiontargetallocation/SET_STATE',
        payload: {
          AfternoonSortTargetTrue: isChecked,
          AfternoonSessionRandomKey: Math.random(),
        },
      })
    } else if (sessionName === 'Evening') {
      dispatch({
        type: 'sessiontargetallocation/SET_STATE',
        payload: {
          EveningSortTargetTrue: isChecked,
          EveningSessionRandomKey: Math.random(),
        },
      })
    }
  }

  searchTarget = text => {
    let searchedTarget = []
    const {dispatch, sessiontargetallocation : {AllocatedTargetListClone}} = this.props;
    searchedTarget = AllocatedTargetListClone.filter(item => item.node.targetAllcatedDetails.targetName.includes(text))
    dispatch({
      type: 'sessiontargetallocation/SET_STATE',
      payload: {
        AllocatedTargetsList: searchedTarget,
        randomKey: Math.random()
      },
    })
  }

  render() {
    const {
      sessiontargetallocation: {
        loading,
        AllocatedTargetsList,
        MorningSession,
        AfternoonSession,
        EveningSession,
        CurrentSession,
        TargetStatusList,
        randomKey,
        MorningSessionRandomKey,
        AfternoonSessionRandomKey,
        EveningSessionRandomKey,
        MorningSortTargetTrue,
        AfternoonSortTargetTrue,
        EveningSortTargetTrue,
      },
      user: { studentName },
    } = this.props

    if (loading) {
      return 'loading targets...'
    }

    const allocatedTargetsListDivs = []
    const morningSessionDiv = []
    const afternoonSessionDiv = []
    const eveningSessionDiv = []

    AllocatedTargetsList.map(item => {
      allocatedTargetsListDivs.push(
        <TargetCard
          key={item.node.id}
          id={item.node.id}
          node={item.node}
          text={item.node.targetAllcatedDetails.targetName}
          showAllocation={true}
        />,
      )
    })

    if (MorningSession && MorningSession.targets.edges.length > 0) {
      if (MorningSortTargetTrue) {
        const sortedList = this.sortTargetInDesiredFormat(MorningSession.targets.edges)
        sortedList.map((item, index) => {
          morningSessionDiv.push(
            <TargetCard
              showDelete
              sessionId="Morning"
              key={item.node.id}
              id={item.node.id}
              node={item.node}
              srNo={index + 1}
              text={item.node.targetAllcatedDetails.targetName}
            />,
          )
        })
      } else {
        MorningSession.targets.edges.map((item, index) => {
          morningSessionDiv.push(
            <TargetCard
              key={item.node.id}
              id={item.node.id}
              node={item.node}
              srNo={index + 1}
              text={item.node.targetAllcatedDetails.targetName}
            />,
          )
        })
      }
    }

    if (AfternoonSession && AfternoonSession.targets.edges.length > 0) {
      if (AfternoonSortTargetTrue) {
        const sortedList = this.sortTargetInDesiredFormat(AfternoonSession.targets.edges)
        sortedList.map((item, index) => {
          afternoonSessionDiv.push(
            <TargetCard
              showDelete
              sessionId="Afternoon"
              srNo={index + 1}
              key={item.node.id}
              id={item.node.id}
              node={item.node}
              text={item.node.targetAllcatedDetails.targetName}
            />,
          )
        })
      } else {
        AfternoonSession.targets.edges.map((item, index) => {
          afternoonSessionDiv.push(
            <TargetCard
              // showDelete
              srNo={index + 1}
              key={item.node.id}
              id={item.node.id}
              node={item.node}
              text={item.node.targetAllcatedDetails.targetName}
            />,
          )
        })
      }
    }

    if (EveningSession && EveningSession.targets.edges.length > 0) {
      if (EveningSortTargetTrue) {
        const sortedList = this.sortTargetInDesiredFormat(EveningSession.targets.edges)
        sortedList.map((item, index) => {
          eveningSessionDiv.push(
            <TargetCard
              showDelete
              sessionId="Evening"
              srNo={index + 1}
              key={item.node.id}
              id={item.node.id}
              node={item.node}
              text={item.node.targetAllcatedDetails.targetName}
            />,
          )
        })
      } else {
        EveningSession.targets.edges.map((item, index) => {
          eveningSessionDiv.push(
            <TargetCard
              key={item.node.id}
              id={item.node.id}
              node={item.node}
              srNo={index + 1}
              text={item.node.targetAllcatedDetails.targetName}
            />,
          )
        })
      }
    }

    const targetSortableStyle = { height: 640, overflow: 'auto' }
    const sessionsSortableStyle = { height: 500, overflow: 'auto', marginTop: '10px' }

    return (
      <Authorize roles={['school_admin', 'therapist']} redirect to="/dashboard/beta">
        <div className={style.targetAllocation}>
          <Helmet title="Target Allocation To Sessions" />

          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className={style.heading}>
                <span>{studentName}&apos;s Target List</span>
              </div>
              <div className={style.heading}>
                <Input
                  placeholder="input search text"
                  onChange={e => this.searchTarget(e.target.value)}
                  // style={{ width: 200 }}
                />

                <Select
                  style={{ width: '100%', marginTop: '2px' }}
                  placeholder="Select Target Status"
                  onSelect={e => this.filterAllocatedTarget(e)}
                >
                  {TargetStatusList.reverse().map(item => {
                    return <Select.Option value={item.id}>{item.statusName}</Select.Option>
                  })}
                </Select>
              </div>
              <div className="card bg-light">
                {/* <h3 className="font-weight-bold text-dark font-size-18 mb-3">Targets</h3> */}
                <Sortable
                  key={randomKey}
                  className="py-4 px-4"
                  options={{
                    group: {
                      name: 'shared',
                      pull: 'clone',
                      // put: false, // Do not allow items to be put into this list
                      // forceFallback: true,
                      put: function (to, el, node) {
                        var check = true
                        for (var key in to.el.children) {
                          if (to.el.children.hasOwnProperty(key)) {
                            if (to.el.children[key].id === node.id) {
                              check = true
                            }
                          }
                        }
                        // console.log(to.el.children.each(function(index, value) {console.log(index, value)}), el, node)
                        // to.el.children.map(item => console.log(item))
                        return check
                        // return to.el.children.some(item => item.id === node.item.id)
                      },
                      add: function (/* *Event */ evt) {
                        console.log('trigger==>', evt)
                      },
                    },
                  }}
                  tag="div"
                  style={targetSortableStyle}
                >
                  {allocatedTargetsListDivs}
                </Sortable>
              </div>
            </div>
            <div className="col-lg-9 col-md-9">
              <Tabs defaultActiveKey="1">
                <TabPane tab="Morning" key="1">
                  {MorningSession ? (
                    <>
                      <div className={style.targetListHeding}>
                        <div className="row">
                          <div className="col-sm-3">
                            <Button
                              type="dashed"
                              className={style.detailsButton}
                              onClick={() => this.showDrawer('Morning')}
                              block
                            >
                              {' '}
                              <PlusOutlined /> Add Details
                            </Button>
                          </div>
                          <div className="col-sm-7">
                            {MorningSortTargetTrue ? '' : <DeleteACard />}
                          </div>
                          <div className="col-sm-2">
                            <Button
                              disabled={MorningSortTargetTrue}
                              onClick={() => this.saveSessionTargets('Morning')}
                              type="link"
                            >
                              Save
                            </Button>
                            <Checkbox onChange={e => this.sortSession('Morning', e.target.checked)}>
                              Sort
                            </Checkbox>
                          </div>
                        </div>

                      </div>
                      <div className="card py-3 px-2" style={{ border: '2px solid #f4f6f8' }}>
                        <Sortable
                          key={MorningSessionRandomKey}
                          options={{
                            group: {
                              name: 'shared',
                              put: function (to, el, node) {
                                var check = true
                                for (var key in to.el.children) {
                                  if (to.el.children.hasOwnProperty(key)) {
                                    if (to.el.children[key].id === node.id) {
                                      check = false
                                    }
                                  }
                                }
                                return check
                                // return to.el.children.some(item => item.id === node.item.id)
                              },
                            },
                            store: {
                              get: function (sortable) {
                                let i = 0
                                const list = []
                                for (i = 0; i < sortable.el.childNodes.length; i++) {
                                  list.push(`"${sortable.el.childNodes[i].id}"`)
                                }
                                localStorage.setItem('Morning', list.join('|'))
                              },
                              // Save the order of elements.
                              // @param {Sortable}  sortable
                              set: function (sortable) {
                                let i = 0
                                const list = []
                                for (i = 0; i < sortable.el.childNodes.length; i++) {
                                  list.push(`"${sortable.el.childNodes[i].id}"`)
                                }
                                localStorage.setItem('Morning', list.join('|'))
                              },
                            },
                          }}
                          tag="div"
                          style={sessionsSortableStyle}
                        >
                          {morningSessionDiv}
                        </Sortable>
                      </div>
                    </>

                  ) : (
                      ''
                    )}
                </TabPane>
                <TabPane tab="Afternoon" key="2">
                  {AfternoonSession ? (
                    <>
                      <div className={style.targetListHeding}>
                        <div className="row">
                          <div className="col-sm-3">
                            <Button
                              type="dashed"
                              className={style.detailsButton}
                              onClick={() => this.showDrawer('Afternoon')}
                              block
                            >
                              {' '}
                              <PlusOutlined /> Add Details
                            </Button>
                          </div>
                          <div className="col-sm-7">
                            {AfternoonSortTargetTrue ? '' : <DeleteACard />}
                          </div>
                          <div className="col-sm-2">
                            <Button
                              disabled={AfternoonSortTargetTrue}
                              onClick={() => this.saveSessionTargets('Afternoon')}
                              type="link"
                            >
                              Save
                            </Button>
                            <Checkbox onChange={e => this.sortSession('Afternoon', e.target.checked)}>
                              Sort
                            </Checkbox>
                          </div>
                        </div>
                      </div>
                      <div className="card py-3 px-2" style={{ border: '2px solid #f4f6f8' }}>
                        <Sortable
                          key={AfternoonSessionRandomKey}
                          options={{
                            group: {
                              name: 'shared',
                              put: function (to, el, node) {
                                var check = true
                                for (var key in to.el.children) {
                                  if (to.el.children.hasOwnProperty(key)) {
                                    if (to.el.children[key].id === node.id) {
                                      check = false
                                    }
                                  }
                                }
                                return check
                              },
                            },
                            store: {
                              // Get the order of elements. Called once during initialization.
                              // @param   {Sortable}  sortable
                              // @returns {Array}
                              get: function (sortable) {
                                console.log(sortable.el.childNodes)
                                let i = 0
                                const list = []
                                for (i = 0; i < sortable.el.childNodes.length; i++) {
                                  list.push(`"${sortable.el.childNodes[i].id}"`)
                                }
                                localStorage.setItem('Afternoon', list.join('|'))
                              },
                              // Save the order of elements.
                              // @param {Sortable}  sortable
                              set: function (sortable) {
                                let i = 0
                                const list = []
                                for (i = 0; i < sortable.el.childNodes.length; i++) {
                                  list.push(`"${sortable.el.childNodes[i].id}"`)
                                }
                                localStorage.setItem('Afternoon', list.join('|'))
                              },
                            },
                          }}
                          tag="div"
                          style={sessionsSortableStyle}
                        >
                          {afternoonSessionDiv}
                        </Sortable>
                      </div>
                    </>
                  ) : (
                      ''
                    )}
                </TabPane>
                <TabPane tab="Evening" key="3">
                  {EveningSession ? (
                    <>
                      <div className={style.targetListHeding}>
                        <div className="row">
                          <div className="col-sm-3">
                            <Button
                              type="dashed"
                              className={style.detailsButton}
                              onClick={() => this.showDrawer('Evening')}
                              block
                            >
                              {' '}
                              <PlusOutlined /> Add Details
                            </Button>
                          </div>
                          <div className="col-sm-7">
                            {EveningSortTargetTrue ? '' : <DeleteACard />}
                          </div>
                          <div className="col-sm-2">
                            <Button
                              disabled={EveningSortTargetTrue}
                              onClick={() => this.saveSessionTargets('Evening')}
                              type="link"
                            >
                              Save
                            </Button>
                            <Checkbox onChange={e => this.sortSession('Evening', e.target.checked)}>
                              Sort
                            </Checkbox>
                          </div>
                        </div>
                      </div>
                      <div className="card py-3 px-2" style={{ border: '2px solid #f4f6f8' }}>
                        <Sortable
                          key={EveningSessionRandomKey}
                          options={{
                            group: {
                              name: 'shared',
                              put: function (to, el, node) {
                                var check = true
                                for (var key in to.el.children) {
                                  if (to.el.children.hasOwnProperty(key)) {
                                    if (to.el.children[key].id === node.id) {
                                      check = false
                                    }
                                  }
                                }
                                return check
                              },
                            },
                            // onRemove: (node) => {
                            //     console.log(node.type)
                            //     console.log(node.item.id)
                            //     console.log(node.item.innerText)
                            //     console.log(node)

                            //     const newItems = this.state.eveningSession.filter(item => item.key !== node.item.id);
                            //     this.setState({ eveningSession: newItems })
                            // },
                            // onAdd: (node) => {
                            //     console.log(node.type)
                            //     console.log(node.item.id)
                            //     console.log(node.item.innerText)
                            //     console.log(node)
                            //     this.setState({ eveningSession: [...this.state.eveningSession, { key: node.item.id, text: node.item.innerText }] });
                            // },
                            store: {
                              // Get the order of elements. Called once during initialization.
                              // @param   {Sortable}  sortable
                              // @returns {Array}
                              get: function (sortable) {
                                console.log(sortable.el.childNodes)
                                let i = 0
                                const list = []
                                for (i = 0; i < sortable.el.childNodes.length; i++) {
                                  list.push(`"${sortable.el.childNodes[i].id}"`)
                                }
                                localStorage.setItem('Evening', list.join('|'))
                              },
                              // Save the order of elements.
                              // @param {Sortable}  sortable
                              set: function (sortable) {
                                let i = 0
                                const list = []
                                for (i = 0; i < sortable.el.childNodes.length; i++) {
                                  list.push(`"${sortable.el.childNodes[i].id}"`)
                                }
                                // this.printDetails()
                                localStorage.setItem('Evening', list.join('|'))
                                // var order = sortable.toArray();
                                // localStorage.setItem(sortable.options.group.name, order.join('|'));
                              },
                            },
                          }}
                          tag="div"
                          style={sessionsSortableStyle}
                        >
                          {eveningSessionDiv}
                        </Sortable>

                        {/* <div>
                    <Button
                      type="dashed"
                      className={style.clearAllButton}
                      onClick={() => this.clearAll('Evening')}
                      block
                    >
                      Clear All
                    </Button>
                  </div> */}
                      </div>
                    </>
                  ) : (
                      ''
                    )}
                </TabPane>
              </Tabs>
            </div>




          </div>
          <Drawer
            title={`${CurrentSession} Session`}
            placement="right"
            width="400px"
            closable={false}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <SessionDetails key={CurrentSession} />
          </Drawer>
        </div>
      </Authorize>
    )
  }
}

export default TargetAllocationToSession
