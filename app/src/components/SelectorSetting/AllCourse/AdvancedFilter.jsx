import {Component} from "react";
import {Button, Offcanvas} from "react-bootstrap";
import {Filter} from "react-bootstrap-icons";
import styled from "styled-components";

const StyledButton = styled(Button)`
    background-color: #009e96;

    &:hover {
        background-color: #008e86;
    }

    &:active {
        background-color: #009e96;
    }
`;

const StyledOffcanvas = styled(Offcanvas)`

`;

class AdvancedFilter extends Component {
    state = {
        show: false,
    };

    handleClose = () => this.setState({show: false});
    handleShow = () => this.setState({show: !this.state.show});

    render() {
        return (
            <>
                <StyledButton variant="success" onClick={this.handleShow}>
                    <Filter/>
                </StyledButton>

                <StyledOffcanvas
                    show={this.state.show}
                    onHide={this.handleClose}
                    scroll={true}
                    backdrop={false}
                    placement={'bottom'}
                    className="bg-light bg-opacity-75"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>進階篩選</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                    </Offcanvas.Body>
                </StyledOffcanvas>
            </>
        );
    }
}

export default AdvancedFilter;
