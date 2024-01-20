import React, {Component} from 'react';
import {Modal, Button, Form, Card} from 'react-bootstrap';
import {entryNotificationConfig} from '../config';
import {Megaphone, FileEarmarkText, ArrowUpCircle} from "react-bootstrap-icons";
import styled from "styled-components";

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
    background-color: #009e96;
    border-color: #009e96;

    &:hover, &:focus {
        background-color: #008a81;
        border-color: #008a81;
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

    renderList(items) {
        return items.map((item, index) => <li key={index}>{item}</li>);
    }

    componentDidMount() {
        const announcementSeen = localStorage.getItem('entryNotificationSeen');
        const versionSeen = localStorage.getItem('entryNotificationVersion');

        if (announcementSeen !== 'true' || versionSeen !== entryNotificationConfig.version) {
            this.setState({show: true});
        }
    }

    handleClose = () => {
        this.setState({show: false});
    };

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
