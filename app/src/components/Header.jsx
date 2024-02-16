import React, {Component} from "react";
import {Container, Nav, Navbar, NavDropdown, Offcanvas} from "react-bootstrap";
import {BookFill, Check2Square, ClockHistory, JournalCheck, List, Megaphone, Search} from "react-bootstrap-icons";
import styled from 'styled-components';
import {websiteColor} from "../config";

import Banner from './banner.svg';

// 自定義 Navbar 樣式
const StyledNavbar = styled(Navbar)`
    background-color: ${websiteColor.mainColor};
    transition: top 0.3s; // 添加過渡效果
`;

const StyledNavLink = styled(Nav.Link)`
    color: white !important; // 預設為白色鏈接顏色

    &:hover, &:focus {
        color: white;
        background-color: transparent;
    }

    &.active {
        border-bottom: 2px solid white; // 當選中時，底部顯示白色邊框
    }

    @media (max-width: 767px) {
        border: 0;
        // Bootstrap 的中型螢幕斷點以下
        color: black !important; // 在 Offcanvas 中將鏈接顏色改為黑色
        &:hover, &:focus {
            color: black;
            background-color: lightgray;
        }

        &.active {
            background-color: lightgray;
        }
    }

    display: flex;
    align-items: center; // 確保內容垂直居中
`;

const StyledNavDropdown = styled(NavDropdown)`
    color: white !important;
    width: 100%;

    .dropdown-toggle {
        display: flex;
        align-items: center;
        color: white !important;

        @media (max-width: 767px) {
            color: black !important;
        }
    }

    .dropdown-menu {
        .dropdown-item {
            &:hover {
                color: white;
                background-color: ${websiteColor.mainDarkerColor};
            }
        }
    }

    .nav-link {
        padding-right: 0 !important;
        padding-left: 0 !important;
    }
`;

class Header extends Component {
    state = {
        showOffcanvas: false,
        lastScrollY: 0,
        showNavbar: true,
    };

    navTabs = [
        {
            title: '所有課程',
            icon: <BookFill/>
        },
        {
            title: '學期必修',
            icon: <JournalCheck/>
        },
        {
            title: '課程偵探',
            icon: <Search/>
        },
        {
            title: '已選匯出',
            icon: <Check2Square/>
        },
        {
            title: '公告',
            icon: <Megaphone/>
        },
    ];

    /**
     * 切換 Offcanvas 顯示狀態
     */
    handleToggleOffcanvas = () => {
        this.setState({showOffcanvas: !this.state.showOffcanvas});
    };

    /**
     * 點擊 Offcanvas 中的鏈接時，關閉 Offcanvas
     * @param tab 鏈接標題
     */
    handleNavClick = (tab) => {
        this.props.onTabChange(tab);

        if (this.state.showOffcanvas) {
            this.setState({showOffcanvas: false});
        }
    };

    /**
     * 註冊 scroll 事件
     */
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    /**
     * 移除 scroll 事件
     */
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    /**
     * 註冊 scroll 事件
     */
    handleScroll = () => {
        const {lastScrollY} = this.state;
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // 向下滾動
            this.setState({showNavbar: false});
        } else {
            // 向上滾動
            this.setState({showNavbar: true});
        }

        this.setState({lastScrollY: currentScrollY});
    };

    render() {
        const {
            currentTab,
            currentCourseHistoryData,
            availableCourseHistoryData,
            switchVersion,
            convertVersion,
        } = this.props;
        const currentVersionDisplay = convertVersion(currentCourseHistoryData);

        return (
            <StyledNavbar expand="md" style={{top: this.state.showNavbar ? '0' : '-100%'}} fixed="top" variant="dark">
                <Container fluid>
                    <Navbar.Brand className="p-0" href="#">
                        <img src={Banner} height="40" className="d-inline-block align-top" alt="中山大學選課助手v5.0.0"/>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={this.handleToggleOffcanvas}>
                        <List size={24} color="white"/>
                    </Navbar.Toggle>
                    <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="start"
                        show={this.state.showOffcanvas}
                        onHide={this.handleToggleOffcanvas}
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="offcanvasNavbarLabel">切換設定區</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className="p-0">
                            <Nav className="justify-content-start flex-grow-1" activeKey={currentTab}>
                                <Nav.Item className="d-flex align-items-center">
                                    <StyledNavDropdown
                                        title={(<><ClockHistory/><span
                                            className="ms-2">{currentVersionDisplay}</span></>) || '找尋資料中...'}
                                        id="nav-dropdown-course-history"
                                        className="px-3 float-start"
                                    >
                                        {availableCourseHistoryData.map((data, index) => (
                                            <NavDropdown.Item key={index} onClick={() => switchVersion(data)}>
                                                {convertVersion(data.name)}
                                            </NavDropdown.Item>
                                        ))}
                                    </StyledNavDropdown>
                                </Nav.Item>
                            </Nav>
                            <Nav className="justify-content-end flex-grow-1" activeKey={currentTab}>
                                {this.navTabs.map((tab) => (
                                    <Nav.Item key={tab.title}>
                                        <StyledNavLink
                                            href={`#${tab.title.toLowerCase().replace(/\s+/g, '-')}`}
                                            onClick={() => this.handleNavClick(tab.title)}
                                            className={tab.title === currentTab ? 'px-3 active' : 'px-3'}
                                        >
                                            {tab.icon}
                                            <span className="ms-2">{tab.title}</span>
                                        </StyledNavLink>
                                    </Nav.Item>
                                ))}
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </StyledNavbar>
        );
    }
}

export default Header;
