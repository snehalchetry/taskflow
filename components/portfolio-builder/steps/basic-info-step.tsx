'use client';

import { motion } from 'framer-motion';
import { User, FileText, Image } from 'lucide-react';
import { PortfolioData } from '@/lib/portfolio-types';

interface Props {
  data: PortfolioData;
  updateData: (updates: Partial<PortfolioData>) => void;
}

export function BasicInfoStep({ data, updateData }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1 font-['Be_Vietnam_Pro']">
          Tell us about yourself
        </h2>
        <p className="text-white/40 text-sm">
          Start with the basics - your name and a short bio
        </p>
      </div>

      {/* Name Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <label className="flex items-center gap-2 text-sm font-medium text-white/70">
          <User className="w-4 h-4 text-[#26d9d9]" />
          Full Name *
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          placeholder="John Doe"
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#26d9d9]/50 focus:bg-white/[0.05] transition-all"
        />
        {data.name.trim() === '' && (
          <p className="text-xs text-red-400/70">Name is required</p>
        )}
      </motion.div>

      {/* Bio Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <label className="flex items-center gap-2 text-sm font-medium text-white/70">
          <FileText className="w-4 h-4 text-[#26d9d9]" />
          Bio
        </label>
        <textarea
          value={data.bio}
          onChange={(e) => updateData({ bio: e.target.value })}
          placeholder="Passionate full-stack developer with 5 years of experience building modern web applications..."
          rows={4}
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#26d9d9]/50 focus:bg-white/[0.05] transition-all resize-none"
        />
        <p className="text-xs text-white/30">{data.bio.length} characters</p>
      </motion.div>

      {/* Avatar URL Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <label className="flex items-center gap-2 text-sm font-medium text-white/70">
          <Image className="w-4 h-4 text-[#26d9d9]" />
          Avatar URL
        </label>
        <input
          type="url"
          value={data.avatar}
          onChange={(e) => updateData({ avatar: e.target.value })}
          placeholder="https://example.com/avatar.jpg"
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#26d9d9]/50 focus:bg-white/[0.05] transition-all"
        />
        {data.avatar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 flex items-center gap-3"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#26d9d9]/30">
              <img
                src={data.avatar}
                alt="Avatar preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23050a0a" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2326d9d9" font-size="40">?</text></svg>';
                }}
              />
            </div>
            <p className="text-xs text-white/40">Preview</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}