"use client";

import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10 px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-2xl font-bold text-white tracking-tight">Sahil Chambyal</h3>
            <p className="text-white/60 leading-relaxed max-w-sm">
              AI/ML Engineer developing scalable AI/ML and intelligent systems that redefine how organizations process and understand information.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-fit"
            >
              <Button 
                variant="outline"
                size="icon"
                className="rounded-xl border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-white w-12 h-12 transition-all duration-300"
                onClick={() => window.open('mailto:sahil.chambyal@outlook.com')}
              >
                <Mail className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Navigation */}
            <div className="space-y-6">
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Navigation</h4>
              <ul className="space-y-4">
                {['About', 'Projects', 'Skills', 'Education'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => {
                        const element = document.getElementById(item.toLowerCase());
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-white/60 hover:text-white transition-colors duration-300 text-sm cursor-pointer"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socials */}
            <div className="space-y-6">
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Socials</h4>
              <ul className="space-y-4">
                <li>
                  <a href="https://github.com/sahilchambyal" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-300 text-sm">GitHub</a>
                </li>
                <li>
                  <a href="https://linkedin.com/in/sahil-chambyal07" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-300 text-sm">LinkedIn</a>
                </li>
                <li>
                  <a href="https://drive.google.com/file/d/1mmy36mrlAOaq2GcKn0oVPXgrULFi7Chp/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-300 text-sm">Resume</a>
                </li>
              </ul>
            </div>

            {/* Featured Projects */}
            <div className="space-y-6">
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Featured</h4>
              <ul className="space-y-4">
                <li>
                  <a href="https://www.kaggle.com/code/sahilchambyal/hybrid-vit-model-for-crop-diagnosis-99-5-val-acc" className="text-white/60 hover:text-white transition-colors duration-300 text-sm">Crop Diagnosis</a>
                </li>
                <li>
                  <a href="https://github.com/Meridion-Labs/orin-langchain" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-300 text-sm">ORIN Tri-Sense</a>
                </li>
                <li>
                  <a href="https://github.com/SahilChambyal/Product-Price-Regressor" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-300 text-sm">Price Regressor</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <p className="text-sm text-white/40">
            © 2025 Sahil Chambyal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
