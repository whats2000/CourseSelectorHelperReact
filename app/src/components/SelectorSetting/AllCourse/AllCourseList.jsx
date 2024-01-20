import {Component} from 'react';
import Papa from 'papaparse';
import {List, AutoSizer} from 'react-virtualized';
import styled from 'styled-components';

const csvUrl = 'https://raw.githubusercontent.com/CelleryLin/selector_helper/master/all_classes/all_classes_1122_20240116.csv';

// 添加基本樣式
const CourseRow = styled.div`
    font-size: 12px;
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
    background-color: #fafafa;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const CourseInfo = styled.div`
    flex: 1;
    text-align: left;
    margin-right: 15px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: fade;

    &:last-child {
        margin-right: 0;
    }
`;

const Tag = styled.span`
    background-color: #eef;
    border: 1px solid #ddf;
    border-radius: 4px;
    padding: 2px 5px;
    margin: 2px;
    font-size: 10px;
    white-space: nowrap;
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

        // 處理時間欄位，改成繁體中文
        const days = {
            'Monday': '一',
            'Tuesday': '二',
            'Wednesday': '三',
            'Thursday': '四',
            'Friday': '五',
            'Saturday': '六',
            'Sunday': '日'
        };
        const time = Object.keys(days)
            .map(day => course[day] ? <Tag key={day}>{days[day]} {course[day]}</Tag> : null)
            .filter(tag => tag !== null);

        // 轉換必修選修欄位
        const compulsoryElective = course['CompulsoryElective'] === 'C' ? '必修' : '選修';

        // 處理可能有多個教授的情況
        const teachers = course['Teacher'].split(',')
            .map((teacher, index) => <Tag key={index}>{teacher.trim().replace('\'', '')}</Tag>);

        // 處理可能有多個學程的情況
        const programs = course['Programs'] ? course['Programs'].split(',')
            .map(program => <Tag key={program}>{program.trim().replaceAll('\'', '')}</Tag>) : (<>無</>);

        return (
            <CourseRow key={key} style={style}>
                <CourseInfo className="text-nowrap">{course['Name']}</CourseInfo>
                <CourseInfo>{time}</CourseInfo>
                <CourseInfo>{course['Class']}</CourseInfo>
                <CourseInfo className="text-nowrap">{course['Department']}</CourseInfo>
                <CourseInfo>{compulsoryElective}</CourseInfo>
                <CourseInfo>{course['Credit']}</CourseInfo>
                <CourseInfo>{teachers}</CourseInfo>
                <CourseInfo>{programs}</CourseInfo>
                <CourseInfo>{course['EMI'] === 1 ? '是' : '否'}</CourseInfo>
            </CourseRow>
        );
    };

    render() {
        const {courses} = this.state;

        return (
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
