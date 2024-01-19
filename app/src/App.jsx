import React, { Component } from "react";
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
`;

class App extends Component {
    state = {
        isCollapsed: false,
    };

    toggleSchedule = () => {
        this.setState({ isCollapsed: !this.state.isCollapsed });
    };

    render() {
        const { isCollapsed } = this.state;
        const slideStyle = {
            marginLeft: isCollapsed ? (window.innerWidth >= 768 ? '-50%' : '0') : '0',
            marginTop: isCollapsed ? (window.innerWidth < 768 ? '-200%' : '0') : '0'
        };

        return (
            <div id="app" className="container-fluid h-100">
                <div className="row h-100">
                    <SlideContainer style={slideStyle} className="col-md-6 h-100">
                        <ScheduleTable/>
                    </SlideContainer>

                    <ToggleButton className="btn btn-secondary w-auto" onClick={this.toggleSchedule}>
                        {isCollapsed ? '>' : '<'}
                    </ToggleButton>

                    <div className="col-md-6 h-100">
                        <SelectorSetting/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
