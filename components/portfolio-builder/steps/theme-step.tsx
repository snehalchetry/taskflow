'use client';

import { motion } from 'framer-motion';
import { Palette, Sparkles, Box } from 'lucide-react';
import { PortfolioData } from '@/lib/portfolio-types';

interface Props {
  data: PortfolioData;
  updateData: (updates: Partial<PortfolioData>) => void;
}

const themes = [
  {
    id: 'minimal' as const,
    name: 'Minimal',
    description: 'Clean and simple design',
    icon: Box,
    preview: {
      bg: '#0d1212',
      card: 'linear-gradient(135deg, #0f1818 0%, #0d1212 100%)',
      accent: '#26d9d9',
    },
  },
  {
    id: 'glassmorphism' as const,
    name: 'Glassmorphism',
    description: 'Frosted glass with depth',
    icon: Sparkles,
    preview: {
      bg: 'linear-gradient(135deg, rgba(10, 18, 18, 0.95), rgba(15, 28, 28, 0.95))',
      card: 'linear-gradient(135deg, rgba(10, 18, 18, 0.95), rgba(15, 28, 28, 0.95))',
      accent: '#26d9d9',
    },
  },
  {
    id: 'brutalist' as const,
    name: 'Brutalist',
    description: 'Bold and raw aesthetic',
    icon: Palette,
    preview: {
      bg: '#050a0a',
      card: '#0a0f0f',
      accent: '#26d9d9',
    },
  },
];

export function ThemeStep({ data, updateData }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1 font-['Be_Vietnam_Pro']">
          Choose Your Theme
        </h2>
        <p className="text-white/40 text-sm">
          Select a visual style for your portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {themes.map((theme, index) => (
          <motion.button
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => updateData({ theme: theme.id })}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
              data.theme === theme.id
                ? 'border-[#26d9d9] shadow-lg shadow-[#26d9d9]/10'
                : 'border-white/10 hover:border-white/20'
            }`}
            style={{ background: theme.preview.bg }}
          >
            {/* Selected indicator */}
            {data.theme === theme.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#26d9d9] flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-[#050a0a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}

            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
              data.theme === theme.id
                ? 'bg-[#26d9d9]/20'
                : 'bg-white/5'
            }`}>
              <theme.icon className={`w-6 h-6 ${
                data.theme === theme.id ? 'text-[#26d9d9]' : 'text-white/60'
              }`} />
            </div>

            {/* Name */}
            <h3 className={`font-semibold mb-1 font-['Be_Vietnam_Pro'] ${
              data.theme === theme.id ? 'text-[#26d9d9]' : 'text-white'
            }`}>
              {theme.name}
            </h3>

            {/* Description */}
            <p className="text-white/40 text-xs">{theme.description}</p>

            {/* Mini Preview */}
            <div className="mt-4 space-y-2">
              <div
                className="h-2 w-16 rounded-full"
                style={{ background: `linear-gradient(90deg, ${theme.preview.accent}, transparent)` }}
              />
              <div className="flex gap-1.5">
                <div
                  className="h-8 w-12 rounded-md"
                  style={{ background: theme.preview.card }}
                />
                <div
                  className="h-8 w-12 rounded-md"
                  style={{ background: theme.preview.card }}
                />
                <div
                  className="h-8 w-12 rounded-md"
                  style={{ background: theme.preview.card }}
                />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Theme Details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-5 rounded-xl bg-white/[0.02] border border-white/5"
      >
        <h4 className="text-sm font-medium text-white mb-3">Theme Details</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-white/40 mb-1">Background</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#050a0a] border border-white/10" />
              <code className="text-xs text-white/60">#050a0a</code>
            </div>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Accent</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#26d9d9]" />
              <code className="text-xs text-white/60">#26d9d9</code>
            </div>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Headings</p>
            <p className="text-sm text-white font-['Be_Vietnam_Pro']">Be Vietnam Pro</p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Body</p>
            <p className="text-sm text-white font-['Public_Sans']">Public Sans</p>
          </div>
        </div>
      </motion.div>

      {/* Ready message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center py-6"
      >
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#26d9d9]/10 border border-[#26d9d9]/20 text-[#26d9d9] text-sm">
          <Sparkles className="w-4 h-4" />
          Ready to export your portfolio!
        </div>
      </motion.div>
    </div>
  );
}