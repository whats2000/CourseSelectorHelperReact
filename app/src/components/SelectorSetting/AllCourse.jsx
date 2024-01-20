import React, {Component} from "react";
import AllCourseList from "./AllCourse/AllCourseList";
import {Card} from "react-bootstrap";

class AllCourse extends Component {
    render() {
        return (
            <Card className="h-100 mb-3">
                <Card.Header className="text-center">
                    <Card.Title className="fw-bolder mb-0 p-2">
                        所有課程
                    </Card.Title>
                </Card.Header>
                <Card.Body className="h-100 min-vh-100">
                    <AllCourseList/>
                </Card.Body>
            </Card>
        );
    }
}

export default AllCourse;