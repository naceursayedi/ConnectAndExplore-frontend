import React, { useEffect, useState } from 'react';
import FormWrapper from './FormWrapper';

type EventThumbnailFormProps = {
  thumbnail?: string;
  hashtags?: string[];
  updateFields: (fields: Partial<{ thumbnail?: string; hashtags?: string[] }>) => void;
};

export default function EventThumbnailForm({
  thumbnail,
  hashtags = [],
  updateFields,
}: EventThumbnailFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(hashtags);
  const [customHashtag, setCustomHashtag] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [thumbPrewview, setThumbPreview] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('Bild auswählen');
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newThumbnail = URL.createObjectURL(file);
      setThumbPreview(newThumbnail);
      setFileUploaded(true);
      // Hier den lokalen Dateipfad setzen (z.B., der Name der ausgewählten Datei)
      const localFilePath = file.name;
      setFilePath(file.name);
    }
  };

  const toggleHashtag = (hashtag: string) => {
    const newHashtags = selectedHashtags.includes(hashtag)
      ? selectedHashtags.filter((h) => h !== hashtag)
      : [...selectedHashtags, hashtag];

    updateFields({ thumbnail, hashtags: newHashtags });
    setSelectedHashtags(newHashtags);
  };


  const handleCustomHashtagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomHashtag(e.target.value);
  };

  const addCustomHashtag = () => {
    if (customHashtag.trim() !== '') {
      setSelectedHashtags((prev) => {
        const newHashtags = [...prev, customHashtag.trim()];
        updateFields({ thumbnail, hashtags: newHashtags });
        return newHashtags;
      });
      setCustomHashtag('');
    }
  };

  useEffect(() => {
    updateFields({ thumbnail, hashtags: selectedHashtags });
  }, [thumbnail, selectedHashtags]);

  // weird base64 converter, but works! (:)) combination of stackoverflow and chatgpt monolog
  const convertToBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const base64Data = canvas.toDataURL('image/png');
        resolve(base64Data);
      };
      img.onerror = () => {
        reject(new Error('Fehler beim Laden des Bildes.'));
      };
      img.src = url;
    });
  };

  const handleImageSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (fileUploaded) {
      // convert imge in base 64, save this in event model
      if (thumbnail) {
        convertToBase64(thumbnail)
          .then(base64Image => {
            // see code
            //console.log("base64Image:" + base64Image);
            updateFields({ thumbnail: base64Image, hashtags: selectedHashtags });
          })
          .catch(error => {
            console.error('Fehler bei der Konvertierung in Base64:', error);
          });
      }
    }

  };

  return (
    <FormWrapper title="Lege ein Thumbnail fest und wähle Hashtags für deine Veranstaltung">
      <div className="flex flex-col items-center">
        <div className="flex gap-2">
          <label htmlFor="bild" className="cursor-pointer">
            <input
              type="file"
              accept="image/jpeg, image/png, image/gif"
              id="bild"
              disabled={loading}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="input-field cursor-pointer">
              {filePath}
            </div>
          </label>
          <button
            className="btn-event event-next upload"
            type="button"
            onClick={handleImageSubmit}
          >
            upload!
          </button>
        </div>

        {thumbPrewview && (
          <div
            style={{
              backgroundImage: `url(${thumbPrewview})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '200px',
            }}
            className="mt-4 rounded shadow-lg"
          />
        )}

        <div className="mt-4 text-center">
          <span className="sub-headline">Makiere dein Event mit Hashtags:</span>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {['Make new friends', 'Networking', 'Technologie', 'Professionals', 'foryou'].map((hashtag) => (
              <button
                type="button"
                key={hashtag}
                className={`hashtag-btn ${selectedHashtags.includes(hashtag) ? 'active' : ''
                  } `}
                onClick={() => toggleHashtag(hashtag)}
              >
                {hashtag}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="# füge mich hinzu"
              value={customHashtag}
              onChange={handleCustomHashtagChange}
              className="border border-gray-700 rounded px-2 py-1 outline-none focus:ring focus:border-blue-300"
            />
            <button
              onClick={addCustomHashtag}
              type="button"
              className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-green-600 transition duration-300"
            >
              Add
            </button>
          </div>
        </div>

        {selectedHashtags.length > 0 && (
          <div className="mt-4">
            <strong>Markierte Hashtags:</strong> {selectedHashtags.join(', ')}
          </div>
        )}
      </div>
    </FormWrapper>
  );
}
