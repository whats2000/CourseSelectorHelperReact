import {Component} from "react";
import {Container} from "react-bootstrap";

class SelectorSetting extends Component {
    render() {
        return (
            <Container>
                <h1>{this.props.currentTab}</h1>
            </Container>
        )
    }
}

export default SelectorSetting;
