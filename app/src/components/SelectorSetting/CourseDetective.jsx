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
                    <Card.Body className="d-flex flex-column">
                        <Card.Text className="text-center">
                            <span className="text-danger fw-bold d-block">此功能尚未完成，</span>
                            <span className="d-block">求演算法大師，需要寫個篩選標準排序，根據排序選擇！</span>
                            <span className="text-light fw-bold">Soon™</span>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </>
        );
    }
}

export default CourseDetective;
