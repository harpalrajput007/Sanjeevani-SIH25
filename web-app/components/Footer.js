export default function Footer() {
  return (
    <footer className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🌿 HerbsTrace</h3>
            <p className="text-green-100">
              Ensuring authenticity and traceability of Ayurvedic herbs through blockchain technology.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-green-100">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/trace" className="hover:text-white">Trace Herbs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-green-100">
              Email: info@herbstrace.com<br/>
              Phone: +91 12345 67890
            </p>
          </div>
        </div>
        
        <div className="border-t border-green-700 mt-8 pt-4 text-center text-green-100">
          <p>&copy; 2024 HerbsTrace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}