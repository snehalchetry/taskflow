'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Link2 } from 'lucide-react';
import { PortfolioData } from '@/lib/portfolio-types';

interface Props {
  data: PortfolioData;
  updateData: (updates: Partial<PortfolioData>) => void;
}

export function SocialsStep({ data, updateData }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1 font-['Be_Vietnam_Pro']">
          Social Links
        </h2>
        <p className="text-white/40 text-sm">
          Connect your social profiles
        </p>
      </div>

      {/* GitHub */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <label className="flex items-center gap-2 text-sm font-medium text-white/70">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <Github className="w-4 h-4 text-white/60" />
          </div>
          GitHub
        </label>
        <input
          type="url"
          value={data.socialLinks.github}
          onChange={(e) =>
            updateData({
              socialLinks: { ...data.socialLinks, github: e.target.value },
            })
          }
          placeholder="https://github.com/username"
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#26d9d9]/50 focus:bg-white/[0.05] transition-all"
        />
      </motion.div>

      {/* LinkedIn */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <label className="flex items-center gap-2 text-sm font-medium text-white/70">
          <div className="w-8 h-8 rounded-lg bg-[#0077b5]/20 flex items-center justify-center">
            <Linkedin className="w-4 h-4 text-[#0077b5]" />
          </div>
          LinkedIn
        </label>
        <input
          type="url"
          value={data.socialLinks.linkedin}
          onChange={(e) =>
            updateData({
              socialLinks: { ...data.socialLinks, linkedin: e.target.value },
            })
          }
          placeholder="https://linkedin.com/in/username"
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#26d9d9]/50 focus:bg-white/[0.05] transition-all"
        />
      </motion.div>

      {/* Twitter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <label className="flex items-center gap-2 text-sm font-medium text-white/70">
          <div className="w-8 h-8 rounded-lg bg-[#1da1f2]/20 flex items-center justify-center">
            <Twitter className="w-4 h-4 text-[#1da1f2]" />
          </div>
          Twitter / X
        </label>
        <input
          type="url"
          value={data.socialLinks.twitter}
          onChange={(e) =>
            updateData({
              socialLinks: { ...data.socialLinks, twitter: e.target.value },
            })
          }
          placeholder="https://twitter.com/username"
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#26d9d9]/50 focus:bg-white/[0.05] transition-all"
        />
      </motion.div>

      {/* Preview Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="pt-6 border-t border-white/5"
      >
        <p className="text-xs text-white/30 mb-4">Preview</p>
        <div className="flex flex-wrap gap-3">
          {data.socialLinks.github && (
            <motion.a
              href={data.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:border-[#26d9d9]/30 transition-all"
            >
              <Github className="w-4 h-4" />
              GitHub
            </motion.a>
          )}
          {data.socialLinks.linkedin && (
            <motion.a
              href={data.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:border-[#0077b5]/50 transition-all"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </motion.a>
          )}
          {data.socialLinks.twitter && (
            <motion.a
              href={data.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:border-[#1da1f2]/50 transition-all"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </motion.a>
          )}
          {!data.socialLinks.github && !data.socialLinks.linkedin && !data.socialLinks.twitter && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-white/30">
              <Link2 className="w-4 h-4" />
              Add links above to preview
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}