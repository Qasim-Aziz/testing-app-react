/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-else-return */
/* eslint-disable object-shorthand */
import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Select, Icon, Row, Col, Input, Empty } from 'antd'
import SessionCard from '../../../components/SessionCard'
import motherSon from '../motherSon.jpg'
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
    const [domain, setDomain] = useState([])
    const [selectedTargetDomain, setSelectedTargetDomain] = useState([])
    const [area, setArea] = useState([])
    const [selectedTargetArea, setSelectedTargetArea] = useState([])
    const [selectAllTarget, setSelectAllTarget] = useState(false)
    const [searchedTargets, setSearchedTargets] = useState([])

    const getDomainByProgramAreaQuery = async pId => {
        const domainResp = await getDomainByProgramArea(pId)
        if (notNull(domainResp)) setDomain(domainResp.data.programDetails.domain.edges)
    }

    const getTargetAreaByDoimainQuery = async domainId => {
        const targetAreaResp = await getTargetAreaByDoimain(domainId)
        setSelectedTargetDomain(domainId)
        if (notNull(targetAreaResp)) setArea(targetAreaResp.data.targetArea.edges)
    }

    const onSelectArea = sArea => {
        setSelectedTargetArea(sArea)
    }

    const searchDomin = () => {
        suggestedTargetQuery(selectedTargetDomain, selectedTargetArea)
    }

    const studentId = JSON.parse(localStorage.getItem('studentId'))

    const suggestedTargetQuery = async (domainId, areaId) => {
        const suggestedTargetResp = await suggestTarget(domainId, areaId, studentId)
        if (notNull(suggestedTargetResp)) setSuggestedTarget(suggestedTargetResp.data.target.edges)
    }

    const onChangeselectAllTarget = ({ target: { checked } }) => {
        setSelectAllTarget(checked)
    }

    const getSearchTargetQuery = async text => {
        const searchTargetsResp = await getSearchTargets(text)
        if (searchTargetsResp) {
            setSearchedTargets(searchTargetsResp?.data?.target?.edges)
            console.log(searchTargetsResp)
        }
    }

    const searchTargets = text => {
        if(text === ""){
            setSearchedTargets([])
        }
        else{
            getSearchTargetQuery(text)
        }
    }



    useEffect(() => {
        getDomainByProgramAreaQuery(selectedProgram)
    }, [])


    return (
        <>
            <div>
                <Select
                    style={selectTargetStyle}
                    defaultValue="Select Target Domain"
                    onSelect={getTargetAreaByDoimainQuery}
                >
                    {domain &&
                        domain.length > 0 &&
                        domain.map(d => {
                            return (
                                <Select.Option value={d.node.id} key={d.node.id}>
                                    {d.node.domain}
                                </Select.Option>
                            )
                        })}
                </Select>
                <Select style={selectTargetAreaStyle} defaultValue="Select Target Area" onSelect={onSelectArea}>
                    {area &&
                        area.map(a => {
                            return (
                                <Select.Option value={a.node.id} key={a.node.id}>
                                    {a.node.Area}
                                </Select.Option>
                            )
                        })}
                </Select>

                <Button type="primary" style={searchBtnStyle} onClick={searchDomin}>
                    <Icon type="search" /> Search
                </Button>

                <Input placeholder="Search target by name" onChange={(e) => searchTargets(e.target.value)} style={{ width: '300px', marginLeft: '20px', float: 'right' }} />
            </div>


            <Row>
                <Col md={12} style={{padding: '10px'}}>
                    <div
                        style={cardsDivStyle}
                    >
                        {suggestedTarget &&
                            suggestedTarget.length > 0 ?
                            <>
                                {suggestedTarget.map(sTarget => {
                                    return (
                                        <SessionCard
                                            key={sTarget.node.id}
                                            allocated={sTarget.node.allocatedTar}
                                            image={motherSon}
                                            heading={sTarget.node.targetMain.targetName}
                                            receptiveLanguage="in therapy"
                                            allocateSessionToTarget={() => allocateSessionToTarget(sTarget)}
                                        />
                                    )
                                })
                            }
                            </>
                            :
                            <Empty description="No target by domain and target area" />
                        }
                    </div>
                </Col>
                <Col md={12} style={{padding: '10px'}}>
                    <div
                        style={cardsDivStyle}
                    >
                        {searchedTargets &&
                            searchedTargets.length > 0 ?
                            <>
                                {searchedTargets.map(sTarget => {
                                    return (
                                        <SessionCard
                                            key={sTarget.node.id}
                                            allocated={sTarget.node.allocatedTar}
                                            image={motherSon}
                                            heading={sTarget.node.targetMain.targetName}
                                            receptiveLanguage="in therapy"
                                            allocateSessionToTarget={() => allocateSessionToTarget(sTarget)}
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
