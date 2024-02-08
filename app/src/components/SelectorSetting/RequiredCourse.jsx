import {Component} from "react";
import {Card, Col} from "react-bootstrap";
import styled from "styled-components";

import ListInformation from "./RequiredCourse/ListInformation";
import CoursesList from "./AllCourse/CoursesList";

const StyledCardBody = styled(Card.Body)`
    height: 100%;
    min-height: 65vh;
    padding: 0;
`;

class RequiredCourse extends Component {
    state = {
        requiredCourseFilters: {},
        filteredCourses: this.props.courses,
    };

    componentDidMount() {
        const savedFilters = localStorage.getItem('requiredCourseFilters');
        if (savedFilters) {
            this.setState({requiredCourseFilters: JSON.parse(savedFilters)}, this.applyFilters);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.requiredCourseFilters !== prevState.requiredCourseFilters) {
            this.applyFilters();
            localStorage.setItem('requiredCourseFilters', JSON.stringify(this.state.requiredCourseFilters));
        }
    }

    /**
     * 處理進階篩選事件
     * @param requiredFilters {object} 必修篩選器
     */
    handleRequiredCourseFilterChange = (requiredFilters) => {
        this.setState(prevState => ({
            requiredCourseFilters: {...prevState.requiredCourseFilters, ...requiredFilters}
        }));
    }

    /**
     * 應用篩選器
     */
    applyFilters = () => {
        const {courses} = this.props;
        const {requiredCourseFilters} = this.state;

        const filteredCourses = courses.filter(course => {
            // 逐一檢查篩選條件，返回符合所有條件的課程
            return Object.entries(requiredCourseFilters).every(([key, value]) => {
                if (!value) return true; // 如果篩選條件為空，則不應用該條件
                return course[key] === value && course['CompulsoryElective'] === "必";
            });
        });

        this.setState({filteredCourses});
    }

    render() {
        const {
            isCollapsed,
            selectedCourses,
            hoveredCourseId,
            onCourseSelect,
            onCourseHover,
            detectTimeConflict,
            calculateTotalCreditsAndHours,
            filterOptions,
        } = this.props;
        const {
            requiredCourseFilters,
            filteredCourses
        } = this.state;

        return (
            <Card className="h-100 mb-3 pb-2">
                <Card.Header className="text-center">
                    <Card.Title className="fw-bolder mb-0 p-2">學期必修</Card.Title>
                    <Card.Subtitle className="mb-0 p-2">
                        <Col>共篩選 {filteredCourses.length} 門課程，已選 {selectedCourses.size} 門課程</Col>
                    </Card.Subtitle>
                </Card.Header>
                <ListInformation
                    filterOptions={filterOptions}
                    filteredCourses={filteredCourses}
                    onCourseSelect={onCourseSelect}
                    onRequiredCourseFilterChange={this.handleRequiredCourseFilterChange}
                    selectedCourses={selectedCourses}
                    requiredCourseFilters={requiredCourseFilters}
                    calculateTotalCreditsAndHours={calculateTotalCreditsAndHours}
                />
                <StyledCardBody>
                    <CoursesList
                        isCollapsed={isCollapsed}
                        courses={filteredCourses}
                        selectedCourses={selectedCourses}
                        displayConflictCourses={true}
                        detectTimeConflict={detectTimeConflict}
                        hoveredCourseId={hoveredCourseId}
                        onCourseSelect={onCourseSelect}
                        onCourseHover={onCourseHover}
                    />
                </StyledCardBody>
            </Card>
        );
    }
}

export default RequiredCourse;
