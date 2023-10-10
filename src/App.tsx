import React, { useCallback, useEffect, useRef, useState } from "react"
import "./App.css"

const App = () => {
  // logoの文字
  const [logoLabel, setLogoLabel] = useState<string>("face was concealed by our censorship. His (her) ");
  // logoの背景色
  const [backgroundColor, setBackgroundColor] = useState<string>("#000000");
  // canvasのHTML要素
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // canvasのcontext
  const [context, setContext] = useState<CanvasRenderingContext2D|null>(null);
  // logoの画像データ
  const [baseLogo, setBaseLogo] = useState<CanvasImageSource|null>(null);

  // ロゴの文字以外の初期化関数
  const initCanvasWithoutSvg = useCallback((context: CanvasRenderingContext2D, color: string) => {
    context.clearRect(0, 0, 2000, 2000);
    context.rect(0, 0, 2000, 2000);
    context.fillStyle = color;
    context.beginPath();
    context.arc(1000, 1000, 1000, 0, Math.PI * 2, true);
    context.fill();
    context.strokeStyle = 'white';
    context.beginPath();
    context.arc(1000, 1000, 720, 0, Math.PI * 2, true);
    context.lineWidth = 30;
    context.stroke();
    context.beginPath();
    context.arc(1000, 1000, 960, 0, Math.PI * 2, true);
    context.lineWidth = 30;
    context.stroke();
    context.font = "bold 150px sans serif";
    context.fillStyle = "white";
  }, []);

  // canvasの更新
  const updateCanvas = useCallback((label: string, color: string) => {
    if (context === null || baseLogo === null) return;
    initCanvasWithoutSvg(context, color);
    context.drawImage(baseLogo, 0, 0, 2000, 2000);
  
    const textArray = label.split('');
    const counter = textArray.length;
    const theta = 2 * Math.PI / counter;
    for (let i = 0; i < counter; i++) {
      const size = context.measureText(textArray[i]);
      context.fillText(textArray[i], 1000 - Math.min(size.width/2, 2250/counter), 210, 4500/counter);
      context.translate(1000, 1000);
      context.rotate(theta);
      context.translate(-1000, -1000);
    }
  }, [context, baseLogo, initCanvasWithoutSvg]);

  // canvasの初期化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    const ctx = canvas.getContext("2d");
    if (ctx === null) return;
    setContext(ctx);

    // 初期化
    initCanvasWithoutSvg(ctx, backgroundColor);
    const base = new Image();
    base.src = "/base_logo.svg";
    base.onload = () => {
      setBaseLogo(base);
      ctx.drawImage(base, 0, 0, 2000, 2000);
    }
  }, []);

  useEffect(() => {
    updateCanvas(logoLabel, backgroundColor);
  }, [updateCanvas, logoLabel, backgroundColor]);

  const inputHandler = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLogoLabel(event.target.value);
  }, [setLogoLabel]);

  const saveButton = useCallback(() => {
    const canvas = canvasRef.current; 
    if (canvas === null) return;

    canvas.toBlob((blob: Blob|null) => {
      if (blob === null) return;
      const a = document.createElement("a");

      a.href = URL.createObjectURL(blob);
      a.download = "c3logo.png";
      a.click();

      URL.revokeObjectURL(a.href);
        
    }, "image/png", 1);
  }, []);

  const colorPickerHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(event.target.value);
  }, [setBackgroundColor]);

  return (
    <>
      <h1 className="title">C3 ロゴジェネレーター</h1>
      <canvas width="2000" height="2000" id="logo" ref={canvasRef} />
      <div className="color-wrapper">
        <div className="color-label">背景色</div>
        <div className="picker-wrapper">
          <input type="color" value={backgroundColor} onChange={colorPickerHandler} />
        </div>
        <input className="color-textbox" type="text" value={backgroundColor} onChange={colorPickerHandler} />
      </div>
      <textarea id="form" onChange={inputHandler} value={logoLabel}></textarea>
      <div className="button-wrapper" onClick={saveButton}>
        <div className="button">画像を保存</div>
      </div>
    </>
  )
}

export default App
