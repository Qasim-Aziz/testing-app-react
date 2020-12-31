/* eslint-disable object-shorthand */
import React, { useState, useEffect } from 'react'
import { Row, Col } from 'antd'
import { useQuery } from 'react-apollo'
import DomainBox from './DomainBox'
import DomainContent from './DomainContent'
import { DOMAIN } from './query'

const TabContent = ({ programArea }) => {
  const { data, error, loading } = useQuery(DOMAIN, { variables: { programArea } })

  const [selectDomain, setSelectDomain] = useState()

  useEffect(() => {
    if (data && !selectDomain) {
      setSelectDomain(
        data.programDetails.domain.edges[0] ? data.programDetails.domain.edges[0].node : null,
      )
    }
  }, [data, selectDomain])

  useEffect(() => {
    console.log(data)
  }, [data])

  const handleSelectDomain = domain => () => {
    setSelectDomain(domain)
  }

  if (loading) {
    return 'Loading...'
  }

  if (error) {
    return 'Opps their is something wrong'
  }

  return (
    <Row gutter={[52, 0]}>
      <Col style={{ maxWidth: 460 }} span={8}>
        {data && (
          <DomainBox
            domains={data.programDetails.domain.edges}
            selectDomain={selectDomain}
            handleSelectDomain={handleSelectDomain}
            programArea={programArea}
          />
        )}
      </Col>
      {selectDomain && data && (
        <Col span={16}>
          <DomainContent domainId={selectDomain.id} programArea={programArea} />
        </Col>
      )}
    </Row>
  )
}

export default TabContent
