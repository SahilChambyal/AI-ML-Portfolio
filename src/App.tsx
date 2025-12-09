import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Card } from './components/ui/card';
import { Footer } from './components/Footer';
import { Github, Linkedin, Mail, ExternalLink, ArrowUpRight, ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import sahilPhoto from 'figma:asset/bb9020aa65b21668c8e338cd68f379a64ca06b58.png';

export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const backgroundY = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const textY = useTransform(smoothProgress, [0, 1], ['0%', '200%']);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const skills = {
    languages: ['Python', 'Java', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'C'],
    frameworks: ['OpenCV', 'Hugging Face', 'PyTorch', 'TensorFlow', 'LangChain', 'Pandas', 'NumPy'],
    platforms: ['AWS', 'Azure', 'GCP', 'MongoDB', 'Linux', 'Git', 'LangSmith', 'n8n']
  };

  const projects = [
    {
      title: "Hybrid ViT Model for Crop Diagnosis",
      subtitle: "Advanced Crop Disease Detection System",
      description: "Designed a hybrid ViT + CNN + Custom MLP architecture that processes images in parallel to detect 38 crop disease classes, achieving 85% training accuracy and 99.5% validation accuracy. Developed an IoT-ready inference pipeline for real-time deployment with sensor integration and filed a patent covering the model architecture and end-to-end diagnostic workflow.",
      metrics: ["99.5% Validation Accuracy", "38 Disease Classes", "IoT-Ready Pipeline", "Patent Filed"],
      tech: ["Vision Transformers", "CNN", "Custom MLP", "IoT"],
      date: "Nov 2025",
      link: 'https://www.kaggle.com/code/sahilchambyal/hybrid-vit-model-for-crop-diagnosis-99-5-val-acc',
      images: ['/project1i1.png', '/project1i2.png']
    },
    {
      title: "ORIN Tri-Sense AI",
      subtitle: "Multilingual RAG Chat-Runtime",
      description: "Built and fine-tuned a multilingual RAG chat-runtime for universities, government, and private orgs (6+ languages). Optimized proprietary RAG (Pinecone) with tri-source retrieval and fine-tuning, reaching 86% relevance and 0.72 MRR. Scaled to 1k sessions / 200 QPS (latency<300 ms), reducing time-to-answer from 96 hours to 10 minutes.",
      metrics: ["1k Sessions/200 QPS", "<300ms Latency", "86% Relevance", "0.72 MRR"],
      tech: ["RAG", "Pinecone", "Multilingual NLP", "Fine-tuning"],
      date: "Oct 2025",
      link: 'https://github.com/Meridion-Labs/orin-langchain',
      images: ['/project2i1.png', '/project2i2.png']
    },
    {
      title: "Product Price Regressor (DeBERTa-v3)",
      subtitle: "Price Prediction System",
      description: "Designed and iteratively fine-tuned a DeBERTa-v3-base regression model over 30 epochs (15+7+8) on a 75,000-sample dataset for price prediction, ultimately achieving a final best validation metric of SMAPE 21.73% (down from initial 63.17%). Optimized training efficiency and stability on a Tesla P100-PCIE-16GB GPU using Automatic Mixed Precision (FP32-FP16), a 2e-5 learning rate, 0.01 weight decay, and gradient clipping (max_norm=1.0), with final architecture size being 183 Million Parameters.",
      metrics: ["SMAPE 21.73%", "75k Samples", "183M Parameters", "Tesla P100 GPU"],
      tech: ["DeBERTa-v3", "Regression", "PyTorch", "Mixed Precision"],
      date: "Oct 2025",
      link: 'https://github.com/SahilChambyal/Product-Price-Regressor',
      images: ['/project3i1.png', '/project3i2.png']
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Cursor follower */}
      <motion.div
        className="custom-cursor fixed top-0 left-0 w-6 h-6 bg-white/30 rounded-full pointer-events-none z-50 mix-blend-difference backdrop-blur-sm"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
        }}
      />

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.2 
        }}
        className="fixed top-0 w-full z-40 bg-black/50 backdrop-blur-2xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="text-xl tracking-tight"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              Sahil Chambyal
            </motion.div>
          </div>
          
          <div className="hidden md:flex items-center space-x-12">
            {['About', 'Projects', 'Skills', 'Education'].map((item, index) => (
              <motion.button
                key={item}
                onClick={() => {
                  const element = document.getElementById(item.toLowerCase());
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative text-white/70 hover:text-white transition-colors duration-500 bg-none border-none cursor-pointer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.3 }
                }}
              >
                {item}
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-px bg-white"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="border-blue-400/50 text-blue-300 bg-blue-400/10 hover:bg-blue-400/20 transition-colors duration-300 rounded-full"
              onClick={() => window.open('https://drive.google.com/file/d/1mmy36mrlAOaq2GcKn0oVPXgrULFi7Chp/view?usp=sharing', '_blank')}
            >
              Resume
            </Button>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="bg-white text-black hover:bg-gray-100 rounded-full px-8 py-2 font-normal tracking-wide transition-all duration-300"
                onClick={() => window.open('https://www.linkedin.com/in/sahil-chambyal07/')}
              >
                Connect
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-8 pt-20 relative overflow-hidden">
        {/* Background Image with Vertical Stripes Effect */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url(${sahilPhoto})`,
              backgroundSize: '60%',
              backgroundPosition: 'right center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          {/* Vertical stripes overlay */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              background: `repeating-linear-gradient(
                90deg,
                transparent 0px,
                transparent 2px,
                rgba(0, 0, 0, 0.7) 2px,
                rgba(0, 0, 0, 0.7) 3px,
                transparent 3px,
                transparent 6px,
                rgba(0, 0, 0, 0.3) 6px,
                rgba(0, 0, 0, 0.3) 7px
              )`
            }}
          />
          {/* Glass morphism overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto flex items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-4xl"
          >
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <Badge variant="outline" className="border-white/40 text-white bg-white/10 backdrop-blur-sm mb-6 px-4 py-2 text-sm tracking-wide rounded-full">
                AI/ML Engineer
              </Badge>
            </motion.div>
            
            <motion.div style={{ y: textY }}>
              <motion.h1 
                className="text-6xl lg:text-8xl font-normal mb-8 leading-[0.9] tracking-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Building intelligent
                <motion.span 
                  className="block text-white/60"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 1 }}
                >
                  systems that
                </motion.span>
                <motion.span 
                  className="block"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1, duration: 1 }}
                >
                  matter
                </motion.span>
              </motion.h1>
            </motion.div>
            
            <motion.p 
              className="text-xl text-white/90 mb-12 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1 }}
            >
              AI/ML Engineer developing scalable AI/ML and intelligent systems that redefine how organizations process and understand information.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-100 rounded-full px-8 py-3 font-normal tracking-wide"
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Projects
                  <ArrowDown className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white/60 rounded-full px-8 py-3 font-normal tracking-wide backdrop-blur-sm"
                  onClick={() => window.open('https://github.com/sahilchambyal')}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-white/70 text-sm tracking-wide"
          >
            Scroll to explore
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <motion.section 
        id="about"
        className="py-32 px-8 relative"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-5xl font-normal mb-16 tracking-tight">About</h2>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.p 
                className="text-xl text-white/90 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                I focus on advancing memory-augmented LLMs and AI agents, currently building project-specific hierarchical memory systems for more coherent, long-term reasoning.  
              </motion.p>
              <motion.p 
                className="text-xl text-white/90 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                My past work spans vision models, multilingual RAG systems, and large-scale regressors, shaping my interest in scalable intelligence and how models store, update, and use structured knowledge effectively.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="text-white/90"
                whileHover={{ x: 10, transition: { duration: 0.3 } }}
              >
                <span className="block text-sm text-white/60 mb-1">Location</span>
                Punjab, India
              </motion.div>
              <motion.div 
                className="text-white/90"
                whileHover={{ x: 10, transition: { duration: 0.3 } }}
              >
                <span className="block text-sm text-white/60 mb-1">Email</span>
                sahil.chambyal@outlook.com
              </motion.div>
              <motion.div 
                className="text-white/90"
                whileHover={{ x: 10, transition: { duration: 0.3 } }}
              >
                <span className="block text-sm text-white/60 mb-1">Status</span>
                Available for opportunities
              </motion.div>
              
              <div className="flex gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white/60 rounded-full backdrop-blur-sm" 
                    onClick={() => window.open('https://linkedin.com/in/sahil-chambyal07')}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white/60 rounded-full backdrop-blur-sm" 
                    onClick={() => window.open('https://github.com/sahilchambyal')}
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section 
        id="projects"
        className="py-32 px-8 bg-gradient-to-b from-transparent to-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-5xl font-normal mb-20 tracking-tight">Featured Projects</h2>
          </motion.div>
          
          <div className="space-y-16">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: index * 0.2 
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.5, ease: "easeOut" }
                }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-700 rounded-3xl overflow-hidden">
                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column: Content */}
                      <div className="flex flex-col h-full">
                        <div>
                          {/* Header with Title and Date */}
                          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 mb-4">
                            <motion.h3 
                              className="text-2xl font-normal text-white tracking-tight leading-tight"
                              whileHover={{ x: 5, transition: { duration: 0.3 } }}
                            >
                              {project.title}
                            </motion.h3>
                            <Badge variant="outline" className="border-white/40 text-white bg-white/10 rounded-full px-3 py-1 w-fit text-xs mt-1">
                              {project.date}
                            </Badge>
                          </div>
                          
                          {/* Subtitle and Description */}
                          <h4 className="text-lg text-white/80 mb-4 font-light">{project.subtitle}</h4>
                          <p className="text-white/80 mb-6 leading-relaxed text-base">{project.description}</p>
                          
                          {/* Tech Tags */}
                          <div className="mb-6">
                            <div className="flex flex-wrap gap-2">
                              {project.tech.map((tech, techIndex) => (
                                <motion.div
                                  key={techIndex}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Badge 
                                    variant="secondary" 
                                    className="bg-white/10 text-white border-0 rounded-full px-3 py-1 text-xs backdrop-blur-sm"
                                  >
                                    {tech}
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Visit Button */}
                          <div className="mb-8">
                            <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }} className="w-fit">
                              <Button 
                                variant="outline" 
                                className="border-green-400/50 text-green-300 bg-green-400/10 hover:bg-green-400/20 hover:border-green-400/60 rounded-full backdrop-blur-sm group transition-all duration-300 px-6 py-2.5 text-base font-medium" 
                                onClick={() => window.open(project.link, '_blank')}
                              >
                                <ExternalLink className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                Visit Project
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                        
                        {/* Key Metrics */}
                        <div className="border-t border-white/10 pt-6 mt-auto">
                          <h5 className="font-normal text-white mb-4 text-base">Key Metrics</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                            {project.metrics.map((metric, metricIndex) => (
                              <motion.div 
                                key={metricIndex} 
                                className="flex items-start gap-3 text-white/80 text-sm"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: metricIndex * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                              >
                                <div className="w-1.5 h-1.5 bg-white/60 rounded-full mt-2 flex-shrink-0" />
                                <span className="leading-relaxed">{metric}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Images */}
                      <div className="flex flex-col gap-4">
                        {project.images?.map((image, imgIndex) => (
                          <motion.div
                            key={imgIndex}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-xl overflow-hidden border border-white/10 aspect-video w-full"
                          >
                            <img 
                              src={image} 
                              alt={`${project.title} screenshot ${imgIndex + 1}`}
                              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Skills Section */}
      <motion.section 
        id="skills"
        className="py-32 px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-5xl font-normal mb-20 tracking-tight">Skills & Technologies</h2>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { title: 'Languages', skills: skills.languages, color: 'blue-400' },
              { title: 'AI/ML Frameworks', skills: skills.frameworks, color: 'purple-400' },
              { title: 'Platforms & Tools', skills: skills.platforms, color: 'green-400' }
            ].map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: categoryIndex * 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.5, ease: "easeOut" }
                }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-500 rounded-3xl h-full">
                  <div className="p-8">
                    <h3 className="text-xl font-normal mb-8 text-white tracking-tight">{category.title}</h3>
                    <div className="flex flex-wrap gap-3">
                      {category.skills.map((skill, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            delay: index * 0.05,
                            duration: 0.3,
                            ease: "easeOut"
                          }}
                          viewport={{ once: true }}
                          whileHover={{ 
                            scale: 1.05, 
                            y: -2,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <Badge 
                            variant="outline" 
                            className={category.color === 'blue-400' 
                              ? "border-blue-400/50 text-blue-300 bg-blue-400/10 rounded-full px-4 py-2 backdrop-blur-sm hover:bg-blue-400/20 transition-colors duration-300"
                              : category.color === 'purple-400'
                              ? "border-purple-400/50 text-purple-300 bg-purple-400/10 rounded-full px-4 py-2 backdrop-blur-sm hover:bg-purple-400/20 transition-colors duration-300"
                              : "border-green-400/50 text-green-300 bg-green-400/10 rounded-full px-4 py-2 backdrop-blur-sm hover:bg-green-400/20 transition-colors duration-300"
                            }
                          >
                            {skill}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Education & Certifications */}
      <motion.section 
        id="education"
        className="py-32 px-8 bg-gradient-to-b from-transparent to-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-5xl font-normal mb-20 tracking-tight">Education & Certifications</h2>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.5, ease: "easeOut" }
              }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-500 rounded-3xl h-full">
                <div className="p-8">
                  <h3 className="text-xl font-normal mb-8 text-white tracking-tight">Education</h3>
                  <div className="space-y-8">
                    <motion.div
                      whileHover={{ x: 5, transition: { duration: 0.3 } }}
                    >
                      <h4 className="font-normal text-lg mb-2 text-white">Bachelor of Technology</h4>
                      <p className="text-white/80 mb-2">Computer Science and Engineering</p>
                      <p className="text-sm text-white/60 mb-1">Lovely Professional University • CGPA 8.33 • 2022-2026</p>
                      <p className="text-sm text-white/60">Minor: Machine Learning and Deep Learning</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5, transition: { duration: 0.3 } }}
                    >
                      <h4 className="font-normal text-lg mb-2 text-white">Senior Secondary Education</h4>
                      <p className="text-white/80 mb-2">Physics, Chemistry, Math, Computer Science</p>
                      <p className="text-sm text-white/60">Sainik School Kapurthala • 2015-2022</p>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.5, ease: "easeOut" }
              }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-500 rounded-3xl h-full">
                <div className="p-8">
                  <h3 className="text-xl font-normal mb-8 text-white tracking-tight">Certifications & Achievements</h3>
                  <div className="space-y-6">
                    {[
                      { title: "Building Intelligent Troubleshooting Agents", org: "Microsoft • Sep 2025" },
                      { title: "AI and Machine Learning Algorithms", org: "Microsoft • Sep 2025" },
                      { title: "Generative AI with Large Language Models", org: "DeepLearning.AI • Apr 2024" },
                      { title: "Microsoft Founder Hub Member", org: "$20,000 in benefits and cloud credits" },
                      { title: "NCC A & B Certificates", org: "6 years of service" }
                    ].map((cert, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ x: 5, transition: { duration: 0.3 } }}
                      >
                        <h4 className="font-normal mb-1 text-white">{cert.title}</h4>
                        <p className="text-sm text-white/60">{cert.org}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
      <Analytics />
    </div>

  );
}