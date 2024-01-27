import React, {Component} from 'react';
import {Card} from "react-bootstrap";
import {Virtuoso} from 'react-virtuoso';
import Item from "../SelectedCourse/SelectedCourseList/Item";
import Header from "./SelectedCourseList/Header";

class CoursesList extends Component {
    /**
     * 渲染列表項目
     * @param {number} index
     * @returns {JSX.Element}
     */
    renderItem = (index) => {
        if (index === 0) return <Header/>;

        const {
            courses,
            onCourseHover,
            hoveredCourseId,
            isCollapsed
        } = this.props;

        const course = courses[index];

        // 如果課程不存在，則不渲染該課程，動態篩選時可能會發生
        if (!course) return null;

        const isHovered = hoveredCourseId === course['Number'];

        // 渲染課程項目
        return (
            <Item
                isCollapsed={isCollapsed}
                course={course}
                isSelected={false}
                isConflict={false}
                isHovered={isHovered}
                onCourseHover={onCourseHover}
            />
        );
    }

    render() {
        const {courses} = this.props;

        if (courses.length === 0)
            return (
                <>
                    <Header/>
                    <Card.Text className="text-center p-5">沒有符合篩選條件的課程</Card.Text>
                </>
            );

        return (
            <Virtuoso
                data={courses}
                itemContent={this.renderItem}
                topItemCount={1}
            >
            </Virtuoso>
        );
    }
}

export default CoursesList;
