import { forwardRef } from 'react';

const CustomVideo = forwardRef(
  ({ autoPlay = false, loop = false, muted = true, preload, src, className }: any, ref: any) => {
    return (
      <video
        ref={ref}
        preload={preload || 'none'}
        autoPlay={autoPlay}
        playsInline={true}
        loop={loop}
        muted={muted}
        src={src}
        className={className}
      />
    );
  }
);
CustomVideo.displayName = 'CustomVideo';
export default CustomVideo;
