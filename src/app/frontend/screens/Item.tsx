import { CheckBox as CheckBoxIcon } from '@styled-icons/material/CheckBox';
import { CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '@styled-icons/material/CheckBoxOutlineBlank';
import { DragIndicator as DragIndicatorIcon } from '@styled-icons/material/DragIndicator';
import { Save } from '@styled-icons/material/Save';
import { BaseInput } from 'app/frontend/common/BaseInput';
import {
  getColor,
  getLighterColor,
  getSpacePx,
  getSpaceSet,
} from 'app/frontend/theme-selectors';
import { FunctionComponent, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ImageGallery } from '../common/ImageGallery';
import { Modal } from '../common/Modal';

type Props = {
  content: string;
  done?: boolean;
  images?: string[];
  onToggle: () => void;
  onItemChange: (content: string) => void;
  onRemove: () => void;
  pending?: boolean;
  draggable?: boolean;
};
export const Item: FunctionComponent<Props> = ({
  content,
  done = false,
  images = [],
  onToggle,
  onItemChange,
  onRemove,
  pending = false,
  draggable = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const prevContent = useRef(content);

  const icon = pending ? Save : done ? CheckBoxIcon : CheckBoxOutlineBlankIcon;

  return (
    <>
      <Root style={{ paddingRight: '10px' }}>
        <Field>
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
        </Field>
        {!!images?.length && (
          <Images>
            {images.map((url) => (
              <Img src={url} key={url} onClick={() => setIsModalOpen(true)} />
            ))}
          </Images>
        )}
      </Root>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ImageGallery images={images.map((src) => ({ src }))} />
      </Modal>
    </>
  );
};

const Root = styled.div`
  padding: ${getSpacePx(1, 2)};
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
`;

const Images = styled.div`
  display: flex;
  gap: ${getSpacePx(2)};
  overflow-x: auto;
  padding-bottom: ${getSpacePx(2)};
`;

const Img = styled.div<{ src: string }>`
  --size: 55px;
  height: var(--size);
  min-width: var(--size);
  background-image: url(${({ src }) => src});
  background-size: cover;
  border-radius: ${({ theme }) => theme.radius};

  :last-child {
    margin-right: 10px;
  }
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
  padding: ${getSpacePx(2)};

  color: ${({ done, theme }) =>
    done ? getLighterColor('text', 2)({ theme }) : getColor('text')({ theme })};
`;
