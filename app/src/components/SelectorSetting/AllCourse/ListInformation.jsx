import React, {Component} from "react";
import {Button, Card, Form, InputGroup} from "react-bootstrap";
import {Filter} from "react-bootstrap-icons";
import styled from "styled-components";

const StyledButton = styled(Button)`
    background-color: #009e96;
    
    &:hover {
        background-color: #008e86;
    }
    
    &:active {
        background-color: #009e96;
    }
`;

class ListInformation extends Component {
    /**
     * 計算總學分與總時數
     * @param selectedCourses {Set: Object} 已選課程的 Set
     * @returns {{totalCredits: number, totalHours: number}} 總學分與總時數
     */
    calculateTotalCreditsAndHours = (selectedCourses) => {
        let totalCredits = 0;
        let totalHours = 0;

        const days = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ];

        selectedCourses.forEach(course => {
            totalCredits += parseFloat(course['Credit'] ?? "0.0");
            days.forEach(day => {
                totalHours += course[day]?.length ?? 0;
            });
        });

        return {totalCredits, totalHours};
    };

    /**
     * 處理篩選課程名稱的事件
     * @param e {React.ChangeEvent<HTMLInputElement>} 事件
     */
    handleFilterChange = (e) => {
        const {onFilterChange} = this.props;
        onFilterChange(e.target.value);
    };

    render() {
        const {selectedCourses} = this.props;
        const {totalCredits, totalHours} = this.calculateTotalCreditsAndHours(selectedCourses);

        return (
            <>
                <Card.Body>
                    <InputGroup>
                        <Form.Control
                            id="all-course-filter"
                            type="text"
                            placeholder="搜索课程..."
                            onChange={this.handleFilterChange}
                        />
                        <InputGroup.Text>{totalCredits} 學分</InputGroup.Text>
                        <InputGroup.Text>{totalHours} 小時</InputGroup.Text>
                        <StyledButton variant="success">
                            <Filter/>
                        </StyledButton>
                    </InputGroup>
                </Card.Body>
            </>
        );
    }
}

export default ListInformation;
