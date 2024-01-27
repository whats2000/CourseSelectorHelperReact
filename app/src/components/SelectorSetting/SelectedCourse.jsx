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
    state = {
        addedSelectedCourses: new Set(),
        courseWeight: {},
    }

    /**
     * 處理加選課程的函數
     * @param course {object} 課程物件
     * @param isSelected {boolean} 是否已選
     */
    handleCourseAddedSelect = (course, isSelected) => {
        this.setState(prevState => {
            const addedSelectedCourses = new Set(prevState.addedSelectedCourses);
            if (isSelected) {
                addedSelectedCourses.add(course);
            } else {
                addedSelectedCourses.delete(course);
            }

            return {addedSelectedCourses};
        });
    }

    /**
     * 處理加選課程權重的函數
     * @param course {object} 課程物件
     * @param weight {string} 權重 0 ~ 100
     */
    handleCourseWeightChange = (course, weight) => {
        const weightNumber = parseInt(weight) > 100 ? 100 :
            parseInt(weight) < 0 ? 0 :
                parseInt(weight);
        this.setState(prevState => {
            const courseWeight = {...prevState.courseWeight};
            courseWeight[course['Number']] = weightNumber;

            return {courseWeight};
        });
    }

    /**
     * 處理匯出加選課程的函數
     */
    handleExportAddedSelectedCourses = () => {
        const { addedSelectedCourses, courseWeight } = this.state;

        // 創建一個包含課程信息的數據結構
        const exportData = Array.from(addedSelectedCourses).map(course => ({
            id: course['Number'],
            name: course['Name'],
            value: courseWeight[course['Number']] || 0,
            isSel: '+'
        }));

        // 生成JS代碼
        const genCode = `
        let exportClass = ${JSON.stringify(exportData)};
        exportClass.forEach((ec, i) => {
            const inputs = document.querySelectorAll('input');
            inputs[2*i].value = ec['id'];
            inputs[2*i+1].value = ec['value'];
            document.querySelectorAll('select')[i].value = ec['isSel'];
        });`;


        // 複製代碼到剪貼板
        navigator.clipboard.writeText(genCode).then(r => console.log('複製成功')).catch(e => console.error('複製失敗'));

        // Todo: 展示複製成功的提示modal
    }

    /**
     * 匯入已選課程
     */
    importSelectedCourses = () => {

    }

    render() {
        const {
            selectedCourses,
            calculateTotalCreditsAndHours,
            onClearAllSelectedCourses,
            isCollapsed,
            hoveredCourseId,
            onCourseHover,
        } = this.props;
        const {
            addedSelectedCourses,
            courseWeight,
        } = this.state;

        return (
            <Card className="h-100 mb-3 pb-2">
                <Card.Header className="text-center">
                    <Card.Title className="fw-bolder mb-0 p-2">已選匯出</Card.Title>
                    <Card.Subtitle className="mb-0 p-2">
                        <Col>共選 {selectedCourses.size} 門課程</Col>
                        <Col
                            className="mt-2 fst-italic text-muted">選擇預加選之課程，填入點數或志願後按匯出，系統會生成腳本以供串接學校選課系統。</Col>
                    </Card.Subtitle>
                </Card.Header>
                <ListInformation
                    selectedCourses={selectedCourses}
                    calculateTotalCreditsAndHours={calculateTotalCreditsAndHours}
                    onClearAllSelectedCourses={onClearAllSelectedCourses}
                    onCourseSelect={this.handleCourseAddedSelect}
                    onExportCourses={this.handleExportAddedSelectedCourses}
                    onImportCourses={this.importSelectedCourses}
                />
                <StyledCardBody>
                    <CoursesList
                        courses={Array.from(selectedCourses.values())}
                        isCollapsed={isCollapsed}
                        hoveredCourseId={hoveredCourseId}
                        onCourseHover={onCourseHover}
                        selectedCourses={selectedCourses}
                        addedSelectedCourses={addedSelectedCourses}
                        displayConflictCourses={true}
                        onCourseSelect={this.handleCourseAddedSelect}
                        courseWeight={courseWeight}
                        onCourseWeightChange={this.handleCourseWeightChange}
                    />
                </StyledCardBody>
            </Card>
        );
    }
}

export default SelectedCourse;
