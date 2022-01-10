import { FC } from 'react';
import ReactImageGallery from 'react-image-gallery';

type Props = {
  images: { src: string }[];
};

export const ImageGallery: FC<Props> = ({ images }) => {
  return (
    <ReactImageGallery
      showNav={false}
      showThumbnails={false}
      showFullscreenButton={false}
      showPlayButton={false}
      items={images.map(({ src }) => ({ original: src }))}
    />
  );
};
