import React, {Component} from 'react';
import Papa from 'papaparse';
import {List, AutoSizer} from 'react-virtualized';
import styled from 'styled-components';

const csvUrl = 'https://raw.githubusercontent.com/CelleryLin/selector_helper/master/all_classes/all_classes_1122_20240116.csv';

// 添加基本樣式
const CourseRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
    background-color: #fafafa;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const CourseInfo = styled.div`
    margin-right: 15px;

    &:last-child {
        margin-right: 0;
    }
`;

class CoursesList extends Component {
    state = {
        courses: []
    };

    componentDidMount() {
        fetch(csvUrl)
            .then(response => response.text())
            .then(csvText => {
                const results = Papa.parse(csvText, {header: true, skipEmptyLines: true});
                this.setState({courses: results.data});
            })
            .catch(error => console.error('Error fetching and parsing data:', error));
    }

    rowRenderer = ({key, index, style}) => {
        const {courses} = this.state;
        const course = courses[index];

        return (
            <CourseRow key={key} style={style}>
                <CourseInfo>{course['Name']}</CourseInfo>
                <CourseInfo>{course['Teacher']}</CourseInfo>
                {/* ... 其他課程信息 */}
            </CourseRow>
        );
    };

    render() {
        const {courses} = this.state;

        return (
            // AutoSizer 會自動調整子組件的大小，RWD 的關鍵 (花我超久調整)
            <AutoSizer>
                {({width, height}) => (
                    <List
                        width={width}
                        height={height}
                        rowCount={courses.length}
                        rowHeight={50}
                        rowRenderer={this.rowRenderer}
                    />
                )}
            </AutoSizer>
        );
    }
}

export default CoursesList;