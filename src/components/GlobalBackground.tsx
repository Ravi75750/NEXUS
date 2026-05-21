import React, { useRef, useEffect } from 'react';

export default function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: 0, y: 0, active: false };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      originalVx: number;
      originalVy: number;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.originalVx = this.vx;
        this.originalVy = this.vy;
        this.size = Math.random() * 2;
      }

      update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Mouse proximity glow for particles
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.fillStyle = `rgba(0, 255, 255, ${1 - dist / 150})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ffff';
          } else {
            ctx.fillStyle = 'rgba(0, 170, 255, 0.5)';
            ctx.shadowBlur = 0;
          }
        } else {
          ctx.fillStyle = 'rgba(0, 170, 255, 0.5)';
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const particleCount = window.innerWidth < 768 ? 15 : 45;
      particles = Array.from({ length: particleCount }, () => new Particle(canvas.width, canvas.height));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isMobile = window.innerWidth < 768;
      const connectionDist = isMobile ? 80 : 150;
      
      particles.forEach((p, i) => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);

        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            let alpha = 0.1 * (1 - dist / connectionDist);
            let lineWidth = 0.25;

            // Brighten strings near mouse
            if (mouse.active && !isMobile) {
              const mdx1 = mouse.x - p.x;
              const mdy1 = mouse.y - p.y;
              const mdist1 = Math.sqrt(mdx1 * mdx1 + mdy1 * mdy1);
              
              const mdx2 = mouse.x - particles[j].x;
              const mdy2 = mouse.y - particles[j].y;
              const mdist2 = Math.sqrt(mdx2 * mdx2 + mdy2 * mdy2);

              if (mdist1 < 180 || mdist2 < 180) {
                const proximity = Math.min(mdist1, mdist2);
                const boost = Math.pow((180 - proximity) / 180, 2);
                alpha += boost * 0.5;
                lineWidth = 0.3 + boost * 1.5;
                ctx.shadowBlur = 12 * boost;
                ctx.shadowColor = '#00ffff';
              }
            }

            ctx.strokeStyle = `rgba(0, 210, 255, ${alpha})`;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }

        // Connection to mouse (Nexus point interaction)
        if (mouse.active && !isMobile) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.4 * (1 - dist / 150)})`;
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ffff';
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => init();
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-nexus-dark">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full opacity-40"
      />
      {/* Dynamic light effects */}
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,170,255,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_90%,rgba(0,77,77,0.15),transparent_50%)]" />
    </div>
  );
}
