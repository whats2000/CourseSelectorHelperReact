import React, {Component} from "react";
import {Container, Nav, Navbar, Offcanvas} from "react-bootstrap";
import {BookFill, Check2Square, JournalCheck, List, Megaphone, Search} from "react-bootstrap-icons";
import styled from 'styled-components';

import logo from '../image/logo.png';

// 自定義 Navbar 樣式
const StyledNavbar = styled(Navbar)`
    background-color: #009e96; // 設置背景顏色
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
        // Bootstrap 的中型螢幕斷點以下
        color: black !important; // 在 Offcanvas 中將鏈接顏色改為黑色
        &:hover, &:focus {
            color: black;
        }

        &.active {
            border-bottom: 2px solid black; // 在 Offcanvas 中選中時底部顯示黑色邊框
        }
    }

    display: flex;
    align-items: center; // 確保內容垂直居中

    .nav-icon {
        margin-right: 0.5rem; // 圖標與文字之間的間距
    }
`;

class Header extends Component {
    state = {
        showOffcanvas: false
    };

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
            title: '已選課程',
            icon: <Check2Square/>
        },
        {
            title: '公告',
            icon: <Megaphone/>
        },
    ];

    render() {
        const {currentTab} = this.props;

        return (
            <StyledNavbar expand="md">
                <Container fluid>
                    <Navbar.Brand href="#">
                        <img src={logo} height="30" className="d-inline-block align-top" alt="React Bootstrap logo"/>
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
                        <Offcanvas.Body>
                            <Nav className="justify-content-end flex-grow-1 pe-3" activeKey={currentTab}>
                                {this.navTabs.map((tab) => (
                                    <Nav.Item key={tab.title}>
                                        <StyledNavLink
                                            href={`#${tab.title.toLowerCase().replace(/\s+/g, '-')}`}
                                            onClick={() => this.handleNavClick(tab.title)}
                                            className={tab.title === currentTab ? 'active' : ''}
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
