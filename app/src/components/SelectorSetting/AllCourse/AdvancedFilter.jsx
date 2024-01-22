import React, {Component} from 'react';
import {Offcanvas, Form, Dropdown, Button} from 'react-bootstrap';
import {Filter} from 'react-bootstrap-icons';
import styled from 'styled-components';

const StyledButton = styled(Button)`
    background-color: #009e96;

    &:hover {
        background-color: #008e86;
    }

    &:active {
        background-color: #009e96;
    }
`;

const StyledDropdownMenu = styled(Dropdown.Menu)`
    max-height: 200px;
    overflow-y: auto;

    .dropdown-item {
        border: white 1px solid;
        &.active {
            color: white;
            background-color: #009e96;
        }

        &:active {
            color: white;
            background-color: #009e96;
        }
    }
`;

const StyledDropdownToggle = styled(Dropdown.Toggle)`
    background-color: #009e96;

    &:hover {
        background-color: #008e86;
    }

    &:active {
        background-color: #009e96;
    }
`;

const FilterRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
`;

const FilterLabel = styled.div`
    flex: 0 0 auto;
    width: 15%;
    padding-right: 15px;
`;

const FilterSelect = styled.div`
    flex: 0 0 auto;
    width: 30%;
    padding-right: 15px;
`;

const FilterInput = styled.div`
    flex: 1;
`;

class AdvancedFilter extends Component {
    state = {
        show: false,
        filterOptions: {
            "名稱": {options: [], dropdown: false},
            "教師": {options: [], dropdown: false},
            "學程": {options: [], dropdown: false},
            "節次": {options: ['A', '1', '2', '3', 'B', '4', '5', '6', '7', '8', '9', 'C', 'D', 'E', 'F'], dropdown: true},
            "星期": {options: ['一', '二', '三', '四', '五', '六', '日'], dropdown: true},
            "年級": {options: ['大一', '大二', '大三', '大四', '不分'], dropdown: true},
            "班別": {options: ['甲班', '乙班', '全英', '不分'], dropdown: true},
            "系所": {options: [], dropdown: true},
            "必修": {options: ['必修', '選修'], dropdown: true},
            "學分": {options: [], dropdown: true},
            "英課": {options: ['是', '否'], dropdown: true},
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
     * 全選
     * @param filterName {string} 篩選器名稱
     */
    handleSelectAll = (filterName) => {
        // 創建一個新的選中狀態對象，將所有選項設為選中
        const selected = {};
        this.state.filterOptions[filterName].options.forEach(option => {
            selected[option] = true;
        });

        // 創建 advancedFilters 的副本並更新
        const updatedAdvancedFilters = {
            ...this.props.advancedFilters,
            [filterName]: selected
        };

        // 更新父組件的狀態
        this.props.onAdvancedFilterChange(updatedAdvancedFilters);
    };

    /**
     * 取消全選
     * @param filterName {string} 篩選器名稱
     */
    handleDeselectAll = (filterName) => {
        // 創建 advancedFilters 的副本並將對應篩選器的選中狀態清空
        const updatedAdvancedFilters = {
            ...this.props.advancedFilters,
            [filterName]: {}
        };

        // 更新父組件的狀態
        this.props.onAdvancedFilterChange(updatedAdvancedFilters);
    };

    /**
     * 選擇/取消選擇選項
     * @param filterName {string} 篩選器名稱
     * @param option {string} 選項名稱
     */
    handleOptionSelect = (filterName, option) => {
        // 創建當前篩選選項的副本
        const selected = {...(this.props.advancedFilters[filterName] || {})};

        // 更新選項的選中狀態
        selected[option] = !selected[option];

        // 創建整個 advancedFilters 的副本並更新相應的篩選器
        const updatedAdvancedFilters = {
            ...this.props.advancedFilters,
            [filterName]: selected
        };

        // 通過父組件的方法更新篩選器
        this.props.onAdvancedFilterChange(updatedAdvancedFilters);
    };

    /**
     * 計算篩選選項
     * @param courses {Array} 課程列表
     */
    calculateFilterOptions = (courses) => {
        let updateFilterOptions = {
            "系所": new Set(),
            "學分": new Set(),
        };

        courses.forEach(course => {
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
                "系所": { ...prevState.filterOptions["系所"], options: updateFilterOptions["系所"] },
                "學分": { ...prevState.filterOptions["學分"], options: updateFilterOptions["學分"] },
            }
        }));
    }


    handleFilterModeChange = (filterName, mode) => {
        const updatedAdvancedFilters = {
            ...this.props.advancedFilters,
            [filterName]: {
                ...this.props.advancedFilters[filterName],
                include: mode === 'include'
            }
        };

        this.props.onAdvancedFilterChange(updatedAdvancedFilters);
    };

    /**
     * 處理文字篩選器變化
     * @param filterName {string} 篩選器名稱
     * @param value {string} 篩選器值
     */
    handleTextFilterChange = (filterName, value) => {
        // 創建 advancedFilters 的副本並更新相應的過濾器值
        const updatedAdvancedFilters = {
            ...this.props.advancedFilters,
            [filterName]: {
                ...this.props.advancedFilters[filterName],
                value: value
            }
        };

        // 更新父組件的狀態
        this.props.onAdvancedFilterChange(updatedAdvancedFilters);
    };


    renderFilterOption = (filterName, options, isDropdown = true) => {
        const selected = this.props.advancedFilters[filterName] || {};
        const textInput = this.props.advancedFilters[filterName]?.value || '';
        const include = this.props.advancedFilters[filterName]?.include ?? true;

        return (
            <FilterRow>
                <FilterLabel>{filterName}</FilterLabel>
                <FilterSelect>
                    <Form.Select
                        onChange={e => this.handleFilterModeChange(filterName, e.target.value)}
                        value={include ? 'include' : 'exclude'}
                    >
                        <option value="include">包含</option>
                        <option value="exclude">不包含</option>
                    </Form.Select>
                </FilterSelect>
                <FilterInput>
                    {isDropdown ? (
                        <Dropdown autoClose="outside">
                            <StyledDropdownToggle variant="success">
                                選擇了 {Object.keys(selected).filter(option => selected[option]).length - (selected['include'] ? 1 : 0)} 項
                            </StyledDropdownToggle>
                            <StyledDropdownMenu>
                                <Dropdown.Item as="button" onClick={() => this.handleSelectAll(filterName)}>全選</Dropdown.Item>
                                <Dropdown.Item as="button" onClick={() => this.handleDeselectAll(filterName)}>取消全選</Dropdown.Item>
                                <Dropdown.Divider/>
                                {options.map((option, index) => (
                                    <Dropdown.Item key={index} active={selected[option]} onClick={() => this.handleOptionSelect(filterName, option)}>
                                        {option}
                                    </Dropdown.Item>
                                ))}
                            </StyledDropdownMenu>
                        </Dropdown>
                    ) : (
                        <Form.Control
                            type="text"
                            placeholder={`搜索${filterName}...`}
                            value={textInput || ''}
                            onChange={e => this.handleTextFilterChange(filterName, e.target.value)}
                        />
                    )}
                </FilterInput>
            </FilterRow>
        );
    };

    render() {
        const {filterOptions} = this.state;

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
                        <Offcanvas.Title>進階篩選</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {
                            Object.keys(filterOptions).map((filterName, index) => (
                                <div key={index}>
                                    {this.renderFilterOption(filterName, filterOptions[filterName].options, filterOptions[filterName].dropdown)}
                                </div>
                            ))
                        }
                    </Offcanvas.Body>
                </Offcanvas>
            </>
        );
    }
}

export default AdvancedFilter;
