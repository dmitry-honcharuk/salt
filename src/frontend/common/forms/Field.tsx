import { color, space } from 'frontend/theme-selectors';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';

type Props = {
  id: string;
  name: string;
  label: React.ReactNode;
  placeholder?: string;
  optionalLabel?: React.ReactNode;
};

export const Field = forwardRef<HTMLInputElement, Props>(
  ({ id, name, label, placeholder, optionalLabel = `it's optional` }, ref) => {
    const [isFocused, setFocused] = useState(false);

    return (
      <>
        <LabelWrapper>
          <Label htmlFor={id} shifted={isFocused}>
            {label}
          </Label>
          <OptionalLabel>{optionalLabel}</OptionalLabel>
        </LabelWrapper>
        <Input
          type='text'
          id={id}
          name={name}
          ref={ref}
          autoComplete='off'
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </>
    );
  },
);

const LabelWrapper = styled.div`
  display: flex;
  margin-bottom: ${space()}px;
  align-items: flex-end;
  justify-content: space-between;
`;

const Label = styled.label<{ shifted: boolean }>`
  display: inline-block;
  letter-spacing: 1px;
  transform: translateX(${(p) => (p.shifted ? space(4) : 0)}px);
  transition: 100ms transform ease-in-out;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  padding: ${space(2)}px ${space(3)}px;
  font-size: 1.5rem;
  border: 2px dashed ${color('inputBorderIdle')};
  transition: 200ms border-color ease-in-out;

  &:focus {
    outline: none;
    border-color: ${color('inputBorderFocused')};
  }
`;

const OptionalLabel = styled.span`
  color: ${color('inputOptionalLabel')};
  letter-spacing: 1px;
`;
