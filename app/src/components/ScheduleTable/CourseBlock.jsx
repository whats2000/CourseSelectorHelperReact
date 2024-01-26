import {Component} from "react";
import styled from "styled-components";
import {websiteColor} from "../../config";

const StyledCourseBlock = styled.div`
    border-radius: 4px;
    margin-bottom: 4px;
    padding: 2px 4px;
    font-size: 9px;
    text-align: center;

    &:last-child {
        margin-bottom: 0;
    }
`;


class CourseBlock extends Component {

    /**
     * 產生一個顏色，並且保持其亮度
     * @param courseUniqueCode {string} 課程唯一代碼
     * @returns {string} 顏色
     */
    getHashColor = (courseUniqueCode) => {
        let hash = 0;
        for (let i = 0; i < courseUniqueCode.length; i++) {
            hash = courseUniqueCode.charCodeAt(i) + ((hash << 5) - hash);
        }

        // 使用亮度遮罩將顏色保持在較亮的範圍
        const brightnessMask = 0x808080;
        let baseColor = (hash & 0x7F7F7F) + brightnessMask;

        return '#' + baseColor.toString(16).padEnd(6, '0');
    }


    render() {
        const {course, onCourseHover, hoveredCourseId} = this.props;
        const isHover = hoveredCourseId === course['Number'];

        const courseBlockStyle = {
            backgroundColor: isHover ? websiteColor.mainColor : this.getHashColor(course['Number'] + course['Name']),
            color: isHover ? 'white' : 'initial',
            boxShadow: isHover ? `0 0 0 0.25rem ${websiteColor.boxShadowColor}` : 'none',
        };

        return (
            <StyledCourseBlock key={course['Number']}
                               onMouseEnter={() => onCourseHover(course['Number'])}
                               onMouseLeave={() => onCourseHover(null)}
                               style={courseBlockStyle}
            >
                <span className="d-block fw-bold">{course['Name']}</span>
                <span>{course['Room']}</span>
            </StyledCourseBlock>
        );
    }
}

export default CourseBlock;
