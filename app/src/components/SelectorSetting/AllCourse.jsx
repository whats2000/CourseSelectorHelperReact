import React, {Component} from "react";
import AllCourseList from "./AllCourse/List";
import {Card} from "react-bootstrap";
import ListHeader from "./AllCourse/ListHeader";
import styled from "styled-components";

const StyledCardBody = styled(Card.Body)`
    height: 100%;
    min-height: 75vh;
    padding: 0;
`;

class AllCourse extends Component {
    render() {
        return (
            <Card className="h-100 mb-3 pb-2">
                <Card.Header className="text-center">
                    <Card.Title className="fw-bolder mb-0 p-2">
                        所有課程
                    </Card.Title>
                </Card.Header>
                <ListHeader/>
                <StyledCardBody>
                    <AllCourseList courses={this.props.courses}/>
                </StyledCardBody>
            </Card>
        );
    }
}

export default AllCourse;
