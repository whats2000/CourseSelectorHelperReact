import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Clipboard, ClipboardCheck} from 'react-bootstrap-icons';
import styled from "styled-components";
import {websiteColor} from "../../../config";

const InfoButton = styled(Button)`
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

class ExportModal extends Component {
    state = {
        isCopied: false,
    }

    /**
     * 複製到剪貼簿的函數
     */
    copyToClipBoard = () => {
        if (this.state.isCopied) return;
        this.setState({isCopied: true});
        setTimeout(() => {
            this.setState({isCopied: false});
        }, 1000);
    }

    render() {
        const {show, onHide, exportStateMessage, code, onShowHowToUseModal} = this.props;
        const {isCopied} = this.state;

        return (
            <Modal show={show} onHide={onHide} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bolder">匯出加選課程</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-2">{exportStateMessage}</div>
                    <div className="position-relative">
                        <SyntaxHighlighter language="javascript" style={dracula}>
                            {code}
                        </SyntaxHighlighter>
                        <CopyToClipboard
                            text={code}
                            onCopy={this.copyToClipBoard}
                        >
                            <Button variant="outline-light" size="sm" className="position-absolute end-0 top-0 m-2">
                                {isCopied ? <ClipboardCheck size={20}/> : <Clipboard size={20}/>}
                            </Button>
                        </CopyToClipboard>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        關閉
                    </Button>
                    <InfoButton variant="success" onClick={onShowHowToUseModal}>
                        使用說明
                    </InfoButton>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ExportModal;
