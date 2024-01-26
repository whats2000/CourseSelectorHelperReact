import React, {Component} from "react";
import {Dropdown, Form} from "react-bootstrap";
import styled from "styled-components";
import {websiteColor} from "../../../../../config";

const StyledDropdownMenu = styled(Dropdown.Menu)`
    max-height: 350px;
    overflow-y: auto;

    .dropdown-item {
        border: white 1px solid;

        &.active {
            color: white;
            background-color: ${websiteColor.mainColor};
        }

        &:active {
            color: white;
            background-color: ${websiteColor.mainColor};
        }
    }
`;

const StyledDropdownToggle = styled(Dropdown.Toggle)`
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

const FilterSwitch = styled(Form.Check)`
    .form-check-input:checked {
        background-color: ${websiteColor.mainColor};
        border-color: ${websiteColor.mainColor};
    }

    .form-check-input:focus {
        border-color: ${websiteColor.mainColor};
        box-shadow: 0 0 0 0.2rem ${websiteColor.boxShadowColor};
    }
`;

class FilterRow extends Component {
    state = {
        searchValue: '',
    };

    /**
     * 計算篩選器選項
     * @param e {InputEvent} 輸入事件
     */
    handleSearchChange = (e) => {
        this.setState({searchValue: e.target.value.toLowerCase()});
    };

    /**
     * 生成篩選器選項
     * @returns {string[]} 篩選器選項
     */
    generateFilteredOptions = () => {
        const {searchValue} = this.state;
        const {filterName, filterOptions} = this.props;

        // 檢查是否有設定顯示名稱
        const hasDisplayName = filterOptions[filterName].optionDisplayName && filterOptions[filterName].optionDisplayName.length > 0;

        // 根據是否有顯示名稱來過濾選項
        return filterOptions[filterName].options.filter((option, index) => {
            // 如果有顯示名稱，則先將顯示名稱轉換為小寫並與輸入值比較
            if (hasDisplayName) {
                const displayName = filterOptions[filterName].optionDisplayName[index].toLowerCase();

                return displayName.startsWith(searchValue.toLowerCase());
            }
            // 如果沒有顯示名稱，則直接比較選項值
            return option.toLowerCase().startsWith(searchValue.toLowerCase());
        });
    };


    /**
     * 處理篩選器模式變化
     * @param filterName {string} 篩選器名稱
     * @param mode {string} 篩選器模式
     */
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
     * 全選
     * @param filterName {string} 篩選器名稱
     */
    handleSelectAll = (filterName) => {
        // 創建一個新的選中狀態對象，將所有選項設為選中
        const selected = {
            active: this.props.advancedFilters[filterName]?.active ?? false,
            include: this.props.advancedFilters[filterName]?.include ?? true,
        };
        this.props.filterOptions[filterName].options.forEach(option => {
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
            [filterName]: {
                active: this.props.advancedFilters[filterName]?.active ?? false,
                include: this.props.advancedFilters[filterName]?.include ?? true,
            }
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

    /**
     * 處理篩選器啟用狀態變化
     * @param filterName {string} 篩選器名稱
     */
    handleFilterActivationChange = (filterName) => {
        // 創建 advancedFilters 的副本並更新相應的過濾器值，預設是關閉的
        const updatedAdvancedFilters = {
            ...this.props.advancedFilters,
            [filterName]: {
                ...this.props.advancedFilters[filterName],
                active: !(this.props.advancedFilters[filterName]?.active ?? false)
            }
        };

        // 更新父組件的狀態
        this.props.onAdvancedFilterChange(updatedAdvancedFilters);
    };

    render() {
        const {searchValue} = this.state;
        const {filterName, isDropdown, advancedFilters, filterNameToDisplayName} = this.props;

        const filteredOptions = this.generateFilteredOptions();

        const selected = advancedFilters[filterName] || {};
        const textInput = advancedFilters[filterName]?.value || '';
        const include = advancedFilters[filterName]?.include ?? true;

        return (
            <StyledFilterRow>
                <FilterLabel>{filterName}</FilterLabel>
                <FilterSelect>
                    <Form.Select
                        id={`advanced-filter-include-${filterName}`}
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
                                {!selected.active ? '未啟用' : '選擇了'} {Object.keys(selected).filter(key => key !== 'active' && key !== 'include' && selected[key]).length} 項
                            < /StyledDropdownToggle>
                            <StyledDropdownMenu>
                                <Dropdown.Item as="button"
                                               onClick={() => this.handleSelectAll(filterName)}>全選</Dropdown.Item>
                                <Dropdown.Item as="button"
                                               onClick={() => this.handleDeselectAll(filterName)}>取消全選</Dropdown.Item>
                                <Form.Control
                                    autoFocus
                                    id={`dropdown-search-${filterName}`}
                                    className="mx-3 ps-0 w-auto shadow-none border-0 border-bottom rounded-0"
                                    placeholder={`搜尋${filterName}...`}
                                    onChange={this.handleSearchChange}
                                    value={searchValue}
                                />
                                <Dropdown.Divider/>
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((option, index) => (
                                        <Dropdown.Item key={index} active={selected[option]}
                                                       onClick={() => this.handleOptionSelect(filterName, option)}>
                                            {filterNameToDisplayName(filterName, option) ?? option}
                                        </Dropdown.Item>
                                    ))) : (
                                    <Dropdown.Item disabled>沒有符合的項目</Dropdown.Item>
                                )}
                            </StyledDropdownMenu>
                        </Dropdown>
                    ) : (
                        <Form.Control
                            id={`advanced-filter-text-${filterName}`}
                            type="text"
                            placeholder={`搜尋${filterName}...`}
                            value={textInput || ''}
                            onChange={e => this.handleTextFilterChange(filterName, e.target.value)}
                        />
                    )}
                </FilterInput>
                {
                    isDropdown && (
                        <FilterSwitch
                            id={`advanced-filter-enable-${filterName}`}
                            type="switch"
                            onChange={() => this.handleFilterActivationChange(filterName)}
                            checked={advancedFilters[filterName]?.active ?? false}
                        />
                    )
                }
            </StyledFilterRow>
        );
    }
}

export default FilterRow;
