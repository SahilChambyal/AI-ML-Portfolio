import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Card } from './components/ui/card';
import { Github, Linkedin, Mail, ExternalLink, ArrowUpRight, ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
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
      title: "Tri-Source RAG",
      subtitle: "Language-Agnostic Query Resolver AI",
      description: "Production RAG chatbot supporting 6+ languages with proprietary tri-source retrieval system. Achieved 86% top-1 relevance and reduced mean time-to-answer from ~96 hours to <10 minutes.",
      metrics: ["~1k concurrent sessions", "~200 QPS", "<300ms retrieval latency", "0.72 MRR"],
      tech: ["RAG", "FAISS", "Milvus", "Multilingual NLP"],
      date: "Sep 2025",
      link:'https://github.com/Meridion-Labs/orin-langchain'
    },
    {
      title: "Product-Price-Regressor",
      subtitle: "Product Price Prediction System",
      description: "Designed and iteratively fine-tuned a DeBERTa-v3-base regression model over 30 epochs (15+7+8) on a 75,000-sample dataset for price prediction, ultimately achieving a final best validation metric of SMAPE 21.73% (down from initial 63.17%)",
      metrics: ["75,000 dataset samples", "30 training epochs", "SMAPE 21.73%", "DeBERTa-v3-base"],
      tech: ["DeBERTa", "Transformers", "Regression Analysis", "Data Preprocessing"],
      date: "Oct 2025",
      link:'https://github.com/SahilChambyal/Product-Price-Regressor'
    },
    {
      title: "Meridian",
      subtitle: "AI Token Metered Pipeline",
      description: "Model-agnostic token pipeline with universal tokenizer middleware and real-time metering. Achieved 99.99% accounting accuracy and 28% API spend reduction.",
      metrics: ["~800 concurrent agents", "2.4M tokens/day", "35ms median latency", "28% cost reduction"],
      tech: ["Token Management", "Real-time Analytics", "Anomaly Detection"],
      date: "Aug 2025",
      link:'https://github.com/Meridion-Labs/metered-token-pipeline'
    },
    {
      title: "NLP Content Analyzer",
      subtitle: "Multi-Parameter Article Analysis",
      description: "End-to-end text analysis pipeline that scrapes and analyzes articles across 20+ linguistic and sentiment metrics. Processed 500+ articles with 95% accuracy.",
      metrics: ["500+ articles analyzed", "95% scraping accuracy", "20+ parameters", "Automated profiling"],
      tech: ["NLTK", "Web Scraping", "Sentiment Analysis", "Content Intelligence"],
      date: "Mar 2025",
      link:'https://github.com/SahilChambyal/NLP_text_analysis_web-scrapping'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden" style={{ cursor: 'none' }}>
      {/* Cursor follower */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 bg-white/30 rounded-full pointer-events-none z-50 mix-blend-difference backdrop-blur-sm"
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
          <motion.div 
            className="text-xl tracking-tight"
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
          >
            Sahil Chambyal
          </motion.div>
          
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
              Computer Science student specializing in AI, ML, and NLP. Creating production-scale solutions that transform how organizations process and understand information.
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
                I'm a Computer Science student at Lovely Professional University with a passion for artificial intelligence and machine learning. My focus is on creating production-ready solutions that solve real-world problems at scale.
              </motion.p>
              <motion.p 
                className="text-xl text-white/90 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                With experience in NLP, computer vision, and agentic AI systems, I've built solutions handling thousands of concurrent users and processing millions of tokens daily.
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
                  <div className="p-12">
                    <div className="w-full">
                      {/* Header with Title and Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <motion.h3 
                          className="text-3xl font-normal text-white tracking-tight"
                          whileHover={{ x: 5, transition: { duration: 0.3 } }}
                        >
                          {project.title}
                        </motion.h3>
                        <Badge variant="outline" className="border-white/40 text-white bg-white/10 rounded-full px-3 py-1 w-fit">
                          {project.date}
                        </Badge>
                      </div>
                      
                      {/* Subtitle and Description */}
                      <h4 className="text-xl text-white/80 mb-6 font-light">{project.subtitle}</h4>
                      <p className="text-white/80 mb-8 leading-relaxed text-lg">{project.description}</p>
                      
                      {/* Tech Tags */}
                      <div className="mb-8">
                        <div className="flex flex-wrap gap-3">
                          {project.tech.map((tech, techIndex) => (
                            <motion.div
                              key={techIndex}
                              whileHover={{ scale: 1.05, y: -2 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Badge 
                                variant="secondary" 
                                className="bg-white/10 text-white border-0 rounded-full px-4 py-2 backdrop-blur-sm"
                              >
                                {tech}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Visit Button */}
                      <div className="mb-12">
                        <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }} className="w-fit">
                          <Button 
                            variant="outline" 
                            size="lg"
                            className="border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white/60 rounded-full backdrop-blur-sm group transition-all duration-300 px-6 py-3 text-base font-medium" 
                            onClick={() => window.open(project.link, '_blank')}
                          >
                            <ExternalLink className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                            Visit Project
                          </Button>
                        </motion.div>
                      </div>
                      
                      {/* Key Metrics */}
                      <div className="border-t border-white/10 pt-8">
                        <h5 className="font-normal text-white mb-6 text-lg">Key Metrics</h5>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {project.metrics.map((metric, metricIndex) => (
                            <motion.div 
                              key={metricIndex} 
                              className="flex items-start gap-3 text-white/80"
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
      <footer className="py-20 px-8 border-t border-white/10 bg-gradient-to-b from-transparent to-black">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p 
            className="text-white/90 mb-8 text-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Let's build something extraordinary together.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 rounded-full px-8 py-3 font-normal tracking-wide"
              onClick={() => window.open('mailto:sahil.chambyal@outlook.com')}
            >
              <Mail className="mr-2 h-4 w-4" />
              Get In Touch
            </Button>
          </motion.div>
          <motion.p 
            className="text-sm text-white/50 mt-12 tracking-wide"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            © 2025 Sahil Chambyal. All rights reserved.
          </motion.p>
        </div>
      </footer>
    </div>
  );
}