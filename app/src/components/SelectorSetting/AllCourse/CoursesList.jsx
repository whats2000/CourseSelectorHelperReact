import React, {Component} from 'react';
import {Card} from "react-bootstrap";
import {Virtuoso} from 'react-virtuoso';
import Item from "./AllCourseList/Item";
import Header from "./AllCourseList/Header";

class CoursesList extends Component {
    /**
     * 渲染列表項目
     * @param {number} index
     * @returns {JSX.Element}
     */
    renderItem = (index) => {
        if (index === 0) {
            return <Header/>;
        }

        const {
            courses,
            displaySelectedOnly,
            selectedCourses,
            displayConflictCourses,
            detectTimeConflict,
            onCourseSelect,
            onCourseHover,
            hoveredCourseId,
            isCollapsed
        } = this.props;

        // 由於頂部有一個固定項目，所以所有後續項目的索引都要向前移動一位
        const course = courses[index - 1];

        // 如果課程不存在，則不渲染該課程，動態篩選時可能會發生
        if (!course) return null;

        const isSelected = selectedCourses.has(course);
        const isHovered = hoveredCourseId === course['Number'];
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
                isCollapsed={isCollapsed}
                course={course}
                isSelected={isSelected}
                isConflict={isConflict}
                isHovered={isHovered}
                onCourseSelect={onCourseSelect}
                onCourseHover={onCourseHover}
            />
        );
    }

    render() {
        const {courses} = this.props;

        if (courses.length === 0) {
            return (
                <>
                    <Header/>
                    <Card.Text className="text-center p-5">沒有符合篩選條件的課程</Card.Text>
                </>
            );
        }

        const dataWithHeader = [{}, ...courses];

        return (
            <Virtuoso
                data={dataWithHeader}
                itemContent={this.renderItem}
                topItemCount={1}
            >
            </Virtuoso>
        );
    }
}

export default CoursesList;
