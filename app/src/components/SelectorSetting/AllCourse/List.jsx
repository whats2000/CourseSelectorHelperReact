import React, {Component} from 'react';
import {Virtuoso} from 'react-virtuoso';
import Item from "./Item";

class CoursesList extends Component {
    /**
     * 渲染列表項目
     * @param {number} index
     * @returns {JSX.Element}
     */
    renderItem = (index) => {
        const {courses} = this.props;
        return <Item course={courses[index]}/>;
    }

    render() {
        const {courses} = this.props;

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
