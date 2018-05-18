import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col, Avatar, Divider, Tag, Button} from 'antd'
import {startCase, shuffle} from 'lodash'
import {formatMoney} from 'accounting'
import {formatNumber} from 'accounting'

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
const COLORS = shuffle("pink, magenta, red, volcano, orange, gold, cyan, lime, green, blue, geekblue, purple".split(','));
const _get_color = (index) => {
    return COLORS[index % COLORS.length].trim();
}

const CompanyInfo = (props) => {
    const {logo, name, description, domain, phone}  = props;
    const {facebook, linkedin, twitter, crunchbase} = props;
    const {location, timeZone, geo, category, tags} = props;

    return (
    <div id="company_details">
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
            <small> {props.legalName}</small>
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
        <Row>
            {tags.map((tag, i) => <Tag key={tag} color={_get_color(i)}>{tag}</Tag>)}
        </Row>
        <Divider orientation='left'><h5>LOCATION</h5></Divider>
        <Row gutter={16}>
            <Col span={12}>
                <p>{location}</p>
                <Divider orientation='left'><h5> TIMEZONE </h5></Divider>
                <p>{timeZone}</p>
            </Col>
            <Col span={12}>
                { _build_map(geo) }
            </Col>
        </Row>
        <Divider orientation='left'><h5>METRICS</h5></Divider>
        <Row type='flex' justify='space-between'>
            {Object.entries(props.metrics).map( ([key, val]) => {
                if (val && key === 'annualRevenue')  val = formatMoney(val, { precision: 0 });
                else if (val && key === 'employees') val = formatNumber(val, { precision: 0 });

                return <Col span={5} key={key}>
                            <h6>{startCase(key)}</h6>
                            <p>{val || "N/A"}</p>
                        </Col>})}
        </Row>
        <Divider orientation='left'><h5>TECHNOLOGIES</h5></Divider>
        <Row type='flex'>
            {props.tech.map((tech, i) => <Tag style={{marginBottom: 8}} key={tech} color={_get_color(i)}>
                                            <a href={`https://www.google.com.mx/search?q=${startCase(tech)}`}>
                                            <small>{startCase(tech).toLocaleUpperCase()}</small>
                                            </a>
                                         </Tag>)}
        </Row>
        <Divider orientation='left'><h5>DETAILS</h5></Divider>
        <Row type='flex' justify='space-between'>
            <Col span={5}>
                <h6>Founded Year</h6>
                <p>{props.foundedYear}</p>
            </Col>
            {Object.entries(category).map( ([key, val]) =>
            <Col span={5} key={key}>
                <h6>{startCase(key)}</h6>
                <p>{val}</p>
            </Col>)}
            <Col span={5}></Col>
        </Row>
    </div>);
}

CompanyInfo.propTypes = {
    name: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    logo: PropTypes.string,
    description: PropTypes.string
}
export default CompanyInfo;