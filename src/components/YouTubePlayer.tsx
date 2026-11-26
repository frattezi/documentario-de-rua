// The Film's player: a thumbnail button until clicked, then the YouTube nocookie embed,
// autoplaying. Before the click nothing is requested from a YouTube host.
import { useState } from "react";
import type { FilmVideo } from "../content/hero";
import { youtubeEmbedAllow, youtubeEmbedUrl } from "../lib/youtube";

export default function YouTubePlayer({ videoId, title, thumbnail, thumbnailAlt, duration }: FilmVideo) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="screen">
        <iframe
          src={youtubeEmbedUrl(videoId)}
          title={title}
          allow={youtubeEmbedAllow}
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="screen"
      onClick={() => setPlaying(true)}
      aria-label={`Assistir ${title} (${duration})`}
    >
      <img src={thumbnail} alt={thumbnailAlt} />
      <span className="play" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M6 4l15 8-15 8z" />
        </svg>
      </span>
      <span className="dur">{duration}</span>
    </button>
  );
}
