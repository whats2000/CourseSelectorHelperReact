import {Component} from "react";
import Header from "./components/Header";
import ScheduleTable from "./components/ScheduleTable";
import SelectorSetting from "./components/SelectorSetting";
import styled from 'styled-components';
import EntryNotification from "./components/EntryNotification";
import Papa from "papaparse";
import {courseData} from "./config";

const MainContent = styled.main`
    margin-top: 68px;
`;

const SlideContainer = styled.div`
    transition: margin 0.5s;
`;

const ToggleButton = styled.button`
    position: fixed;
    z-index: 100;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.5;
    border-radius: 0 0.375rem 0.375rem 0;

    &:hover {
        opacity: 1;
    }
`;

class App extends Component {
    state = {
        isCollapsed: false,
        currentTab: '公告',
        courses: [],
    };

    /**
     * 取得最新課程資料
     */
    componentDidMount() {
        fetch(courseData.latestSource)
            .then(response => response.text())
            .then(csvText => {
                const results = Papa.parse(csvText, {header: true, skipEmptyLines: true});
                this.setState({courses: results.data});
            })
            .catch(error => console.error('Error fetching and parsing data:', error));
    }

    /**
     * 切換課表顯示狀態
     */
    toggleSchedule = () => {
        this.setState({isCollapsed: !this.state.isCollapsed});
    };

    /**
     * 切換設定頁面
     */
    handleTabChange = tab => {
        this.setState({currentTab: tab});
    }

    /**
     * 渲染元件
     * @returns {React.ReactNode}
     */
    render() {
        const {isCollapsed} = this.state;
        const slideStyle = {
            marginLeft: isCollapsed ? (window.innerWidth >= 992 ? '-50%' : '0') : '0',
            marginTop: isCollapsed ? (window.innerWidth < 992 ? '-600%' : '0') : '0'
        };

        return (
            <>
                <Header currentTab={this.state.currentTab} onTabChange={this.handleTabChange}/>
                <EntryNotification/>

                <ToggleButton className="btn btn-secondary w-auto" onClick={this.toggleSchedule}>
                    {isCollapsed ? '>' : '<'}
                </ToggleButton>

                <MainContent id="app" className="container-fluid">
                    <div className="row d-flex flex-wrap">
                        <SlideContainer style={slideStyle} className="col-lg-6 d-flex flex-column">
                            <ScheduleTable/>
                        </SlideContainer>

                        <div className="col-lg d-flex flex-column">
                            <SelectorSetting currentTab={this.state.currentTab}
                                             courses={this.state.courses}
                            />
                        </div>
                    </div>
                </MainContent>
            </>
        );
    }
}

export default App;
