import React, {Component} from 'react';
import {Card} from "react-bootstrap";
import {Virtuoso} from 'react-virtuoso';
import Item from "./AllCourseList/Item";

class CoursesList extends Component {
    /**
     * 渲染列表項目
     * @param {number} index
     * @returns {JSX.Element}
     */
    renderItem = (index) => {
        const { courses, displaySelectedOnly, selectedCourses, displayConflictCourses, detectTimeConflict } = this.props;
        const course = courses[index];
        const isSelected = selectedCourses.has(course);
        let isConflict = false;

        // 如果設定為僅顯示已選擇的課程，且當前課程未被選擇，則不渲染該課程
        if (displaySelectedOnly && !isSelected) {
            return null;
        }

        // 如果設定為顯示包含衝堂課程，則計算該課程是否衝堂
        if (displayConflictCourses) {
            isConflict = detectTimeConflict(course, selectedCourses);
        }

        // 渲染課程項目
        return (
            <Item
                course={course}
                isSelected={isSelected}
                isConflict={isConflict}
                onCourseSelect={this.props.onCourseSelect}
            />
        );
    }

    render() {
        const {courses} = this.props;

        if (courses.length === 0) {
            return <Card.Text className="text-center p-5">沒有符合篩選條件的課程</Card.Text>;
        }

        return (
            <Virtuoso
                data={courses}
                itemContent={this.renderItem}
            >
            </Virtuoso>
        );
    }
}

export default CoursesList;
