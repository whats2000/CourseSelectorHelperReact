import {Component} from "react";
import {Card} from "react-bootstrap";
// import styled from "styled-components";
import ListInformation from "./RequiredCourse/ListInformation";

// const StyledCardBody = styled(Card.Body)`
//     height: 100%;
//     min-height: 65vh;
//     padding: 0;
// `;

class RequiredCourse extends Component {
    render() {
        return (
            <Card className="h-100 mb-3 pb-2">
                <Card.Header className="text-center">
                    <Card.Title className="fw-bolder mb-0 p-2">學期必修</Card.Title>
                </Card.Header>
                <ListInformation/>
            </Card>
        );
    }
}

export default RequiredCourse;
