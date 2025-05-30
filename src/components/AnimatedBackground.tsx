import { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create animated squares
    const squares: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    // Initialize squares
    for (let i = 0; i < 15; i++) {
      squares.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 60 + 20,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.3 + 0.1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 1 + 0.5
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      squares.forEach(square => {
        // Mouse influence
        const dx = mouseRef.current.x - square.x;
        const dy = mouseRef.current.y - square.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const force = (200 - distance) / 200;
          square.x -= dx * force * 0.008;
          square.y -= dy * force * 0.008;
        }

        // Regular movement
        square.y -= square.speed;
        square.rotation += square.rotationSpeed;

        // Reset position when square goes off screen
        if (square.y + square.size < 0) {
          square.y = canvas.height + square.size;
          square.x = Math.random() * canvas.width;
        }

        // Keep squares within horizontal bounds
        if (square.x < -square.size) square.x = canvas.width + square.size;
        if (square.x > canvas.width + square.size) square.x = -square.size;

        // Draw square
        ctx.save();
        ctx.translate(square.x + square.size / 2, square.y + square.size / 2);
        ctx.rotate((square.rotation * Math.PI) / 180);
        ctx.globalAlpha = square.opacity;
        ctx.strokeStyle = '#f59120';
        ctx.lineWidth = 2;
        ctx.strokeRect(-square.size / 2, -square.size / 2, square.size, square.size);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ zIndex: 1 }}
    />
  );
};

export default AnimatedBackground;
