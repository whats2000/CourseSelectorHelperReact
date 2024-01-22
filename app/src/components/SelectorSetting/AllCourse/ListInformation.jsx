import React, {Component} from "react";
import {Card, Form, InputGroup} from "react-bootstrap";
import AdvancedFilter from "./AdvancedFilter";

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
                            placeholder="搜尋課程..."
                            onChange={this.handleFilterChange}
                        />
                        <InputGroup.Text>{totalCredits} 學分</InputGroup.Text>
                        <InputGroup.Text>{totalHours} 小時</InputGroup.Text>
                        <AdvancedFilter/>
                    </InputGroup>
                </Card.Body>
            </>
        );
    }
}

export default ListInformation;
