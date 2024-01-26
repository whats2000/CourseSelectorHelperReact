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

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentDidMount() {

    }

    /**
     * 處理進階篩選事件
     * @param requiredFilters {object} 必修篩選器
     */
    handleRequiredCourseFilterChange = (requiredFilters) => {
        this.setState({requiredCourseFilters: requiredFilters});
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
