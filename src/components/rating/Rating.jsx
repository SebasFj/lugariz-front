import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function Rating({ value = 0, onRate = () => {} }) {
  const [hoverValue, setHoverValue] = useState(null);

  const stars = [1, 2, 3, 4, 5];

  const getColor = (star) => {
    // Si hay hover, usamos hoverValue
    if (hoverValue !== null) {
      return star <= hoverValue ? "gold" : "#ccc";
    }
    // Si no hay hover, usamos value (rating real)
    return star <= value ? "gold" : "#ccc";
  };

  return (
    <div style={{ display: "flex", gap: "6px", cursor: "pointer" }}>
      {stars.map((star) => (
        <FaStar
          key={star}
          size={24}
          color={getColor(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(null)}
          onClick={() => onRate(star)}
          style={{ transition: "color 0.2s" }}
        />
      ))}
    </div>
  );
}
