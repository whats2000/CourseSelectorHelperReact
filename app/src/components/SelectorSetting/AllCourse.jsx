import {Component} from "react";
import {Card} from "react-bootstrap";
import styled from "styled-components";

import AllCourseList from "./AllCourse/List";
import ListHeader from "./AllCourse/ListHeader";
import ListInformation from "./AllCourse/ListInformation";

const StyledCardBody = styled(Card.Body)`
    height: 100%;
    min-height: 75vh;
    padding: 0;
`;

class AllCourse extends Component {
    state = {
        basicFilter: '',
        advancedFilters: {},
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
        if (this.state.basicFilter !== prevState.basicFilter || this.state.advancedFilters !== prevState.advancedFilters) {
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
        const {basicFilter} = this.state;

        let filteredCourses = basicFilter
            ? courses.filter(course =>
                course['Name'].toLowerCase().includes(basicFilter.toLowerCase()) ||
                course['Teacher'].toLowerCase().includes(basicFilter.toLowerCase()) ||
                course['Programs'].toLowerCase().includes(basicFilter.toLowerCase()) ||
                course['Number'].toLowerCase().includes(basicFilter.toLowerCase()) ||
                course['Department'].toLowerCase().includes(basicFilter.toLowerCase()))
            : courses;

        return this.applyAdvancedFilters(filteredCourses, this.state.advancedFilters);
    };

    /**
     * 獲取進階過濾後的課程列表
     * @param courses {Array} 課程列表
     * @param filters {Object} 進階篩選器
     * @returns {Array} 過濾後的課程列表
     */
    applyAdvancedFilters = (courses, filters) => {
        console.log(filters);

        return courses.filter(course => {
            for (let filterName in filters) {
                const filter = filters[filterName];
                const isInclude = filter.include === undefined ? true : filter.include;

                if (!(filter.active ?? false)) continue;

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

                // 處理星期與節次的篩選
                // 資料表保存的格式為：{Monday: 'A123', Tuesday: '', ...}
                // 而篩選器星期的格式為：{Monday: true, Tuesday: false..., include: true}
                // 而篩選器節次的格式為：{1: true, 2: false..., include: true}
                // 先檢查是否存在星期的篩選條件，並記錄符合條件的星期
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


    render() {
        const {courses, selectedCourses, onCourseSelect} = this.props;
        const {filteredCourses, basicFilter, advancedFilters} = this.state;

        return (
            <Card className="h-100 mb-3 pb-2">
                <Card.Header className="text-center">
                    <Card.Title className="fw-bolder mb-0 p-2">所有課程</Card.Title>
                    <Card.Subtitle className="mb-0 p-2">共篩選 {filteredCourses.length} 門課程</Card.Subtitle>
                </Card.Header>
                <ListInformation
                    courses={courses}
                    selectedCourses={selectedCourses}
                    basicFilter={basicFilter}
                    onBasicFilterChange={this.handleBasicFilterChange}
                    advancedFilters={advancedFilters}
                    onAdvancedFilterChange={this.handleAdvancedFilterChange}
                />
                <ListHeader/>
                <StyledCardBody>
                    <AllCourseList
                        courses={filteredCourses}
                        selectedCourses={selectedCourses}
                        onCourseSelect={onCourseSelect}
                    />
                </StyledCardBody>
            </Card>
        );
    }
}

export default AllCourse;
