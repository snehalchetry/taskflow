'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Rocket, ExternalLink, Github } from 'lucide-react';
import { useState } from 'react';
import { PortfolioData, Project } from '@/lib/portfolio-types';

interface Props {
  data: PortfolioData;
  updateData: (updates: Partial<PortfolioData>) => void;
}

export function ProjectsStep({ data, updateData }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    techStack: [],
    liveLink: '',
    githubLink: '',
  });
  const [techInput, setTechInput] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      techStack: [],
      liveLink: '',
      githubLink: '',
    });
    setTechInput('');
    setEditingProject(null);
    setShowForm(false);
  };

  const startEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      liveLink: project.liveLink,
      githubLink: project.githubLink,
    });
    setShowForm(true);
  };

  const addTech = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== tech),
    }));
  };

  const saveProject = () => {
    if (formData.title.trim()) {
      if (editingProject) {
        updateData({
          projects: data.projects.map((p) =>
            p.id === editingProject.id ? { ...p, ...formData } : p
          ),
        });
      } else {
        const project: Project = {
          id: Date.now().toString(),
          ...formData,
        };
        updateData({ projects: [...data.projects, project] });
      }
      resetForm();
    }
  };

  const deleteProject = (id: string) => {
    updateData({ projects: data.projects.filter((p) => p.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1 font-['Be_Vietnam_Pro']">
          Your Projects
        </h2>
        <p className="text-white/40 text-sm">
          Showcase your best work
        </p>
      </div>

      {/* Add Project Button / Form */}
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.button
            key="add-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(true)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full p-6 rounded-xl border-2 border-dashed border-white/10 text-white/40 hover:border-[#26d9d9]/30 hover:text-white/60 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Project
          </motion.button>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h3>
              <motion.button
                onClick={resetForm}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/50">Project Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="My Awesome App"
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#26d9d9]/50 transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/50">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="A brief description of your project..."
                rows={3}
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#26d9d9]/50 transition-all resize-none"
              />
            </div>

            {/* Tech Stack */}
            <div className="space-y-2">
              <label className="text-xs text-white/50">Tech Stack</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.techStack.map((tech) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-[#26d9d9]/10 text-[#26d9d9] rounded-md border border-[#26d9d9]/20"
                  >
                    {tech}
                    <button
                      onClick={() => removeTech(tech)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  placeholder="React, TypeScript..."
                  className="flex-1 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#26d9d9]/50 transition-all"
                />
                <motion.button
                  onClick={addTech}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-white/5 text-white/70 rounded-lg text-sm hover:bg-white/10 transition-all"
                >
                  Add
                </motion.button>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-white/50 flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3" />
                  Live Link
                </label>
                <input
                  type="url"
                  value={formData.liveLink}
                  onChange={(e) => setFormData((prev) => ({ ...prev, liveLink: e.target.value }))}
                  placeholder="https://myapp.com"
                  className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#26d9d9]/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/50 flex items-center gap-1.5">
                  <Github className="w-3 h-3" />
                  GitHub Link
                </label>
                <input
                  type="url"
                  value={formData.githubLink}
                  onChange={(e) => setFormData((prev) => ({ ...prev, githubLink: e.target.value }))}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#26d9d9]/50 transition-all"
                />
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              onClick={saveProject}
              disabled={!formData.title.trim()}
              whileHover={{ scale: formData.title.trim() ? 1.02 : 1 }}
              whileTap={{ scale: formData.title.trim() ? 0.98 : 1 }}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                formData.title.trim()
                  ? 'bg-[#26d9d9] text-[#050a0a] font-bold'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              {editingProject ? 'Update Project' : 'Add Project'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      <div className="space-y-3">
        <AnimatePresence>
          {data.projects.length === 0 && !showForm ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                <Rocket className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-white/30 text-sm">No projects added yet</p>
              <p className="text-white/20 text-xs mt-1">Click above to add your first project</p>
            </motion.div>
          ) : (
            data.projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="group p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#26d9d9]/20 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium mb-1">{project.title}</h4>
                    <p className="text-white/40 text-sm line-clamp-2 mb-3">
                      {project.description || 'No description'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.techStack.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-xs bg-[#26d9d9]/10 text-[#26d9d9] rounded border border-[#26d9d9]/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 5 && (
                        <span className="px-2 py-0.5 text-xs bg-white/5 text-white/40 rounded">
                          +{project.techStack.length - 5} more
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#26d9d9] hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Live
                        </a>
                      )}
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/50 hover:text-white hover:underline flex items-center gap-1"
                        >
                          <Github className="w-3 h-3" />
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      onClick={() => startEdit(project)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.718 3.036z" />
                      </svg>
                    </motion.button>
                    <motion.button
                      onClick={() => deleteProject(project.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}