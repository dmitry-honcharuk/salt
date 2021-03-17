import { CheckBox as CheckBoxIcon } from '@styled-icons/material/CheckBox';
import { CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '@styled-icons/material/CheckBoxOutlineBlank';
import { Save } from '@styled-icons/material/Save';
import { BaseInput } from 'frontend/common/BaseInput';
import { color, lighterColor, spaceSet } from 'frontend/theme-selectors';
import { FunctionComponent, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

type Props = {
  content: string;
  done: boolean;
  onToggle: () => void;
  onItemChange: (content: string) => void;
  focused?: boolean;
  pending?: boolean;
};
export const Item: FunctionComponent<Props> = ({
  content,
  done,
  onToggle,
  onItemChange,
  focused = false,
  pending = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused]);

  const icon = pending ? Save : done ? CheckBoxIcon : CheckBoxOutlineBlankIcon;

  return (
    <Root>
      <Icon as={icon} onClick={onToggle} done={done} pending={pending} />
      <Input
        done={done}
        value={content}
        disabled={pending}
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
  padding: ${spaceSet(2, 1)};
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
  height: ${spaceSet(6)};
  margin-right: ${spaceSet(2)};
  color: ${color('main')};
`;

const Icon = styled(IconBase)<{ done: boolean; pending: boolean }>`
  height: ${spaceSet(6)};
  margin-right: ${spaceSet(2)};
  fill: ${color('main')};

  animation: ${({ theme }) => blink(color('main')({ theme }))} 800ms linear
    alternate;

  animation-iteration-count: ${({ pending }) => (pending ? 'infinite' : 0)};
`;

export const Input = styled(BaseInput)<{ done?: boolean }>`
  flex-grow: 1;

  color: ${({ done, theme }) =>
    done ? lighterColor('text', 2)({ theme }) : color('text')({ theme })};
`;
