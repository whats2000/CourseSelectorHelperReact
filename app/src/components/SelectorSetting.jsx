import {Component} from "react";
import AllCourse from "./SelectorSetting/AllCourse";
import RequiredCourse from "./SelectorSetting/RequiredCourse";
import CourseDetective from "./SelectorSetting/CourseDetective";
import Announcement from "./SelectorSetting/Announcement";
import SelectedCourse from "./SelectorSetting/SelectedCourse";

class SelectorSetting extends Component {
    state = {
        filterOptions: {
            "名稱": {options: [], dropdown: false},
            "教師": {options: [], dropdown: false},
            "學程": {options: [], dropdown: false},
            "節次": {
                options: ['A', '1', '2', '3', 'B', '4', '5', '6', '7', '8', '9', 'C', 'D', 'E', 'F'],
                dropdown: true
            },
            "星期": {
                options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                optionDisplayName: ['一', '二', '三', '四', '五', '六', '日'],
                dropdown: true
            },
            "年級": {
                options: ['0', '1', '2', '3', '4'],
                optionDisplayName: ['不分', '大一', '大二', '大三', '大四'],
                dropdown: true
            },
            "班別": {options: ['甲班', '乙班', '全英班', '不分班'], dropdown: true},
            "系所": {options: [], dropdown: true},
            "必修": {options: ['必', '選'], optionDisplayName: ['必修', '選修'], dropdown: true},
            "學分": {options: [], dropdown: true},
            "英課": {options: ['1', '0'], optionDisplayName: ['是', '否'], dropdown: true},
        },
    };

    courseDataNameMap = {
        "名稱": "Name",
        "教師": "Teacher",
        "學程": "Programs",
        "年級": "Grade",
        "班別": "Class",
        "系所": "Department",
        "必修": "CompulsoryElective",
        "學分": "Credit",
        "英課": "EMI",
    }

    courseDayName = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]

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
            this.courseDayName.forEach(day => {
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
        for (let day of this.courseDayName) {
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
            isCollapsed
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
                courseDataNameMap={this.courseDataNameMap}
                courseDayName={this.courseDayName}
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
                courseDataNameMap={this.courseDataNameMap}
            />,
            '課程偵探': <CourseDetective/>,
            '已選匯出': <SelectedCourse/>,
            '公告': <Announcement/>,
        }

        return (
            <>
                {mapTabToComponent[currentTab] ?? <h1>我很確 Tab 傳遞某處出錯，請回報</h1>}
            </>
        )
    }
}

export default SelectorSetting;
