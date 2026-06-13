/** All portfolio copy/data in one place, keeping section components lean. */

export const LINKS = {
  github: "https://github.com/sahilchambyal",
  linkedin: "https://www.linkedin.com/in/sahil-chambyal07/",
  resume: "https://drive.google.com/file/d/1mmy36mrlAOaq2GcKn0oVPXgrULFi7Chp/view?usp=sharing",
  email: "mailto:sahil.chambyal@outlook.com",
};

export interface Project {
  codename: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: { label: string; value: string }[];
  tech: string[];
  date: string;
  link: string;
  images: string[];
}

export const PROJECTS: Project[] = [
  {
    codename: "BIO-CORE",
    title: "Hybrid ViT Model for Crop Diagnosis",
    subtitle: "Advanced crop disease detection system",
    description:
      "Designed a hybrid ViT + CNN + custom MLP architecture that processes images in parallel to detect 38 crop disease classes, achieving 85% training accuracy and 99.5% validation accuracy. Developed an IoT-ready inference pipeline for real-time deployment with sensor integration and filed a patent covering the model architecture and end-to-end diagnostic workflow.",
    metrics: [
      { label: "Validation accuracy", value: "99.5%" },
      { label: "Disease classes", value: "38" },
      { label: "Inference pipeline", value: "IoT-ready" },
      { label: "Patent", value: "Filed" },
    ],
    tech: ["Vision Transformers", "CNN", "Custom MLP", "IoT"],
    date: "NOV 2025",
    link: "https://www.kaggle.com/code/sahilchambyal/hybrid-vit-model-for-crop-diagnosis-99-5-val-acc",
    images: ["/project1i1.png", "/project1i2.png"],
  },
  {
    codename: "TRI-RING",
    title: "ORIN Tri-Sense AI",
    subtitle: "Multilingual RAG chat-runtime",
    description:
      "Built and fine-tuned a multilingual RAG chat-runtime for universities, government, and private orgs (6+ languages). Optimized proprietary RAG (Pinecone) with tri-source retrieval and fine-tuning, reaching 86% relevance and 0.72 MRR. Scaled to 1k sessions / 200 QPS (latency < 300 ms), reducing time-to-answer from 96 hours to 10 minutes.",
    metrics: [
      { label: "Throughput", value: "1k sessions / 200 QPS" },
      { label: "Latency", value: "< 300 ms" },
      { label: "Relevance", value: "86%" },
      { label: "MRR", value: "0.72" },
    ],
    tech: ["RAG", "Pinecone", "Multilingual NLP", "Fine-tuning"],
    date: "OCT 2025",
    link: "https://github.com/Meridion-Labs/orin-langchain",
    images: ["/project2i1.png", "/project2i2.png"],
  },
  {
    codename: "DATA-OBELISK",
    title: "Product Price Regressor",
    subtitle: "DeBERTa-v3 price prediction system",
    description:
      "Designed and iteratively fine-tuned a DeBERTa-v3-base regression model over 30 epochs on a 75,000-sample dataset for price prediction, achieving a final best validation SMAPE of 21.73% (down from 63.17%). Optimized training efficiency on a Tesla P100 GPU using automatic mixed precision, a 2e-5 learning rate, 0.01 weight decay, and gradient clipping, with a final architecture of 183M parameters.",
    metrics: [
      { label: "SMAPE", value: "21.73%" },
      { label: "Dataset", value: "75k samples" },
      { label: "Parameters", value: "183M" },
      { label: "Hardware", value: "Tesla P100" },
    ],
    tech: ["DeBERTa-v3", "Regression", "PyTorch", "Mixed Precision"],
    date: "OCT 2025",
    link: "https://github.com/SahilChambyal/Product-Price-Regressor",
    images: ["/project3i1.png", "/project3i2.png"],
  },
];

export const SKILLS = [
  { title: "Languages", items: ["Python", "Java", "C++", "TypeScript", "JavaScript", "SQL", "C"] },
  { title: "AI/ML Frameworks", items: ["OpenCV", "Hugging Face", "PyTorch", "TensorFlow", "LangChain", "Pandas", "NumPy"] },
  { title: "Platforms & Tools", items: ["AWS", "Azure", "GCP", "MongoDB", "Linux", "Git", "LangSmith", "n8n"] },
];

export const EDUCATION = [
  {
    degree: "Bachelor of Technology",
    field: "Computer Science and Engineering",
    detail: "Lovely Professional University · CGPA 8.33 · 2022–2026",
    extra: "Minor: Machine Learning and Deep Learning",
  },
  {
    degree: "Senior Secondary Education",
    field: "Physics, Chemistry, Math, Computer Science",
    detail: "Sainik School Kapurthala · 2015–2022",
    extra: "",
  },
];

export const ACHIEVEMENTS = [
  { title: "Building Intelligent Troubleshooting Agents", org: "Microsoft · Sep 2025" },
  { title: "AI and Machine Learning Algorithms", org: "Microsoft · Sep 2025" },
  { title: "Generative AI with Large Language Models", org: "DeepLearning.AI · Apr 2024" },
  { title: "Microsoft Founders Hub Member", org: "$20,000 in benefits and cloud credits" },
  { title: "NCC A & B Certificates", org: "6 years of service" },
];
