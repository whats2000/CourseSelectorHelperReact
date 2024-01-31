import React, {useState} from 'react';
import {DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {Card} from "react-bootstrap";
import {SortableItem} from "./ListInformation/SortableItem";
import {courseDetectiveElements} from "../../../config";

function ListInformation() {
    const [elements, setElements] = useState(courseDetectiveElements);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event) {
        const {active, over} = event;

        if (active.id !== over.id) {
            setElements((elements) => {
                const oldIndex = elements.findIndex(e => e.id === active.id);
                const newIndex = elements.findIndex(e => e.id === over.id);

                return arrayMove(elements, oldIndex, newIndex);
            });
        }
    }

    return (
        <Card.Body>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                    items={elements}
                    strategy={verticalListSortingStrategy}>
                    {elements.map((element, index) => (
                        <SortableItem index={index} key={element.id} id={element.id} content={element.content}/>
                    ))}
                </SortableContext>
            </DndContext>
        </Card.Body>
    );
}

export default ListInformation;
