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

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
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
      const particleCount = Math.floor(window.innerWidth / 15); // Increased density

      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 1.2, // Increased base velocity
          vy: (Math.random() - 0.5) * 1.2,
          size: Math.random() * 4 + 1, // Slightly larger particles
          opacity: Math.random() * 0.6 + 0.3,
        });
      }
      particlesRef.current = particles;
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 145, 32, ${particle.opacity})`;
        ctx.fill();
      });
    };

    const updateParticles = () => {
      particlesRef.current.forEach((particle) => {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200; // Increased influence range

        // Apply stronger mouse influence
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          particle.x += dx * force * 0.08; // Much stronger force
          particle.y += dy * force * 0.08;
        }

        // Return to base position more quickly
        particle.x += (particle.baseX - particle.x) * 0.08;
        particle.y += (particle.baseY - particle.y) * 0.08;

        // Apply velocity
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary checks with more responsive bouncing
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.8;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.8;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Update base position more dynamically
        particle.baseX += particle.vx * 0.15;
        particle.baseY += particle.vy * 0.15;

        // Keep base position in bounds
        if (particle.baseX < 0 || particle.baseX > canvas.width) {
          particle.baseX = Math.max(0, Math.min(canvas.width, particle.baseX));
        }
        if (particle.baseY < 0 || particle.baseY > canvas.height) {
          particle.baseY = Math.max(0, Math.min(canvas.height, particle.baseY));
        }

        // More dynamic opacity changes
        particle.opacity += (Math.random() - 0.5) * 0.02;
        particle.opacity = Math.max(0.2, Math.min(0.8, particle.opacity));
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
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
