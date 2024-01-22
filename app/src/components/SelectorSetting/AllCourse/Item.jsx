import {Component} from "react";
import styled from "styled-components";
import {Form} from "react-bootstrap";

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
    text-align: center;
    overflow: hidden;
    text-overflow: fade;

    &:last-child {
        margin-right: 0;
    }
`;

const SmallCourseInfo = styled(CourseInfo)`
    flex: 0.4;
`;

const TinyCourseInfo = styled(CourseInfo)`
    flex: 0.25;
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

class Item extends Component {
    handleCourseSelect = () => {
        this.props.onCourseSelect(this.props.course, !this.props.isSelected);
    }

    render() {
        const {course} = this.props;

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
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`中山大學 ${teacherName} DCard | PTT`)}`;
                return (
                    <Tag key={index}>
                        <StyledLink href={searchUrl} target="_blank"
                                    rel="noopener noreferrer">{teacherName}</StyledLink>
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
            <Tag
                className={classColor[course['Class']] ? classColor[course['Class']].color : 'bg-transparent border-0'}>
                {classColor[course['Class']] ? classColor[course['Class']].name : '缺失'}
            </Tag>
        )

        return (
            <CourseRow>
                <TinyCourseInfo>
                    <Form.Check
                        id={course['Number']}
                        aria-label="option 1"
                                checked={this.props.isSelected}
                                onChange={this.handleCourseSelect}/>
                </TinyCourseInfo>
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
    }
}

export default Item;
