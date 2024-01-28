import {Component} from "react";
import {Button, Modal, Form} from "react-bootstrap";
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

class ImportModal extends Component {
    state = {
        importCode: "",
        isValid: true,
    };

    /**
     * 處理程式碼變更的事件
     * @param event {InputEvent} 輸入事件
     */
    handleCodeChange = (event) => {
        this.setState({importCode: event.target.value});
    }

    /**
     * 處理匯入的事件
     */
    handleImport = () => {
        const {importCode} = this.state;
        const {onImportCodeSubmit, onHide} = this.props;

        try {
            const jsonMatch = importCode.match(/exportClass = (\[.*?]);/s);
            if (jsonMatch && jsonMatch[1]) {
                const success = onImportCodeSubmit(jsonMatch[1]);

                if (success) {
                    onHide();
                } else {
                    this.setState({isValid: false});
                }
            } else {
                this.setState({isValid: false});
            }
        } catch (error) {
            console.error("解析錯誤格式：", error);
            this.setState({isValid: false});
        }
    }

    render() {
        const {show, onHide} = this.props;
        const {importCode, isValid} = this.state;

        return (
            <Modal show={show} onHide={onHide} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bolder">匯入課程</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>請將由本網站生成的匯出代碼貼上至下方文字方塊，並按下「匯入」按鈕。</p>
                    <Form.Control
                        id="import-code"
                        as="textarea"
                        className={!isValid ? "is-invalid" : ""}
                        style={{height: "200px"}}
                        placeholder="由本網站生成的匯出腳本程式碼"
                        value={importCode}
                        onChange={this.handleCodeChange}
                    />
                    {!isValid && (
                        <Form.Control.Feedback type="invalid">
                            無效的程式碼，請檢查您的輸入！
                        </Form.Control.Feedback>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary"
                            onClick={onHide}>取消</Button>
                    <InfoButton variant="success"
                                onClick={this.handleImport}>匯入</InfoButton>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default ImportModal;
