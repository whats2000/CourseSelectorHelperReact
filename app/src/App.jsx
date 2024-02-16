import {Component} from "react";
import styled from 'styled-components';
import Papa from "papaparse";
import {Col, Row} from "react-bootstrap";

import Header from "./components/Header";
import LoadingSpinner from "./components/LoadingSpinner";
import ScheduleTable from "./components/ScheduleTable";
import SelectorSetting from "./components/SelectorSetting";
import EntryNotification from "./components/EntryNotification";

import {courseData} from "./config";

const MainContent = styled.main`
    margin-top: 68px;
`;

const SlideColContainer = styled(Col)`
    transition: margin 0.5s;
`;

const ToggleButton = styled.button`
    position: fixed;
    z-index: 100;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.5;
    border-radius: 0 0.375rem 0.375rem 0;

    &:hover {
        opacity: 1;
    }
`;

class App extends Component {
    state = {
        loading: "資料",
        isCollapsed: false,
        currentTab: "公告",
        courses: [],
        selectedCourses: new Set(),
        hoveredCourseId: null,
        currentCourseHistoryData: "",
        latestCourseHistoryData: "",
        availableCourseHistoryData: [],
        searchTimeSlot: [],
    };

    componentDidMount() {
        // 移除靜態載入畫面
        const loadingScreen = document.getElementById('loading');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }

        const removeLoadingScreen = () => {
            this.endLoading();
        }

