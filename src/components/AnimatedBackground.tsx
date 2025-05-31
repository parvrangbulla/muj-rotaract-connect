
import { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
    }> = [];

    // Floating shapes
    const shapes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      type: 'circle' | 'square' | 'triangle';
      opacity: number;
    }> = [];

    // Background dots (made smaller)
    const dots: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      pulseSpeed: number;
      pulseOffset: number;
    }> = [];

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        hue: Math.random() * 60 + 15 // Orange-ish colors
      });
    }

    // Initialize floating shapes
    for (let i = 0; i < 8; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 20 + 10,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        type: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle',
        opacity: Math.random() * 0.1 + 0.05
      });
    }

    // Initialize background dots (smaller size)
    const spacing = 60; // Increased spacing between dots
    for (let x = 0; x < canvas.width; x += spacing) {
      for (let y = 0; y < canvas.height; y += spacing) {
        dots.push({
          x: x + Math.random() * 20,
          y: y + Math.random() * 20,
          size: Math.random() * 1.5 + 0.5, // Much smaller dots (0.5-2px instead of 2-6px)
          opacity: Math.random() * 0.15 + 0.05, // Lower opacity
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2
        });
      }
    }

    let time = 0;

    const animate = () => {
      time += 0.016;
      
      // Clear canvas with slight trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background dots (smaller)
      dots.forEach(dot => {
        const pulse = Math.sin(time * dot.pulseSpeed + dot.pulseOffset) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(245, 145, 32, ${dot.opacity * pulse})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size * pulse, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 70%, 60%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw floating shapes
      shapes.forEach(shape => {
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotation += shape.rotationSpeed;

        // Wrap around edges
        if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size;

        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        ctx.fillStyle = `rgba(245, 145, 32, ${shape.opacity})`;

        // Draw different shapes
        switch (shape.type) {
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'square':
            ctx.fillRect(-shape.size, -shape.size, shape.size * 2, shape.size * 2);
            break;
          case 'triangle':
            ctx.beginPath();
            ctx.moveTo(0, -shape.size);
            ctx.lineTo(-shape.size, shape.size);
            ctx.lineTo(shape.size, shape.size);
            ctx.closePath();
            ctx.fill();
            break;
        }
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default AnimatedBackground;
