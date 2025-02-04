import React from 'react';
import { Graphics, Text } from '@pixi/react';

function SpaceObject({ pos, canvasSize }) {
  const offsetX = canvasSize.width / 2;
  const offsetY = canvasSize.height / 2;
  const x = offsetX + pos.x * 100;
  const y = offsetY - pos.y * 100;

  return (
    <>
      <Graphics
        draw={(g) => {
            g.clear();
            g.lineStyle(0);
            g.beginFill(0xffffff);
            g.drawCircle(x, y, 50);
            g.endFill();
        }}
      />
    </>
  );
}

export default SpaceObject;