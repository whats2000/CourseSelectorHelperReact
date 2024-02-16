import {Component} from "react";

import AllCourse from "./SelectorSetting/AllCourse";
import RequiredCourse from "./SelectorSetting/RequiredCourse";
import CourseDetective from "./SelectorSetting/CourseDetective";
import Announcement from "./SelectorSetting/Announcement";
import SelectedCourse from "./SelectorSetting/SelectedCourse";

import {courseDayName, defaultFilterOptions} from "../config";

class SelectorSetting extends Component {
    state = {
        filterOptions: defaultFilterOptions,
    };

    componentDidMount() {
        this.calculateFilterOptions(this.props.courses);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.courses !== this.props.courses) {
            this.calculateFilterOptions(this.props.courses);
        }
    }

    /**
     * 計算篩選選項
     * @param courses {Array} 課程列表
     */
    calculateFilterOptions = (courses) => {
        let updateFilterOptions = {
            "系所": new Set(),
            "學分": new Set(),
        };

        courses?.forEach(course => {
            updateFilterOptions["系所"].add(course['Department']);
            updateFilterOptions["學分"].add(course['Credit'].toString());
        });

        // 將 Set 轉換為 Array
        updateFilterOptions["系所"] = Array.from(updateFilterOptions["系所"]).sort();
        updateFilterOptions["學分"] = Array.from(updateFilterOptions["學分"]).sort();

        // 更新狀態
        this.setState(prevState => ({
            filterOptions: {
                ...prevState.filterOptions,
                "系所": {...prevState.filterOptions["系所"], options: updateFilterOptions["系所"]},
                "學分": {...prevState.filterOptions["學分"], options: updateFilterOptions["學分"]},
            }
        }));
    };

    /**
     * 計算總學分與總時數
     * @param selectedCourses {Set: Object} 已選課程的 Set
     * @returns {{totalCredits: number, totalHours: number}} 總學分與總時數
     */
    calculateTotalCreditsAndHours = (selectedCourses) => {
        let totalCredits = 0;
        let totalHours = 0;

        selectedCourses.forEach(course => {
            totalCredits += parseFloat(course['Credit'] ?? "0.0");
            courseDayName.forEach(day => {
                totalHours += course[day]?.length ?? 0;
            });
        });

        return {totalCredits, totalHours};
    };

    /**
     * 檢測時間衝突
     * @param course {Object} 要檢測的課程
     * @param selectedCourses {Set} 已選擇的課程集合
     * @returns {boolean} 如果衝突，返回 true
     */
    detectTimeConflict = (course, selectedCourses) => {
        for (let selectedCourse of selectedCourses) {
            if (this.isConflict(course, selectedCourse)) {
                return true;
            }
        }
        return false;
    };

    /**
     * 判斷兩個課程是否衝突
     * @param course1 {Object} 第一個課程
     * @param course2 {Object} 第二個課程
     * @returns {boolean} 如果衝突，返回 true
     */
    isConflict = (course1, course2) => {
        for (let day of courseDayName) {
            if (course1[day] && course2[day]) {
                const time1 = course1[day].split('');
                const time2 = course2[day].split('');
                if (time1.some(t => time2.includes(t))) {
                    return true;
                }
            }
        }
        return false;
    };

    render() {
        const {
            currentTab,
            courses,
            selectedCourses,
            onCourseSelect,
            onClearAllSelectedCourses,
            onCourseHover,
            hoveredCourseId,
            isCollapsed,
            latestCourseHistoryData,
            convertVersion,
            searchTimeSlot,
        } = this.props;
        const {filterOptions} = this.state;

        const mapTabToComponent = {
            '所有課程': <AllCourse
                isCollapsed={isCollapsed}
                courses={courses}
                selectedCourses={selectedCourses}
                hoveredCourseId={hoveredCourseId}
                onCourseSelect={onCourseSelect}
                onClearAllSelectedCourses={onClearAllSelectedCourses}
                onCourseHover={onCourseHover}
                filterOptions={filterOptions}
                detectTimeConflict={this.detectTimeConflict}
                calculateTotalCreditsAndHours={this.calculateTotalCreditsAndHours}
            />,
            '學期必修': <RequiredCourse
                isCollapsed={isCollapsed}
                courses={courses}
                selectedCourses={selectedCourses}
                hoveredCourseId={hoveredCourseId}
                onCourseSelect={onCourseSelect}
                onClearAllSelectedCourses={onClearAllSelectedCourses}
                onCourseHover={onCourseHover}
                filterOptions={filterOptions}
                detectTimeConflict={this.detectTimeConflict}
                calculateTotalCreditsAndHours={this.calculateTotalCreditsAndHours}
            />,
            '課程偵探': <CourseDetective
                isCollapsed={isCollapsed}
                courses={courses}
                selectedCourses={selectedCourses}
                hoveredCourseId={hoveredCourseId}
                onCourseSelect={onCourseSelect}
                onCourseHover={onCourseHover}
                searchTimeSlot={searchTimeSlot}
                detectTimeConflict={this.detectTimeConflict}
                calculateTotalCreditsAndHours={this.calculateTotalCreditsAndHours}
            />,
            '已選匯出': <SelectedCourse
                isCollapsed={isCollapsed}
                courses={courses}
                hoveredCourseId={hoveredCourseId}
                onCourseSelect={onCourseSelect}
                onCourseHover={onCourseHover}
                selectedCourses={selectedCourses}
                calculateTotalCreditsAndHours={this.calculateTotalCreditsAndHours}
                onClearAllSelectedCourses={onClearAllSelectedCourses}
            />,
            '公告': <Announcement
                latestCourseHistoryData={latestCourseHistoryData}
                convertVersion={convertVersion}
            />,
        }

        return (
            <>
                {mapTabToComponent[currentTab] ?? <h1>我很確 Tab 傳遞某處出錯，請回報</h1>}
            </>
        )
    }
}

export default SelectorSetting;
