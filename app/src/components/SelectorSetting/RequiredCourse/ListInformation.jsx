import React, {Component} from "react";
import {Card, Button, Form, InputGroup, Dropdown} from "react-bootstrap";
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
            filterOptions,
        } = this.props;
        const {totalCredits, totalHours} = calculateTotalCreditsAndHours(selectedCourses);

        return (
            <Card.Body>
                <ButtonsRow className="mb-2">
                    <StyledSelect
                        id="required-course-department"
                        className="w-100"
                        onChange={this.handleSelectDepartment}>
                        <option value="">選擇系所</option>
                        {filterOptions['系所'].options.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </StyledSelect>
                    <StyledSelect
                        id="required-course-class"
                        onChange={this.handleSelectClass}>
                        <option value="">選擇班級 (全)</option>
                        {filterOptions['班別'].options.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </StyledSelect>
                    <StyledSelect
                        id="required-course-grade"
                        onChange={this.handleSelectGrade}>
                        <option value="">選擇年級 (全)</option>
                        {filterOptions['年級'].options.map((option, index) => (
                            <option key={index} value={option}>{filterOptions['年級'].optionDisplayName[index]}</option>
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
