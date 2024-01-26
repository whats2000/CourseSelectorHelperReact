import React, {Component} from "react";
import {Card, Button, DropdownButton, Dropdown} from "react-bootstrap";
import styled from "styled-components";
import {websiteColor} from "../../../config";

const StyledDropdown = styled(DropdownButton)`
    margin-right: 10px;
`;

const StyledButton = styled(Button)`
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
    margin-bottom: 10px;
`;

class ListInformation extends Component {
    // 假設的篩選條件數據
    departments = ["系所1", "系所2", "系所3"];
    classes = ["班級1", "班級2", "班級3"];
    grades = ["年級1", "年級2", "年級3"];

    // 各種篩選條件的事件處理函數
    handleSelectDepartment = (value) => {
        // 處理選擇系所
    };

    handleSelectClass = (value) => {
        // 處理選擇班級
    };

    handleSelectGrade = (value) => {
        // 處理選擇年級
    };

    handleSelectAll = () => {
        // 處理全部選擇
    };

    handleDeselectAll = () => {
        // 處理全部取消
    };

    render() {
        return (
            <Card.Body>
                <ButtonsRow>
                    <StyledDropdown title="系所" onSelect={this.handleSelectDepartment}>
                        {this.departments.map((dept, index) => (
                            <Dropdown.Item key={index} eventKey={dept}>{dept}</Dropdown.Item>
                        ))}
                    </StyledDropdown>
                    <StyledDropdown title="班級" onSelect={this.handleSelectClass}>
                        {this.classes.map((cls, index) => (
                            <Dropdown.Item key={index} eventKey={cls}>{cls}</Dropdown.Item>
                        ))}
                    </StyledDropdown>
                    <StyledDropdown title="年級" onSelect={this.handleSelectGrade}>
                        {this.grades.map((grade, index) => (
                            <Dropdown.Item key={index} eventKey={grade}>{grade}</Dropdown.Item>
                        ))}
                    </StyledDropdown>
                </ButtonsRow>
                <ButtonsRow>
                    <StyledButton onClick={this.handleSelectAll}>全部填入</StyledButton>
                    <StyledButton onClick={this.handleDeselectAll}>全部取消</StyledButton>
                </ButtonsRow>
            </Card.Body>
        );
    }
}

export default ListInformation;
