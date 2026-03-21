'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Zap, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { PortfolioData, Skill, SkillLevel, skillLevelColors } from '@/lib/portfolio-types';

interface Props {
  data: PortfolioData;
  updateData: (updates: Partial<PortfolioData>) => void;
}

export function SkillsStep({ data, updateData }: Props) {
  const [newSkill, setNewSkill] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('intermediate');

  const addSkill = () => {
    if (newSkill.trim()) {
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.trim(),
        level: newSkillLevel,
      };
      updateData({ skills: [...data.skills, skill] });
      setNewSkill('');
      setNewSkillLevel('intermediate');
    }
  };

  const removeSkill = (id: string) => {
    updateData({ skills: data.skills.filter((s) => s.id !== id) });
  };

  const updateSkillLevel = (id: string, level: SkillLevel) => {
    updateData({
      skills: data.skills.map((s) => (s.id === id ? { ...s, level } : s)),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1 font-['Be_Vietnam_Pro']">
          Your Skills
        </h2>
        <p className="text-white/40 text-sm">
          Add your technical skills and proficiency level
        </p>
      </div>

      {/* Add Skill Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              placeholder="React, TypeScript, Node.js..."
              className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#26d9d9]/50 transition-all text-sm"
            />
          </div>
          <div className="relative">
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
              className="appearance-none px-4 py-2.5 pr-10 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#26d9d9]/50 transition-all text-sm cursor-pointer"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
          <motion.button
            onClick={addSkill}
            disabled={!newSkill.trim()}
            whileHover={{ scale: newSkill.trim() ? 1.02 : 1 }}
            whileTap={{ scale: newSkill.trim() ? 0.98 : 1 }}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              newSkill.trim()
                ? 'bg-[#26d9d9] text-[#050a0a] font-bold'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add
          </motion.button>
        </div>
      </motion.div>

      {/* Skills List */}
      <div className="space-y-2">
        <AnimatePresence>
          {data.skills.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                <Zap className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-white/30 text-sm">No skills added yet</p>
              <p className="text-white/20 text-xs mt-1">Start adding your technical skills above</p>
            </motion.div>
          ) : (
            data.skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#26d9d9]/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: skillLevelColors[skill.level].text,
                    }}
                  />
                  <span className="text-white font-medium">{skill.name}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: skillLevelColors[skill.level].bg,
                      color: skillLevelColors[skill.level].text,
                      border: `1px solid ${skillLevelColors[skill.level].border}`,
                    }}
                  >
                    {skill.level}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkillLevel(skill.id, e.target.value as SkillLevel)}
                    className="appearance-none bg-transparent text-xs text-white/40 focus:outline-none cursor-pointer"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                  <motion.button
                    onClick={() => removeSkill(skill.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Quick Add Suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="pt-4 border-t border-white/5"
      >
        <p className="text-xs text-white/30 mb-3">Quick add popular skills:</p>
        <div className="flex flex-wrap gap-2">
          {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'].map((skill) => (
            <motion.button
              key={skill}
              onClick={() => {
                if (!data.skills.some((s) => s.name.toLowerCase() === skill.toLowerCase())) {
                  updateData({
                    skills: [
                      ...data.skills,
                      { id: Date.now().toString(), name: skill, level: 'intermediate' },
                    ],
                  });
                }
              }}
              disabled={data.skills.some((s) => s.name.toLowerCase() === skill.toLowerCase())}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                data.skills.some((s) => s.name.toLowerCase() === skill.toLowerCase())
                  ? 'bg-white/5 text-white/20 cursor-not-allowed'
                  : 'bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white/70 border border-white/5'
              }`}
            >
              + {skill}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}