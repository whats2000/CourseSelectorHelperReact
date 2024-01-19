import React, {Component} from "react";
import Header from "./components/Header";
import ScheduleTable from "./components/ScheduleTable";
import SelectorSetting from "./components/SelectorSetting";
import styled from 'styled-components';

const SlideContainer = styled.div`
    transition: margin 0.5s;
    height: 100%;
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
        currentTab: '公告'
    };

    /**
     * 切換課表顯示狀態
     */
    toggleSchedule = () => {
        this.setState({isCollapsed: !this.state.isCollapsed});
    };

    /**
     * 調整視窗大小時，若視窗寬度大於 768px 則自動展開課表
     */
    handleResize = () => {
        if (window.innerWidth >= 768) {
            this.setState({isCollapsed: false});
        }
    };

    /**
     * 註冊 resize 事件
     */
    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    /**
     * 移除 resize 事件
     */
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

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
            marginLeft: isCollapsed ? (window.innerWidth >= 768 ? '-50%' : '0') : '0',
            marginTop: isCollapsed ? (window.innerWidth < 768 ? '-600%' : '0') : '0'
        };

        return (
            <>
                <Header currentTab={this.state.currentTab} onTabChange={this.handleTabChange}/>
                <div id="app" className="container-fluid h-100">
                    <div className="row h-100">
                        <SlideContainer style={slideStyle} className="col-md-6 h-100">
                            <ScheduleTable/>
                        </SlideContainer>

                        <ToggleButton className="btn btn-secondary w-auto" onClick={this.toggleSchedule}>
                            {isCollapsed ? '>' : '<'}
                        </ToggleButton>

                        <div className="col-md-6 h-100">
                            <SelectorSetting currentTab={this.state.currentTab}/>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default App;
