'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import { Check } from 'lucide-react';

const FRAME_COUNT = 240;

function ScrollRevealText({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 80, filter: "blur(15px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.div>
    );
}

function HeroTexts({ progress }: { progress: any }) {
    // 0 to 1 during the hero section (which is 800vh)
    
    // First text appears early, disappears
    const text1Op = useTransform(progress, [0.0, 0.05, 0.2, 0.25], [0, 1, 1, 0]);
    const text1Y = useTransform(progress, [0.0, 0.05, 0.2, 0.25], [100, 0, 0, -100]);

    const text2Op = useTransform(progress, [0.28, 0.33, 0.45, 0.5], [0, 1, 1, 0]);
    const text2Y = useTransform(progress, [0.28, 0.33, 0.45, 0.5], [100, 0, 0, -100]);

    const text3Op = useTransform(progress, [0.55, 0.6, 0.7, 0.75], [0, 1, 1, 0]);
    const text3Y = useTransform(progress, [0.55, 0.6, 0.7, 0.75], [100, 0, 0, -100]);

    const text4Op = useTransform(progress, [0.8, 0.85, 0.95, 1], [0, 1, 1, 0]);
    const text4Y = useTransform(progress, [0.8, 0.85, 0.95, 1], [100, 0, 0, -100]);

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 p-6" aria-hidden="true">
            <motion.div style={{ opacity: text1Op, y: text1Y, position: 'absolute' }} className="text-center w-full">
                <div className="text-[4rem] sm:text-[6rem] md:text-[8rem] font-semibold tracking-tighter text-white leading-none drop-shadow-2xl">Profoundly</div>
                <div className="text-[4rem] sm:text-[6rem] md:text-[8rem] font-semibold tracking-tighter text-neutral-400 leading-none drop-shadow-2xl">Powerful.</div>
            </motion.div>

            <motion.div style={{ opacity: text2Op, y: text2Y, position: 'absolute' }} className="text-center w-full">
                <div className="text-[3rem] sm:text-[5rem] md:text-[7rem] font-semibold tracking-tight text-white mb-4 drop-shadow-xl">Titanium.</div>
                <p className="text-xl sm:text-2xl md:text-4xl text-neutral-300 font-light tracking-wide drop-shadow-md">So strong. So light.</p>
            </motion.div>

            <motion.div style={{ opacity: text3Op, y: text3Y, position: 'absolute' }} className="text-center w-full bg-gradient-to-t from-black/50 to-transparent pb-10">
                <div className="text-[3rem] sm:text-[5rem] md:text-[7rem] font-semibold tracking-tight text-white mb-4 drop-shadow-xl">A new core.</div>
                <p className="text-xl sm:text-2xl md:text-4xl text-neutral-300 font-light tracking-wide mt-2 drop-shadow-md">The conceptual A18 Pro chip.</p>
            </motion.div>

            <motion.div style={{ opacity: text4Op, y: text4Y, position: 'absolute' }} className="text-center w-full drop-shadow-2xl">
                <div className="text-[4rem] sm:text-[6rem] md:text-[8rem] font-semibold tracking-tighter text-white mb-2 leading-none">Unfold</div>
                <div className="text-[4rem] sm:text-[6rem] md:text-[8rem] font-semibold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 leading-none">the infinite.</div>
            </motion.div>
        </div>
    )
}

