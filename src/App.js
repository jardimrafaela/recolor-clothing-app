import React, { useState, useEffect } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import './App.css';

// Função para carregar dinamicamente todas as pastas dentro de /src/images/
const importOutfits = () => {
  const context = require.context('./images', true, /\.(png|jpe?g|svg)$/);
  const outfits = {};

  context.keys().forEach((key) => {
    // Extrair o nome da pasta (outfit)
    const pathParts = key.split('/');
    if (pathParts.length < 2) return;

    const folderName = pathParts[1]; // Nome da pasta (outfit)

    if (!outfits[folderName]) {
      outfits[folderName] = [];
    }

    outfits[folderName].push({
      name: key.replace('./', ''),
      src: context(key),
    });
  });

  return Object.keys(outfits).map((folderName) => ({
    name: folderName,
    images: outfits[folderName].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true })
    ),
  }));
};

// Carregar os outfits dinamicamente
const outfits = importOutfits();

const RecolorTool = () => {
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const [baseHue, setBaseHue] = useState(0);
  const [corsetHue, setCorsetHue] = useState(0);
  const [currentBaseImage, setCurrentBaseImage] = useState(null);
  const [currentCorsetImage, setCurrentCorsetImage] = useState(null);

  const currentOutfit = outfits[currentOutfitIndex] || { images: [] };

  // Filtrar imagens por tipo (base, corset, etc.)
  const baseImages = currentOutfit.images.filter((img) => img.name.includes('base'));
  const corsetImages = currentOutfit.images.filter((img) => img.name.includes('corset'));

  // Carregar a imagem base
  useEffect(() => {
    if (baseImages.length > 0) {
      const img = new window.Image();
      const index = Math.floor(baseHue / (360 / baseImages.length));
      img.src = baseImages[index]?.src;
      img.onload = () => setCurrentBaseImage(img);
    }
  }, [baseHue, baseImages]);

  // Carregar a imagem do corset (apenas se houver variações)
  useEffect(() => {
    if (corsetImages.length > 0) {
      const img = new window.Image();
      const index = Math.floor(corsetHue / (360 / corsetImages.length));
      img.src = corsetImages[index]?.src;
      img.onload = () => setCurrentCorsetImage(img);
    } else {
      setCurrentCorsetImage(null); // Remover a imagem de corset se não houver variações
    }
  }, [corsetHue, corsetImages]);

  const calculateScale = (image, canvasWidth, canvasHeight) => {
    const scale = Math.min(canvasWidth / image.width, canvasHeight / image.height);
    return scale;
  };

  return (
    <div className="editor">
      <h1>{currentOutfit.name}</h1>

      <div className="controls">
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
        <div>
          <label>Corset Hue</label>
          <input
            type="range"
            min="0"
            max="360"
            value={corsetHue}
            onChange={(e) => setCorsetHue(Number(e.target.value))}
            disabled={corsetImages.length === 0} // Desativar se não houver variações de corset
          />
        </div>
      </div>

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

      <div className="pagination">
        <button
          disabled={currentOutfitIndex === 0}
          onClick={() => setCurrentOutfitIndex((prev) => prev - 1)}
        >
          Previous
        </button>
        <button
          disabled={currentOutfitIndex === outfits.length - 1}
          onClick={() => setCurrentOutfitIndex((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

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
