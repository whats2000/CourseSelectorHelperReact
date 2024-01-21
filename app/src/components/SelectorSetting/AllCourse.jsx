import React, {Component} from "react";
import AllCourseList from "./AllCourse/AllCourseList";
import {Card} from "react-bootstrap";
import AllCourseListHeader from "./AllCourse/AllCourseListHeader";
import styled from "styled-components";

const StyledCardBody = styled(Card.Body)`
    height: 100%;
    min-height: 75vh;
    padding: 0;
`;

class AllCourse extends Component {
    render() {
        return (
            <Card className="h-100 mb-3">
                <Card.Header className="text-center">
                    <Card.Title className="fw-bolder mb-0 p-2">
                        所有課程
                    </Card.Title>
                </Card.Header>
                <AllCourseListHeader/>
                <StyledCardBody>
                    <AllCourseList courses={this.props.courses}/>
                </StyledCardBody>
            </Card>
        );
    }
}

export default AllCourse;
