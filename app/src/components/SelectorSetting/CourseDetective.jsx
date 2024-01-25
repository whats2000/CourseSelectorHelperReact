import {Component} from "react";
import {Card} from "react-bootstrap";

class CourseDetective extends Component {
    render() {
        return (
            <>
                <Card className="h-100 mb-3 pb-2">
                    <Card.Header className="text-center">
                        <Card.Title className="fw-bolder mb-0 p-2">課程偵探</Card.Title>
                    </Card.Header>
                </Card>
            </>
        );
    }
}

export default CourseDetective;
