'use client'
import React, { useEffect, useRef, useState, useCallback } from "react";
import { io } from 'socket.io-client';

interface DrawingAction {
  path: { x: number; y: number }[];
  style: { color: string; lineWidth: number };
}

const WhiteBoardCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(3);
  const [drawingActions, setDrawingActions] = useState<DrawingAction[]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [currentStyle, setCurrentStyle] = useState({
    color: "black",
    lineWidth: 3,
  });

  const socket = useRef(io(`${process.env.NEXT_PUBLIC_SERVER_URL}`)).current;

  const reDrawPreviousData = useCallback((ctx: CanvasRenderingContext2D, actions: DrawingAction[] = drawingActions) => {
    actions.forEach(({ path, style }) => {
      ctx.beginPath();
      ctx.strokeStyle = style.color;
      ctx.lineWidth = style.lineWidth;
      ctx.moveTo(path[0].x, path[0].y);
      path.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  }, [drawingActions]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.parentElement!.clientWidth;
      canvas.height = canvas.parentElement!.clientHeight * 0.75;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        setContext(ctx);
        reDrawPreviousData(ctx);
      }
    }

    socket.on('drawing', (data: DrawingAction) => {
      setDrawingActions((prevActions) => [...prevActions, data]);
      if (context && canvasRef.current) {
        reDrawPreviousData(context, [...drawingActions, data]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [context, socket, drawingActions, reDrawPreviousData]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (context) {
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !context) return;

    context.strokeStyle = currentStyle.color;
    context.lineWidth = currentStyle.lineWidth;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();

    setCurrentPath((prevPath) => [
      ...prevPath,
      { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY },
    ]);
  };

  const endDrawing = () => {
    setDrawing(false);
    if (context) {
      context.closePath();
    }
    if (currentPath.length > 0) {
      const newDrawingAction = { path: currentPath, style: currentStyle };
      setDrawingActions((prevActions) => [
        ...prevActions,
        newDrawingAction,
      ]);
      socket.emit('drawing', newDrawingAction); 
    }
    setCurrentPath([]);
  };

  const changeColor = (color: string) => {
    setCurrentColor(color);
    setCurrentStyle((prevStyle) => ({ ...prevStyle, color }));
  };

  const changeWidth = (width: number) => {
    setLineWidth(width);
    setCurrentStyle((prevStyle) => ({ ...prevStyle, lineWidth: width }));
  };

  const undoDrawing = () => {
    if (drawingActions.length > 0) {
      const newActions = drawingActions.slice(0, -1);
      setDrawingActions(newActions);
      if (context && canvasRef.current) {
        const newContext = canvasRef.current.getContext("2d");
        if (newContext) {
          newContext.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          reDrawPreviousData(newContext, newActions);
        }
      }
    }
  };

  const clearDrawing = () => {
    setDrawingActions([]);
    setCurrentPath([]);
    if (context && canvasRef.current) {
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        className="border border-gray-400 w-full h-64 sm:h-80 md:h-96 lg:h-500 xl:h-600"
      />
      <div className="flex flex-col sm:flex-row my-4 items-center w-full justify-between">
        <div className="flex justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-0">
          {["red", "blue", "green", "yellow", "black"].map((color) => (
            <div
              key={color}
              className={`w-8 h-8 rounded-full cursor-pointer ${
                currentColor === color
                  ? `${color === "black" ? "bg-white" : `bg-${color}-700`}`
                  : `${color === "black" ? "bg-black" : `bg-${color}-500`}`
              }`}
              onClick={() => changeColor(color)}
            />
          ))}
        </div>
        <div className="flex-grow flex justify-center sm:justify-end w-full sm:w-auto">
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => changeWidth(Number(e.target.value))}
            className="w-full sm:w-auto"
          />
        </div>
      </div>
      <div className="flex justify-center my-4 space-x-2">
        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={undoDrawing}
        >
          Undo
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={clearDrawing}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default WhiteBoardCanvas;
