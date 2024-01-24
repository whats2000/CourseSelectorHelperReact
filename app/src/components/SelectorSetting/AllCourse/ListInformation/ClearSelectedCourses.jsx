import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";

class ClearSelectedCourses extends Component {
    state = {
        showModal: false
    };

    /**
     * 處理顯示確認 Modal
     */
    handleShowModal = () => {
        this.setState({showModal: true});
    };

    /**
     * 處理關閉確認 Modal
     */
    handleCloseModal = () => {
        this.setState({showModal: false});
    };

    /**
     * 處理確認清除
     */
    handleConfirmClear = () => {
        this.props.onClearAllSelectedCourses();
        this.handleCloseModal();
    };

    render() {
        const {showModal} = this.state;

        return (
            <>
                <Button
                    variant="danger"
                    onClick={this.handleShowModal}
                    className="ms-2">
                    清除
                </Button>

                <Modal show={showModal} onHide={this.handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>確認清除</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>您確定要清除所有已選擇的課程嗎？</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseModal}>
                            取消
                        </Button>
                        <Button variant="danger" onClick={this.handleConfirmClear}>
                            確認清除
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default ClearSelectedCourses;
