import React, { PropsWithChildren } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { List } from './List';

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);

  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
};

interface Props<Item extends { id: string }> {
  items: Item[];
  renderItem: (item: Item) => React.ReactNode;
  onDragEnd: (items: Item[]) => void;
}

export function DraggableList<T extends { id: string }>({
  items,
  renderItem,
  onDragEnd: handleDragEnd,
}: PropsWithChildren<Props<T>>): React.ReactElement {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const reordered = reorder(
      items,
      result.source.index,
      result.destination.index,
    );

    handleDragEnd(reordered);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='list'>
        {(provided) => (
          <ul ref={provided.innerRef} {...provided.droppableProps}>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <List items={items} renderItem={renderItem} />
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}
