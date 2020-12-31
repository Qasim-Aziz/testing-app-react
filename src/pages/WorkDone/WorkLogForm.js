import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, notification, TimePicker } from 'antd'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import './workForm.scss'
import TextArea from 'antd/lib/input/TextArea'

const { Option } = Select

const CREATE_TOILET_DATA = gql`
  mutation CreateTimesheet(
    $title: String!
    $location: ID!
    $note: String
    $start: DateTime!
    $end: DateTime!
  ) {
    CreateTimesheet(
      input: {
        timesheet: { title: $title, location: $location, note: $note, start: $start, end: $end }
      }
    ) {
      timesheet {
        id
      }
    }
  }
`

const SCHOOL_LOCATION = gql`
  query {
    schoolLocation {
      edges {
        node {
          id
          location
        }
      }
    }
  }
`

export default ({ style, setNewLogCreated }) => {
  const [title, setTitle] = useState()
  const [location, setLocation] = useState()
  const [note, setNote] = useState()
  const [start, setStart] = useState()
  const [end, setEnd] = useState()

  const { data: locationData, loading: locationLoading } = useQuery(SCHOOL_LOCATION)

  const [CreateLog, { data, error }] = useMutation(CREATE_TOILET_DATA, {
    variables: {
      title,
      location,
      note,
      start,
      end,
    },
  })

  const SubmitForm = e => {
    e.preventDefault()
    CreateLog()
  }

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Work Data',
        description: 'New Work Log Added Successfully',
      })
      setNewLogCreated(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Somthing want wrong',
        description: error,
      })
    }
  }, [error])

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  return (
    <Form
      onSubmit={e => SubmitForm(e, this)}
      name="control-ref"
      style={{ marginLeft: 0, ...style }}
    >
      <Form.Item label="Titile">
        <Input
          required
          placeholder="title"
          size="large"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </Form.Item>

      <Form.Item label="Start & End Time">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <TimePicker
            size="large"
            style={{
              width: '45%',
            }}
            required
            onChange={newTime => setStart(newTime)}
          />
          <TimePicker
            size="large"
            style={{
              width: '45%',
            }}
            required
            onChange={newTime => setEnd(newTime)}
          />
        </div>
      </Form.Item>

      <Form.Item label="Geolocation">
        <Select
          required
          size="large"
          showSearch
          optionFilterProp="location"
          loading={locationLoading}
          onChange={value => setLocation(value)}
        >
          {locationData &&
            locationData.schoolLocation.edges.map(({ node }) => (
              <Option value={node.id} location={node.location}>
                {node.location}
              </Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item label="Notes">
        <TextArea
          style={{ width: '100%', resize: 'none', height: 150 }}
          size="large"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: '100%',
            height: 40,
            background: '#0B35B3',
          }}
        >
          Save Data
        </Button>
      </Form.Item>
    </Form>
  )
}
