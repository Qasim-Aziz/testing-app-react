import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Popover, notification } from 'antd'
import { COLORS } from 'assets/styles/globalStyles'
import moment from 'moment'
import { combineDateAndTime } from 'utilities'
import { useMutation } from 'react-apollo'
import { CREATE_APPOINTMENT } from './query'

const True = true

const Timeslot = ({
  selectedTimeSlot,
  selectedDate,
  isAvailable,
  selectedTherapist,
  allTherapist,
  pendingStatusId,
  refetchAvailableSlotTime,
}) => {
  const [isPopoverVisible, setPopoverVisible] = useState(false)
  const [titleText, setTitleText] = useState()
  const [noteText, setNoteText] = useState()
  const [purposeText, setPurposeText] = useState()
  const studentId = localStorage.getItem('studentId')

  const [
    createAppointment,
    {
      data: createAppointmentData,
      error: createAppointmentError,
      loading: isCreateAppointmentLoading,
    },
  ] = useMutation(CREATE_APPOINTMENT)

  useEffect(() => {
    if (createAppointmentData && createAppointmentData.CreateAppointment) {
      notification.success({ message: 'Appointment created successfully.' })
      if (refetchAvailableSlotTime)
        refetchAvailableSlotTime({
          variables: {
            therapistId: selectedTherapist,
            date: selectedDate.format('YYYY-MM-DD'),
          },
        })
    }
  }, [createAppointmentData])

  useEffect(() => {
    if (createAppointmentError) {
      console.log(createAppointmentError)
      notification.error({
        message: 'Error! please check your timings or you already have appointment',
        // message: createAppointmentError[0]?.message,
        duration: 10,
      })
    }
  }, [createAppointmentError])


  const getDateTime = momentObj => momentObj.local().utc().format('YYYY-MM-DDTHH:mm:ssZ')


  const bookAppointment = e => {
    e.preventDefault()
    console.log("selectedTimeSlot ===>", selectedTimeSlot)
    console.log("selectedDate ===>", selectedDate)
    console.log(combineDateAndTime(selectedDate, moment(selectedTimeSlot, 'HH:mm a')))
    console.log("slot time asdhahsjdhas =======> ", getDateTime(selectedDate))
    if (!titleText || !purposeText) {
      notification.error({
        message: 'Appointment Title and purpose is required',
        // message: createAppointmentError[0]?.message, 
        duration: 5
      })
    }
    else {
      createAppointment({
        variables: {
          title: titleText,
          studentId,
          therapistId: selectedTherapist,
          note: noteText,
          purposeAssignment: purposeText,
          startDateAndTime: combineDateAndTime(selectedDate, moment(selectedTimeSlot, 'HH:mm a')),
          endDateAndTime: combineDateAndTime(selectedDate, moment(selectedTimeSlot, 'HH:mm a')),
          slotDate: selectedDate.format('YYYY-MM-DD'),
          slotTime: selectedTimeSlot,
          appointmentStatus: pendingStatusId,
        },
        errorPolicy: 'all'
      })
      setPopoverVisible(false)
    }
    
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
        label="Title"
        labelAlign="left"
        labelCol={{ xs: { span: 24 } }}
        wrapperCol={{ xs: { span: 24 } }}
      >
        <Input
          onChange={e => setTitleText(e.target.value)}
          value={titleText}
          placeholder="Enter Title"
        />
      </Form.Item>

      <Form.Item
        label="Purpose"
        labelAlign="left"
        labelCol={{ xs: { span: 24 } }}
        wrapperCol={{ xs: { span: 24 } }}
      >
        <Input
          onChange={e => setPurposeText(e.target.value)}
          value={purposeText}
          placeholder="Enter Purpose"
        />
      </Form.Item>

      <Form.Item
        label="Note"
        labelAlign="left"
        labelCol={{ xs: { span: 24 } }}
        wrapperCol={{ xs: { span: 24 } }}
      >
        <Input.TextArea
          onChange={e => setNoteText(e.target.value)}
          autoSize={{ minRows: 3, maxRows: 5 }}
          value={noteText}
          placeholder="Enter note"
        />
      </Form.Item>

      <Form.Item style={{ textAlign: 'center' }} wrapperCol={{ xs: { span: 24 } }}>
        <Button type="primary" htmlType="submit" disabled={isCreateAppointmentLoading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )

  return (
    <>
      {isAvailable === True ? (
        <Popover
          content={popoverContent}
          title="Book Appointment"
          trigger="click"
          visible={isPopoverVisible}
          onVisibleChange={setPopoverVisible}
        >
          <Button size="large" style={{ width: '80%' }} disabled={isCreateAppointmentLoading}>
            {selectedTimeSlot}
          </Button>
        </Popover>
      ) : (
        <Button
          size="large"
          style={{ width: '80%', backgroundColor: COLORS.palleteLightBlue }}
          disabled
        >
          {selectedTimeSlot}
        </Button>
      )}
    </>
  )
}

export default Timeslot
