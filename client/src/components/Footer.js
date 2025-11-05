import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Firecracker Store</h3>
            <p className="text-gray-400">Premium fireworks and crackers for all occasions.</p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/category/day-crackers" className="hover:text-fire-yellow">Day Crackers</Link></li>
              <li><Link to="/category/night-crackers" className="hover:text-fire-yellow">Night Crackers</Link></li>
              <li><Link to="/category/accessories" className="hover:text-fire-yellow">Customize Boxes</Link></li>
              <li><Link to="/category/display-boxes" className="hover:text-fire-yellow">Gift Boxes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-fire-yellow">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-fire-yellow">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-fire-yellow">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-fire-yellow">Return Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📧 info@firecrackerstore.com</li>
              <li>📱 +91 9342564949</li>
              <li>📍 Tamilnadu, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-400">
          <p>&copy; 2024 Firecracker Store. All rights reserved.</p>
          <p className="mt-2 text-sm text-red-400">
            ⚠️ Use firecrackers safely. Follow all safety guidelines. Keep away from children.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;




