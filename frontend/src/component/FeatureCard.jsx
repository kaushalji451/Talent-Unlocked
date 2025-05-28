import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const FeatureCard = ({ item, index }) => {
  const controls = useAnimation();

  useEffect(() => {
    // Initial animation on mount
    controls.start({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 + index * 0.2, duration: 0.6 },
    });
  }, [controls, index]);

  const handleHoverStart = () => {
    controls.start({
      rotateZ: [0, 5, -5, 5, -5, 0],
      scale: 1.07,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    });
  };

  const handleHoverEnd = () => {
    controls.start({
      rotateZ: 0,
      scale: 1,
      transition: { duration: 0.4 },
    });
  };

  return (
    <motion.div
      key={item.title}
      className="relative bg-white rounded-2xl shadow-xl p-8 text-center group transition-all duration-300 overflow-hidden hover:shadow-indigo-300"
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">
        {item.icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-indigo-800">
        {item.title}
      </h3>
      <p className="text-gray-600">{item.desc}</p>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition duration-500 pointer-events-none"></div>
    </motion.div>
  );
};

export default FeatureCard;
