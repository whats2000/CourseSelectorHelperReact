import React from 'react';
import {Form} from "react-bootstrap";
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import styled from "styled-components";
import {websiteColor} from "../../../../config";

const StyledFormCheckWrapper = styled.div`
    .form-check-input:checked {
        background-color: ${websiteColor.mainColor};
        border-color: ${websiteColor.mainColor};
    }

    .form-check-input:focus {
        box-shadow: 0 0 0 0.25rem ${websiteColor.boxShadowColor};
    }

    .form-check-input:disabled ~ .form-check-label {
        color: ${websiteColor.mainLighterColor};
    }

    .form-check-input:checked ~ .form-check-label::before {
        background-color: ${websiteColor.mainColor};
    }

    .form-switch .form-check-input:checked ~ .form-check-label::before {
        border-color: ${websiteColor.mainColor};
    }

    .form-check-label::before {
        border-color: ${websiteColor.mainColor};
    }
`;

export function SortableItem({id, index, content, enableDrag, toggleEnable}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: id,
        disabled: !enableDrag,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '10px',
        margin: '5px 0',
        backgroundColor: enableDrag ? 'white' : 'lightgray',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        touchAction: 'none',
    };

    const handleToggle = (event) => {
        event.stopPropagation();
        toggleEnable(id);
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <span>{index + 1} {content}</span>
            <StyledFormCheckWrapper>
                <Form.Check
                    type="switch"
                    id={`order-element-${id}`}
                    checked={enableDrag}
                    onChange={handleToggle}
                />
            </StyledFormCheckWrapper>
        </div>
    );
}
