/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react'
import { Row, Col, Button, Input, Form, Select, Typography, notification, Modal } from 'antd'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import fatherAndSon from '../../images/fatherAndSon2.jpg'
import dawn from '../../icons/dawn.png'
import afternoonsun from '../../icons/afternoon.svg'
import moon from '../../icons/moon.png'
import TimeSpend from './TimeSpend'
import MemersTags from './MemersTags'
import client from '../../apollo/config'

@connect(({ user, family }) => ({ user, family }))
class FamilyBasicForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: true,
      relationId: '',
      relationName: '',
      memberId: '',
      memberName: '',
      morning: 0,
      afternoon: 0,
      evening: 0,
      newMember: false,
      siblingsArray: [],
      siblingsCount: 0,
      grandParentsArray: [],
      grandParentsCount: 0,
      otherMembersArray: [],
      otherMembersCount: 0,
      confirmationModalVisible: false,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props

    dispatch({
      type: 'user/GET_STUDENT_NAME',
    })

    this.setState({
      isLoaded: false,
    })
  }

  componentDidUpdate(prevProps) {
    const { processData, family, form, familyMembers, updatedMember } = this.props
    if (
      prevProps.processData.relationId !== processData.relationId &&
      prevProps.processData.relationName !== processData.relationName
    ) {
      let obj = {}
      if (!processData.newMember) {
        const i = family.familyMembers.findIndex(
          val => val.node.relationship.name === processData.relationName,
        )
        if (i > -1) {
          let [m, a, e] = [0, 0, 0]
          const timeData = family.familyMembers[i].node.timeSpent.edges.map(val => {
            if (val.node.sessionName.name === 'Morning') {
              m = parseInt(val.node.duration.slice(0, 1), 10)
            } else if (val.node.sessionName.name === 'Afternoon') {
              a = parseInt(val.node.duration.slice(0, 1), 10)
            } else {
              e = parseInt(val.node.duration.slice(0, 1), 10)
            }
            return null
          })
          const siblingsArray = family.familyMembers.filter(val => {
            return val.node.relationship.name === 'Sibling'
          })
          const siblingsCount = siblingsArray.length
          const grandParentsArray = family.familyMembers.filter(
            val => val.node.relationship.name === 'Grand Parents',
          )
          const grandParentsCount = grandParentsArray.length
          const otherMembersArray = family.familyMembers.filter(
            val => val.node.relationship.name === 'Other Members',
          )
          const otherMembersCount = otherMembersArray.length
          obj = {
            relationId: processData.relationId,
            relationName: processData.relationName,
            memberId: family.familyMembers[i].node.id,
            memberName: family.familyMembers[i].node.memberName,
            morning: m,
            afternoon: a,
            evening: e,
            newMember: false,
            currentIndex: 0,
            siblingsArray,
            siblingsCount,
            grandParentsCount,
            grandParentsArray,
            otherMembersArray,
            otherMembersCount,
          }
        } else {
          const siblingsArray = family.familyMembers.filter(
            val => val.node.relationship.name === 'Sibling',
          )
          const siblingsCount = siblingsArray.length
          const grandParentsArray = family.familyMembers.filter(
            val => val.node.relationship.name === 'Grand Parents',
          )
          const grandParentsCount = grandParentsArray.length
          const otherMembersArray = family.familyMembers.filter(
            val => val.node.relationship.name === 'Other Members',
          )
          const otherMembersCount = otherMembersArray.length
          obj = {
            relationId: processData.relationId,
            relationName: processData.relationName,
            memberId: '',
            memberName: '',
            morning: 0,
            afternoon: 0,
            evening: 0,
            newMember: false,
            currentIndex: 0,
            siblingsArray,
            siblingsCount,
            grandParentsCount,
            grandParentsArray,
            otherMembersArray,
            otherMembersCount,
          }
        }
      } else {
        const siblingsArray = family.familyMembers.filter(
          val => val.node.relationship.name === 'Sibling',
        )
        const siblingsCount = siblingsArray.length
        const grandParentsArray = family.familyMembers.filter(
          val => val.node.relationship.name === 'Grand Parents',
        )
        const grandParentsCount = grandParentsArray.length
        const otherMembersArray = family.familyMembers.filter(
          val => val.node.relationship.name === 'Other Members',
        )
        const otherMembersCount = otherMembersArray.length
        obj = {
          relationId: '',
          relationName: '',
          memberId: '',
          memberName: '',
          morning: 0,
          afternoon: 0,
          evening: 0,
          newMember: false,
          currentIndex: 0,
          siblingsArray,
          siblingsCount,
          grandParentsCount,
          grandParentsArray,
          otherMembersCount,
          otherMembersArray,
        }
      }
      form.setFieldsValue({ name: obj.memberName })
      this.updateState(obj)
    }

    if (
      family.familyMembers !== prevProps.family.familyMembers ||
      family.updatedMember !== prevProps.family.updatedMember
    ) {
      let obj = {}
      const siblingsArray = family.familyMembers.filter(
        val => val.node.relationship.name === 'Sibling',
      )
      const siblingsCount = siblingsArray.length
      const grandParentsArray = family.familyMembers.filter(
        val => val.node.relationship.name === 'Grand Parents',
      )
      const grandParentsCount = grandParentsArray.length
      const otherMembersArray = family.familyMembers.filter(
        val => val.node.relationship.name === 'Other Members',
      )
      const otherMembersCount = otherMembersArray.length
      obj = {
        siblingsArray,
        siblingsCount,
        grandParentsCount,
        grandParentsArray,
        otherMembersCount,
        otherMembersArray,
      }
      this.updateState(obj)
    }
  }

  handleTime = (i, val) => {
    const { morning, afternoon, evening } = this.state
    // eslint-disable-next-line no-nested-ternary
    const key = i === 'm' ? 'morning' : i === 'a' ? 'afternoon' : 'evening'
    this.setState(state => {
      if (state[key] >= 0) {
        if (state[key] === 0 && val < 0) {
          return state
        }
        return { [key]: state[key] + val }
      }
      return state
    })
  }

  handleNextMember = index => {
    const { relationName, siblingsCount } = this.state
    const { family, form } = this.props
    const indexLength = family.familyMembers.filter(
      val => relationName === val.node.relationship.name,
    ).length
    if (index === indexLength) {
      index = 0
    }
    const memberDataUpdate = family.familyMembers.filter(
      val => relationName === val.node.relationship.name,
    )[index]
    let [m, a, e] = [0, 0, 0]

    if (memberDataUpdate) {
      const timeData = memberDataUpdate.node.timeSpent.edges.map(val => {
        if (val.node.sessionName.name === 'Morning') {
          m = parseInt(val.node.duration.slice(0, 1), 10)
        } else if (val.node.sessionName.name === 'Afternoon') {
          a = parseInt(val.node.duration.slice(0, 1), 10)
        } else {
          e = parseInt(val.node.duration.slice(0, 1), 10)
        }
        return null
      })
      form.setFieldsValue({ name: memberDataUpdate.node.memberName })
      const obj = {
        memberId: memberDataUpdate.node.id,
        memberName: memberDataUpdate.node.memberName,
        morning: m,
        afternoon: a,
        evening: e,
        newMember: false,
        currentIndex: index,
      }
      this.updateState(obj)
    }
  }

  handleMemberSubmit = e => {
    e.preventDefault()

    const { memberId, morning, evening, afternoon, relationId } = this.state
    const { dispatch, user, form } = this.props

    const studentId = localStorage.getItem('studentId')

    if (morning + evening + afternoon <= 0) {
      notification.error({
        message: 'Fill time spend hours',
        description: 'Please fill atlest 1 hour of the day',
      })
      return
    }

    if (memberId) {
      dispatch({
        type: 'family/EDIT_MEMBER',
        payload: {
          memberId,
          memberName: form.getFieldValue('name'),
          relationId,
          morning,
          evening,
          afternoon,
        },
      })
    } else {
      dispatch({
        type: 'family/CREATE_NEW',
        payload: {
          studentId,
          // studentId: user.studentId,
          memberName: form.getFieldValue('name'),
          relationId,
          morning,
          evening,
          afternoon,
        },
      })
    }
  }

  handleSelect = id => {
    this.setState(state => ({
      ...state,
      relationId: id,
    }))
  }

  updateTimer = (m, a, e) => {
    this.setState(state => ({
      ...state,
      morning: m,
      afternoon: a,
      evening: e,
    }))
  }

  handleChange = e => {
    const { form } = this.props
    const { value } = e.target
    this.setState(state => ({
      ...state,
      memberData: {
        ...state.memberData,
        memberName: value,
      },
    }))
    form.setFieldsValue({ name: value })
  }

  updateState = obj => {
    this.setState(state => ({
      ...state,
      ...obj,
    }))
  }

  addNewMember = type => {
    const { memberClickHandler, family, form } = this.props
    const relationshipId = family.relations.filter(d => d.name === type)
    if (relationshipId.length > 0) {
      memberClickHandler(relationshipId[0].id, relationshipId[0].name, true)
      this.setState(state => ({
        memberId: null,
        relationId: relationshipId[0].id,
        memberData: {
          ...state.memberData,
          memberName: '',
        },
        memberName: '',
        morning: 0,
        afternoon: 0,
        evening: 0,
      }))
    }
    form.setFieldsValue({ name: '' })
  }

  deleteMember = (member, relation) => {
    this.setState({
      deleteMember: member,
      deleteRelation: relation,
      confirmationModalVisible: true,
    })
  }

  deleteMemberConfirm = () => {
    const {
      siblingsArray,
      grandParentsArray,
      otherMembersArray,
      deleteMember: member,
      deleteRelation: relation,
    } = this.state
    let obj = {
      confirmationModalVisible: false,
    }

    client
      .mutate({
        mutation: gql`mutation {
          deleteMember(input:{pk:"${member.node.id}"})
             {
                 ok
             }
        }`,
      })
      .then(result => {
        if (result.data.deleteMember.ok) {
          notification.success({
            message: 'Family Member Deleted successfully',
          })
          if (relation === 'Sibling') {
            const filteredMember = siblingsArray.filter(sib => sib.node.id !== member.node.id)
            obj = {
              ...obj,
              siblingsArray: filteredMember,
            }
          } else if (relation === 'Grand Parents') {
            const filteredMember = grandParentsArray.filter(sib => sib.node.id !== member.node.id)
            obj = {
              ...obj,
              grandParentsArray: filteredMember,
            }
          } else {
            const filteredMember = otherMembersArray.filter(sib => sib.node.id !== member.node.id)
            obj = {
              ...obj,
              otherMembersArray: filteredMember,
            }
          }
          this.updateState(obj)
        }
      })
      .catch(error => {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Somthing want wrong',
            description: item.message,
          })
        })
      })
  }

  hideModal = () => {
    this.setState({
      confirmationModalVisible: false,
    })
  }

  render() {
    const {
      processData,
      family,
      form,
      user: { studentName },
    } = this.props
    const {
      isLoaded,
      morning,
      evening,
      afternoon,
      relationName,
      currentIndex,
      siblingsArray,
      grandParentsArray,
      otherMembersArray,
      relationId,
      memberName,
      confirmationModalVisible,
    } = this.state

    const { Text } = Typography
    if (isLoaded) {
      return <div>Loding...</div>
    }
    let memberArray = []
    if (relationName === 'Sibling') memberArray = siblingsArray
    else if (relationName === 'Grand Parents') memberArray = grandParentsArray
    else memberArray = otherMembersArray

    return (
      <Form onSubmit={this.handleMemberSubmit}>
        <div className="name-card">
          <Row className="relationship">
            <Col sm={20}>
              <Text>{relationName}</Text>
            </Col>
          </Row>
          {relationName === 'Sibling' ||
          relationName === 'Grand Parents' ||
          relationName === 'Other Members' ? (
            <MemersTags
              membersArray={memberArray}
              currentIndex={currentIndex}
              handleNextMember={this.handleNextMember}
              addNewMember={() => this.addNewMember(relationName)}
              deleteMember={member => this.deleteMember(member, relationName)}
            />
          ) : (
            <></>
          )}

          <Row
            type="flex"
            style={{
              backgroundColor: '#fff',
              height: '200px',
              boxShadow: '0 0px 0px rgba(0,0,0,0.1)',
            }}
          >
            {/* <Col sm={6}>
              <img src={fatherAndSon} alt="" className="member-image" />
            </Col> */}
            <Col sm={16}>
              <Row
                type="flex"
                justify="center"
                align="middle"
                style={{ padding: '10px 10px', flexDirection: 'column' }}
              >
                <Form.Item label="" className="form-item">
                  {form.getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Please Select Name!' }],
                  })(
                    <Input
                      name="Name"
                      placeholder="Name"
                      onChange={this.handleChange}
                      style={{ width: '100%', height: '40px' }}
                    />,
                  )}
                </Form.Item>
                <Form.Item label="" className="form-item">
                  {form.getFieldDecorator('relation', {
                    rules: [{ required: true, message: 'Please Select Name!' }],
                  })(
                    <Fragment>
                      {processData.newMember && processData.relationName === '' ? (
                        <Select
                          placeholder="Select relation with student"
                          onChange={e => this.handleSelect(e)}
                          value={relationId}
                          className="relation-select"
                        >
                          <Select.Option value={family && family.relations[2].id}>
                            {family && family.relations[2].name}
                          </Select.Option>
                          <Select.Option value={family && family.relations[3].id}>
                            {family && family.relations[3].name}
                          </Select.Option>
                          <Select.Option value={family && family.relations[4].id}>
                            {family && family.relations[4].name}
                          </Select.Option>
                        </Select>
                      ) : (
                        <Input
                          name="Relation"
                          placeholder="Relationship"
                          value={relationName}
                          disabled
                          style={{ width: '100%', height: '40px' }}
                        />
                      )}
                    </Fragment>,
                  )}
                </Form.Item>
                {(relationName === 'Sibling' || relationName === 'Grand Parents') &&
                !processData.newMember ? (
                  <Button
                    onClick={() => {
                      this.handleNextMember(currentIndex + 1)
                    }}
                  >
                    Next
                  </Button>
                ) : null}
              </Row>
            </Col>
          </Row>
        </div>
        <Row
          style={{
            margin: '0',
            padding: '14px 10px',
            boxShadow: '0 0px 0px rgba(0,0,0,0.1)',
            backgroundColor: '#fff',
          }}
        >
          <Col>
            <Text className="time-spend">How much time do you spend with {studentName}?</Text>
            {/* <Paragraph type="secondary" className="how-much-time">

            </Paragraph> */}
          </Col>
          <TimeSpend
            image={dawn}
            daySlot="Morning"
            time={morning}
            onDecrement={() => this.handleTime('m', -1)}
            onIncrement={() => this.handleTime('m', 1)}
          />
          <TimeSpend
            image={afternoonsun}
            daySlot="Afternoon"
            time={afternoon}
            onDecrement={() => this.handleTime('a', -1)}
            onIncrement={() => this.handleTime('a', 1)}
          />
          <TimeSpend
            image={moon}
            daySlot="Evening"
            time={evening}
            onDecrement={() => this.handleTime('e', -1)}
            onIncrement={() => this.handleTime('e', 1)}
          />
        </Row>
        <Button type="primary" htmlType="submit" className="save-btn">
          SAVE DETAILS
        </Button>

        <Modal
          title="Confirm Delete"
          visible={confirmationModalVisible}
          onOk={this.deleteMemberConfirm}
          onCancel={this.hideModal}
          okText="Delete"
          cancelText="Cancel"
        >
          <p>Do you want to delete Member</p>
        </Modal>
      </Form>
    )
  }
}
const FamilyForm = Form.create()(FamilyBasicForm)
export default FamilyForm
