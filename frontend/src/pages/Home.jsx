import { motion } from "framer-motion";
import FeatureCard from "../component/FeatureCard";

const features = [
  {
    title: "Showcase Your Skills",
    desc: "Stand out with assessments that highlight your true potential and strengths.",
    icon: "🌟",
  },
  {
    title: "Get Instant Feedback",
    desc: "Know where you shine and where to improve — right after each assessment.",
    icon: "⚡",
  },
  {
    title: "Boost Your Employability",
    desc: "Complete assessments that showcase your talents and get noticed by recruiters.",
    icon: "🚀",
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white text-gray-800 font-sans">
      {/* Hero */}
      <section className="text-center px-6 pt-24 pb-20 max-w-5xl mx-auto">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-6 text-indigo-900"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to Innate Gamma
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl mb-8 text-gray-600"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Prove your skills. Grow your confidence. Land the job.
        </motion.p>
        <motion.a
          href="/login"
          className="px-8 py-3 bg-indigo-600 text-white rounded-full text-lg font-medium hover:bg-indigo-700 transition shadow-lg"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Your Assessment
        </motion.a>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-10 px-6 pb-24 max-w-6xl mx-auto">
        {features.map((item, index) => (
          <FeatureCard key={index} item={item} index={index} />
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t text-sm text-gray-500">
        © 2025 Innate Gamma — Your Career, Elevated.
      </footer>
    </div>
  );
}
