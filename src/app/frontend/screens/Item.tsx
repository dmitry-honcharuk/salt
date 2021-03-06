import { CheckBox as CheckBoxIcon } from '@styled-icons/material/CheckBox';
import { CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '@styled-icons/material/CheckBoxOutlineBlank';
import { DragIndicator as DragIndicatorIcon } from '@styled-icons/material/DragIndicator';
import { Save } from '@styled-icons/material/Save';
import { BaseInput } from 'app/frontend/common/BaseInput';
import {
  getColor,
  getLighterColor,
  getSpaceSet,
} from 'app/frontend/theme-selectors';
import { FunctionComponent, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

type Props = {
  content: string;
  done?: boolean;
  onToggle: () => void;
  onItemChange: (content: string) => void;
  onRemove: () => void;
  pending?: boolean;
  draggable?: boolean;
};
export const Item: FunctionComponent<Props> = ({
  content,
  done = false,
  onToggle,
  onItemChange,
  onRemove,
  pending = false,
  draggable = false,
}) => {
  const prevContent = useRef(content);

  const icon = pending ? Save : done ? CheckBoxIcon : CheckBoxOutlineBlankIcon;

  return (
    <Root>
      <Icon as={icon} onClick={onToggle} done={done} pending={pending} />
      <Input
        done={done}
        value={content}
        disabled={pending}
        onKeyUp={({ key }) => {
          if (
            key === 'Backspace' &&
            content === '' &&
            prevContent.current === ''
          ) {
            onRemove();
          }

          prevContent.current = content;
        }}
        onChange={(event) => {
          onItemChange(event.target.value);
        }}
      />
      {draggable && <IconBase as={DragIndicatorIcon} />}
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  align-items: center;
  padding: ${getSpaceSet(2, 1)};
  font-size: 20px;
`;

const blink = (color: string) => keyframes`
 0% {
    fill: ${color};
  }

  100% {
    fill: transparent;
  }
`;

export const IconBase = styled.svg`
  height: ${getSpaceSet(6)};
  fill: ${getColor('main')};
`;

const Icon = styled(IconBase)<{ done: boolean; pending: boolean }>`
  animation: ${({ theme }) => blink(getColor('main')({ theme }))} 800ms linear
    alternate;

  animation-iteration-count: ${({ pending }) => (pending ? 'infinite' : 0)};
`;

export const Input = styled(BaseInput)<{ done?: boolean }>`
  flex-grow: 1;
  font-size: 1.2rem;

  color: ${({ done, theme }) =>
    done ? getLighterColor('text', 2)({ theme }) : getColor('text')({ theme })};
`;
