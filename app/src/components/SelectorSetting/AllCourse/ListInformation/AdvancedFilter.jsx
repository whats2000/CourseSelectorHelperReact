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

    componentDidMount() {
        this.calculateFilterOptions(this.props.courses);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.courses !== this.props.courses) {
            this.calculateFilterOptions(this.props.courses);
        }
    }

    /**
     * 關閉進階篩選
     */
    handleClose = () => this.setState({show: false});

    /**
     * 顯示進階篩選
     */
    handleShow = () => this.setState({show: !this.state.show});

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

    render() {
        const {filterOptions} = this.state;
        const {advancedFilters, onAdvancedFilterChange} = this.props;

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
                            可以用空格分隔多個關鍵字，空格是「且」的意思，逗號是「或」的意思
                        </StyledFilterRow>
                        {
                            Object.keys(filterOptions).map((filterName, index) => (
                                <FilterRow key={index}
                                           filterOptions={filterOptions}
                                           filterName={filterName}
                                           options={filterOptions[filterName].options}
                                           isDropdown={filterOptions[filterName].dropdown}
                                           advancedFilters={advancedFilters}
                                           onAdvancedFilterChange={onAdvancedFilterChange}
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
