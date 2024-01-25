import {Component} from "react";
import Header from "./components/Header";
import ScheduleTable from "./components/ScheduleTable";
import SelectorSetting from "./components/SelectorSetting";
import styled from 'styled-components';
import EntryNotification from "./components/EntryNotification";
import Papa from "papaparse";
import {courseData} from "./config";

const MainContent = styled.main`
    margin-top: 68px;
`;

const SlideContainer = styled.div`
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
        isCollapsed: false,
        currentTab: '公告',
        courses: [],
        selectedCourses: new Set(),
        hoveredCourseId: null,
    };

    /**
     * 取得最新課程資料
     */
    componentDidMount() {
        fetch(courseData.latestSource)
            .then(response => response.text())
            .then(csvText => {
                const results = Papa.parse(csvText, {header: true, skipEmptyLines: true});
                // 去除重複值
                const uniqueResults = results.data.filter((course, index, self) =>
                        index === self.findIndex(c => (
                            c['Name'] === course['Name'] &&
                            c['Number'] === course['Number'] &&
                            c['Teacher'] === course['Teacher']
                        ))
                );
                this.setState({courses: uniqueResults}, () => {
                    // 載入已選課程
                    const savedSelectedCoursesNumbers = localStorage.getItem('selectedCoursesNumbers');
                    if (savedSelectedCoursesNumbers) {
                        const selectedCourseNumbers = new Set(JSON.parse(savedSelectedCoursesNumbers));
                        const selectedCourses = new Set(
                            this.state.courses.filter(course => selectedCourseNumbers.has(course['Number']))
                        );
                        this.setState({selectedCourses});
                    }
                });
            })
            .catch(error => console.error('Error fetching and parsing data:', error));
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
     * 渲染元件
     * @returns {React.ReactNode} 元件
     */
    render() {
        const {isCollapsed, currentTab, courses, selectedCourses, hoveredCourseId} = this.state;
        const slideStyle = {
            marginLeft: isCollapsed ? (window.innerWidth >= 992 ? '-50%' : '0') : '0',
            marginTop: isCollapsed ? (window.innerWidth < 992 ? '-600%' : '0') : '0'
        };

        return (
            <>
                <Header currentTab={this.state.currentTab} onTabChange={this.handleTabChange}/>
                <EntryNotification/>

                <ToggleButton className="btn btn-secondary w-auto" onClick={this.toggleSchedule}>
                    {isCollapsed ? '>' : '<'}
                </ToggleButton>

                <MainContent id="app" className="container-fluid">
                    <div className="row d-flex flex-wrap">
                        <SlideContainer style={slideStyle} className="col-lg-6 d-flex flex-column">
                            <ScheduleTable selectedCourses={selectedCourses}
                                           hoveredCourseId={hoveredCourseId}
                                           onCourseHover={this.handleCourseHover}
                            />
                        </SlideContainer>

                        <div className="col-lg d-flex flex-column">
                            <SelectorSetting currentTab={currentTab}
                                             courses={courses}
                                             selectedCourses={selectedCourses}
                                             hoveredCourseId={hoveredCourseId}
                                             onCourseSelect={this.handleCourseSelect}
                                             onClearAllSelectedCourses={this.handleClearAllSelectedCourses}
                                             onCourseHover={this.handleCourseHover}
                            />
                        </div>
                    </div>
                </MainContent>
            </>
        );
    }
}

export default App;
