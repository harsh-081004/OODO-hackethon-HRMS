import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

const SERVICE_OPTIONS = ['Brand', 'Digital', 'Campaign', 'Other'];

export const ServicePills = () => {
  const [services, setServices] = useState([]);

  const toggleService = (service) => {
    setServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  return (
    <div className="w-full">
      {/* Title & Subtitle */}
      <h2 className="text-2xl font-medium tracking-tight mb-2">
        What sort of service?
      </h2>
      <p className="opacity-85 text-[#738273] mb-8">
        Select all that apply
      </p>

      {/* Multi-Select Pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        {SERVICE_OPTIONS.map((service) => {
          const isSelected = services.includes(service);

          return (
            <motion.button
              key={service}
              type="button"
              onClick={() => toggleService(service)}
              whileTap={{ scale: 0.96 }}
              className={`px-6 py-3 rounded-full text-base sm:text-lg font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer select-none ${
                isSelected
                  ? 'bg-[#1C2E1E] text-white shadow-md shadow-emerald-950/5 transform'
                  : 'bg-white text-[#1C2E1E] border border-[#F1F3F1] hover:bg-[#F1F3F1]/55'
              }`}
            >
              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0, y: -4 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="inline-flex"
                  >
                    <Check size={18} strokeWidth={2.5} />
                  </motion.span>
                )}
              </AnimatePresence>
              <span>{service}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Contingent Feedback Status Banner */}
      <AnimatePresence mode="wait">
        {services.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="italic text-xs text-[#738273]"
          >
            Please click to select services above.
          </motion.p>
        ) : (
          <motion.div
            key="active"
            initial={{ opacity: 0, height: 0, y: 8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="overflow-hidden"
          >
            <div className="bg-[#FAFBF9] border border-[#EAECE9] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-xl shadow-sm">
              <div className="text-sm sm:text-base text-neutral-800">
                Ready to inquire about:{' '}
                <strong className="text-[#1C2E1E] font-semibold">
                  {services.join(', ')}
                </strong>
              </div>

              <a
                href="#contact"
                className="text-[#4D6D47] uppercase text-xs font-bold tracking-wider hover:opacity-80 transition-opacity flex items-center gap-1.5 cursor-pointer bg-white px-4 py-2 rounded-full border border-[#EAECE9] shadow-xs"
              >
                <span>Let's Go</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
