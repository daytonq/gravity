import React, { useState } from 'react';
import SpaceObject from './SpaceObject';
import { Container, Graphics, Text } from '@pixi/react';
import * as PIXI from 'pixi.js'

function SpaceObjects({ positions, canvasSize, socketId }) {
  const [isStarted, setIsStarted] = useState(false);
  const sendData = async () => {
    console.log(socketId)
    const data = { user_id: socketId, space_objects: [{ name: "first", mass: 1, radius: 50, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, movement_type: 0 }, 
      { name: "second", mass: 1, radius: 50, position: { x: 2, y: 2 }, velocity: { x: -2, y: 0 }, movement_type: 1 }], 
      time_delta: 0.001, simulation_time: 10, G: 10, collision_type: 0, acceleration_rate: 1, elasticity_coefficient: 1 };
    console.log(socketId);
    try {
      const response = await fetch('http://localhost:5000/set_simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) { throw new Error("Not ok") }
      const result = await response.json();
      console.log("Success", result);
    } catch (error) { console.error(error) }
  };

  const launchSimulation = async () => {
    const data = {user_id: socketId}
    try {
      const response = await fetch('http://localhost:5000/launch_simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if(!response.ok) {throw new Error("Not ok")}
      const result = await response.json();
      console.log("Success", result);
      setIsStarted(true);
    } catch (error) {console.error(error)}
    };

  return (
    <>
      {positions.map((pos, index) => (
        <SpaceObject key={index} pos={pos} canvasSize={canvasSize} />
      ))}
      {!isStarted && (
        <>
      {<Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0xfffffa);
          g.drawRect(canvasSize.width / 2, canvasSize.height / 2, 200, 50);
          g.endFill();
        }}
        eventMode="dynamic"
        pointerdown={() => sendData()}
      />}
      {<Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0xfffffa);
          g.drawRect(canvasSize.width / 2, canvasSize.height / 2 - 200, 200, 50);
          g.endFill();
        }}
        eventMode="dynamic"
        pointerdown={() => launchSimulation()}
      />}</>)}
    </>
  );
}

export default SpaceObjects;

