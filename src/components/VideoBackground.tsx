import React from 'react';

const VideoBackground: React.FC = () => {
  return (
    <div className="relative w-full sm:h-[500px] md:h-[700px] lg:h-[900px] xl:h-[1000px] overflow-hidden z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover object-center"
        style={{ maxHeight: '120vw' }}
      >
        <source src={`${import.meta.env.BASE_URL}MangueRecife.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBackground;