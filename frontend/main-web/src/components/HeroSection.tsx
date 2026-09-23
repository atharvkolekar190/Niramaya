import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { ArrowRight, Play } from 'lucide-react';

type Props = { onLearnMore?: () => void; onViewSolution?: () => void };

export default function HeroSection({ onLearnMore, onViewSolution }: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1698465281093-9f09159733b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGhlYWx0aGNhcmUlMjBkb2N0b3IlMjBwYXRpZW50JTIwSW5kaWF8ZW58MXx8fHwxNzU3NDQxNzg4fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Rural healthcare in India"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
        <h1 className="text-5xl md:text-7xl mb-6 leading-tight">
          Revolutionizing Rural Healthcare in{' '}
          <span className="text-green-400">Nabha</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
          173 villages. Thousands of lives. One scalable solution.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg" onClick={onLearnMore}
          >
            Learn More
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg"
            onClick={onViewSolution}
          >
            <Play className="mr-2 h-5 w-5" />
            View Solution
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl text-green-400 mb-2">8</div>
            <div className="text-sm opacity-80">Villages Connected</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl text-blue-400 mb-2">12</div>
            <div className="text-sm opacity-80">Doctors Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl text-orange-400 mb-2">15km</div>
            <div className="text-sm opacity-80">Average Distance</div>
          </div>
        </div>
      </div>
    </section>
  );
}