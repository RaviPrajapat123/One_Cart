import React from 'react';
import t1 from "../assets/back1-Pica.png";
import t2 from "../assets/back2-Pica.png";
import t3 from "../assets/back3-Pica.png";
import t4 from "../assets/back4-Pica.png";

const backgrounds = [t1, t2, t3, t4];

function Background({ heroCount }) {
  const bgImage = backgrounds[heroCount];

  return bgImage ? (
    <img
      src={bgImage}
      alt={`Background ${heroCount}`}
      className="w-full h-full object-cover object-center transition duration-300 overflow-auto"
    />
  ) : null;
}

export default Background;
