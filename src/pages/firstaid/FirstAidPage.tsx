import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Search,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldAlert,
  Flame,
  Activity,
  Droplet,
  Sun,
  EyeOff,
  PhoneCall,
  Info,
} from 'lucide-react';
import { FIRST_AID_TOPICS } from '../../data/demoData';
import { FirstAidTopic } from '../../types';

export const FirstAidPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(FIRST_AID_TOPICS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(FIRST_AID_TOPICS.map((t) => t.category)))];

  const filteredTopics = FIRST_AID_TOPICS.filter((t) => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchSummary = t.summary.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary) return false;
    }
    return true;
  });

  const activeTopic =
    FIRST_AID_TOPICS.find((t) => t.id === selectedTopicId) || filteredTopics[0] || FIRST_AID_TOPICS[0];

  const getTopicIcon = (id: string) => {
    switch (id) {
      case 'minor_cuts':
        return Activity;
      case 'minor_burns':
        return Flame;
      case 'sprains_strains':
        return Activity;
      case 'nosebleeds':
        return Droplet;
      case 'heat_exhaustion':
        return Sun;
      case 'fainting':
        return EyeOff;
      case 'choking':
        return ShieldAlert;
      case 'severe_bleeding':
        return AlertOctagon;
      default:
        return HeartPulse;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-medblue uppercase tracking-wider">
              EDUCATIONAL HEALTH HUB
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-medteal-50 text-medteal font-semibold border border-medteal/20">
              Verified Evidence-Based Protocol
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-navy tracking-tight mt-1">
            First-Aid Reference & Educational Guide
          </h1>
          <p className="text-xs sm:text-sm text-mutedgrey mt-0.5">
            Immediate stabilizing steps, what to avoid, and precise red-flag triggers for professional emergency intervention.
          </p>
        </div>

        <Link
          to="/emergency"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emergency text-white font-bold text-xs shadow-sm hover:bg-red-700 transition-colors self-start md:self-auto"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call 112 / Emergency</span>
        </Link>
      </div>

      {/* Mandatory Clinical Disclaimer Banner */}
      <div className="bg-amber-500/10 border border-amberwarn/40 rounded-2xl p-4 sm:p-5 text-xs text-amber-950 flex items-start gap-3.5">
        <AlertOctagon className="w-5 h-5 text-amberwarn shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold text-navy">IMPORTANT MEDICAL DISCLAIMER:</strong>
          <p className="leading-relaxed text-slate-700">
            This module provides general educational guidance curated from recognized public health authorities (Red Cross, WHO, NHS, AHA). It <strong>does not provide medical diagnosis</strong>, does not prescribe pharmaceutical medications, and is never a substitute for qualified professional medical attention. In severe or doubtful cases, always dial <strong>112</strong> or visit the Campus Central Medical Centre immediately.
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Topic Index & Search */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-mutedgrey" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topics (e.g. burn, choking, bleed)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white text-navy text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-medblue"
            />
          </div>

          {/* Topic List */}
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
            {filteredTopics.map((topic) => {
              const Icon = getTopicIcon(topic.id);
              const isSelected = activeTopic.id === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`w-full p-3.5 text-left flex items-center justify-between gap-3 transition-colors ${
                    isSelected ? 'bg-medblue-50/80 border-l-4 border-medblue' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        topic.urgency === 'high'
                          ? 'bg-red-50 text-emergency'
                          : topic.urgency === 'medium'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-medteal-50 text-medteal'
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-navy truncate">{topic.title}</div>
                      <div className="text-[10px] text-mutedgrey">{topic.category}</div>
                    </div>
                  </div>
                  {topic.urgency === 'high' && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-100 text-emergency">
                      Critical
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Topic Reader */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Topic Header */}
            <div className="space-y-2 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-medblue">
                  {activeTopic.category}
                </span>
                <span className="text-xs text-mutedgrey">•</span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    activeTopic.urgency === 'high'
                      ? 'bg-red-100 text-emergency'
                      : activeTopic.urgency === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-mint text-emerald-800'
                  }`}
                >
                  {activeTopic.urgency} Urgency
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-navy">{activeTopic.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {activeTopic.summary}
              </p>
            </div>

            {/* 1. Immediate Steps (DO THIS) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-medteal" />
                <span>Immediate Recommended Actions</span>
              </h3>
              <div className="space-y-2">
                {activeTopic.immediate_steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-medteal text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. What NOT To Do (DANGEROUS MISTAKES) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                <XCircle className="w-4 h-4 text-emergency" />
                <span>What NOT To Do</span>
              </h3>
              <div className="space-y-2">
                {activeTopic.do_nots.map((dont, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-red-50/50 border border-red-200/60 text-xs text-slate-800 flex items-start gap-2.5"
                  >
                    <XCircle className="w-4 h-4 text-emergency shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{dont}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Red Flags — When to Seek ER */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amberwarn" />
                <span>When to Seek Immediate Emergency Attention</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-800">
                {activeTopic.when_to_seek_er.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amberwarn shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Verified Sources Citations */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-navy">Evidence Sources:</span>
                {activeTopic.verified_sources.map((src) => (
                  <a
                    key={src.name}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-medblue hover:underline bg-slate-100 px-2.5 py-1 rounded-md text-[11px]"
                  >
                    <span>{src.name}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