function HeroSequence() {
  const { scrollYProgress } = useScroll();
  
  // Create a buttery smooth spring proxy for the scroll to ensure frames and text transition beautifully
  const smoothScroll = useSpring(scrollYProgress, {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Hero section takes the first 70% of the entire page scroll
  const heroProgress = useTransform(smoothScroll, [0, 0.7], [0, 1]);

  useEffect(() => {
    // Preload images into memory
    for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        const numStr = i.toString().padStart(3, '0');
        img.src = `/images/herosection/ezgif-frame-${numStr}.png`;
        imagesRef.current[i-1] = img;
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let fallbackFrameIndex = 0;

    const render = () => {
      // Get the target frame based on current scroll progress [0, 1] 
      // Ensure we stay within 0 to (FRAME_COUNT - 1)
      const targetFrame = Math.min(Math.floor(heroProgress.get() * FRAME_COUNT), FRAME_COUNT - 1);
      const img = imagesRef.current[targetFrame];

      // If the target image is fully loaded, use it. Otherwise, use the last good frame.
      if (img && img.complete && img.naturalWidth > 0) {
        fallbackFrameIndex = targetFrame;
      }

      const drawImg = imagesRef.current[fallbackFrameIndex];
      const canvas = canvasRef.current;
      
      if (drawImg && drawImg.complete && drawImg.naturalWidth > 0 && canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Set exact resolution to avoid grainy upscaling
            if (canvas.width !== drawImg.naturalWidth) {
                canvas.width = drawImg.naturalWidth;
                canvas.height = drawImg.naturalHeight;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(drawImg, 0, 0);
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [heroProgress]);

  return (
      <div className="h-[800vh] relative z-0">
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center">
              <canvas 
                  ref={canvasRef} 
                  width={1920} 
                  height={1080} 
                  className="absolute inset-0 w-full h-full object-cover scale-105"
              />
              <div className="absolute inset-0 bg-black/30 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-t from-black to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-[20vh] bg-gradient-to-b from-black to-transparent pointer-events-none" />
              <HeroTexts progress={heroProgress} />
          </div>
      </div>
  )
}

const DetailsSection = () => {
    return (
        <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col gap-[20rem]">
            <ScrollRevealText>
                <div className="text-center flex flex-col items-center">
                    <h2 className="text-[4rem] sm:text-[5rem] md:text-[6rem] font-semibold tracking-tighter text-white mb-10 leading-[1.1]">
                        Brilliant. <br /><span className="text-neutral-500">In every way.</span>
                    </h2>
                    <p className="text-2xl md:text-4xl font-light text-neutral-300 leading-relaxed max-w-4xl tracking-wide"> 
                        The custom Retina XDR display pushes boundaries with incredible color accuracy and dynamic range. A visual feast that adapts to your environment seamlessly.
                    </p>
                </div>
            </ScrollRevealText>

            <ScrollRevealText>
                <div className="text-center flex flex-col items-center">
                    <h2 className="text-[4rem] sm:text-[5rem] md:text-[6rem] font-semibold tracking-tighter text-white mb-10 leading-[1.1]">
                        Forged in <br /><span className="text-neutral-500">Titanium.</span>
                    </h2>
                    <p className="text-2xl md:text-4xl font-light text-neutral-300 leading-relaxed max-w-4xl tracking-wide"> 
                        Aerospace‑grade titanium design that’s incredibly durable yet startlingly light. Engineered to absolute perfection for millions of folds.
                    </p>
                </div>
            </ScrollRevealText>

            <ScrollRevealText>
                <div className="text-center flex flex-col items-center">
                    <h2 className="text-[4rem] sm:text-[5rem] md:text-[6rem] font-semibold tracking-tighter text-white mb-10 leading-[1.1]">
                        Pro Camera. <br /><span className="text-neutral-500">Pro.</span>
                    </h2>
                    <p className="text-2xl md:text-4xl font-light text-neutral-300 leading-relaxed max-w-4xl tracking-wide"> 
                        Capture the world with unmatched clarity. Next-generation computational photography processing billions of operations per second for the perfect shot.
                    </p>
                </div>
            </ScrollRevealText>
        </div>
    )
};

const PricingSection = () => {
    return (
        <div className="max-w-6xl mx-auto px-6 py-40 mt-32 border-t border-white/10">
             <ScrollRevealText>
                 <div className="text-center mb-24">
                     <h2 className="text-6xl md:text-[5rem] font-semibold tracking-tighter mb-6">Take the leap.</h2>
                     <p className="text-3xl text-neutral-400 font-light">The future is available today.</p>
                 </div>
             </ScrollRevealText>
             
             <div className="flex flex-col md:flex-row gap-10 justify-center items-stretch mt-10">
                  <motion.div 
                     initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: false, margin: "-100px" }}
                     className="bg-[#121212] shadow-2xl rounded-[48px] p-12 md:p-16 flex-1 border border-white/5 text-left flex flex-col justify-between hover:bg-[#1a1a1a] transition-colors duration-500"
                  >
                     <div>
                         <h3 className="text-[2.5rem] font-semibold mb-2 tracking-tight">Pro</h3>
                         <p className="text-neutral-400 font-medium mb-10 text-2xl">The ultimate experience.</p>
                         <div className="text-[4rem] font-semibold tracking-tighter mb-10 leading-none">$1099 <span className="text-2xl text-neutral-500 font-normal tracking-normal block mt-3">or $45.79/mo.</span></div>
                         <ul className="space-y-6 text-neutral-300 font-medium border-t border-white/10 pt-10 text-xl">
                             <li className="flex gap-4 items-center"><Check className="text-neutral-500 w-6 h-6" /> 256GB Storage</li>
                             <li className="flex gap-4 items-center"><Check className="text-neutral-500 w-6 h-6" /> A18 Bionic</li>
                             <li className="flex gap-4 items-center"><Check className="text-neutral-500 w-6 h-6" /> Advanced Camera System</li>
                         </ul>
                     </div>
                     <button className="w-full mt-16 py-6 bg-white text-black font-semibold rounded-full text-xl hover:bg-neutral-200 transition-colors shadow-xl">
                         Buy Now
                     </button>
                  </motion.div>

                  <motion.div 
                     initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: false, margin: "-100px" }}
                     className="bg-[#121212] shadow-2xl rounded-[48px] p-12 md:p-16 flex-1 border border-white/5 text-left flex flex-col justify-between hover:bg-[#1a1a1a] transition-colors duration-500 relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold tracking-[0.25em] rounded-bl-3xl uppercase">Ultra</div>
                     <div>
                         <h3 className="text-[2.5rem] font-semibold mb-2 tracking-tight">Pro Max</h3>
                         <p className="text-neutral-400 font-medium mb-10 text-2xl">Beyond boundaries.</p>
                         <div className="text-[4rem] font-semibold tracking-tighter mb-10 leading-none">$1299 <span className="text-2xl text-neutral-500 font-normal tracking-normal block mt-3">or $54.12/mo.</span></div>
                         <ul className="space-y-6 text-neutral-300 font-medium border-t border-white/10 pt-10 text-xl">
                             <li className="flex gap-4 items-center"><Check className="text-blue-400 w-6 h-6" /> Up to 1TB Storage</li>
                             <li className="flex gap-4 items-center"><Check className="text-blue-400 w-6 h-6" /> A18 Pro Chip</li>
                             <li className="flex gap-4 items-center"><Check className="text-blue-400 w-6 h-6" /> 5x Periscope Zoom</li>
                         </ul>
                     </div>
                     <button className="w-full mt-16 py-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-full text-xl hover:scale-[1.02] transition-transform shadow-xl">
                         Buy Now
                     </button>
                  </motion.div>
             </div>
        </div>
    )
}

export default function LandingPage() {
  return (
    <ReactLenis root options={{ lerp: 0.05, wheelMultiplier: 0.8, smoothWheel: true }}>
      <main className="relative bg-black text-white selection:bg-white/20 select-none overflow-clip min-h-[1200vh]">
        <h1 className="sr-only">iPhone 18 Fold Concept - The Infinite Unfolded</h1>
        <HeroSequence />
        <div className="relative z-10 bg-black pt-40 pb-64">
           <DetailsSection />
           <PricingSection />
        </div>
      </main>
    </ReactLenis>
  );
}
