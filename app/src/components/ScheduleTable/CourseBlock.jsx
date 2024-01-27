import {Component} from "react";
import {Trash3} from "react-bootstrap-icons";
import styled from "styled-components";
import {websiteColor} from "../../config";

const DeleteButton = styled.div`
    position: absolute;
    top: -10px;
    left: -10px;
    width: 15px;
    height: 15px;
    background-color: ${websiteColor.mainLighterColor};
    color: ${websiteColor.mainColor};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    visibility: hidden;
`;

const HoverInfo = styled.span`
    display: none;
`;

const StyledCourseBlock = styled.div`
    position: relative;
    border-radius: 4px;
    margin-bottom: 4px;
    padding: 2px 4px;
    font-size: 9px;
    text-align: center;

    &:last-child {
        margin-bottom: 0;
    }

    &:hover ${DeleteButton} {
        visibility: visible;
    }

    &:hover ${HoverInfo} {
        display: block;
    }
`;


class CourseBlock extends Component {
    /**
     * 處理刪除課程的函數
     */
    handleDeleteCourse = () => {
        const {course, handleCourseSelect} = this.props;
        handleCourseSelect(course, false); // 調用父組件的函數來刪除課程
    };

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
                <HoverInfo>{course['Number']}</HoverInfo>
                <HoverInfo>{course['Teacher']}</HoverInfo>
                <DeleteButton onClickCapture={this.handleDeleteCourse}>
                    <Trash3 size={10}/>
                </DeleteButton>
            </StyledCourseBlock>
        );
    }
}

export default CourseBlock;
