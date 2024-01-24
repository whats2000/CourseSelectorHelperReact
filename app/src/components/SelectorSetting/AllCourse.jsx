import {Component} from "react";
import {Card, Col} from "react-bootstrap";
import styled from "styled-components";

import CoursesList from "./AllCourse/CoursesList";
import ListHeader from "./AllCourse/ListHeader";
import ListInformation from "./AllCourse/ListInformation";

const StyledCardBody = styled(Card.Body)`
    height: 100%;
    min-height: 65vh;
    padding: 0;
`;

class AllCourse extends Component {
    state = {
        basicFilter: '',
        advancedFilters: {},
        displaySelectedOnly: false,
        displayConflictCourses: true,
        filteredCourses: this.props.courses,
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.basicFilter !== prevState.basicFilter ||
            this.state.advancedFilters !== prevState.advancedFilters ||
            this.state.displayConflictCourses !== prevState.displayConflictCourses) {
            localStorage.setItem('basicFilter', this.state.basicFilter);
            localStorage.setItem('advancedFilters', JSON.stringify(this.state.advancedFilters));

            const filteredCourses = this.getFilteredCourses();
            this.setState({filteredCourses});
        }
    }

    componentDidMount() {
        const savedBasicFilter = localStorage.getItem('basicFilter');
        const savedAdvancedFilters = localStorage.getItem('advancedFilters');

        if (savedBasicFilter || savedAdvancedFilters) {
            this.setState({
                basicFilter: savedBasicFilter || '',
                advancedFilters: savedAdvancedFilters ? JSON.parse(savedAdvancedFilters) : {},
                filteredCourses: this.getFilteredCourses(),
            });
        }
    }

    /**
     * 處理基本篩選事件
     * @param filter {string} 篩選字串
     */
    handleBasicFilterChange = (filter) => {
        this.setState({basicFilter: filter});
    };

    /**
     * 處理進階篩選事件
     * @param advancedFilters {object} 進階篩選器
     */
    handleAdvancedFilterChange = (advancedFilters) => {
        this.setState({advancedFilters});
    };


    /**
     * 獲取過濾後的課程列表
     * @returns {Array} 過濾後的課程列表
     */
    getFilteredCourses = () => {
        const {courses} = this.props;
        const {basicFilter, displayConflictCourses, advancedFilters} = this.state;

        let filteredCourses = basicFilter
            ? courses.filter(course =>
                course['Name'].toLowerCase().includes(basicFilter.toLowerCase()) ||
                course['Teacher'].toLowerCase().includes(basicFilter.toLowerCase()) ||
                course['Programs'].toLowerCase().includes(basicFilter.toLowerCase()) ||
                course['Number'].toLowerCase().includes(basicFilter.toLowerCase()) ||
                course['Department'].toLowerCase().includes(basicFilter.toLowerCase()))
            : courses;

        filteredCourses = this.applyAdvancedFilters(filteredCourses, advancedFilters);

        // 如果不顯示衝突課程，進行過濾
        if (!displayConflictCourses) {
            filteredCourses = this.filterOutConflictCourses(filteredCourses);
        }

        return filteredCourses;
    };

    /**
     * 獲取進階過濾後的課程列表
     * @param courses {Array} 課程列表
     * @param filters {Object} 進階篩選器
     * @returns {Array} 過濾後的課程列表
     */
    applyAdvancedFilters = (courses, filters) => {
        return courses.filter(course => {
            for (let filterName in filters) {
                const filter = filters[filterName];
                const isInclude = filter.include === undefined ? true : filter.include;

                // 如果是文字類型的篩選（如名稱、教師、學程）
                if (filter.value) {
                    const courseValue = course[this.courseDataNameMap[filterName]]?.toLowerCase();
                    const filterValue = filter.value.toLowerCase();

                    if ((isInclude && !courseValue.includes(filterValue)) ||
                        (!isInclude && courseValue.includes(filterValue))) {
                        return false;
                    }

                    continue;
                }

                if (!(filter.active ?? false)) continue;

                // 處理星期與節次的篩選
                if (filterName === '星期') {
                    let daysMatched = Object.keys(filter).some(day => {
                        return filter[day] && course[day];
                    });

                    if ((filter.include === undefined || filter.include) && !daysMatched) {
                        return false;
                    } else if (filter.include === false && daysMatched) {
                        return false;
                    }

                    continue;
                }

                // 處理節次的篩選
                if (filterName === '節次') {
                    let periodsMatched = false;

                    // 檢查每一天，如果課程的時間段與篩選器的節次匹配
                    this.courseDayName.forEach(day => {
                        if (typeof course[day] === 'string') {
                            periodsMatched = periodsMatched || course[day].split('').some(period => {
                                return filter[period];
                            });
                        }
                    });

                    if ((filter.include === undefined || filter.include) && !periodsMatched) {
                        return false;
                    } else if (filter.include === false && periodsMatched) {
                        return false;
                    }

                    continue;
                }

                // 如果是選項類型的篩選
                if (typeof filter === 'object') {
                    let optionMatch = Object.keys(filter).some(option => {
                        // 跳過非選項鍵（如active和include）
                        if (option === 'active' || option === 'include') return false;

                        return filter[option] && (course[this.courseDataNameMap[filterName]]?.toString() === option);
                    });

                    if ((isInclude && !optionMatch) || (!isInclude && optionMatch)) {
                        return false;
                    }
                }
            }
            return true;
        });
    };

    /**
     * 過濾掉時間衝突的課程
     * @param courses {Array} 課程列表
     * @returns {Array} 經過時間衝突過濾的課程列表
     */
    filterOutConflictCourses = (courses) => {
        const { selectedCourses } = this.props;
        return courses.filter(course => {
            // 如果課程已被選擇，則不進行衝突檢查，直接保留
            if (selectedCourses.has(course)) {
                return true;
            }
            // 否則，檢查是否有時間衝突
            return !this.detectTimeConflict(course, selectedCourses);
        });
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

    /**
     * 切換只顯示已選課程
     */
    toggleOnlySelected = () => {
        this.setState({displaySelectedOnly: !this.state.displaySelectedOnly});
    }

    /**
     * 切換是否顯示衝堂課程
     */
    toggleDisplayConflictCourses = () => {
        this.setState({displayConflictCourses: !this.state.displayConflictCourses});
    }

    render() {
        const {courses, selectedCourses, onCourseSelect, onClearAllSelectedCourses} = this.props;
        const {filteredCourses, basicFilter, advancedFilters, displaySelectedOnly, displayConflictCourses} = this.state;

        return (
            <Card className="h-100 mb-3 pb-2">
                <Card.Header className="text-center">
                    <Card.Title className="fw-bolder mb-0 p-2">所有課程</Card.Title>
                    <Card.Subtitle className="mb-0 p-2">
                            <Col>共篩選 {filteredCourses.length} 門課程，已選 {selectedCourses.size} 門課程</Col>
                    </Card.Subtitle>
                </Card.Header>
                <ListInformation
                    courses={courses}
                    selectedCourses={selectedCourses}
                    onClearAllSelectedCourses={onClearAllSelectedCourses}
                    basicFilter={basicFilter}
                    onBasicFilterChange={this.handleBasicFilterChange}
                    advancedFilters={advancedFilters}
                    onAdvancedFilterChange={this.handleAdvancedFilterChange}
                    displaySelectedOnly={displaySelectedOnly}
                    toggleOnlySelected={this.toggleOnlySelected}
                    displayConflictCourses={displayConflictCourses}
                    toggleDisplayConflictCourses={this.toggleDisplayConflictCourses}
                />
                <ListHeader/>
                <StyledCardBody>
                    <CoursesList
                        courses={displaySelectedOnly ? Array.from(selectedCourses) : filteredCourses}
                        selectedCourses={selectedCourses}
                        onCourseSelect={onCourseSelect}
                        displayConflictCourses={displayConflictCourses}
                        detectTimeConflict={this.detectTimeConflict}
                    />
                </StyledCardBody>
            </Card>
        );
    }
}

export default AllCourse;
