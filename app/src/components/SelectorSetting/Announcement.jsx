import React, {Component} from 'react';
import {Card} from 'react-bootstrap';
import {
    FileEarmarkText, JournalText,
    InfoCircle, ArrowUpCircle,
    Gear, ExclamationCircle,
    CodeSlash, Envelope
} from 'react-bootstrap-icons';
import styled from 'styled-components';
import {announcementData} from "../../config";

const StyledCard = styled(Card)`
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
`;

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
    renderList(items) {
        return items.map((item, index) => <li key={index}>{item}</li>);
    }

    render() {
        return (
            <StyledCard>
                <Card.Header className="text-center">
                    <Card.Title className="fw-bolder mb-0 p-2">
                        🙈這裡是中山大學選課小助手 {announcementData.version}
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <div className="row">
                        <div className="col">
                            <TextWithIcon><JournalText/> 更新紀錄：</TextWithIcon>
                            <ul>
                                <li>學期課程資料: {announcementData.latestSemester} ({announcementData.updateDate})</li>
                            </ul>

                            <TextWithIcon><FileEarmarkText/> 回饋表單：</TextWithIcon>
                            <ul>
                                <li><a href={announcementData.feedbackFormUrl}
                                       target="_blank"
                                       rel="noreferrer">
                                    {announcementData.feedbackFormUrl}
                                </a></li>
                            </ul>

                            <TextWithIcon><InfoCircle/> 使用須知：</TextWithIcon>
                            <ul>{this.renderList(announcementData.description)}</ul>

                            <TextWithIcon><ArrowUpCircle/> 更新內容：</TextWithIcon>
                            <ul>{this.renderList(announcementData.updates)}</ul>
                        </div>

                        <div className="col">
                            <TextWithIcon><Gear/> 主要功能：</TextWithIcon>
                            <ul>{this.renderList(announcementData.features)}</ul>

                            <TextWithIcon><ExclamationCircle/> 已知問題：</TextWithIcon>
                            <ul>{this.renderList(announcementData.knownIssues)}</ul>

                            <TextWithIcon><CodeSlash/> 專案程式：</TextWithIcon>
                            <ul>
                                <li><a href={announcementData.githubUrl} target="_blank" rel="noreferrer">Github</a>
                                </li>
                            </ul>

                            <TextWithIcon><Envelope/> 錯誤回報 & 聯絡：</TextWithIcon>
                            <ul>
                                <li>總負責人：<a
                                    href={`mailto:${announcementData.contactEmail}`}>{announcementData.contactEmail}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer className="text-center text-muted fst-italic fw-light">
                    <Card.Text className="text-center">
                        {announcementData.copyright.map(text => {
                            return <small key={text}>{text}<br/></small>;
                        })}
                    </Card.Text>
                </Card.Footer>
            </StyledCard>
        );
    }
}

export default Announcement;
