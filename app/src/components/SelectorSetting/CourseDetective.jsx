import {Component} from "react";
import {Card, Col} from "react-bootstrap";
import styled from "styled-components";

import CoursesList from "./AllCourse/CoursesList";
import ListInformation from "./CourseDetective/ListInformation";

import {courseDetectiveElements} from "../../config";

const StyledCardBody = styled(Card.Body)`
    height: 100%;
    min-height: 65vh;
    padding: 0;
`;

class CourseDetective extends Component {
    state = {
        orderElements: courseDetectiveElements,
        filteredCourses: [],
    }

    componentDidMount() {
        this.setState({filteredCourses: this.props.courses}, () => {
            this.reorderAndFilterCourses();
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.courses !== this.props.courses || prevProps.searchTimeSlot !== this.props.searchTimeSlot) {
            this.reorderAndFilterCourses();
        }
    }

    /**
     * 設定排序元素序位
     * @param newOrderElements {Array} 新的排序元素
     */
    setOrderElements = (newOrderElements) => this.setState({
        orderElements: newOrderElements
    }, () => {
        this.reorderAndFilterCourses();
    });

    /**
     * 重新排序並篩選課程
     */
    reorderAndFilterCourses = () => {
        const {orderElements} = this.state;
        const {courses, searchTimeSlot} = this.props;

        // searchTimeSlot: [{day: "Monday", time: "1"}, {day: "Tuesday", time: "2"}]
        // courses: [{Name: "課程名稱", Department: "系所", "Monday": "123", "Tuesday": "456", ...}, ...]
        const filteredCourses = courses.filter(course => {
            if (searchTimeSlot?.length === 0) return true;

            for (let i = 0; i < searchTimeSlot.length; i++) {
                const {weekday, timeSlot} = searchTimeSlot[i];
                if (course[weekday].includes(timeSlot)) return true;
            }
        });

        const finalFilteredCourses = [];

        orderElements.forEach(element => {
            if (!element.enabled) return;

            let matchingCourses = [];
            switch (element.id) {
                case "liberal-arts":
                    matchingCourses = filteredCourses.filter(course => course.Department.startsWith("博雅"));
                    break;
                case "sports-fitness":
                    matchingCourses = filteredCourses.filter(course =>
                        course.Name === "運動與健康：體適能" || course.Name === "運動與健康：初級游泳");
                    break;
                case "sports-other":
                    matchingCourses = filteredCourses.filter(course =>
                        course.Name.startsWith("運動與健康：") && course.Name !== "運動與健康：體適能" && course.Name !== "運動與健康：初級游泳");
                    break;
                case "cross-department":
                    matchingCourses = filteredCourses.filter(course => course.Department.startsWith("跨院"));
                    break;
                case "chinese-critical-thinking":
                    matchingCourses = filteredCourses.filter(course => course.Name.startsWith("中文思辨與表達"));
                    break;
                case "random-courses":
                    matchingCourses = filteredCourses.filter(course => !course.Department.includes("碩") && !course.Department.includes("博"));
                    break;
                case "random-graduate-courses":
                    matchingCourses = filteredCourses.filter(course => course.Department.includes("碩") || course.Department.includes("博"));
                    break;
                case "english-beginner":
                    matchingCourses = filteredCourses.filter(course => course.Name === "英文初級");
                    break;
                case "english-intermediate":
                    matchingCourses = filteredCourses.filter(course => course.Name === "英文中級");
                    break;
                case "english-advanced-mid":
                    matchingCourses = filteredCourses.filter(course => course.Name === "英文中高級");
                    break;
                case "english-advanced":
                    matchingCourses = filteredCourses.filter(course => course.Name === "英文高級");
                    break;
                default:
                    break;
            }

            finalFilteredCourses.push(...matchingCourses);
        });

        this.setState({filteredCourses: finalFilteredCourses});
    }

    /**
     * 切換排序元素啟用狀態
     * @param id {string} 元素 id
     */
    toggleOrderElementEnable = (id) => {
        this.setState(prevState => ({
            orderElements: prevState.orderElements.map(element => {
                if (element.id === id) {
                    return {...element, enabled: !element.enabled};
                }
                return element;
            })
        }), () => {
            this.reorderAndFilterCourses();
        });
    }

    render() {
        const {
            selectedCourses,
            isCollapsed,
            displayConflictCourses,
            detectTimeConflict,
            calculateTotalCreditsAndHours,
            hoveredCourseId,
            onCourseSelect,
            onCourseHover,
        } = this.props;
        const {
            orderElements,
            filteredCourses,
        } = this.state;

        return (
            <>
                <Card className="h-100 mb-3 pb-2">
                    <Card.Header className="text-center">
                        <Card.Title className="fw-bolder mb-0 p-2">課程偵探</Card.Title>
                        <Card.Subtitle className="mb-0 p-2">
                            <Col>共篩選 {filteredCourses.length} 門課程，已選擇 {selectedCourses.size} 門課程</Col>
                            <Col className="mt-2 fst-italic text-muted">
                                依照您的需求篩選並排序課程，點擊課表空白處以篩選特定時段的課程。
                            </Col>
                        </Card.Subtitle>
                    </Card.Header>
                    <ListInformation
                        elements={orderElements}
                        setElements={this.setOrderElements}
                        selectedCourses={selectedCourses}
                        calculateTotalCreditsAndHours={calculateTotalCreditsAndHours}
                        toggleElementEnable={this.toggleOrderElementEnable}
                    />
                    <StyledCardBody>
                        <CoursesList
                            isCollapsed={isCollapsed}
                            courses={filteredCourses}
                            selectedCourses={selectedCourses}
                            displayConflictCourses={displayConflictCourses}
                            detectTimeConflict={detectTimeConflict}
                            hoveredCourseId={hoveredCourseId}
                            onCourseSelect={onCourseSelect}
                            onCourseHover={onCourseHover}
                        />
                    </StyledCardBody>
                </Card>
            </>
        );
    }
}

export default CourseDetective;
