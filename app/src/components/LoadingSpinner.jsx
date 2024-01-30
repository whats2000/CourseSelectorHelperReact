import {Component} from 'react';
import {Spinner} from 'react-bootstrap';
import styled from 'styled-components';

const LoadingContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 9999;

    .spinner {
        margin-bottom: 20px;
    }

    .loading-text {
        font-size: 20px;
        color: #333;
    }
`;

class LoadingSpinner extends Component {
    render() {
        const {loadingName} = this.props;

        return (
            <LoadingContainer>
                <Spinner animation="border" variant="secondary" className="spinner"/>
                <span className="loading-text">正在加載{loadingName}...</span>
            </LoadingContainer>
        );
    }
}

export default LoadingSpinner;
