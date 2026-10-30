import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { ArrowRight, Play } from 'lucide-react';
import heroBackground from '../assets/niramaya-hero-background.jpg';

type Props = { onLearnMore?: () => void; onViewSolution?: () => void };

export default function HeroSection({ onLearnMore, onViewSolution }: Props) {
  return (
    <section className="relative flex min-h-[calc(100vh-1rem)] items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={heroBackground}
          alt="Rural healthcare in India"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(5,31,27,0.88),rgba(7,42,39,0.6),rgba(15,23,42,0.58))]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 text-center text-white">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-emerald-100 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
          Connected care for every community
        </div>
        <h1 className="mb-6 text-5xl font-semibold leading-[1.08] md:text-7xl">
          Niramaya Digital Healthcare
        </h1>
        
        <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-slate-100 md:text-2xl">
          A unified platform for patients, doctors, pharmacists, records, consultations, and health insights.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="rounded-xl bg-emerald-500 px-8 py-3 text-white shadow-lg shadow-emerald-950/25 hover:bg-emerald-400" onClick={onLearnMore}
          >
            Learn More
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="rounded-xl border-white/50 bg-white/5 px-8 py-3 text-white hover:bg-white hover:text-slate-900"
            onClick={onViewSolution}
          >
            <Play className="mr-2 h-5 w-5" />
            View Solution
          </Button>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm md:gap-8">
          <div className="rounded-xl px-2 py-4 text-center">
            <div className="mb-2 text-3xl font-semibold text-emerald-300 md:text-4xl">8</div>
            <div className="text-xs text-slate-200 md:text-sm">Villages Connected</div>
          </div>
          <div className="rounded-xl border-x border-white/10 px-2 py-4 text-center">
            <div className="mb-2 text-3xl font-semibold text-sky-300 md:text-4xl">12</div>
            <div className="text-xs text-slate-200 md:text-sm">Doctors Available</div>
          </div>
          <div className="rounded-xl px-2 py-4 text-center">
            <div className="mb-2 text-3xl font-semibold text-amber-300 md:text-4xl">15km</div>
            <div className="text-xs text-slate-200 md:text-sm">Average Distance</div>
          </div>
        </div>
      </div>
    </section>
  );
}