import React, { useState, useEffect } from 'react'
import { Select, DatePicker, Form, Button, Table, Drawer, notification } from 'antd'
import moment from 'moment'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { CloudDownloadOutlined } from '@ant-design/icons'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { useDispatch } from 'react-redux'
import SessionFeedbackForm from 'pages/sessionFeedback'
import {
  GET_APPOINTMENTS,
  GET_LEARNERS,
  GET_THERAPIST,
  GET_APPOINTMENT_STATUSES,
  UPDATE_APPOINTMENT_STATUS,
} from './query'
import './style.scss'

const { RangePicker } = DatePicker
const { Option } = Select

const AppointmentReport = () => {
  const [selectedLearner, setSelectedLearner] = useState()
  const [selectedTherapist, setSelectedTherapist] = useState()
  const [selectedDateRange, setSelectedDateRange] = useState([moment().subtract(6, 'd'), moment()])
  const [appointmentList, setAppointmentList] = useState([])
  const [feedbackDrawer, setFeedbackDrawer] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState()

  const { data: allLearners, loading: isLearnerLoading } = useQuery(GET_LEARNERS)
  const { data: allTherapist, loading: isTherapistLoading } = useQuery(GET_THERAPIST)
  const { data: allAppointment, loading: isAppointmentLoading } = useQuery(GET_APPOINTMENTS, {
    variables: {
      dateFrom: moment(selectedDateRange[0]).format('YYYY-MM-DD'),
      dateTo: moment(selectedDateRange[1]).format('YYYY-MM-DD'),
      studentId: selectedLearner,
      therapistId: selectedTherapist,
    },
  })
  const { data: allAppointmentStatus, loading: allAppointmentStatusLoading } = useQuery(
    GET_APPOINTMENT_STATUSES,
  )
  const [
    updateAppointmentStatus,
    { data: updateAppointmentStatusData, error: updateAppointmentStatusError },
  ] = useMutation(UPDATE_APPOINTMENT_STATUS)

  const dispatch = useDispatch()

  useEffect(() => {
    if (allAppointment) {
      const processedAppointments = allAppointment.appointments.edges.map(({ node }) => ({
        id: node.id,
        studentName: `${node?.student?.firstname} ${node?.student?.lastname}`,
        therapistName: `${node?.therapist?.name} ${node?.therapist?.surname}`,
        startTime: moment(node.start).format('YYYY-MM-DD HH:mm'),
        endTime: moment(node.end).format('YYYY-MM-DD HH:mm'),
        isApproved: node.isApproved,
        title: node.title,
        purposeAssignment: node.purposeAssignment ?? 'N/A',
        status: node?.appointmentStatus?.id,
        note: node.note,
        location: node?.location?.location ?? 'N/A',
      }))

      setAppointmentList(processedAppointments)
    }
  }, [allAppointment])

  const appointmentColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
    },
    {
      title: 'Student Name',
      dataIndex: 'studentName',
    },
    {
      title: 'Therapist Name',
      dataIndex: 'therapistName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (text, record) => (
        <Select
          placeholder="Select Status"
          loading={allAppointmentStatusLoading}
          value={text}
          onChange={value => saveAppointmentStatus(record.id, value)}
          style={{ width: 100 }}
        >
          {allAppointmentStatus &&
            allAppointmentStatus.appointmentStatuses.map(node => (
              <Option key={node.id} value={node.id}>
                {node.appointmentStatus}
              </Option>
            ))}
        </Select>
      ),
    },
    {
      title: 'Feedback',
      dataIndex: '',
      align: 'center',
      render: (text, record) => {
        return (
          <Button type="link" onClick={() => showFeedback(record.id)} size="small">
            Feedback
          </Button>
        )
      },
    },
  ]

  const exportToCSV = () => {
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

    const dataToExport = appointmentList.map(item => ({
      Title: item.title,
      'Student Name': item.studentName,
      'Therapist Name': item.therapistName,
      'Start Time': item.startTime,
      'End Time': item.endTime,
      'Purpose Assignment': item.purposeAssignment,
      Note: item.note,
      Location: item.location,
      'Is Approved': item.isApproved,
      Status: item.status,
    }))

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const excelData = new Blob([excelBuffer], { type: fileType })

    const startDate = moment(selectedDateRange[0]).format('YYYY_MM_DD')
    const endDate = moment(selectedDateRange[1]).format('YYYY_MM_DD')
    FileSaver.saveAs(excelData, `Appointments_${startDate}-${endDate}.xlsx`)
  }

  const showFeedback = id => {
    setFeedbackDrawer(true)

    setSelectedAppointmentId(id)
    dispatch({
      type: 'feedback/SET_STATE',
      payload: {
        AppointmnetId: id,
      },
    })
  }

  const saveAppointmentStatus = (appointmentId, newStatus) => {
    updateAppointmentStatus({
      variables: {
        appointmentId,
        newStatus,
      },
    })
  }

  useEffect(() => {
    if (updateAppointmentStatusData)
      notification.success({ message: 'Status updated successfully.' })
  }, [updateAppointmentStatusData])

  useEffect(() => {
    if (updateAppointmentStatusError)
      notification.error({ message: 'An error occurred to update status.' })
  }, [updateAppointmentStatusError])

  return (
    <div className="appointmentReport">
      <Form layout="inline" className="filterCard">
        <Form.Item label="Learner">
          <Select
            placeholder="Select Learner"
            loading={isLearnerLoading}
            showSearch
            allowClear
            optionFilterProp="children"
            value={selectedLearner}
            onChange={setSelectedLearner}
            style={{ width: '150px' }}
          >
            {allLearners?.students?.edges?.map(({ node: { id, firstname, lastname } }) => (
              <Option key={id} value={id}>
                {`${firstname} ${lastname}`}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Thetapist">
          <Select
            placeholder="Select Therapist"
            loading={isTherapistLoading}
            showSearch
            allowClear
            optionFilterProp="children"
            value={selectedTherapist}
            onChange={setSelectedTherapist}
            style={{ width: '150px' }}
          >
            {allTherapist?.staffs?.edges?.map(({ node: { id, name, surname } }) => (
              <Option key={id} value={id}>
                {`${name} ${surname}`}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Date">
          <RangePicker
            value={selectedDateRange}
            onChange={setSelectedDateRange}
            size="default"
            className="datePicker"
          />
        </Form.Item>
        <Form.Item style={{ float: 'right', marginRight: 0 }}>
          <Button
            type="primary"
            htmlType="button"
            disabled={isAppointmentLoading || appointmentList.length === 0}
            onClick={exportToCSV}
          >
            <CloudDownloadOutlined /> Export
          </Button>
        </Form.Item>
      </Form>

      <div style={{ padding: '10px' }}>
        <Table
          loading={isAppointmentLoading}
          className="payorTable"
          rowKey="id"
          columns={appointmentColumns}
          dataSource={appointmentList}
          pagination={{
            position: 'both',
            showSizeChanger: true,
            pageSizeOptions: ['25', '50', '100', '250'],
          }}
          size="small"
          bordered
          expandRowByClick
          expandedRowRender={row => (
            <>
              <p style={{ margin: 0 }}>
                <b>Is Approved: </b>
                {row.isApproved ? 'Yes' : 'No'}
              </p>
              <p style={{ margin: 0 }}>
                <b>Purpose Assignment: </b>
                {row.purposeAssignment}
              </p>
              <p style={{ margin: 0 }}>
                <b>Location: </b>
                {row.location}
              </p>
              <p style={{ margin: 0 }}>
                <b>Note: </b>
                {row.note}
              </p>
            </>
          )}
        />
      </div>

      <Drawer
        title="Give Session Feedback"
        placement="right"
        width="500px"
        closable
        onClose={() => setFeedbackDrawer(false)}
        visible={feedbackDrawer}
      >
        <SessionFeedbackForm appointmentId={selectedAppointmentId} key={selectedAppointmentId} />
      </Drawer>
    </div>
  )
}

export default AppointmentReport
