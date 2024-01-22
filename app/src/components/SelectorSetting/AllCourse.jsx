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
        filter: ''
    };

    handleFilterChange = (filter) => {
        this.setState({filter});
    };

    getFilteredCourses = () => {
        const {courses} = this.props;
        const {filter} = this.state;

        return filter
            ? courses.filter(course =>
                course['Name'].toLowerCase().includes(filter.toLowerCase()) ||
                course['Teacher'].toLowerCase().includes(filter.toLowerCase()) ||
                course['Programs'].toLowerCase().includes(filter.toLowerCase()) ||
                course['Number'].toLowerCase().includes(filter.toLowerCase()) ||
                course['Department'].toLowerCase().includes(filter.toLowerCase()))
            : courses;
    };

    render() {
        const filteredCourses = this.getFilteredCourses();
        const {selectedCourses, onCourseSelect} = this.props;

        return (
            <Card className="h-100 mb-3 pb-2">
                <Card.Header className="text-center">
                    <Card.Title className="fw-bolder mb-0 p-2">所有課程</Card.Title>
                </Card.Header>
                <ListInformation
                    selectedCourses={selectedCourses}
                    onFilterChange={this.handleFilterChange}
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
