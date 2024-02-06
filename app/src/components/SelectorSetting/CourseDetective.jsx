import {Component} from "react";
import {Card} from "react-bootstrap";
import ListInformation from "./CourseDetective/ListInformation";
import {courseDetectiveElements} from "../../config";

class CourseDetective extends Component {
    state = {
        orderElements: courseDetectiveElements,
    }

    /**
     * 設定排序元素序位
     * @param newOrderElements {Array} 新的排序元素
     */
    setOrderElements = (newOrderElements) => this.setState({orderElements: newOrderElements});

    render() {
        const {
            selectedCourses,
            calculateTotalCreditsAndHours,
        } = this.props;
        const {orderElements} = this.state;

        return (
            <>
                <Card className="h-100 mb-3 pb-2">
                    <Card.Header className="text-center">
                        <Card.Title className="fw-bolder mb-0 p-2">課程偵探</Card.Title>
                    </Card.Header>
                    <ListInformation
                        elements={orderElements}
                        setElements={this.setOrderElements}
                        selectedCourses={selectedCourses}
                        calculateTotalCreditsAndHours={calculateTotalCreditsAndHours}
                    />
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
