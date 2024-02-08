import React, {Component} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {
    FileEarmarkText, JournalText,
    InfoCircle, ArrowUpCircle,
    Gear, ExclamationCircle,
    CodeSlash, Envelope
} from 'react-bootstrap-icons';
import styled from 'styled-components';
import {announcementData} from "../../config";

const TextWithIcon = styled(Card.Text)`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-weight: bold;
    svg {
        margin: 0 8px;
    }
`;

class Announcement extends Component {
    /**
     * 渲染列表
     * @param {string[]} items 列表項目
     * @returns {JSX.Element[]} 列表元素
     */
    renderList(items) {
        return items.map((item, index) => <li key={index}>{item}</li>);
    }

    render() {
        const {latestCourseHistoryData, convertVersion} = this.props;
        return (
            <Card className="h-100 mb-3">
                <Card.Header className="text-center">
                    <Card.Title className="fw-bolder mb-0 p-2">
                        🙈這裡是中山大學選課小助手 {announcementData.version}
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col lg={6} md={6}>
                            <TextWithIcon><JournalText/> 更新紀錄：</TextWithIcon>
                            <ul>
                                <li>學期課程資料: {convertVersion(latestCourseHistoryData)}</li>
                            </ul>
                        </Col>
                        <Col lg={6} md={6}>
                            <TextWithIcon><FileEarmarkText/> 回饋表單：</TextWithIcon>
                            <ul>
                                <li><a href={announcementData.feedbackFormUrl}
                                       target="_blank"
                                       rel="noreferrer">
                                    {announcementData.feedbackFormUrl}
                                </a></li>
                            </ul>
                        </Col>
                        <Col lg={6} md={6}>
                            <TextWithIcon><InfoCircle/> 使用須知：</TextWithIcon>
                            <ul>{this.renderList(announcementData.description)}</ul>
                        </Col>
                        <Col lg={6} md={6}>
                            <TextWithIcon><ArrowUpCircle/> 更新內容：</TextWithIcon>
                            <ul>{this.renderList(announcementData.updates)}</ul>
                        </Col>
                        <Col lg={6} md={6}>
                            <TextWithIcon><Gear/> 主要功能：</TextWithIcon>
                            <ul>{this.renderList(announcementData.features)}</ul>
                        </Col>
                        <Col lg={6} md={6}>
                            <TextWithIcon><ExclamationCircle/> 已知問題：</TextWithIcon>
                            <ul>{this.renderList(announcementData.knownIssues)}</ul>
                        </Col>
                        <Col lg={6} md={6}>
                            <TextWithIcon><CodeSlash/> 專案程式：</TextWithIcon>
                            <ul>
                                <li><a href={announcementData.githubUrl} target="_blank" rel="noreferrer">Github</a>
                                </li>
                            </ul>
                        </Col>
                        <Col lg={6} md={6}>
                            <TextWithIcon><Envelope/> 錯誤回報 & 聯絡：</TextWithIcon>
                            <ul>
                                <li>總負責人：<a
                                    href={`mailto:${announcementData.contactEmail}`}>{announcementData.contactEmail}</a>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer className="text-center text-muted fst-italic fw-light">
                    <Card.Text className="text-center">
                        {announcementData.copyright.map(text => {
                            return <small key={text}>{text}<br/></small>;
                        })}
                    </Card.Text>
                </Card.Footer>
            </Card>
        );
    }
}

export default Announcement;
