import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

export function SortableItem(props) {
    const {
        index,
        content,
        enableDrag,
    } = props;
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: props.id,
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

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {index + 1} {content}
        </div>
    );
}
