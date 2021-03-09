import { CheckBox as CheckBoxIcon } from '@styled-icons/material/CheckBox';
import { CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '@styled-icons/material/CheckBoxOutlineBlank';
import Color from 'color';
import { color, spaceSet } from 'frontend/theme-selectors';
import debounce from 'lodash/debounce';
import { ChangeEvent, FunctionComponent, useEffect, useRef } from 'react';
import styled from 'styled-components';

type Props = {
  id: string;
  content: string;
  done: boolean;
  onToggle: () => void;
  onItemChange: (content: string) => void;
  focused?: boolean;
};
export const Item: FunctionComponent<Props> = ({
  content,
  done,
  onToggle,
  onItemChange,
  focused,
}) => {
  const { current: handleChange } = useRef(
    debounce((event: ChangeEvent<HTMLInputElement>) => {
      onItemChange(event.target.value);
    }, 300),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused]);

  return (
    <Root done={done}>
      <Icon
        as={done ? CheckBoxIcon : CheckBoxOutlineBlankIcon}
        onClick={onToggle}
        done={done}
      />

      <Input defaultValue={content} onChange={handleChange} ref={inputRef} />
    </Root>
  );
};

const Root = styled.div<{ done?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${spaceSet(2, 1)};
  font-size: 20px;
  color: ${({ done, theme }) =>
    done
      ? Color(color('text')({ theme })).lighten(2).string()
      : color('text')({ theme })};
`;

const Icon = styled.svg<{ done?: boolean }>`
  height: ${spaceSet(6)};
  margin-right: ${spaceSet(2)};
  color: ${({ done, theme }) =>
    done
      ? Color(color('main')({ theme })).lighten(0.1).string()
      : color('main')({ theme })};
`;

const Input = styled.input`
  border: none;
  font-size: 20px;

  :focus {
    outline: none;
  }
`;
