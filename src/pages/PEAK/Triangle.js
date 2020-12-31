/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-const */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */
/* eslint-disable no-restricted-syntax */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-prototype-builtins */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */

import React from 'react'
import { Popover } from 'antd'


class Triangle extends React.Component {
    state = {
        visible: false,
        searchTargetText: '',
    }

    render() {
        const {
            allcode,
            blankBlockStyle,
        } = this.props

        console.log('super props ===> ',allcode, blankBlockStyle)

        return (
            <div style={{ width: '100%', alignSelf: 'center' }} key={allcode}>
                {allcode.map((item, i) => (
                    <div key={item} style={{ width: '100%', alignSelf: 'center', textAlign: 'center' }}>
                        {item.map((e, index) =>
                            <>
                                {i !== 0 && index === 0 &&
                                    <>
                                        <div style={blankBlockStyle}>&nbsp;</div>
                                    </>
                                }
                                <Popover content={<div style={{ maxWidth: '200px' }}>{e.node?.instructions}</div>} title={e.code}>
                                    <div
                                        style={{
                                            border: '1px solid',
                                            height: 30,
                                            width: 30,
                                            display: 'inline-block',
                                            backgroundColor: e.yes,
                                            fontSize: '11px',
                                            paddingTop: '2px'

                                        }}
                                    >
                                        {e.code}
                                    </div>
                                </Popover>
                                {i !== 0 && (index + 1) === item.length &&
                                    <>
                                        <div style={blankBlockStyle}>&nbsp;</div>
                                    </>
                                }
                            </>
                        )}
                    </div>
                ))}
            </div>
        )
    }
}

export default Triangle
