import {Component} from "react";
import AllCourse from "./SelectorSetting/AllCourse";
import RequiredCourse from "./SelectorSetting/RequiredCourse";
import CourseDetective from "./SelectorSetting/CourseDetective";
import Announcement from "./SelectorSetting/Announcement";
import SelectedCourse from "./SelectorSetting/SelectedCourse";

class SelectorSetting extends Component {
    render() {
        const {currentTab, courses, selectedCourses, onCourseSelect, onClearAllSelectedCourses, onCourseHover, hoveredCourseId} = this.props;

        const mapTabToComponent = {
            '所有課程': <AllCourse
                courses={courses}
                selectedCourses={selectedCourses}
                hoveredCourseId={hoveredCourseId}
                onCourseSelect={onCourseSelect}
                onClearAllSelectedCourses={onClearAllSelectedCourses}
                onCourseHover={onCourseHover}
            />,
            '學期必修': <RequiredCourse/>,
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
