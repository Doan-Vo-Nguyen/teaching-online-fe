/* eslint-disable react/prop-types */
// components/VideoPlayer.jsx
import thumbnail from "@/assets/images/thumbnail.jpg";

import { Tabs } from "@/components/ui/tabs";
import LectureInfo from "./LectureInfo";

const VideoPlayer = ({ selectedVideo, lectureDetail }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative pt-[56.25%] bg-black">
        <video
          className="absolute inset-0 w-full h-full"
          src={selectedVideo.content}
          controls
          poster={thumbnail}
          playsInline={true}
        ></video>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <LectureInfo lectureDetail={lectureDetail} />
      </Tabs>
    </div>
  );
};

export default VideoPlayer;
