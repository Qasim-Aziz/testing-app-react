/* eslint-disable*/
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { Form, Input, Button, Select, DatePicker, Radio, Drawer } from 'antd'
import moment from 'moment'
import gql from 'graphql-tag'

const TT = gql`
  mutation(
    $staff: ID!
    $leaveType: String!
    $fromDate: Date!
    $toDate: Date!
    $description: String!
    $note: String
    $status: String!
  ) {
    createRequestLeave(
      input: {
        staff: $staff
        leaveType: $leaveType
        fromDate: $fromDate
        toDate: $toDate
        description: $description
        note: $note
        status: $status
      }
    ) {
      details {
        id
        leaveType
        fromDate
        toDate
        description
        note
        status
        staff {
          id
          name
        }
      }
    }
  }
`
function index({ form }) {
  const [startDate, setStartDate] = useState(moment().subtract(-1, 'day'))
  const [endDate, setEndDate] = useState(moment().subtract(-2, 'day'))
  const [description, setDescription] = useState('description')
  const userId = localStorage.getItem('userId')
  const [makeLeaveReq] = useMutation(TT)

  const handleSubmitt = e => {
    e.preventDefault()
    form.validateFields((err, val) => {
      console.log(err, val)
      if (!err) {
        makeLeaveReq({
          variables: {
            staff: userId,
            leaveType: 'Casual',
            note: 'This is note',
            status: 'Pending',
            fromDate: moment(startDate).format('YYYY-MM-DD'),
            toDate: endDate.format('YYYY-MM-DD'),
            description,
          },
        })
          .then(res => console.log(res, 're s re s'))
          .catch(error => console.log(error, 'erorroor er'))
      }
    })
  }

  return (
    <div>
      <Form onSubmit={handleSubmitt}>
        <DatePicker value={startDate} onChange={e => setStartDate(e)} />
        <DatePicker value={endDate} onChange={e => setEndDate(e)} />
        <Input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="description"
        ></Input>
        <Button htmlType="submit" type="primary">
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default Form.create()(index)
