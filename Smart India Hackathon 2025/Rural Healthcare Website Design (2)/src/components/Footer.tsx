import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: "About Project", href: "#about" },
    { name: "Healthcare Data", href: "#data" },
    { name: "Solution Overview", href: "#solution" },
    { name: "Impact Stories", href: "#impact" }
  ];

  const resources = [
    { name: "Research Papers", href: "#research" },
    { name: "Implementation Guide", href: "#guide" },
    { name: "Technical Docs", href: "#docs" },
    { name: "Policy Framework", href: "#policy" }
  ];

  const partners = [
    { name: "Punjab Health Dept", href: "#punjab" },
    { name: "Nabha Civil Hospital", href: "#hospital" },
    { name: "Rural Pharmacies", href: "#pharmacy" },
    { name: "Community Health Workers", href: "#workers" }
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Project Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-green-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl">Nabha Telemedicine</h3>
                <p className="text-green-400 text-sm">Rural Healthcare Initiative</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
              Transforming rural healthcare access through innovative telemedicine solutions. 
              Connecting 173 villages to quality medical care.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">Nabha, Punjab, India</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">+91-XXX-XXX-XXXX</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">info@nabhatelemedicine.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg mb-6">Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a 
                    href={resource.href} 
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-lg mb-6">Partners</h4>
            <ul className="space-y-3">
              {partners.map((partner, index) => (
                <li key={index}>
                  <a 
                    href={partner.href} 
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
                    {partner.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Stats */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Social Links */}
            <div>
              <h4 className="text-lg mb-4">Follow Our Progress</h4>
              <div className="flex gap-4">
                <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-green-600 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-green-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-green-600 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-green-600 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl text-green-400 mb-1">173</div>
                <div className="text-xs text-gray-400">Villages</div>
              </div>
              <div>
                <div className="text-2xl text-green-400 mb-1">50K+</div>
                <div className="text-xs text-gray-400">People Served</div>
              </div>
              <div>
                <div className="text-2xl text-green-400 mb-1">24/7</div>
                <div className="text-xs text-gray-400">Availability</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <h4 className="text-lg mb-4">Data Sources & References</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
            <ul className="space-y-2">
              <li>• Punjab Health Department, 2024</li>
              <li>• National Rural Health Mission Data</li>
              <li>• Census 2011 - Rural Demographics</li>
            </ul>
            <ul className="space-y-2">
              <li>• Internet & Mobile Association of India</li>
              <li>• Ministry of Health & Family Welfare</li>
              <li>• Telemedicine Society of India Reports</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2024 Nabha Telemedicine Initiative. Built with ❤️ for rural healthcare transformation.
          </div>
          
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#privacy" className="hover:text-green-400">Privacy Policy</a>
            <a href="#terms" className="hover:text-green-400">Terms of Use</a>
            <a href="#contact" className="hover:text-green-400">Contact</a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            <strong>Disclaimer:</strong> This is a conceptual presentation of the Nabha Telemedicine Initiative. 
            All data presented is based on publicly available sources and research. This project is designed 
            to demonstrate potential impact and solutions for rural healthcare challenges in Punjab.
          </p>
        </div>
      </div>
    </footer>
  );
}