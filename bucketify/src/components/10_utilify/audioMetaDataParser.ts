import { fromUrl } from 'id3js';
import { getExtension } from './utility';

export type TAudioMetaData = {
  title: string;
  album: string | null;
  artist: string | null;
  track: unknown | null;
};

/**
 * Get audio metadata from an audio file by s3 pre-signed URL.
 *
 * @param {string} signedUrl
 * @param {string} key key of a s3 object.
 * @return {TAudioMetaData}
 */
export const getMetadataBySignedUrl: (signedUrl: string, key: string) => TAudioMetaData = (
  signedUrl,
  key
) => {
  console.group('GET_AUDIO_METADATA');

  let audioMetaData: TAudioMetaData = {
    title: key,
    album: null,
    artist: null,
    track: null
  };

  const extension = getExtension(key);

  console.log('extension: ' + extension)

  if (extension === 'mp3') {
    const metadata = getMP3Metadata(signedUrl, key);
    if (metadata !== null){
      audioMetaData = metadata
    }
  } else if (extension === 'mp4') {
  } else if (extension === 'm4a') {
  }

  console.groupEnd();
  return audioMetaData;
};

/**
 * Get audio metadata that their extension is MP3.
 *
 * @param {*} signedUrl
 * @param {*} key
 * @return {*} 
 */
export const getMP3Metadata: (signedUrl: string, key: string) => TAudioMetaData | null = (
  signedUrl,
  key
) => {
  let audioMetaData: TAudioMetaData | null = null;

  fromUrl(signedUrl).then((tags) => {
    console.info(tags);
    if (tags === null) {
      return null;
    } else {
      const title = tags.title ? tags.title : key;
      const album = tags.album ? tags.album : null;
      const artist = tags.album ? tags.artist : null;
      const track = tags.track ? tags.track : null;
      
      // console.info(title,album,artist,track)

      audioMetaData = {
        title: title,
        album: album,
        artist: artist,
        track: track,
      };

      // console.dir(audioMetaData)
    }
  });

  return audioMetaData;
};
