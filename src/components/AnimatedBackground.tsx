import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseX: number;
  baseY: number;
}

interface GeometricShape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  type: 'square' | 'triangle' | 'circle';
  opacity: number;
  pulseSpeed: number;
  bounceDirection: number;
  bounceSpeed: number;
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shapesRef = useRef<GeometricShape[]>([]);
  const animationRef = useRef<number>();
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

    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.floor(window.innerWidth / 12);

      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 5 + 2,
          opacity: Math.random() * 0.7 + 0.3,
        });
      }
      particlesRef.current = particles;
    };

    const createGeometricShapes = () => {
      const shapes: GeometricShape[] = [];
      const shapeCount = 15;

      for (let i = 0; i < shapeCount; i++) {
        shapes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 30 + 20,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          type: ['square', 'triangle', 'circle'][Math.floor(Math.random() * 3)] as 'square' | 'triangle' | 'circle',
          opacity: Math.random() * 0.3 + 0.1,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          bounceDirection: Math.random() * Math.PI * 2,
          bounceSpeed: Math.random() * 0.5 + 0.2,
        });
      }
      shapesRef.current = shapes;
    };

    const drawParticles = () => {
      particlesRef.current.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 145, 32, ${particle.opacity})`;
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(245, 145, 32, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    const drawGeometricShapes = () => {
      shapesRef.current.forEach((shape) => {
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        ctx.globalAlpha = shape.opacity;
        
        ctx.strokeStyle = `rgba(245, 145, 32, ${shape.opacity})`;
        ctx.lineWidth = 2;
        
        switch (shape.type) {
          case 'square':
            ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
            break;
          case 'triangle':
            ctx.beginPath();
            ctx.moveTo(0, -shape.size / 2);
            ctx.lineTo(-shape.size / 2, shape.size / 2);
            ctx.lineTo(shape.size / 2, shape.size / 2);
            ctx.closePath();
            ctx.stroke();
            break;
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
            ctx.stroke();
            break;
        }
        
        ctx.restore();
      });
    };

    const updateParticles = () => {
      particlesRef.current.forEach((particle) => {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        // Apply mouse influence
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          particle.x += dx * force * 0.05;
          particle.y += dy * force * 0.05;
        }

        // Return to base position
        particle.x += (particle.baseX - particle.x) * 0.05;
        particle.y += (particle.baseY - particle.y) * 0.05;

        // Apply velocity
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary checks
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.8;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.8;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Update base position
        particle.baseX += particle.vx * 0.1;
        particle.baseY += particle.vy * 0.1;

        // Keep base position in bounds
        if (particle.baseX < 0 || particle.baseX > canvas.width) {
          particle.baseX = Math.max(0, Math.min(canvas.width, particle.baseX));
        }
        if (particle.baseY < 0 || particle.baseY > canvas.height) {
          particle.baseY = Math.max(0, Math.min(canvas.height, particle.baseY));
        }

        // Dynamic opacity changes
        particle.opacity += (Math.random() - 0.5) * 0.01;
        particle.opacity = Math.max(0.2, Math.min(0.8, particle.opacity));
      });
    };

    const updateGeometricShapes = () => {
      shapesRef.current.forEach((shape) => {
        // Rotation animation
        shape.rotation += shape.rotationSpeed;
        
        // Pulse animation
        shape.opacity += Math.sin(Date.now() * shape.pulseSpeed) * 0.001;
        shape.opacity = Math.max(0.05, Math.min(0.4, shape.opacity));
        
        // Bounce animation
        shape.x += Math.cos(shape.bounceDirection) * shape.bounceSpeed;
        shape.y += Math.sin(shape.bounceDirection) * shape.bounceSpeed;
        
        // Boundary bounce
        if (shape.x < 0 || shape.x > canvas.width) {
          shape.bounceDirection = Math.PI - shape.bounceDirection;
          shape.x = Math.max(0, Math.min(canvas.width, shape.x));
        }
        if (shape.y < 0 || shape.y > canvas.height) {
          shape.bounceDirection = -shape.bounceDirection;
          shape.y = Math.max(0, Math.min(canvas.height, shape.y));
        }
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      updateParticles();
      updateGeometricShapes();
      drawGeometricShapes();
      drawParticles();
      
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    createGeometricShapes();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
      createGeometricShapes();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default AnimatedBackground;
