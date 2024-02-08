import React, {useState} from 'react';
import {DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {Button, Card, InputGroup, Offcanvas} from "react-bootstrap";
import {SortNumericUp} from "react-bootstrap-icons";
import styled from "styled-components";
import {SortableItem} from "./ListInformation/SortableItem";
import {websiteColor} from "../../../config";

const StyledButton = styled(Button)`
    background-color: ${websiteColor.mainColor};
    border-color: ${websiteColor.mainColor};
    display: flex;
    align-items: center;

    &:hover {
        background-color: ${websiteColor.mainDarkerColor};
        border-color: ${websiteColor.mainDarkerColor};
    }
`;

const ButtonsRow = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
`;

const StyledTextRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
`;

function ListInformation({elements, setElements, calculateTotalCreditsAndHours, selectedCourses, toggleElementEnable}) {
    const [show, setShow] = useState(false);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleCloseOrderElement = () => setShow(false);
    const handleToggleOrderElement = () => setShow(!show);

    const handleDragEnd = (event) => {
        const {active, over} = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = elements.findIndex(e => e.id === active.id);
        const newIndex = elements.findIndex(e => e.id === over.id);
        const newElements = arrayMove(elements, oldIndex, newIndex);

        setElements(newElements);
    };

    const {totalCredits, totalHours} = calculateTotalCreditsAndHours(selectedCourses);

    return (
        <Card.Body>
            <ButtonsRow className="mb-2">
                <InputGroup className="w-auto">
                    <InputGroup.Text>{totalCredits} 學分</InputGroup.Text>
                    <InputGroup.Text>{totalHours} 小時</InputGroup.Text>
                </InputGroup>
                <StyledButton className="ms-auto" variant="success" onClick={handleToggleOrderElement}>
                    <SortNumericUp/><span className="ms-3">排序</span>
                </StyledButton>
            </ButtonsRow>

            <Offcanvas
                show={show}
                onHide={handleCloseOrderElement}
                scroll={true}
                backdrop={false}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="fw-bolder">排序優先序位</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <StyledTextRow className="text-muted fst-italic">
                        拖動來交換自己喜好的排序，歡迎填問卷告訴我們您的需求，使我們能夠更好的改進這個功能。
                    </StyledTextRow>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}>
                        <SortableContext
                            items={elements}
                            strategy={verticalListSortingStrategy}>
                            {elements.map((element, index) => (
                                <SortableItem
                                    index={index}
                                    key={element.id}
                                    id={element.id}
                                    content={element.content}
                                    enableDrag={element.enabled}
                                    toggleEnable={toggleElementEnable}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </Offcanvas.Body>
            </Offcanvas>
        </Card.Body>
    );
}

export default ListInformation;
