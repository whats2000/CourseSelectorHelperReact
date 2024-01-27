import React, {Component} from "react";
import {Button, Card, InputGroup} from "react-bootstrap";
import styled from "styled-components";
import {websiteColor} from "../../../config";
import {BoxArrowInRight, BoxArrowRight, InfoCircle} from "react-bootstrap-icons";

const StyledButton = styled(Button)`
    background-color: ${websiteColor.mainColor};
    border-color: ${websiteColor.mainColor};
    display: flex;
    align-items: center;

    &:hover {
        background-color: ${websiteColor.mainDarkerColor};
        border-color: ${websiteColor.mainDarkerColor};
    }
`;

const ButtonsRow = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
`;

class ListInformation extends  Component {
    importSelectedCourses = () => {
    }

    exportSelectedCourses = () => {
    }

    selectAllCourses = () => {

    }

    deselectAllCourses = () => {

    }

    render() {
        const {
            selectedCourses,
            calculateTotalCreditsAndHours,
        } = this.props;
        const {totalCredits, totalHours} = calculateTotalCreditsAndHours(selectedCourses);

        return (
            <Card.Body>
                <ButtonsRow className="mb-2">
                    <InputGroup className="w-auto">
                        <InputGroup.Text>{totalCredits} 學分</InputGroup.Text>
                        <InputGroup.Text>{totalHours} 小時</InputGroup.Text>
                    </InputGroup>
                    <StyledButton className="ms-auto" variant="success">
                        <InfoCircle/><span className="ms-3">使用說明</span>
                    </StyledButton>
                </ButtonsRow>
                <ButtonsRow>
                    <StyledButton variant="success" onClick={this.importSelectedCourses}>
                        <BoxArrowInRight/><span className="ms-1">匯入</span>
                    </StyledButton>
                    <StyledButton className="ms-2" variant="success" onClick={this.exportSelectedCourses}>
                        <BoxArrowRight/><span className="ms-1">匯出</span>
                    </StyledButton>
                    <StyledButton className="ms-auto" variant="success" onClick={this.selectAllCourses}>全選</StyledButton>
                    <Button className="ms-2" variant="danger" onClick={this.deselectAllCourses}>取消</Button>
                </ButtonsRow>
            </Card.Body>
        );
    }
}

export default ListInformation;
