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
import { FunctionComponent, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

type Props = {
  content: string;
  done: boolean;
  onToggle: () => void;
  onItemChange: (content: string) => void;
  onRemove: () => void;
  focused?: boolean;
  pending?: boolean;
  moving?: boolean;
};
export const Item: FunctionComponent<Props> = ({
  content,
  done,
  onToggle,
  onItemChange,
  onRemove,
  focused = false,
  pending = false,
  moving = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused]);

  const icon = moving
    ? DragIndicatorIcon
    : pending
    ? Save
    : done
    ? CheckBoxIcon
    : CheckBoxOutlineBlankIcon;
  const lastContentRef = useRef<string | null>(null);

  return (
    <Root>
      <Icon
        as={icon}
        onClick={moving ? undefined : onToggle}
        done={done}
        pending={pending}
      />
      <Input
        done={done}
        value={content}
        disabled={pending || moving}
        onKeyDown={() => {
          lastContentRef.current = content;
        }}
        onKeyUp={({ key }) => {
          if (
            key === 'Backspace' &&
            content === lastContentRef.current &&
            content === ''
          ) {
            onRemove();
          }
        }}
        onChange={(event) => {
          onItemChange(event.target.value);
        }}
        ref={inputRef}
      />
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
  margin-right: ${getSpaceSet(2)};
  color: ${getColor('main')};
`;

const Icon = styled(IconBase)<{ done: boolean; pending: boolean }>`
  height: ${getSpaceSet(6)};
  margin-right: ${getSpaceSet(2)};
  fill: ${getColor('main')};

  animation: ${({ theme }) => blink(getColor('main')({ theme }))} 800ms linear
    alternate;

  animation-iteration-count: ${({ pending }) => (pending ? 'infinite' : 0)};
`;

export const Input = styled(BaseInput)<{ done?: boolean }>`
  flex-grow: 1;

  color: ${({ done, theme }) =>
    done ? getLighterColor('text', 2)({ theme }) : getColor('text')({ theme })};
`;
