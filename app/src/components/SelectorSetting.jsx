import {Component} from "react";
import AllCourse from "./SelectorSetting/AllCourse";
import RequiredCourse from "./SelectorSetting/RequiredCourse";
import CourseDetective from "./SelectorSetting/CourseDetective";
import Announcement from "./SelectorSetting/Announcement";
import SelectedCourse from "./SelectorSetting/SelectedCourse";

class SelectorSetting extends Component {
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

        const mapTabToComponent = {
            '所有課程': <AllCourse
                isCollapsed={isCollapsed}
                courses={courses}
                selectedCourses={selectedCourses}
                hoveredCourseId={hoveredCourseId}
                onCourseSelect={onCourseSelect}
                onClearAllSelectedCourses={onClearAllSelectedCourses}
                onCourseHover={onCourseHover}
                detectTimeConflict={this.detectTimeConflict}
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
                detectTimeConflict={this.detectTimeConflict}
                courseDataNameMap={this.courseDataNameMap}
            />,
            '課程偵探': <CourseDetective/>,
            '已選課程': <SelectedCourse/>,
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
