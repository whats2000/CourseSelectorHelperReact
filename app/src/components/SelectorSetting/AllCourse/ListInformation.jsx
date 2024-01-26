import React, {Component} from "react";
import {Card, Form, InputGroup, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import AdvancedFilter from "./ListInformation/AdvancedFilter";
import styled from "styled-components";
import {websiteColor} from "../../../config";
import ClearSelectedCourses from "./ListInformation/ClearSelectedCourses";

const ButtonsRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    /* 定義活動按鈕的樣式 */

    .btn-check:checked + .btn {
        background-color: ${websiteColor.mainColor};
        color: white;
        border-color: ${websiteColor.mainColor};
    }
`;

const StyledButton = styled(ToggleButton)`
    color: ${websiteColor.mainColor};
    border-color: ${websiteColor.mainColor};


    &:focus, &:active:focus, &:not(:disabled):not(.disabled).active:focus {
        box-shadow: 0 0 0 0.2rem ${websiteColor.boxShadowColor};
    }
`;

class ListInformation extends Component {
    /**
     * 處理篩選課程名稱的事件
     * @param e {React.ChangeEvent<HTMLInputElement>} 事件
     */
    handleFilterChange = (e) => {
        const {onBasicFilterChange} = this.props;
        onBasicFilterChange(e.target.value);
    };

    /**
     * 處理顯示已選課程的事件
     */
    handleShowSelectedCourses = () => {
        this.props.toggleDisplayConflictCourses();
    }

    /**
     * 處理僅顯示已選課程的事件
     */
    handleToggleOnlySelected = () => {
        this.props.toggleOnlySelected();
    }

    render() {
        const {
            courses,
            selectedCourses,
            basicFilter,
            advancedFilters,
            onAdvancedFilterChange,
            onClearAllSelectedCourses,
            displaySelectedOnly,
            displayConflictCourses,
            calculateTotalCreditsAndHours,
            filterOptions,
        } = this.props;
        const {totalCredits, totalHours} = calculateTotalCreditsAndHours(selectedCourses);

        return (
            <>
                <Card.Body>
                    <InputGroup className="mb-2">
                        <Form.Control
                            id="all-course-filter"
                            type="text"
                            placeholder="關鍵字 (空格分隔)..."
                            value={basicFilter ?? ""}
                            onChange={this.handleFilterChange}
                        />
                        <InputGroup.Text>{totalCredits} 學分</InputGroup.Text>
                        <InputGroup.Text>{totalHours} 小時</InputGroup.Text>
                        <AdvancedFilter courses={courses}
                                        advancedFilters={advancedFilters}
                                        onAdvancedFilterChange={onAdvancedFilterChange}
                                        filterOptions={filterOptions}
                        />
                    </InputGroup>

                    <ButtonsRow>
                        <ToggleButtonGroup
                            type="radio"
                            name="options"
                            defaultValue={'allCourses'}
                            value={displaySelectedOnly ? 'onlySelected' : 'allCourses'}
                            onChange={this.handleToggleOnlySelected}>
                            <StyledButton variant="outline-success" id="tbg-radio-1"
                                          value={'allCourses'}>所有</StyledButton>
                            <StyledButton variant="outline-success" id="tbg-radio-2"
                                          value={'onlySelected'}>僅已選</StyledButton>
                        </ToggleButtonGroup>

                        <div>
                            <StyledButton
                                id="toggle-show-conflict-courses"
                                type="checkbox"
                                variant="outline-success"
                                onClick={this.handleShowSelectedCourses}
                                value="show"
                                checked={displayConflictCourses}
                            >
                                {displayConflictCourses ? '隱藏衝堂' : '顯示衝堂'}
                            </StyledButton>
                            <ClearSelectedCourses onClearAllSelectedCourses={onClearAllSelectedCourses}/>
                        </div>
                    </ButtonsRow>
                </Card.Body>
            </>
        );
    }
}

export default ListInformation;
