import React, { useState } from 'react'
import { Form, Input, Button, Popover } from 'antd'
import moment from 'moment'

const Timeslot = ({ selectedTimeSlot, selectedDate, selectedTherapist, allTherapist }) => {
  const [isPopoverVisible, setPopoverVisible] = useState(false)
  const [noteText, setNoteText] = useState()
  const studentId = localStorage.getItem('studentId')

  const bookAppointment = e => {
    e.preventDefault()
    console.log('Booking Appointment with ', {
      selectedTimeSlot,
      selectedDate,
      selectedTherapist,
      noteText,
      studentId,
    })
    setPopoverVisible(false)
  }

  const popoverContent = (
    <Form className="timeslot" onSubmit={bookAppointment} size="small">
      <Form.Item
        label="Therapist"
        labelAlign="left"
        labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
      >
        {allTherapist.find(t => t.id === selectedTherapist)?.title}
      </Form.Item>

      <Form.Item
        label="Date"
        labelAlign="left"
        labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
      >
        {moment(selectedDate).format('YYYY-MM-DD')}
      </Form.Item>

      <Form.Item
        label="Time"
        labelAlign="left"
        labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
      >
        {selectedTimeSlot}
      </Form.Item>

      <Form.Item
        label="Note"
        labelAlign="left"
        labelCol={{ xs: { span: 24 } }}
        wrapperCol={{ xs: { span: 24 } }}
      >
        <Input.TextArea
          rows={2}
          onChange={e => setNoteText(e.target.value)}
          autoSize={{ minRows: 3, maxRows: 5 }}
          value={noteText}
          placeholder="Enter note"
        />
      </Form.Item>

      <Form.Item style={{ textAlign: 'center' }} wrapperCol={{ xs: { span: 24 } }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )

  return (
    <Popover
      content={popoverContent}
      title="Book Appointment"
      trigger="click"
      visible={isPopoverVisible}
      onVisibleChange={setPopoverVisible}
    >
      <Button size="large" style={{ width: '80%' }}>
        Time {selectedTimeSlot}
      </Button>
    </Popover>
  )
}

export default Timeslot
