import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col, Avatar, Divider, Button} from 'antd'
import {startCase} from 'lodash'

const _build_map = (geo) => {
    const {lat, lng} = geo;
    return <iframe width="100%"
            style={{border: 0}}
            title="map"
            height="100"
            src={`https://www.google.com/maps/embed/v1/place?q=''&zoom=13
            &key=AIzaSyDrP1ajpg3YkYLSmnDUUc8Umdo4xyf5vfU
            &center=${lat},${lng}`} />
}
const _build_social_btn = (network, info, icon = network) => {
    const handle = info.handle;
    return <Button type='primary'
            size='large'
            href={`https://${network}.com/${handle}`}
            icon={icon}
            shape='circle' />
}

const CompanyInfo = (props) => {
    const {logo, name, description, domain, phone}  = props;
    const {facebook, linkedin, twitter, crunchbase} = props;
    const {location, timeZone, geo, category}       = props;

    return (
        <React.Fragment>
        <Divider>Company</Divider>
        <Row type='flex' justify='space-between'>
            <h1>
                <Avatar src={logo} style={{marginRight: 16, verticalAlign: 'middle'}}>{name}</Avatar>
                <a href={`http://${domain}`}>{name}</a>
                <Divider type='vertical' />
            </h1>
            {phone && <Button size='large' ghost type='primary' icon='phone'>{phone}</Button>}
        </Row>
        <Row type='flex' align='middle'>
            <Col span={12}>
            <small>{props.legalName}</small>
            <p>{description}</p>
            </Col>
            <Col span={12}>
            <Row type='flex' align='middle' justify='space-around'>
            {crunchbase && <Col span={2}>{_build_social_btn('crunchbase', crunchbase, 'global')}</Col>}
            {facebook   && <Col span={2}>{_build_social_btn('facebook', facebook)}</Col>}
            {twitter    && <Col span={2}>{_build_social_btn('twitter', twitter)}</Col>}
            {linkedin   && <Col span={2}>{_build_social_btn('linkedin', linkedin)}</Col>}
            </Row>
            </Col>
        </Row>
        <Divider orientation='left'>Location</Divider>
        <Row gutter={16}>
            <Col span={12}>
                <p>{location}</p>
                <Divider orientation='left'>Timezone</Divider>
                <p>{timeZone}</p>
            </Col>
            <Col span={12}>
                { _build_map(geo) }
            </Col>
        </Row>
        <Divider orientation='left'>Details</Divider>
        <Row type='flex'>
            {Object.entries(category).map( ([key, val]) =>
            <Col span={5} key={key}>
                <h6>{startCase(key)}</h6>
                <p>{val}</p>
            </Col>)}
        </Row>
    </React.Fragment>);
}

CompanyInfo.propTypes = {
    name: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    logo: PropTypes.string,
    description: PropTypes.string
}
export default CompanyInfo;