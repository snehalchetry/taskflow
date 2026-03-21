'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Eye, Code2, Sparkles } from 'lucide-react';
import { PortfolioData, defaultPortfolioData } from '@/lib/portfolio-types';
import { downloadPortfolio } from '@/lib/export-portfolio';
import { BasicInfoStep } from './steps/basic-info-step';
import { SkillsStep } from './steps/skills-step';
import { ProjectsStep } from './steps/projects-step';
import { SocialsStep } from './steps/socials-step';
import { ThemeStep } from './steps/theme-step';
import { LivePreview } from './live-preview';

const steps = [
  { id: 'basic', label: 'Basic Info', icon: '👤' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'projects', label: 'Projects', icon: '🚀' },
  { id: 'socials', label: 'Social Links', icon: '🔗' },
  { id: 'theme', label: 'Theme', icon: '🎨' },
];

export function PortfolioBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [showPreview, setShowPreview] = useState(false);

  const updateData = (updates: Partial<PortfolioData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleExport = () => {
    downloadPortfolio(data);
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 0:
        return data.name.trim().length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-[#050a0a]">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(38, 217, 217, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(38, 217, 217, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#26d9d9]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Form Panel */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#26d9d9] to-[#1ab3b3] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#050a0a]" />
              </div>
              <h1 className="text-2xl font-bold text-white font-['Be_Vietnam_Pro']">Portfolio Builder</h1>
            </div>
            <p className="text-white/40 text-sm">Create your developer portfolio in minutes</p>
          </motion.div>

          {/* Step Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-8 overflow-x-auto pb-2"
          >
            {steps.map((step, index) => (
              <motion.button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  currentStep === index
                    ? 'bg-[#26d9d9]/10 text-[#26d9d9] border border-[#26d9d9]/30'
                    : index < currentStep
                    ? 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                    : 'bg-white/[0.02] text-white/30 border border-white/5'
                }`}
              >
                <span className="text-base">{step.icon}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Form Content */}
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {currentStep === 0 && (
                  <BasicInfoStep data={data} updateData={updateData} />
                )}
                {currentStep === 1 && (
                  <SkillsStep data={data} updateData={updateData} />
                )}
                {currentStep === 2 && (
                  <ProjectsStep data={data} updateData={updateData} />
                )}
                {currentStep === 3 && (
                  <SocialsStep data={data} updateData={updateData} />
                )}
                {currentStep === 4 && (
                  <ThemeStep data={data} updateData={updateData} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mt-8 pt-6 border-t border-white/5"
          >
            <motion.button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              whileHover={{ scale: currentStep === 0 ? 1 : 1.02 }}
              whileTap={{ scale: currentStep === 0 ? 1 : 0.98 }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentStep === 0
                  ? 'opacity-30 cursor-not-allowed'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </motion.button>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setShowPreview(!showPreview)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all lg:hidden ${
                  showPreview
                    ? 'bg-[#26d9d9]/10 text-[#26d9d9] border border-[#26d9d9]/30'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide' : 'Preview'}
              </motion.button>

              {currentStep === steps.length - 1 ? (
                <motion.button
                  onClick={handleExport}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#26d9d9] to-[#1ab3b3] text-[#050a0a] shadow-lg shadow-[#26d9d9]/20 hover:shadow-[#26d9d9]/30 transition-shadow"
                >
                  <Download className="w-4 h-4" />
                  Export HTML
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={!canGoNext()}
                  whileHover={{ scale: canGoNext() ? 1.02 : 1 }}
                  whileTap={{ scale: canGoNext() ? 0.98 : 1 }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    canGoNext()
                      ? 'bg-[#26d9d9] text-[#050a0a] font-bold shadow-lg shadow-[#26d9d9]/20 hover:shadow-[#26d9d9]/30'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Preview Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`w-full lg:w-1/2 border-l border-white/5 bg-[#030808] ${
            showPreview ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="h-full overflow-auto">
            <div className="sticky top-0 bg-[#030808]/90 backdrop-blur-sm border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Code2 className="w-4 h-4" />
                Live Preview
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <div className="w-2 h-2 rounded-full bg-[#26d9d9] animate-pulse" />
                Auto-updating
              </div>
            </div>
            <LivePreview data={data} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}