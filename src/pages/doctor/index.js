/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react'
import { Row, Col, Input, Button, Drawer, Typography } from 'antd'
import { useQuery, useLazyQuery } from 'react-apollo'
import { PlusOutlined } from '@ant-design/icons'
import profileImg from 'images/student.jpg'
import { GET_DOCTORS, GET_DOCTOR } from './query'
import './form.scss'
import DoctorForm from './DoctorForm'
import DoctorCard from './DoctorCard'
import UpdateDoctorForm from './UpdateDoctorForm'

const { Title, Text } = Typography

const { Search } = Input

export default () => {
  const [doctorDrawer, setDoctorDrawer] = useState(false)
  const [selecteDoctor, setSelectDoctor] = useState(null)
  const [location, setLocation] = useState()
  const [updateDoctor, setUpdateDoctor] = useState(null)

  const { data, error, loading } = useQuery(GET_DOCTORS, {
    variables: {
      location,
    },
  })

  return (
    <div
      style={{
        maxWidth: 1300,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <Row gutter={[32, 0]}>
        <Col span={16}>
          <Search
            style={{ marginBottom: 4, height: 48 }}
            placeholder="Search for verified doctors near you"
            value={location}
            onChange={e => {
              console.log(e)
              setLocation(e.target.value)
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 8,
            }}
          >
            <Button size="large" onClick={() => setDoctorDrawer(true)}>
              <PlusOutlined style={{ fontSize: 24, marginTop: 4 }} />
            </Button>
          </div>
          {loading && <h4>Loading...</h4>}
          {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
          {data?.getDoctors.edges.map(({ node }) => (
            <DoctorCard
              node={node}
              key={node.id}
              setSelectDoctor={setSelectDoctor}
              setUpdateDoctor={setUpdateDoctor}
              selectDoctor={selecteDoctor}
            />
          ))}
        </Col>
        <Col span={8}>{selecteDoctor && <DoctorDetailsCard doctor={selecteDoctor} />}</Col>
      </Row>

      <Drawer
        visible={doctorDrawer}
        onClose={() => setDoctorDrawer(false)}
        width={440}
        title="Add a new doctor"
      >
        <div style={{ padding: '0px 30px' }}>
          <DoctorForm setDoctorDrawer={setDoctorDrawer} />
        </div>
      </Drawer>

      <Drawer
        visible={updateDoctor}
        onClose={() => setUpdateDoctor(null)}
        width={440}
        title="Update doctor details"
      >
        <div style={{ padding: '0px 30px' }}>
          <UpdateDoctorForm updateDoctor={updateDoctor} setUpdateDoctor={setUpdateDoctor} />
        </div>
      </Drawer>
    </div>
  )
}

const DoctorDetailsCard = ({ doctor }) => {
  const { data, error, loading } = useQuery(GET_DOCTOR, {
    variables: {
      doctorId: doctor,
    },
  })

  const [getRelatedDoctors, { data: relatedDoctor, loading: relatedDoctorLoading }] = useLazyQuery(
    GET_DOCTORS,
  )

  useEffect(() => {
    if (data) {
      getRelatedDoctors({
        variables: {
          practicingArea: data.doctorDetail.practicingArea,
        },
      })
    }
  }, [data])

  if (loading) {
    return <h4>Loading...</h4>
  }

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  return (
    <div
      style={{
        boxShadow:
          '0px 0px 1px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 2px 4px rgba(0, 0, 0, 0.04)',
        borderRadius: 8,
        padding: '36px 20px',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img
          src={profileImg}
          alt="profile"
          style={{ width: 165, height: 165, borderRadius: '50%' }}
        />
        <Title
          style={{
            fontSize: 19,
            marginTop: 8,
            marginBottom: 4,
            fontWeight: 600,
            color: '#45494E',
          }}
        >
          {data.doctorDetail?.name}
        </Title>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: '#45494E',
            display: 'block',
          }}
        >
          {data.doctorDetail?.qualification}
        </Text>
        <div>
          <Text style={{ fontSize: 13, color: 'rgba(95, 95, 95, 0.75)' }}>
            {data.doctorDetail.location} . &nbsp;
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(95, 95, 95, 0.75)' }}>
            {data.doctorDetail?.association}
          </Text>
        </div>
      </div>
      {relatedDoctorLoading && <h5>Loading...</h5>}
      {relatedDoctor && relatedDoctor.getDoctors.edges.length > 1 && (
        <div style={{ marginTop: 48 }}>
          <Title
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: '#45494E',
              marginBottom: 20,
              marginTop: 0,
            }}
          >
            Related Doctors
          </Title>
          {relatedDoctor.getDoctors.edges.map(({ node }) => {
            if (node.id === doctor) {
              return undefined
            }
            return (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: 12,
                }}
              >
                <img
                  src={profileImg}
                  alt="profile"
                  style={{ width: 60, height: 60, borderRadius: '50%' }}
                />
                <Title
                  style={{
                    fontSize: 19,
                    marginTop: 8,
                    marginBottom: 4,
                    fontWeight: 600,
                    color: '#45494E',
                  }}
                >
                  {node.name}
                </Title>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: '#45494E',
                    display: 'block',
                  }}
                >
                  {node.qualification}
                </Text>
                <div>
                  <Text style={{ fontSize: 13, color: 'rgba(95, 95, 95, 0.75)' }}>
                    {node.location} . &nbsp;
                  </Text>
                  <Text style={{ fontSize: 13, color: 'rgba(95, 95, 95, 0.75)' }}>
                    {node.association}
                  </Text>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
