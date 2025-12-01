import React, { useState } from "react";

export default function NeoConvert() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [convertedUrl, setConvertedUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSourceFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setConvertedUrl("");
  };

  const runNeoConvert = async (stylePrompt: string) => {
    if (!sourceFile) {
      setMessage("Please upload an image first.");
      return;
    }

    setLoading(true);
    setMessage("NeoConvert is processing...");

    try {
      const fd = new FormData();
      fd.append("file", sourceFile);
      fd.append("prompt", stylePrompt);

      const apiUrl = import.meta.env.VITE_AI_PROXY_URL + "/api/neoconvert";

      const res = await fetch(apiUrl, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setConvertedUrl(url);
      setMessage("Conversion complete!");
    } catch (err) {
      console.error(err);
      setMessage("NeoConvert failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white max-w-3xl mx-auto">

      <h1 className="text-4xl font-bold mb-6 text-cyan-400">
        NeoConvert — AI Image Converter
      </h1>

      {/* Upload Box */}
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-6">
        <label className="block mb-3 text-gray-300">Upload Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="block w-full mb-4"
        />

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="rounded-xl w-full h-64 object-cover mb-4 border border-white/10"
          />
        )}
      </div>

      {/* Style Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => runNeoConvert("Convert this image into anime style")}
          className="px-4 py-2 bg-cyan-600 rounded-lg"
        >
          Anime
        </button>

        <button
          onClick={() => runNeoConvert("Convert this image into Pixar 3D cartoon style")}
          className="px-4 py-2 bg-violet-600 rounded-lg"
        >
          Pixar 3D
        </button>

        <button
          onClick={() => runNeoConvert("Convert this into a watercolor painting")}
          className="px-4 py-2 bg-blue-600 rounded-lg"
        >
          Watercolor
        </button>

        <button
          onClick={() => runNeoConvert("Convert this into neon cyberpunk art style")}
          className="px-4 py-2 bg-pink-600 rounded-lg"
        >
          Cyberpunk
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-yellow-400 mb-4">Processing...</p>}

      {/* Converted Output */}
      {convertedUrl && (
        <div className="mt-6">
          <h2 className="text-xl mb-3">Converted Image:</h2>
          <img
            src={convertedUrl}
            alt="Converted"
            className="rounded-xl w-full h-64 object-cover border border-white/10"
          />
        </div>
      )}

      {message && <p className="mt-4 opacity-70">{message}</p>}
    </div>
  );
}