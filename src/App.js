import React, { useState, useEffect } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import './App.css';

const RecolorTool = () => {
  // Lista de imagens base
  const baseImages = [
    `${process.env.PUBLIC_URL}/images/outfit1-brown.png`,
    `${process.env.PUBLIC_URL}/images/outfit1-pink.png`,
    `${process.env.PUBLIC_URL}/images/outfit1-purple.png`,
    `${process.env.PUBLIC_URL}/images/outfit1-blue.png`,
    `${process.env.PUBLIC_URL}/images/outfit1-green.png`,
  ];

  // Lista de imagens do corset
  const corsetImages = [
    `${process.env.PUBLIC_URL}/images/corset-brown.png`,
    `${process.env.PUBLIC_URL}/images/corset-pink.png`,
    `${process.env.PUBLIC_URL}/images/corset-purple.png`,
    `${process.env.PUBLIC_URL}/images/corset-blue.png`,
    `${process.env.PUBLIC_URL}/images/corset-green.png`,
  ];

  // Estados para controle de Hue
  const [baseHue, setBaseHue] = useState(0);
  const [corsetHue, setCorsetHue] = useState(0);

  // Estados para armazenar as imagens carregadas
  const [currentBaseImage, setCurrentBaseImage] = useState(null);
  const [currentCorsetImage, setCurrentCorsetImage] = useState(null);

  // Carregar a imagem base
  useEffect(() => {
    const img = new window.Image();
    const index = Math.floor(baseHue / (360 / baseImages.length));
    img.src = baseImages[index];
    img.onload = () => setCurrentBaseImage(img);
  }, [baseHue]);

  // Carregar a imagem do corset
  useEffect(() => {
    const img = new window.Image();
    const index = Math.floor(corsetHue / (360 / corsetImages.length));
    img.src = corsetImages[index];
    img.onload = () => setCurrentCorsetImage(img);
  }, [corsetHue]);

  // Função para calcular escala e centralizar a imagem
  const calculateScale = (image, canvasWidth, canvasHeight) => {
    const scale = Math.min(canvasWidth / image.width, canvasHeight / image.height);
    return scale;
  };

  return (
    <div className="editor">
      <h1>Recolor Your Clothes!</h1>

      <div className="controls">
        {/* Controle para a imagem base */}
        <div>
          <label>Base Hue</label>
          <input
            type="range"
            min="0"
            max="360"
            value={baseHue}
            onChange={(e) => setBaseHue(Number(e.target.value))}
          />
        </div>

        {/* Controle para o corset */}
        <div>
          <label>Corset Hue</label>
          <input
            type="range"
            min="0"
            max="360"
            value={corsetHue}
            onChange={(e) => setCorsetHue(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Canvas para renderizar as imagens */}
      <Stage width={500} height={500} className="canvas">
        <Layer>
          {currentBaseImage && (
            <Image
              image={currentBaseImage}
              x={250}
              y={250}
              offsetX={currentBaseImage.width / 2}
              offsetY={currentBaseImage.height / 2}
              scaleX={calculateScale(currentBaseImage, 500, 500)}
              scaleY={calculateScale(currentBaseImage, 500, 500)}
            />
          )}
          {currentCorsetImage && (
            <Image
              image={currentCorsetImage}
              x={250}
              y={250}
              offsetX={currentCorsetImage.width / 2}
              offsetY={currentCorsetImage.height / 2}
              scaleX={calculateScale(currentCorsetImage, 500, 500)}
              scaleY={calculateScale(currentCorsetImage, 500, 500)}
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
