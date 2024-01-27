import React, {Component} from "react";
import styled from 'styled-components';

const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 2px solid #ddd;
    background-color: #f5f5f5;
    font-weight: bold;
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

class Header extends Component {
    render() {
        return (
            <>
                <HeaderRow>
                    <TinyCourseInfo>加選</TinyCourseInfo>
                    <CourseInfo>名稱/課號</CourseInfo>
                    <SmallCourseInfo>系所</SmallCourseInfo>
                    <SmallCourseInfo>時間</SmallCourseInfo>
                    <TinyCourseInfo>英課</TinyCourseInfo>
                    <SmallCourseInfo>志願/點數</SmallCourseInfo>
                </HeaderRow>
            </>
        );
    }
}
export default Header;
