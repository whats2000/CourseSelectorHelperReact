import {Component} from "react";
import {Card, Col} from "react-bootstrap";
import styled from "styled-components";

import CoursesList from "./AllCourse/CoursesList";
import ListInformation from "./AllCourse/ListInformation";

import {courseDataNameMap, courseDayName} from "../../config";

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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.basicFilter !== prevState.basicFilter ||
            this.state.advancedFilters !== prevState.advancedFilters ||
            this.state.displayConflictCourses !== prevState.displayConflictCourses ||
            this.props.selectedCourses !== prevProps.selectedCourses) {
            localStorage.setItem('basicFilter', this.state.basicFilter);
            localStorage.setItem('advancedFilters', JSON.stringify(this.state.advancedFilters));

            const filteredCourses = this.getFilteredCourses();
            this.setState({filteredCourses});
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

        let filteredCourses = courses;

        // 如果有基本篩選字串，則過濾掉不包含該字串的課程
        if (basicFilter) {
            const filterKeywords = basicFilter.toLowerCase().split(/\s+/);

            filteredCourses = filteredCourses.filter(course =>
                filterKeywords.every(keyword =>
                    course['Name'].toLowerCase().includes(keyword) ||
                    course['Teacher'].toLowerCase().includes(keyword) ||
                    course['Programs'].toLowerCase().includes(keyword) ||
                    course['Number'].toLowerCase().includes(keyword) ||
                    course['Department'].toLowerCase().includes(keyword)
                )
            );
        }

        filteredCourses = this.applyAdvancedFilters(filteredCourses, advancedFilters);

        // 如果不顯示衝堂課程，則過濾掉衝堂課程
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
            return Object.entries(filters).every(([filterName, filter]) => {
                // 文字篩選器：只要有文字，就進行篩選
                if (filter.value !== undefined && filter.value !== "") {
                    return this.applyTextFilter(course, filterName, filter);
                }

                // 如果篩選器激活，則進行篩選
                if (filter.active) {
                    // 星期或節次篩選器
                    if (filterName === '星期' || filterName === '節次') {
                        return this.applyTimeFilter(course, filterName, filter);
                    } else {
                        return this.applyOptionFilter(course, filterName, filter);
                    }
                }

                // 如果篩選器未激活，則不進行篩選
                return true;
            });
        });
    };

    /**
     * 用匹配文字篩選課程
     * @param course {Object} 課程
     * @param filterName {string} 篩選器名稱
     * @param filter {Object} 篩選器
     * @returns {boolean} 如果匹配，返回 true
     */
    applyTextFilter = (course, filterName, filter) => {
        const courseValue = course[courseDataNameMap[filterName]]?.toLowerCase();
        const isInclude = filter.include === undefined ? true : filter.include;
        // 使用逗號或空格分割每個組
        const filterGroups = filter.value.toLowerCase().split(/[，,]/);

        return filterGroups.some(group => {
            // 使用空格分割每個關鍵字
            const keywords = group.trim().split(/\s+/);
            return keywords.every(keyword =>
                isInclude ? courseValue.includes(keyword) : !courseValue.includes(keyword)
            );
        });
    };

    /**
     * 用星期或節次篩選課程
     * @param course {Object} 課程
     * @param filterName {string} 篩選器名稱
     * @param filter {Object} 篩選器
     * @returns {boolean} 如果匹配，返回 true
     */
    applyTimeFilter = (course, filterName, filter) => {
        // 檢查是否包含或排除
        const isInclude = filter.include === undefined ? true : filter.include;

        if (filterName === '星期') {
            // 檢查是否有任何一天匹配
            const daysMatched = courseDayName.some(day => {
                return filter[day] && course[day];
            });
            return isInclude ? daysMatched : !daysMatched;
        }

        if (filterName === '節次') {
            // 檢查是否有任何一節匹配
            let periodsMatched = false;
            courseDayName.forEach(day => {
                if (course[day]) {
                    periodsMatched = periodsMatched || course[day].split('').some(period => {
                        return filter[period];
                    });
                }
            });
            return isInclude ? periodsMatched : !periodsMatched;
        }

        throw new Error('Invalid filter name at applyTimeFilter(), check the second parameter.');
    };


    /**
     * 用選項篩選課程
     * @param course {Object} 課程
     * @param filterName {string} 篩選器名稱
     * @param filter {Object} 篩選器
     * @returns {boolean} 如果匹配，返回 true
     */
    applyOptionFilter = (course, filterName, filter) => {
        const courseValue = course[courseDataNameMap[filterName]]?.toString();
        let matched = Object.keys(filter).some(option => {
            if (option === 'active' || option === 'include') return false;
            return filter[option] && courseValue === option;
        });
        return (filter.include === undefined ? true : filter.include) ? matched : !matched;
    };


    /**
     * 過濾掉時間衝突的課程
     * @param courses {Array} 課程列表
     * @returns {Array} 經過時間衝突過濾的課程列表
     */
    filterOutConflictCourses = (courses) => {
        const {selectedCourses} = this.props;
        return courses.filter(course => {
            // 如果課程已被選擇，則不進行衝突檢查，直接保留
            if (selectedCourses.has(course)) {
                return true;
            }
            // 否則，檢查是否有時間衝突
            return !this.props.detectTimeConflict(course, selectedCourses);
        });
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
        const {
            courses,
            selectedCourses,
            onCourseSelect,
            onClearAllSelectedCourses,
            onCourseHover,
            filterOptions,
            hoveredCourseId,
            isCollapsed,
            detectTimeConflict,
            calculateTotalCreditsAndHours,
        } = this.props;
        const {
            filteredCourses,
            basicFilter,
            advancedFilters,
            displaySelectedOnly,
            displayConflictCourses
        } = this.state;

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
                    calculateTotalCreditsAndHours={calculateTotalCreditsAndHours}
                    filterOptions={filterOptions}
                />
                <StyledCardBody>
                    <CoursesList
                        isCollapsed={isCollapsed}
                        courses={displaySelectedOnly ? Array.from(selectedCourses) : filteredCourses}
                        selectedCourses={selectedCourses}
                        displayConflictCourses={displayConflictCourses}
                        detectTimeConflict={detectTimeConflict}
                        hoveredCourseId={hoveredCourseId}
                        onCourseSelect={onCourseSelect}
                        onCourseHover={onCourseHover}
                    />
                </StyledCardBody>
            </Card>
        );
    }
}

export default AllCourse;
