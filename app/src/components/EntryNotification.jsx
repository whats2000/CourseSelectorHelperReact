import React, {Component} from 'react';
import {Modal, Button, Form, Card} from 'react-bootstrap';
import {entryNotificationConfig} from '../config';
import {Megaphone, FileEarmarkText, ArrowUpCircle} from "react-bootstrap-icons";
import styled from "styled-components";
import {websiteColor} from "../config";

const TextWithIcon = styled(Card.Text)`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-weight: bold;

    svg {
        margin: 0 8px;
    }
`;

const FillFormButton = styled(Button)`
    background-color: ${websiteColor.mainColor};
    border-color: ${websiteColor.mainColor};

    &:hover, &:focus {
        background-color: ${websiteColor.mainDarkerColor};
        border-color: ${websiteColor.mainDarkerColor};
    }

    a {
        color: white;
        text-decoration: none;
    }
`;

class EntryNotification extends Component {
    state = {
        show: false,
    };

    componentDidMount() {
        const announcementSeen = localStorage.getItem('entryNotificationSeen');
        const versionSeen = localStorage.getItem('entryNotificationVersion');

        if (announcementSeen !== 'true' || versionSeen !== entryNotificationConfig.version) {
            this.setState({show: true});
        }
    }

    /**
     * 渲染列表
     * @param items {string[]} 列表項目
     * @returns {JSX.Element[]} 列表元素
     */
    renderList(items) {
        return items.map((item, index) => <li key={index}>{item}</li>);
    }

    /**
     * 關閉 Modal
     */
    handleClose = () => {
        this.setState({show: false});
    };

    /**
     * 處理「不再顯示」的事件
     * @param event {Event} 事件
     */
    handleDontShowAgain = (event) => {
        const {checked} = event.target;
        localStorage.setItem('entryNotificationSeen', checked ? 'true' : 'false');
        localStorage.setItem('entryNotificationVersion', entryNotificationConfig.version);
    };

    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title><TextWithIcon><Megaphone/>公告</TextWithIcon></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{entryNotificationConfig.description}</p>

                    <TextWithIcon><ArrowUpCircle/> 更新內容：</TextWithIcon>
                    <ul>{this.renderList(entryNotificationConfig.updates)}</ul>

                    <TextWithIcon><FileEarmarkText/> 回饋表單：</TextWithIcon>
                    <ul>
                        <li><a href={entryNotificationConfig.feedbackFormUrl}
                               target="_blank"
                               rel="noreferrer">
                            {entryNotificationConfig.feedbackFormUrl}
                        </a></li>
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Form.Check
                        id="dont-show-again"
                        type="checkbox"
                        label="不再顯示"
                        onChange={this.handleDontShowAgain}
                    />
                    <Button variant="secondary" onClick={this.handleClose}>
                        關閉
                    </Button>
                    <FillFormButton>
                        <a href={entryNotificationConfig.feedbackFormUrl}
                           target="_blank"
                           rel="noreferrer">
                            填寫回饋表單
                        </a>
                    </FillFormButton>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default EntryNotification;
