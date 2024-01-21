import {Component} from 'react';
import Papa from 'papaparse';
import {List, AutoSizer} from 'react-virtualized';
import styled from 'styled-components';

const csvUrl = 'https://raw.githubusercontent.com/CelleryLin/selector_helper/master/all_classes/all_classes_1122_20240116.csv';

// 添加基本樣式
const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 2px solid #ddd;
    background-color: #f5f5f5;
    font-weight: bold;
`;

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
    overflow: hidden;
    text-overflow: fade;

    &:last-child {
        margin-right: 0;
    }
`;

const SmallCourseInfo = styled(CourseInfo)`
    flex: 0.4;
    text-align: center;
`;

const Tag = styled.div`
    background-color: #eef;
    border: 1px solid #ddf;
    border-radius: 4px;
    padding: 2px 5px;
    margin: 2px;
    font-size: 10px;
`;

const StyledLink = styled.a`
    display: inline-block;
    text-decoration: none;
    color: black;

    &:hover {
        text-decoration: underline;
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

    getDynamicRowHeight = (index) => {
        const course = this.state.courses[index];
        let height = 50; // 基本行高

        // 假设每增加一個教授、時段或學程，行高增加20px
        const additionalHeight = 20;
        height += (course['Teacher'].split(',').length - 1) * additionalHeight;
        height += (course['Programs'] ? course['Programs'].split(',').length - 1 : 0) * additionalHeight;

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const timeCount = days.reduce((count, day) => {
            return count + (course[day] ? course[day].split(',').length : 0);
        }, 0);
        height += (timeCount - 1) * additionalHeight;

        // 估算課程名稱的行數
        const charsPerLine = 4; // 每行大概有幾個字
        const nameLines = Math.ceil(course['Name'].length / charsPerLine);
        height += (nameLines - 1) * additionalHeight;

        return height;
    };

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

        // 處理可能有多個教授的情況
        const teachers = course['Teacher'].split(',')
            .map((teacher, index) => {
                const teacherName = teacher.trim().replace('\'', '');
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`中山大學 ${teacherName} dcard | ptt`)}`;
                return (
                    <Tag key={index}>
                        <StyledLink href={searchUrl} target="_blank" rel="noopener noreferrer">{teacherName}</StyledLink>
                    </Tag>
                );
            });

        // 處理可能有多個學程的情況
        const programs = course['Programs'] ? course['Programs'].split(',')
            .map(program => <Tag key={program}>{program.trim().replaceAll('\'', '')}</Tag>) : (<>無</>);

        // 處理學分顏色 0 ~ 3
        const credit = (
            <Tag className={(course['Credit'] === '0' ? 'bg-danger' :
                course['Credit'] === '1' ? 'bg-warning' :
                    course['Credit'] === '2' ? 'bg-success' :
                        course['Credit'] === '3' ? 'bg-primary' : 'bg-info') + ' text-white'}>
                {course['Credit']}
            </Tag>
        )

        // 處理全英課程
        const emi = (
            <Tag className={course['EMI'] === '1' ? 'bg-danger text-white' : 'bg-transparent border-0'}>
                {course['EMI'] === '1' ? '是' : '否'}
            </Tag>
        )

        // 處理必選修
        const compulsoryElective = (
            <Tag className={course['CompulsoryElective'] === '必' ? 'bg-danger text-white' : 'bg-transparent border-0'}>
                {course['CompulsoryElective']}
            </Tag>
        )

        // 處理課程連結
        const courseName = (
            <StyledLink href={course['Url']} target="_blank" rel="noopener noreferrer">
                {course['Name']}
            </StyledLink>
        )

        // 處理課程顏色
        const classColor = {
            '不分班': {
                name: '不分',
                color: 'bg-transparent border-0',
            },
            '全英班': {
                name: '全英',
                color: 'bg-danger text-white',
            },
            '甲班': {
                name: '甲班',
                color: 'bg-info text-white',
            },
            '乙班': {
                name: '乙班',
                color: 'bg-warning text-white',
            },
        }
        const courseClass = (
            <Tag className={classColor[course['Class']] ? classColor[course['Class']].color : 'bg-transparent border-0'}>
                {classColor[course['Class']] ? classColor[course['Class']].name : '缺失'}
            </Tag>
        )

        return (
            <CourseRow key={key} style={style}>
                <CourseInfo>{courseName}</CourseInfo>
                <SmallCourseInfo>{time}</SmallCourseInfo>
                <SmallCourseInfo>{course['Department']}</SmallCourseInfo>
                <SmallCourseInfo>{compulsoryElective}</SmallCourseInfo>
                <SmallCourseInfo>{credit}</SmallCourseInfo>
                <SmallCourseInfo>{emi}</SmallCourseInfo>
                <SmallCourseInfo>{courseClass}</SmallCourseInfo>
                <SmallCourseInfo>{teachers}</SmallCourseInfo>
                <CourseInfo>{programs}</CourseInfo>
            </CourseRow>
        );
    };

    render() {
        const {courses} = this.state;

        return (
            <div className="h-100 w-100">
                <HeaderRow>
                    <CourseInfo>名稱</CourseInfo>
                    <SmallCourseInfo>時間</SmallCourseInfo>
                    <SmallCourseInfo>系所</SmallCourseInfo>
                    <SmallCourseInfo>必選</SmallCourseInfo>
                    <SmallCourseInfo>學分</SmallCourseInfo>
                    <SmallCourseInfo>英課</SmallCourseInfo>
                    <SmallCourseInfo>班級</SmallCourseInfo>
                    <SmallCourseInfo>教師</SmallCourseInfo>
                    <CourseInfo>學程</CourseInfo>
                </HeaderRow>
                <AutoSizer>
                    {({width, height}) => (
                        <List
                            width={width}
                            height={height - 50}
                            rowCount={courses.length}
                            rowHeight={({index}) => this.getDynamicRowHeight(index)}
                            rowRenderer={this.rowRenderer}
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }

}

export default CoursesList;
