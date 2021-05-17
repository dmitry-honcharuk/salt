import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

interface Props<Item extends { id: string }> {
  items: Item[];
  renderItem: (item: Item) => React.ReactNode;
}
export const List = React.memo<Props<{ id: string }>>(
  ({ items, renderItem }) => {
    return (
      <>
        {items.map((item, index: number) => (
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided) => (
              <li
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                {renderItem(item)}
              </li>
            )}
          </Draggable>
        ))}
      </>
    );
  },
);
