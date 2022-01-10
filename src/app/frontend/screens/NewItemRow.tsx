import { Cancel } from '@styled-icons/material/Cancel';
import { PhotoLibrary } from '@styled-icons/material/PhotoLibrary';
import { Send } from '@styled-icons/material/Send';
import { BaseInput } from 'app/frontend/common/BaseInput';
import { getColor, getRadius, getSpacePx } from 'app/frontend/theme-selectors';
import { ItemEntity } from 'core/entities/Item';
import produce from 'immer';
import { ChangeEvent, FunctionComponent, useRef, useState } from 'react';
import styled from 'styled-components';
import { ButtonBase } from '../common/ButtonBase';
import { ImageGallery } from '../common/ImageGallery';
import { Modal } from '../common/Modal';

type Props = {
  className?: string;
  onCreate: (
    params: Partial<Omit<ItemEntity, 'id'>>,
    files?: File[]
  ) => Promise<void>;
};

export const NewItemRow: FunctionComponent<Props> = ({
  onCreate,
  className,
}) => {
  const [state, setState] = useState<Omit<ItemEntity, 'id' | 'createdAt'>>({
    content: '',
    done: false,
  });
  const filesRef = useRef<Map<string, File>>(new Map());
  const [images, setImages] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reset = () =>
    setState({
      content: '',
      done: false,
    });

  const create = async () => {
    if (!state.content) {
      return;
    }

    const item = { ...state };

    reset();

    await onCreate(item, [...filesRef.current.values()]);

    Object.values(images).forEach((src) => URL.revokeObjectURL(src));
    filesRef.current.clear();

    setImages({});
  };

  const handleFiles = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files?.length) {
      return;
    }

    const imageUrls: Record<string, string> = {};

    for (const file of target.files) {
      const canvas = document.createElement('canvas');
      const img = new Image();
      filesRef.current.set(file.name, file);
      const url = URL.createObjectURL(file);
      imageUrls[file.name] = url;
      img.src = url;

      img.addEventListener('load', () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) {
            console.log('Failed to convert file to png');
            return;
          }

          filesRef.current.set(
            file.name,
            new File([blob], file.name, {
              lastModified: file.lastModified,
              type: 'image/jpg',
            })
          );
        }, 'image/jpg');
      });
    }

    setImages((images) => ({
      ...images,
      ...imageUrls,
    }));
  };

  const imageEntries = Object.entries(images);

  return (
    <>
      <Root className={className}>
        <Input
          placeholder="New item"
          value={state.content}
          onChange={({ target }) => {
            setState((s) => ({ ...s, content: target.value }));
          }}
          onKeyPress={async ({ code }) => {
            if (code === 'Enter') {
              await create();
            }
          }}
        />
        {!!imageEntries.length && (
          <Images>
            {imageEntries.map(([name, src]) => (
              <Img src={src} key={name} onClick={() => setIsModalOpen(true)}>
                <CloseButton
                  onClick={() => {
                    URL.revokeObjectURL(src);

                    filesRef.current.delete(name);

                    setImages(
                      produce((images) => {
                        delete images[name];
                      })
                    );
                  }}
                >
                  <CloseIcon />
                </CloseButton>
              </Img>
            ))}
          </Images>
        )}

        <Actions>
          <FileLabel>
            <PhotoIcon />
            <FileInput type="file" onChange={handleFiles} multiple />
          </FileLabel>
          <SendButton onClick={create}>
            <SendIcon />
          </SendButton>
        </Actions>
      </Root>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ImageGallery images={imageEntries.map(([, src]) => ({ src }))} />
      </Modal>
    </>
  );
};

const Root = styled.div`
  border: 2px dashed ${getColor('main')};
  padding-bottom: ${getSpacePx(1)};
  border-radius: ${getRadius()};
`;

const Input = styled(BaseInput)`
  width: 100%;
`;

const FileLabel = styled.label`
  padding: ${getSpacePx(1)};
`;

const FileInput = styled.input`
  display: none;
`;

const Actions = styled.div`
  margin-top: ${getSpacePx(2)};
  padding: ${getSpacePx(0, 2)};
  display: flex;
  justify-content: space-between;
`;

const Images = styled.div`
  padding: ${getSpacePx(2)};
  display: flex;
  gap: ${getSpacePx(2)};
  flex-wrap: nowrap;
  overflow-x: auto;
`;

const Img = styled.div<{ src: string }>`
  --size: 75px;
  height: var(--size);
  width: var(--size);
  background-image: url(${({ src }) => src});
  background-size: cover;
  position: relative;
  border-radius: ${({ theme }) => theme.radius};
  min-width: var(--size);
`;

const CloseButton = styled(ButtonBase)`
  position: absolute;
  top: -10px;
  right: -10px;
  cursor: pointer;
`;

const CloseIcon = styled(Cancel)`
  fill: ${getColor('grey')};
  height: 24px;
  background-color: white;
  border-radius: 50%;
`;

const PhotoIcon = styled(PhotoLibrary)`
  fill: ${getColor('grey')};
  height: 24px;
`;

const SendIcon = styled(Send)`
  fill: ${getColor('grey')};
  height: 24px;
`;

const SendButton = styled(ButtonBase)`
  padding: ${getSpacePx(1)};
`;
