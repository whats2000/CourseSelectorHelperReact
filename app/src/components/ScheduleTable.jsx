import {Component} from 'react';
import styled from 'styled-components';
import {Col, Row} from "react-bootstrap";

const StyledTable = styled.table`
    font-size: 10px;
    width: 100%;
`;

const HeaderCell = styled.th`
    background-color: lightgray !important;
`;

const TimeSlotCell = styled.td`
    width: 4%;
    background-color: lightgrey !important;
`;

const CourseCell = styled.td`
    width: 12.5%;
    padding: 2px !important;
`;

const CourseBlock = styled.div`
    background-color: #dfdf9f;
    border: 1px solid #bfbf7f;
    border-radius: 4px;
    margin-bottom: 4px;
    padding: 2px 4px;
    font-size: 9px;
    text-align: center;
    width: 100%;
    flex-grow: 1;
    
    &:last-child {
        margin-bottom: 0;
    }
`;


class ScheduleTable extends Component {
    setting = {
        columns: 8, // Total columns
        weekday: [
            {key: 'Monday', value: '一'},
            {key: 'Tuesday', value: '二'},
            {key: 'Wednesday', value: '三'},
            {key: 'Thursday', value: '四'},
            {key: 'Friday', value: '五'},
            {key: 'Saturday', value: '六'},
            {key: 'Sunday', value: '日'},
        ],
        timeSlots: [
            {key: 'A', value: '7:00\n~\n7:50'},
            {key: '1', value: '8:10\n~\n9:00'},
            {key: '2', value: '9:10\n~\n10:00'},
            {key: '3', value: '10:10\n~\n11:00'},
            {key: '4', value: '11:10\n~\n12:00'},
            {key: 'B', value: '12:10\n~\n13:00'},
            {key: '5', value: '13:10\n~\n14:00'},
            {key: '6', value: '14:10\n~\n15:00'},
            {key: '7', value: '15:10\n~\n16:00'},
            {key: '8', value: '16:10\n~\n17:00'},
            {key: '9', value: '17:10\n~\n18:00'},
            {key: 'C', value: '18:20\n~\n19:10'},
            {key: 'D', value: '19:15\n~\n20:05'},
            {key: 'E', value: '20:10\n~\n21:00'},
            {key: 'F', value: '21:05\n~\n21:55'}
        ]
    }

    /**
     * 建立課表
     * @returns {{}} 課表
     */
    createCourseTable = () => {
        const {selectedCourses} = this.props;
        const coursesTable = {};

        this.setting.timeSlots.forEach(timeSlot => {
            this.setting.weekday.forEach(weekday => {
                coursesTable[`${weekday.key}-${timeSlot.key}`] = [];

                Array.from(selectedCourses).forEach(course => {
                    if (course[weekday.key] && course[weekday.key].includes(timeSlot.key)) {
                        coursesTable[`${weekday.key}-${timeSlot.key}`].push(course);
                    }
                });
            });
        });

        return coursesTable;
    };

    /**
     * 產生課程方塊
     * @param courses {Object[]} 課程資料
     * @returns {JSX.Element[]} 課程方塊
     */
    generateCourseBlocks = (courses) => {
        return courses.map(course => (
            <CourseBlock key={course['Number']} className="align-self-stretch">
                <Row>
                    <Col className="fw-bolder">{course['Name']}</Col>
                </Row>
                <Row>
                    <Col className="text-muted">{course['Number']}</Col>
                </Row>
            </CourseBlock>
        ));
    };

    render() {
        const coursesTable = this.createCourseTable();

        return (
            <div className="table-responsive rounded-2">
                <StyledTable
                    className="table table-bordered border-white border-5 rounded-5 table-secondary text-center">
                    <thead>
                    <tr>
                        <HeaderCell>期</HeaderCell>
                        {this.setting.weekday.map((weekday, index) => (
                            <HeaderCell key={index}>{weekday.value}</HeaderCell>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {this.setting.timeSlots.map((timeSlot, index) => (
                        <tr key={index}>
                            <TimeSlotCell>
                                <span className="fw-bold d-block">{timeSlot.key}</span>
                                <span>{timeSlot.value}</span>
                            </TimeSlotCell>
                            {this.setting.weekday.map((weekday, n) => (
                                <CourseCell key={`${weekday.key}-${timeSlot.key}`}>
                                    <div className="d-flex flex-column">
                                        {this.generateCourseBlocks(coursesTable[`${weekday.key}-${timeSlot.key}`])}
                                    </div>
                                </CourseCell>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </StyledTable>
            </div>
        );
    }
}

export default ScheduleTable;
