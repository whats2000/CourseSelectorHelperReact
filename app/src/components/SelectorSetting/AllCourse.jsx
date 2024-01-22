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
        advancedFilters: {}
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.basicFilter !== prevState.basicFilter || this.state.advancedFilters !== prevState.advancedFilters) {
            localStorage.setItem('basicFilter', this.state.basicFilter);
            localStorage.setItem('advancedFilters', JSON.stringify(this.state.advancedFilters));
        }
    }

    componentDidMount() {
        const savedBasicFilter = localStorage.getItem('basicFilter');
        const savedAdvancedFilters = localStorage.getItem('advancedFilters');

        if (savedBasicFilter || savedAdvancedFilters) {
            this.setState({
                basicFilter: savedBasicFilter || '',
                advancedFilters: savedAdvancedFilters ? JSON.parse(savedAdvancedFilters) : {}
            });
        }
    }

    /**
     * 處理基本篩選事件
     * @param filter {string} 篩選字串
     */
    handleBasicFilterChange = (filter) => {
        this.setState({ basicFilter: filter });
    };

    handleAdvancedFilterChange = (advancedFilters) => {
        this.setState({ advancedFilters });
    };

    getFilteredCourses = () => {
        const { courses } = this.props;
        const { basicFilter } = this.state;

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

    applyAdvancedFilters = (courses, filters) => {
        // 這裡加入進階篩選的邏輯
        // ...

        return courses; // 返回過濾後的課程列表
    };

    render() {
        console.log(this.state.advancedFilters);
        const filteredCourses = this.getFilteredCourses();
        const {courses, selectedCourses, onCourseSelect } = this.props;
        const {basicFilter, advancedFilters} = this.state;

        return (
            <Card className="h-100 mb-3 pb-2">
                <Card.Header className="text-center">
                    <Card.Title className="fw-bolder mb-0 p-2">所有課程</Card.Title>
                </Card.Header>
                <ListInformation
                    courses={courses}
                    selectedCourses={selectedCourses}
                    basicFilter={basicFilter}
                    onBasicFilterChange={this.handleBasicFilterChange}
                    advancedFilters={advancedFilters}
                    onAdvancedFilterChange={this.handleAdvancedFilterChange}
                />
                <ListHeader />
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
