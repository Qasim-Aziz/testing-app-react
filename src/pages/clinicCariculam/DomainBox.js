/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import { Button, Card, Typography, Input, Modal, notification, AutoComplete, Tooltip } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import Scrollbars from 'react-custom-scrollbars'
import gql from 'graphql-tag'
import { useMutation, useLazyQuery } from 'react-apollo'
import { COLORS } from 'assets/styles/globalStyles'
import DoaminCard from './DoaminCard'
import { DOMAIN } from './query'

const { Title, Text } = Typography
const { Search } = Input

const CREATE_DOMAIN = gql`
  mutation domainProgram($label: String!, $key: String!, $programArea: ID!) {
    domainProgram(input: { programArea: $programArea, key: $key, label: $label }) {
      domain {
        id
        domain
        targetArea {
          edges {
            node {
              id
              Area
            }
          }
        }
      }
    }
  }
`

const FILTER_DOMAIN = gql`
  query($text: String!) {
    domain(domain_Icontains: $text, isActive: true) {
      edges {
        node {
          id
          domain
          targetArea {
            edges {
              node {
                id
                Area
              }
            }
          }
        }
      }
    }
  }
`

// TODO
// take text input vlaue

const DomainBox = ({ domains, selectDomain, handleSelectDomain, programArea }) => {
  const userRole = useSelector(state => state.user.role)
  const [liveDomains, setLiveDomains] = useState(domains)
  const [createDomainModel, setCreateDomainModel] = useState(false)
  const [searchText, setSearchText] = useState()

  const [resutl, setResult] = useState(domains)
  const [newDomainName, setNewDomainName] = useState('')
  const [key, setKey] = useState('mand1')

  const [updateDomain, setUpdateDomain] = useState()

  const [filterDomain, { data: filterDomainData, loading: filterDomainLoading }] = useLazyQuery(
    FILTER_DOMAIN,
    {
      variables: {
        text: searchText,
      },
    },
  )

  const [
    createDomain,
    { data: createDomainData, error: createDomainError, loading: createDomainLoading },
  ] = useMutation(CREATE_DOMAIN, {
    variables: {
      label: key !== 'mand1' ? 'mand1' : newDomainName,
      key: key === 'mand1' ? newDomainName : key,
      programArea,
    },
    update(cache, { data }) {
      const cacheData = cache.readQuery({
        query: DOMAIN,
        variables: {
          programArea,
        },
      })

      cache.writeQuery({
        query: DOMAIN,
        variables: {
          programArea,
        },
        data: {
          programDetails: {
            domain: {
              edges: [
                {
                  node: data.domainProgram.domain,
                  __typename: 'DomainTypeEdge',
                },
                ...cacheData.programDetails.domain.edges,
              ],
              __typename: 'DomainTypeConnection',
            },
          },
        },
      })
    },
  })

  const handelNewDomainSearch = value => {
    let res = []

    if (!value) {
      res = domains
    } else {
      // eslint-disable-next-line consistent-return
      res = domains
        // eslint-disable-next-line consistent-return
        .map(domain => {
          if (domain.node.domain.toLowerCase().match(value.toLowerCase())) {
            return domain
          }
        })
        .filter(Boolean)
    }

    setResult(res)
  }

  const handelCreateDomainModel = () => setCreateDomainModel(state => !state)

  const handelCreateNewDomain = () => {
    if (newDomainName) {
      createDomain()
    } else {
      notification.info({
        message: 'Please type or select a domain name',
      })
    }
  }

  useEffect(() => {
    if (updateDomain) {
      setLiveDomains(state => {
        const newState = []
        state.map(domain => {
          if (domain.node.id === updateDomain.id) {
            domain.node.name = updateDomain.name
          }
          newState.push(domain)
        })
        return newState
      })
    }
  }, [updateDomain])

  useEffect(() => {
    if (filterDomainData) {
      setLiveDomains(filterDomainData.domain.edges)
    } else {
      setLiveDomains(domains)
    }
  }, [domains, filterDomainData])

  useEffect(() => {
    if (searchText) {
      filterDomain()
    }
  }, [filterDomain, searchText])

  useEffect(() => {
    if (createDomainData) {
      notification.success({
        message: 'Clinic Curriculam',
        description: 'Create Domain Successfully',
      })
      setNewDomainName('')
      setKey('mand1')
      setCreateDomainModel(false)
    }
  }, [createDomainData])

  useEffect(() => {
    if (createDomainError) {
      notification.error({
        message: 'Something went wrong',
        description: createDomainError.message,
      })
    }
  }, [createDomainError])

  return (
    <Card
      style={{
        borderRadius: 0,
        background: COLORS.palleteLight,
        minHeight: '65vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 26,
        }}
      >
        <Title style={{ fontSize: 24, fontWeight: 'bold', lineHeight: '33px' }}>Domain</Title>
        {userRole === 'school_admin' || userRole === 'superUser' ? (
          <Tooltip placement="topRight" title="Click here to add domain">
            <Button type="link" onClick={handelCreateDomainModel}>
              <PlusOutlined style={{ fontSize: 24 }} />
            </Button>
          </Tooltip>
        ) : (
          ''
        )}
      </div>
      <Search
        style={{ height: 40 }}
        placeholder="Search Domains"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
      />
      {filterDomainLoading && <Text style={{ marginTop: 24 }}>Loading...</Text>}
      <Scrollbars style={{ marginTop: 24, height: '600px' }} autoHide>
        {liveDomains.map(({ node }, index) => {
          return (
            <DoaminCard
              id={node.id}
              selected={selectDomain && selectDomain.id === node.id ? true : null}
              title={node.domain}
              setUpdateDomain={setUpdateDomain}
              targetAreas={node.targetAreas}
              handleSelectDomain={handleSelectDomain(node)}
              key={node.id}
              programArea={programArea}
              style={{
                margin: '0 20px 0 0',
                marginTop: index === 0 ? 0 : 16,
              }}
            />
          )
        })}
      </Scrollbars>
      <Modal
        visible={createDomainModel}
        title="Title"
        onCancel={handelCreateDomainModel}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handelCreateNewDomain}
            loading={createDomainLoading}
          >
            Create
          </Button>,
        ]}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
          }}
        >
          <AutoComplete
            value={newDomainName}
            onSearch={handelNewDomainSearch}
            onSelect={v => setKey(v)}
            onChange={v => setNewDomainName(v)}
            size="large"
            style={{
              width: '100%',
            }}
            placeholder="Please type the domain name"
          >
            {resutl.map(({ node }) => {
              return (
                <AutoComplete.Option key={node.id} value={node.id} name={node.domain}>
                  {node.domain}
                </AutoComplete.Option>
              )
            })}
          </AutoComplete>
        </div>
      </Modal>
    </Card>
  )
}

export default DomainBox
