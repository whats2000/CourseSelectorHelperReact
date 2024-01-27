import {Component} from "react";
import {Card, Col} from "react-bootstrap";
import ListInformation from "./SelectedCourse/ListInformation";
import Header from "./SelectedCourse/SelectedCourseList/Header";
import styled from "styled-components";
import CoursesList from "./SelectedCourse/CoursesList";

const StyledCardBody = styled(Card.Body)`
    height: 100%;
    min-height: 65vh;
    padding: 0;
`;

class SelectedCourse extends Component {
    render() {
        const {
            selectedCourses,
            calculateTotalCreditsAndHours,
            onClearAllSelectedCourses,
            isCollapsed,
            hoveredCourseId,
            onCourseHover,
        } = this.props;

        return (
            <>
                <Card className="h-100 mb-3 pb-2">
                    <Card.Header className="text-center">
                        <Card.Title className="fw-bolder mb-0 p-2">已選匯出</Card.Title>
                        <Card.Subtitle className="mb-0 p-2">
                            <Col>共選 {selectedCourses.size} 門課程</Col>
                            <Col className="mt-2 fst-italic text-muted">選擇預加選之課程，填入點數或志願後按匯出，系統會生成腳本以供串接學校選課系統。</Col>
                        </Card.Subtitle>
                    </Card.Header>
                    <ListInformation
                        selectedCourses={selectedCourses}
                        calculateTotalCreditsAndHours={calculateTotalCreditsAndHours}
                        onClearAllSelectedCourses={onClearAllSelectedCourses}
                    />
                    <StyledCardBody>
                        <CoursesList
                            courses={Array.from(selectedCourses.values())}
                            isCollapsed={isCollapsed}
                            hoveredCourseId={hoveredCourseId}
                            onCourseHover={onCourseHover}
                            selectedCourses={selectedCourses}
                            displayConflictCourses={true}
                        />
                    </StyledCardBody>
                </Card>
            </>
        );
    }
}

export default SelectedCourse;
