import React, { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Stage } from "@pixi/react";
import { calculateCanvasSize } from "./common.ts";
import SpaceObjects from "./components/SpaceObjects.jsx";
import * as PIXI from "pixi.js";
import { socket } from "./socket.js";

const App = () => {
  const keyMap = { w: 'up', s: 'down', a: 'left', d: 'right' };
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

  const sendPressKey = async (direction, isPressed) => {
    console.log(socket);
    if (direction === 'right' || direction === 'left' || direction === 'up' || direction === 'down') {
      socket.emit('button_press', {
        "is_pressed": isPressed,
        "direction": direction,
      })
    }
  }

  const handleKeyPress = (event) => {
    const direction = event.key.toLowerCase();
    sendPressKey(keyMap[direction], true);
    console.log(keyMap[direction], 'true')
  };

  const handleKeyRelease = (event) => {
    const direction = event.key.toLowerCase();
    sendPressKey(keyMap[direction], false);
    console.log(keyMap[direction], 'false')
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyRelease);
    socket.on("update_step", (data) => {
      setPositions(parseData(data));
      console.log(data);
      console.log(socket)
    });

    socket.on('connect', () => {
      setSocketId(socket.id);
    });

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyRelease);
    };
  }, []);

  return (
    <Stage width={canvasSize.width} height={canvasSize.height} options={{ backgroundColor: 0x000000 }}>
      <SpaceObjects positions={positions} canvasSize={canvasSize} socketId={socketId} socket={socket} />
    </Stage>
  );
};

export default App;
