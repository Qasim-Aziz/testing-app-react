/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
import React from 'react'

class HeaderComponent extends React.Component {

	render() {
			const { leftContent = '', centerContent, rightContent = '' } = this.props
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '0px 10px',
					backgroundColor: '#FFF',
					boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)',
				}}
			>
				<div style={{ padding: '5px 0px' }}>
					{leftContent}
				</div>
				<div>
					<span style={{ fontSize: '25px', color: '#000' }}>{centerContent}</span>
				</div>
				<div style={{ padding: '5px 0px' }}>
					{rightContent}
				</div>
			</div>
		)
	}
}

export default HeaderComponent
