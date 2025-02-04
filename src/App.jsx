import React, { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Stage } from "@pixi/react";
import { calculateCanvasSize } from "./common.ts";
import SpaceObjects from "./components/SpaceObjects.jsx";
import * as PIXI from "pixi.js";

const App = () => {
  PIXI.settings.EVENT_SYSTEM = "dynamic";
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize);
  const [positions, setPositions] = useState([]);
  const [socketId, setSocketId] = useState();

  const updateCanvasSize = useCallback(() => {
    setCanvasSize(calculateCanvasSize());
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [updateCanvasSize]);

  const parseData = (data) => {
    const parsedData = JSON.parse(data)
    return parsedData.map((obj) => {
      const [key] = Object.keys(obj);
      return obj[key];
    })
  }
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("update_step", (data) => {
      setPositions(parseData(data));
    });
    
    socket.on('connect', () => {
      setSocketId(socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Stage width={canvasSize.width} height={canvasSize.height} options={{ backgroundColor: 0x000000}}>
      <SpaceObjects positions={positions} canvasSize={canvasSize} socketId={socketId} />
    </Stage>
  );
};

export default App;
