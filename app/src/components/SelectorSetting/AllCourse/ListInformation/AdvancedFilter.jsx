import React, {Component} from 'react';
import {Offcanvas, Button} from 'react-bootstrap';
import {Filter} from 'react-bootstrap-icons';
import styled from 'styled-components';
import FilterRow from "./AdvancedFilter/FilterRow";
import {websiteColor} from "../../../../config";

const StyledButton = styled(Button)`
    background-color: ${websiteColor.mainColor};

    &:hover {
        background-color: ${websiteColor.mainDarkerColor};
    }

    &:active {
        background-color: ${websiteColor.mainColor};
    }
`;

const StyledFilterRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
`;

class AdvancedFilter extends Component {
    state = {
        show: false,
    };

    /**
     * 關閉進階篩選
     */
    handleClose = () => this.setState({show: false});

    /**
     * 顯示進階篩選
     */
    handleShow = () => this.setState({show: !this.state.show});

    /**
     * 篩選器選項名稱轉換成顯示名稱
     * @param filterName {String} 篩選器名稱
     * @param optionName {String} 選項名稱
     */
    filterNameToDisplayName = (filterName, optionName) => {
        const filter = this.props.filterOptions[filterName];

        // 檢查是否有 displayName 映射
        if (filter && filter.optionDisplayName) {
            // 找到選項名稱在 options 中的索引
            const index = filter.options.indexOf(optionName);
            // 如果找到對應的索引且該索引在 optionDisplayName 中有對應的值，則返回該顯示名稱
            if (index !== -1 && filter.optionDisplayName[index]) {
                return filter.optionDisplayName[index];
            }
        }
        // 如果沒有找到對應的顯示名稱，或者沒有 displayName 映射，則直接返回選項名稱
        return optionName;
    }

    render() {
        const {advancedFilters, onAdvancedFilterChange, filterOptions} = this.props;

        return (
            <>
                <StyledButton variant="success" onClick={this.handleShow}>
                    <Filter/>
                </StyledButton>

                <Offcanvas
                    show={this.state.show}
                    onHide={this.handleClose}
                    scroll={true}
                    backdrop={false}
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title className="fw-bolder">進階篩選</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <StyledFilterRow className="text-muted fst-italic">
                            可以用空格分隔多個關鍵字，空格是「且」的意思，逗號是「或」的意思，系所篩選包含通識與博雅喔!
                        </StyledFilterRow>
                        {
                            Object.keys(filterOptions).map((filterName, index) => (
                                <FilterRow key={index}
                                           filterOptions={filterOptions}
                                           filterName={filterName}
                                           isDropdown={filterOptions[filterName].dropdown}
                                           advancedFilters={advancedFilters}
                                           onAdvancedFilterChange={onAdvancedFilterChange}
                                           filterNameToDisplayName={this.filterNameToDisplayName}
                                />
                            ))
                        }
                    </Offcanvas.Body>
                </Offcanvas>
            </>
        );
    }
}

export default AdvancedFilter;
