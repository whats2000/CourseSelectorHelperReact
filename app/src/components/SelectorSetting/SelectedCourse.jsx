import {Component} from "react";
import {Card, Col} from "react-bootstrap";
import ListInformation from "./SelectedCourse/ListInformation";
import styled from "styled-components";
import CoursesList from "./SelectedCourse/CoursesList";
import ExportModal from "./SelectedCourse/ExportModal";

const StyledCardBody = styled(Card.Body)`
    height: 100%;
    min-height: 65vh;
    padding: 0;
`;

class SelectedCourse extends Component {
    state = {
        addedSelectedCourses: new Set(),
        courseWeight: {},
        showExportModal: false,
        exportStateMessage: "",
        generatedCode: '',
    }

    componentDidMount() {
        const savedAddedSelectedCourses = localStorage.getItem('addedSelectedCourses');
        const savedCourseWeight = localStorage.getItem('courseWeight');

        if (savedAddedSelectedCourses) {
            const addedSelectedCourses = new Set(JSON.parse(savedAddedSelectedCourses));
            this.setState({addedSelectedCourses});
        }

        if (savedCourseWeight) {
            const courseWeight = JSON.parse(savedCourseWeight);
            this.setState({courseWeight});
        }
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
                addedSelectedCourses.add(course['Number']);
            } else {
                addedSelectedCourses.delete(course['Number']);
            }
            localStorage.setItem('addedSelectedCourses', JSON.stringify(Array.from(addedSelectedCourses)));
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
            localStorage.setItem('courseWeight', JSON.stringify(courseWeight));
            return {courseWeight};
        });
    }

    /**
     * 處理匯出加選課程的函數
     */
    handleExportAddedSelectedCourses = () => {
        const {selectedCourses} = this.props;
        const {addedSelectedCourses, courseWeight} = this.state;

        // 創建一個包含課程信息的數據結構
        const exportData = Array.from(addedSelectedCourses).map(courseNumber => {
            const course = Array.from(selectedCourses).find(c => c['Number'] === courseNumber);
            return {
                id: course['Number'],
                name: course['Name'],
                value: courseWeight[course['Number']] || 0,
                isSel: '+'
            };
        });

        // 生成JS代碼
        const genCode =
`const frame = document.getElementById('main');
const doc = frame.contentDocument || frame.contentWindow.document;
const exportClass = ${JSON.stringify(exportData)};
try {
    exportClass.forEach((ec, i) => {
        const inputs = doc.querySelectorAll('input');
        inputs[2*i].value = ec['id'];
        inputs[2*i+1].value = ec['value'];
        doc.querySelectorAll('select')[i].value = ec['isSel'];
    });
    console.log('自動填寫: 完成');
} catch (e) {
    console.error('自動填寫: 失敗: ' + e);
}
`;


        // 複製代碼到剪貼板
        navigator.clipboard.writeText(genCode)
            .then(() => {
                this.setState({
                    showExportModal: true,
                    exportStateMessage: <p>成功匯處 <span
                        className="text-danger">{exportData.length}</span> 個課程，腳本已複製到剪貼板</p>,
                    generatedCode: genCode
                }); // 更新状态以显示模态框和信息
            })
            .catch(() => {
                this.setState({
                    showExportModal: true,
                    exportStateMessage: <p>複製失敗，請手動複製以下腳本程式</p>,
                    generatedCode: genCode
                });
            });
    };

    /**
     * 匯入已選課程
     */
    importSelectedCourses = () => {

    }

    /**
     * 顯示匯出modal
     */
    closeExportModal = () => {
        this.setState({showExportModal: false});
    };

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
            showExportModal,
            exportStateMessage,
            generatedCode,
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
                <ExportModal
                    show={showExportModal}
                    exportStateMessage={exportStateMessage}
                    code={generatedCode}
                    onHide={this.closeExportModal}
                />
            </Card>
        );
    }
}

export default SelectedCourse;
