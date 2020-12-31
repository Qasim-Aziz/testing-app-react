/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-else-return */
/* eslint-disable object-shorthand */
import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Select, Icon, Row, Col, Input, Empty, Radio } from 'antd'
import SessionCard from '../../../components/SessionCard'
import EquivalenceCard from '../../../components/SessionCard/Equivalence'
import motherSon from '../motherSon.jpg'
import {
    getEquivalenceCategory,
    getTargetsByCategory,
    getTargetsByCode
} from './Equivalence.query'

import {
    getDomainByProgramArea,
    getTargetAreaByDoimain,
    suggestTarget,
    getSearchTargets,
} from './TargetAllocation.query'
import { notNull } from '../../../utilities'

const selectTargetStyle = {
    width: '200px',
    textDecoration: 'none',
    marginRight: '20px',
}

const selectTargetAreaStyle = {
    width: '300px',
    textDecoration: 'none',
    marginRight: '20px',
}

const searchBtnStyle = {
    color: '#FFF',
    backgroundColor: '#0B35B3',
    width: '120px',
}

const cardsDivStyle = {
    height: '570px',
    overflowY: 'scroll',
    padding: '15px',
    marginTop: '30px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px'
}

const TargetsAvailableDrawer = ({
    selectedStudent,
    selectedProgram,
    allocateSessionToTarget,
    suggestedTarget,
    setSuggestedTarget,
}) => {

    const [category, setCategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [suggestedTargets, setSuggestedTargets] = useState([])
    const [loading, setLoading] = useState(false)

    const getCategory = async () => {
        const response = await getEquivalenceCategory()
        if (notNull(response)) setCategory(response.data.peakEquDomains)
    }

    const getSuggestedTargets = async () => {
        const response = await getTargetsByCategory(selectedCategory)
        if (notNull(response)) {
            setSuggestedTargets([])
            setSuggestedTargets(response.data.getPeakEquCodes.edges)
            setLoading(false)
        }
    }


    useEffect(() => {
        if (selectedCategory !== '') {
            getSuggestedTargets()
        }
    }, [selectedCategory])




    const [searchedTargets, setSearchedTargets] = useState([])
    const studentId = JSON.parse(localStorage.getItem('studentId'))

    const getSearchTargetQuery = async text => {
        const response = await getTargetsByCode(text)
        if (response) {
            setSearchedTargets([])
            setSearchedTargets(response?.data?.suggestPeakEquivalanceTargets?.targets)
            setLoading(false)
        }
    }

    const searchTargets = text => {
        if (text === "") {
            setSearchedTargets([])
        }
        else {
            getSearchTargetQuery(text)
        }
    }

    const selectCategory = text => {
        setSelectedCategory(text)
        setLoading(true)
    }



    useEffect(() => {
        getCategory()

    }, [])

    const peakEnable = true
    const equivalenceEnable = true


    return (
        <>
            <div>
                <Radio.Group onChange={(e) => selectCategory(e.target.value)}>
                    {category.map(item => (
                        <Radio.Button value={item.name}>{item.name}</Radio.Button>
                    ))}
                </Radio.Group>

                <Input placeholder="Search target by name" onChange={(e) => searchTargets(e.target.value)} style={{ width: '300px', marginLeft: '20px', float: 'right' }} />
            </div>


            <Row>
                <Col md={12} style={{ padding: '10px' }}>
                    <div
                        style={cardsDivStyle}
                    >
                        {loading ? ('Loading...') : 
                            <>
                                {suggestedTargets &&
                                    suggestedTargets.length > 0 ?
                                    <>
                                        {suggestedTargets.map(nodeItem => {
                                            return (
                                                <EquivalenceCard
                                                    key={nodeItem.node.code.id}
                                                    targetItem={nodeItem.node}
                                                    allocated={false}
                                                    allocateSessionToTarget={() => allocateSessionToTarget({ node: nodeItem.node.target }, peakEnable, equivalenceEnable, nodeItem.node)}
                                                />
                                            )
                                        })
                                        }
                                    </>
                                    :
                                    <Empty description="Select equivalence category to suggest targets" />
                                }
                            </>
                        }

                    </div>
                </Col>
                <Col md={12} style={{ padding: '10px' }}>
                    <div
                        style={cardsDivStyle}
                    >
                        {searchedTargets &&
                            searchedTargets.length > 0 ?
                            <>
                                {searchedTargets.map(sTarget => {
                                    return (
                                        <EquivalenceCard
                                            key={sTarget.code.id}
                                            targetItem={sTarget}
                                            allocated={false}
                                            allocateSessionToTarget={() => allocateSessionToTarget({ node: sTarget.target }, peakEnable, equivalenceEnable)}
                                        />
                                    )
                                })
                                }
                            </>
                            :
                            <Empty description="No manual searched target" />
                        }
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default TargetsAvailableDrawer
