import React from 'react';
import { Graphics } from '@pixi/react';

function SpaceObject({ pos, canvasSize }) {
  const x = canvasSize.width / 2 + pos.x * 100;
  const y = canvasSize.height / 2 - pos.y * 100;

  return (
    <Graphics
      draw={(g) => {
        g.clear();
        g.lineStyle(0);
        g.beginFill(0xffffff);
        g.drawCircle(x, y, 50);
        g.endFill();
      }}
    />
  );
}

export default SpaceObject;