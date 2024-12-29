import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
  color?: string;
}

interface MousePosition {
  x: number;
  y: number;
}

class Particle {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  originX: number;
  originY: number;
  ease: number;
  friction: number;
  springFactor: number;
  size: number;
  color: string;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.vx = 0;
    this.vy = 0;
    this.originX = x;
    this.originY = y;
    this.ease = 0.1;
    this.friction = 0.95;
    this.springFactor = 0.05;
    this.size = 3;
    this.color = color;
  }

  setOrigin(x: number, y: number) {
    this.originX = x;
    this.originY = y;
  }

  think() {
    let dx = this.originX - this.x;
    let dy = this.originY - this.y;

    this.vx += dx * this.springFactor;
    this.vy += dy * this.springFactor;

    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export function Particles({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  refresh = false,
  color = "#ffffff",
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef<MousePosition>({ x: 0, y: 0 });
  const multiplier = useRef(Math.min(Math.max(window.innerWidth / 1000, 0.5), 1));

  useEffect(() => {
    /* @vite-ignore */
    const path = new URL("./", import.meta.url).pathname;
    if (!canvasRef.current) return;

    context.current = canvasRef.current.getContext("2d");

    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      multiplier.current = Math.min(Math.max(window.innerWidth / 1000, 0.5), 1);
      initParticles();
    };

    const initParticles = () => {
      if (!canvasRef.current) return;
      particles.current = [];

      const { width, height } = canvasRef.current;
      const particleCount = Math.floor(quantity * multiplier.current);

      for (let i = 0; i < particleCount; i++) {
        particles.current.push(
          new Particle(
            Math.floor(Math.random() * width),
            Math.floor(Math.random() * height),
            color
          )
        );
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const { width: canvasWidth, height: canvasHeight } = canvasRef.current;
      const { width: rectWidth, height: rectHeight } = rect;
      const scaleX = canvasWidth / rectWidth;
      const scaleY = canvasHeight / rectHeight;

      mouse.current = {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
      };
    };

    const animate = () => {
      if (!context.current || !canvasRef.current) return;

      context.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      particles.current.forEach((particle) => {
        const { x: mouseX, y: mouseY } = mouse.current;
        const distX = mouseX - particle.x;
        const distY = mouseY - particle.y;
        const dist = Math.sqrt(distX ** 2 + distY ** 2);
        const staticFactor = (staticity * multiplier.current) / 2;
        const easeFactor = (ease * multiplier.current) / 400;

        if (dist < staticFactor) {
          const angle = Math.atan2(distY, distX);
          const force = (staticFactor - dist) / staticFactor;

          particle.setOrigin(
            particle.x - Math.cos(angle) * force * easeFactor,
            particle.y - Math.sin(angle) * force * easeFactor
          );
        } else {
          particle.setOrigin(particle.originX, particle.originY);
        }

        particle.think();
        particle.draw(context.current!);
      });

      requestAnimationFrame(animate);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [quantity, staticity, ease, refresh, color]);

  return (
    <canvas
      className={cn("absolute inset-0 -z-10", className)}
      ref={canvasRef}
    />
  );
}