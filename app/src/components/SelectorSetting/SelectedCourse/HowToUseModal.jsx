import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import styled from "styled-components";
import {websiteColor, howToUseExportCode} from "../../../config";

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

class HowToUseModal extends Component {
    state = {
        currentPage: 1,
        totalPages: howToUseExportCode.length,
    };

    /**
     * 前往下一個頁面
     */
    nextPage = () => {
        if (this.state.currentPage === this.state.totalPages) {
            this.props.onHide();
            return;
        }

        this.setState(prevState => ({
            currentPage: Math.min(prevState.currentPage + 1, prevState.totalPages)
        }));
    };

    /**
     * 前往上一個頁面
     */
    prevPage = () => {
        this.setState(prevState => ({
            currentPage: Math.max(prevState.currentPage - 1, 1)
        }));
    };

    render() {
        const {currentPage, totalPages} = this.state;
        const {show, onHide} = this.props;

        return (
            <Modal show={show} onHide={onHide} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bolder">如何使用</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={howToUseExportCode[currentPage - 1].image} alt="如何使用" className="w-100"/>
                    <p>{howToUseExportCode[currentPage - 1].description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <span className="me-auto">第 {currentPage} / {totalPages} 頁</span>
                    <Button
                        variant="secondary"
                        onClick={this.prevPage}
                        disabled={currentPage === 1}
                    >
                        上一頁
                    </Button>
                    <InfoButton
                        variant="success"
                        onClick={this.nextPage}
                    >
                        {currentPage === totalPages ? '完成' : '下一頁'}
                    </InfoButton>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default HowToUseModal;
