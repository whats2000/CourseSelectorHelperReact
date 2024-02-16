import {Component} from 'react';
import styled from 'styled-components';

import CourseBlock from "./ScheduleTable/CourseBlock";

import {timeSlot, weekday} from "../config";

const StyledTableContainer = styled.div`
    border-radius: 0.375rem;
`;

const StyledTableContainerDetectiveMode = styled(StyledTableContainer)`
    cursor: zoom-in;
`;


const StyledTable = styled.table`
    font-size: 10px;
    width: 100%;
`;

const HeaderCell = styled.th`
    font-weight: normal;
    padding: 2px !important;
    background-color: lightgray !important;
`;

const TimeSlotCell = styled.th`
    width: 4%;
    padding: 2px !important;
    font-weight: normal;
    background-color: lightgray !important;
`;

const CourseCell = styled.td`
    width: 12.5%;
    padding: 2px !important;
`;

class ScheduleTable extends Component {
    setting = {
        columns: weekday.length + 1,
        weekday: weekday,
        timeSlots: timeSlot,
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

    render() {
        const {
            hoveredCourseId,
            onCourseHover,
            handleCourseSelect,
            currentTab,
        } = this.props;
        const coursesTable = this.createCourseTable();

        const isAtCourseDetectiveTab = currentTab === '課程偵探';
        const TableContainer = isAtCourseDetectiveTab ? StyledTableContainerDetectiveMode : StyledTableContainer;

        return (
            <TableContainer
                className="table-responsive"
            >
                <StyledTable
                    className="table table-bordered border-white border-5 table-secondary text-center">
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
                                <span className="d-block fw-bold">{timeSlot.key}</span>
                                <span>{timeSlot.value}</span>
                            </TimeSlotCell>
                            {this.setting.weekday.map((weekday) => (
                                <CourseCell
                                    key={`${weekday.key}-${timeSlot.key}`}
                                >
                                    {coursesTable[`${weekday.key}-${timeSlot.key}`].map((course, i) =>
                                        <CourseBlock key={i}
                                                     course={course}
                                                     handleCourseSelect={handleCourseSelect}
                                                     hoveredCourseId={hoveredCourseId}
                                                     onCourseHover={onCourseHover}
                                        />
                                    )}
                                </CourseCell>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </StyledTable>
            </TableContainer>
        );
    }
}

export default ScheduleTable;
