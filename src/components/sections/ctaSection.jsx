import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../../Styles/Home.css";

const ctaSection = () => {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Ready to Make <span className="gradient-text-green-blue">Smarter Decisions</span>?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Join thousands of smart shoppers who compare before they buy.
        </motion.p>
        <Link to="/products">
          <motion.button
            className="cta-button"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Shop Now
          </motion.button>
        </Link>
      </div>
    </section>
  );
};

export default ctaSection;
