import { JSX, Ref } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

interface Props {
  stream: MediaStream | null;
}

const Video = (props: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.stream;
    }
  }, [videoRef.current, props.stream]);

  return (
    <div>
      <video
        ref={videoRef}
        class="rounded-lg"
        autoPlay
        width="100%"
        // height="100%"
      />
    </div>
  );
};

export default Video;
