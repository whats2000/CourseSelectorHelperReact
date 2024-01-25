import {Component} from "react";
import styled from "styled-components";
import {websiteColor} from "../../config";

const StyledCourseBlock = styled.div`
    background-color: ${websiteColor.mainLighterColor};
    border: 1px solid ${websiteColor.mainColor};
    border-radius: 4px;
    margin-bottom: 4px;
    padding: 2px 4px;
    font-size: 9px;
    text-align: center;
    
    &.hover {
        background-color: ${websiteColor.mainColor};
        color: white;
    }
    
    &:last-child {
        margin-bottom: 0;
    }
`;

class CourseBlock extends Component {
    render() {
        const {course, onCourseHover, hoveredCourseId} = this.props;
        const isHover = hoveredCourseId === course['Number'];

        return (
            <StyledCourseBlock key={course['Number']}
                         onMouseEnter={() => onCourseHover(course['Number'])}
                         onMouseLeave={() => onCourseHover(null)}
                         className={isHover ? 'hover' : ''}>
                <span className="d-block fw-bold">{course['Name']}</span>
                <span>{course['Room']}</span>
            </StyledCourseBlock>
        );
    }
}

export default CourseBlock;