        fetch(courseData.targetAPI)
            .then(response => response.json())
            .then(files => {
                if (!(files && files.length)) throw new Error('抓取課程資料失敗。');

                // Filter out the .csv files and group by academic year and semester
                const groupedFiles = files
                    .filter(file => file.name.endsWith('.csv'))
                    .reduce((acc, file) => {
                        const match = file.name.match(/all_classes_(\d{3})([123])_/);
                        if (!match) return acc;

                        const key = `${match[1]}-${match[2]}`; // Group key: academicYear-semester
                        if (!acc[key]) {
                            acc[key] = [];
                        }
                        acc[key].push(file);

                        return acc;
                    }, {});

                // Select the latest file for each academic year and semester
                const latestFiles = Object.values(groupedFiles).map(group => {
                    return group.sort((a, b) => b.name.localeCompare(a.name))[0];
                });

                // Update the state with the latest files
                this.setState({availableCourseHistoryData: latestFiles});

                // Fetch the content of the latest file
                const latestFile = latestFiles.sort((a, b) => b.name.localeCompare(a.name))[0];
                this.setState({currentCourseHistoryData: latestFile.name});
                this.setState({latestCourseHistoryData: latestFile.name})

                if (latestFile) {
                    return fetch(latestFile['download_url']);
                } else {
                    throw new Error('沒有找到課程資料。');
                }
            })
            .then(response => response.text())
            .then(csvText => {
                // Parse the CSV content
                const results = Papa.parse(csvText, {header: true, skipEmptyLines: true});
                const uniqueResults = this.filterUniqueCourses(results.data);

                this.setState({courses: uniqueResults}, this.loadSelectedCourses);

                removeLoadingScreen();
            })
            .catch(error => {
                console.error('轉換課程資料失敗：', error);

                removeLoadingScreen();
            });
    }

    /**
     * 轉換版本
     * @param version {Object} 版本
     */
    switchVersion = (version) => {
        this.startLoading("資料");

        // Fetch the CSV file associated with the selected version
        fetch(version['download_url'])
            .then(response => response.text())
            .then(csvText => {
                // Parse the CSV content
                const results = Papa.parse(csvText, {header: true, skipEmptyLines: true});
                const uniqueResults = this.filterUniqueCourses(results.data);

                // Update the state with the new course data and selected version
                this.setState({
                    courses: uniqueResults,
                    currentCourseHistoryData: version.name,
                }, this.loadSelectedCourses);

                this.endLoading();
            })
            .catch(error => {
                console.error('轉換課程資料失敗：', error);

                this.endLoading();
            });
    }

    /**
     * 轉換版本資訊成可閱讀的格式
     * @param version
     */
    convertVersion = (version) => {
        // Regular expression to extract parts of the version string
        const regex = /all_classes_(\d{3})([123])_(\d{4})(\d{2})(\d{2})\.csv/;
        const match = version.match(regex);

        // Return the original string if it doesn't match the expected format
        if (!match) return version;

        const [, academicYear, semesterCode, , month, day] = match;

        // Convert the academic year and semester code to a readable format
        const semesterText = semesterCode === '1' ? '上' : semesterCode === '2' ? '下' : '暑';
        const formattedAcademicYear = `${parseInt(academicYear, 10)}`;

        // Format the update date
        const formattedDate = `${month}/${day} 資料`;

        return `${formattedAcademicYear}${semesterText} ${formattedDate}`;
    }

    /**
     * 過濾重複的課程
     * @param courses {Array<Object>} 課程資料
     * @returns {Array<Object>} 過濾後的課程資料
     */
    filterUniqueCourses = (courses) => {
        return courses.filter((course, index, self) =>
                index === self.findIndex(c => (
                    c['Name'] === course['Name'] &&
                    c['Number'] === course['Number'] &&
                    c['Teacher'] === course['Teacher']
                ))
        );
    }

    /**
     * 載入已選課程
     */
    loadSelectedCourses = () => {
        const savedSelectedCoursesNumbers = localStorage.getItem('selectedCoursesNumbers');
        if (!savedSelectedCoursesNumbers) return;

        const selectedCourseNumbers = new Set(JSON.parse(savedSelectedCoursesNumbers));
        const selectedCourses = new Set(
            this.state.courses.filter(course => selectedCourseNumbers.has(course['Number']))
        );
        this.setState({selectedCourses});
    }

    /**
     * 切換課表顯示狀態
     */
    toggleSchedule = () => {
        this.setState({isCollapsed: !this.state.isCollapsed});
    };

    /**
     * 切換設定頁面
     */
    handleTabChange = tab => {
        this.setState({currentTab: tab});
    }

    /**
     * 處理課程選取
     * @param course {Object} 課程資料
     * @param isSelected {boolean} 是否選取
     */
    handleCourseSelect = (course, isSelected) => {
        this.setState(prevState => {
            const selectedCourses = new Set(prevState.selectedCourses);
            if (isSelected) {
                selectedCourses.add(course);
            } else {
                selectedCourses.delete(course);
            }

            localStorage.setItem('selectedCoursesNumbers', JSON.stringify(Array.from(selectedCourses).map(c => c['Number'])));

            return {selectedCourses};
        });
    };

    /**
     * 處理清除所有已選課程的事件
     */
    handleClearAllSelectedCourses = () => {
        localStorage.removeItem('selectedCoursesNumbers');

        this.setState({selectedCourses: new Set()});
    }

    /**
     * 處理課程滑鼠移入
     * @param courseId {string} 課程編號
     */
    handleCourseHover = (courseId) => {
        this.setState({hoveredCourseId: courseId});
    };

    /**
     * 切換課程時間選取狀態
     * @param timeSlot {Object} 時間格子
     */
    toggleSearchTimeSlot = (timeSlot) => {
        const {searchTimeSlot} = this.state;

        const searchTimeSlotIndex = searchTimeSlot.findIndex(slot => slot.weekday === timeSlot.weekday && slot.timeSlot === timeSlot.timeSlot);

        if (searchTimeSlotIndex === -1) {
            this.setState(prevState => ({
                searchTimeSlot: [...prevState.searchTimeSlot, timeSlot]
            }));
        } else {
            this.setState(prevState => ({
                searchTimeSlot: prevState.searchTimeSlot.filter((slot, index) => index !== searchTimeSlotIndex)
            }));
        }
    }

    /**
     * 開始載入
     * @param loadingName {string} 載入名稱
     */
    startLoading = (loadingName) => {
        this.setState({loading: loadingName});
    }

    /**
     * 結束載入
     */
    endLoading = () => {
        this.setState({loading: null});
    }

    /**
     * 渲染元件
     * @returns {React.ReactNode} 元件
     */
    render() {
        const {
            isCollapsed,
            currentTab,
            courses,
            selectedCourses,
            hoveredCourseId,
            currentCourseHistoryData,
            latestCourseHistoryData,
            availableCourseHistoryData,
            loading,
            searchTimeSlot,
        } = this.state;
        const slideStyle = {
            marginLeft: isCollapsed ? (window.innerWidth >= 992 ? '-50%' : '0') : '0',
            marginTop: isCollapsed ? (window.innerWidth < 992 ? '-600%' : '0') : '0'
        };

        return (
            <>
                <Header
                    currentTab={currentTab}
                    onTabChange={this.handleTabChange}
                    currentCourseHistoryData={currentCourseHistoryData}
                    availableCourseHistoryData={availableCourseHistoryData}
                    switchVersion={this.switchVersion}
                    convertVersion={this.convertVersion}
                />
                <EntryNotification/>
                {loading && <LoadingSpinner loadingName={loading}/>}

                <ToggleButton className="btn btn-secondary w-auto" onClick={this.toggleSchedule}>
                    {isCollapsed ? '>' : '<'}
                </ToggleButton>

                <MainContent id="app" className="container-fluid">
                    <Row className="d-flex flex-wrap">
                        <SlideColContainer
                            style={slideStyle}
                            className="d-flex flex-column"
                            lg={6}
                        >
                            <ScheduleTable
                                selectedCourses={selectedCourses}
                                currentTab={currentTab}
                                handleCourseSelect={this.handleCourseSelect}
                                hoveredCourseId={hoveredCourseId}
                                onCourseHover={this.handleCourseHover}
                                searchTimeSlot={searchTimeSlot}
                                toggleSearchTimeSlot={this.toggleSearchTimeSlot}
                            />
                        </SlideColContainer>

                        <Col className="d-flex flex-column">
                            <SelectorSetting
                                isCollapsed={isCollapsed}
                                currentTab={currentTab}
                                courses={courses}
                                selectedCourses={selectedCourses}
                                hoveredCourseId={hoveredCourseId}
                                onCourseSelect={this.handleCourseSelect}
                                onClearAllSelectedCourses={this.handleClearAllSelectedCourses}
                                onCourseHover={this.handleCourseHover}
                                latestCourseHistoryData={latestCourseHistoryData}
                                convertVersion={this.convertVersion}
                                searchTimeSlot={searchTimeSlot}
                            />
                        </Col>
                    </Row>
                </MainContent>
            </>
        );
    }
}

export default App;
