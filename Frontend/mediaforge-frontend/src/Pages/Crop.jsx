import React, { useState } from "react";
import Navbar from "./Navbar";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./Crop.css";
import Footer from "./footer";
const Crop = () => {

  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState();
  const [imageRef, setImageRef] = useState(null);

  const onSelectFile = (e) => {
    if (e.target.files?.length) {
      setSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  const downloadCrop = () => {
    if (!imageRef || !crop?.width || !crop?.height) return;

    const canvas = document.createElement("canvas");
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      imageRef,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const link = document.createElement("a");
    link.download = "cropped.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="cropPage">
      <Navbar />

      <div className="cropContainer">
        <h1 className="cropTitle">Crop Image</h1>

        <input type="file" accept="image/*" onChange={onSelectFile} className="fileInput"/>

        {src && (
          <>
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
              <img src={src} onLoad={(e) => setImageRef(e.currentTarget)} alt="" />
            </ReactCrop>

            <button className="downloadBtn" onClick={downloadCrop}>
              Download Cropped Image
            </button>
          </>
        )}

      </div>

      <Footer/>
    </div>
  );
};

export default Crop;
