import React, { useEffect, useState } from 'react';

export const SakuraPetals: React.FC = () => {
  const [petals, setPetals] = useState<Array<{ id: number; left: number; duration: number; delay: number; swayDuration: number }>>([]);

  useEffect(() => {
    const petalCount = 15;
    const newPetals = Array.from({ length: petalCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
      swayDuration: 3 + Math.random() * 2,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="sakura-petal"
          style={{
            left: `${petal.left}%`,
            animationDuration: `${petal.duration}s, ${petal.swayDuration}s`,
            animationDelay: `${petal.delay}s, ${petal.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
