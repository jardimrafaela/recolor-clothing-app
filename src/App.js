import React, { useState, useEffect } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import './App.css';

const RecolorTool = () => {
  // Lista de imagens com diferentes cores
  const images = [
    `${process.env.PUBLIC_URL}/images/outfit1-brown.png`,
    `${process.env.PUBLIC_URL}/images/outfit1-blue.png`,
    `${process.env.PUBLIC_URL}/images/outfit1-green.png`,
    `${process.env.PUBLIC_URL}/images/outfit1-purple.png`,
    `${process.env.PUBLIC_URL}/images/outfit1-pink.png`,
  ];

  const [hue, setHue] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);

  // Carregar a imagem atual com base no índice
  useEffect(() => {
    const img = new window.Image();
    const index = Math.floor(hue / (360 / images.length));
    img.src = images[index];
    img.onload = () => setCurrentImage(img); // Atualizar o estado somente quando a imagem estiver carregada
  }, [hue]);

  return (
    <div className="editor">
      <h1>Recolor Your Clothes!</h1>
      <div className="controls">
        <label>Hue</label>
        <input
          type="range"
          min="0"
          max="360"
          value={hue}
          onChange={(e) => setHue(Number(e.target.value))}
        />
      </div>
      <Stage width={500} height={500} className="canvas">
        <Layer>
          {currentImage && (
            <Image
              image={currentImage} // Renderiza a imagem carregada
              width={500}
              height={500}
            />
          )}
        </Layer>
      </Stage>
      <button
        onClick={() => {
          const uri = document.querySelector('canvas').toDataURL();
          const link = document.createElement('a');
          link.download = 'edited-image.png';
          link.href = uri;
          link.click();
        }}
      >
        Download Image
      </button>
    </div>
  );
};

export default RecolorTool;

