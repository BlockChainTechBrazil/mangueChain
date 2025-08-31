import React from 'react';

const VideoBackground: React.FC = () => {
  return (
    <div className="relative w-full h-[350px] sm:h-[500px] md:h-[700px] lg:h-[900px] xl:h-[1200px] overflow-hidden z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover object-center"
        style={{ maxHeight: '120vw' }}
      >
        <source src="/MangueRecife.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBackground;