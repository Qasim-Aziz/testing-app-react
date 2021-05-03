import gql from 'graphql-tag'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'

const customStyles = {
  header: {
    style: {
      maxHeight: '50px',
    },
  },
  headRow: {
    style: {
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: '#ddd',
      backgroundColor: '#f5f5f5',
    },
  },
  headCells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: '#ddd',
      },
      fontWeight: 'bold',
      fontSize: '13px',
    },
  },
  cells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: '#ddd',
      },
      fontSize: '12px',
    },
  },
  pagination: {
    style: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      borderTopStyle: 'none',
      minHeight: '35px',
    },
  },
  table: {
    style: {
      paddingBottom: '40px',
      top: '40px',
    },
  },
}

const GET_ACTIVITIES_QUERY = gql`
  query {
    getActivity {
      edges {
        node {
          activityType {
            id
            name
          }
          id
          user {
            id
            firstName
            lastName
          }
          subject
          date
          length
          addNote
        }
      }
    }
  }
`

const GET_ACTIVITY_TYPES_QUERY = gql`
  query {
    getActivityType {
      id
      name
    }
  }
`

const TherapistActivityList = () => {
  const { data } = useQuery(GET_ACTIVITIES_QUERY)
  const { data: actType } = useQuery(GET_ACTIVITY_TYPES_QUERY)
  console.log(data)

  const [therapists, setTherapists] = useState([])
  const [visible, setVisible] = useState(false)

  const [selectedActivity, setSelectedActivity] = useState()
  const [type, setType] = useState('')
  const [subject, setSubject] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(moment())
  const [length, setLength] = useState('')

  useEffect(() => {
    if (data) {
      const therapist = data.getActivity.edges.length > 0 && data.getActivity.edges.map(i => i.node)
      console.log(therapist)
      setTherapists(therapist)
    }
  }, [data])
  return (
    <>
      <h1>this is therapist activity log list</h1>
    </>
  )
}

export default TherapistActivityList
