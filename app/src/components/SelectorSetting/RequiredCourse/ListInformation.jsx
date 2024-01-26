import React, {Component} from "react";
import {Card, Button, Form, InputGroup} from "react-bootstrap";
import styled from "styled-components";
import {websiteColor} from "../../../config";

const StyledSelect = styled(Form.Select)`
    margin-right: 10px;
    width: auto;

    &:last-child {
        margin-right: 0;
    }
`;

const StyledButton = styled(Button)`
    margin-left: auto;
    background-color: ${websiteColor.mainColor};
    border-color: ${websiteColor.mainColor};

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

class ListInformation extends Component {
    departments = ["系所1", "系所2", "系所3"];
    classes = ["班級1", "班級2", "班級3"];
    grades = ["年級1", "年級2", "年級3"];

    handleSelectDepartment = (e) => {
        // 處理選擇系所
    };

    handleSelectClass = (e) => {
        // 處理選擇班級
    };

    handleSelectGrade = (e) => {
        // 處理選擇年級
    };

    handleSelectAll = () => {
        // 處理全部選擇
    };

    handleDeselectAll = () => {
        // 處理全部取消
    };

    render() {
        const {
            selectedCourses,
            calculateTotalCreditsAndHours,
        } = this.props;
        const {totalCredits, totalHours} = calculateTotalCreditsAndHours(selectedCourses);

        return (
            <Card.Body>
                <ButtonsRow className="mb-2">
                    <StyledSelect className="w-100" onChange={this.handleSelectDepartment}>
                        <option value="">選擇系所</option>
                        {this.departments.map((dept, index) => (
                            <option key={index} value={dept}>{dept}</option>
                        ))}
                    </StyledSelect>
                    <StyledSelect onChange={this.handleSelectClass}>
                        <option value="">選擇班級</option>
                        {this.classes.map((cls, index) => (
                            <option key={index} value={cls}>{cls}</option>
                        ))}
                    </StyledSelect>
                    <StyledSelect onChange={this.handleSelectGrade}>
                        <option value="">選擇年級</option>
                        {this.grades.map((grade, index) => (
                            <option key={index} value={grade}>{grade}</option>
                        ))}
                    </StyledSelect>
                </ButtonsRow>
                <ButtonsRow>
                    <InputGroup className="w-auto">
                        <InputGroup.Text>{totalCredits} 學分</InputGroup.Text>
                        <InputGroup.Text>{totalHours} 小時</InputGroup.Text>
                    </InputGroup>
                    <StyledButton variant="success" onClick={this.handleSelectAll}>全部填入</StyledButton>
                    <Button variant="danger" className="ms-2" onClick={this.handleDeselectAll}>全部取消</Button>
                </ButtonsRow>
            </Card.Body>
        );
    }
}

export default ListInformation;
