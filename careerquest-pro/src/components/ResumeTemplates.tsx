import React from 'react';
import { ResumeData } from '../types';
import { logoImg } from './Logo';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Award, Briefcase, GraduationCap, Code, CheckCircle2 } from 'lucide-react';

interface ResumeTemplatesProps {
  data: ResumeData;
  printRef?: React.RefObject<HTMLDivElement | null>;
}

export const ResumeTemplateView: React.FC<ResumeTemplatesProps> = ({ data, printRef }) => {
  const { templateId } = data;

  if (templateId === 'vibrant-tech') {
    return (
      <div ref={printRef} className="print-resume-container relative overflow-hidden bg-white text-slate-800 p-8 shadow-md rounded-xl max-w-[800px] mx-auto border border-slate-200 print:shadow-none print:p-0 print:border-none print:max-w-none text-sm">
        {/* Subtle Watermark Background Logo */}
        <div className="absolute right-4 bottom-4 w-64 h-64 opacity-[0.03] pointer-events-none select-none">
          <img src={logoImg} alt="" className="w-full h-full object-contain filter grayscale" referrerPolicy="no-referrer" />
        </div>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 text-white p-6 rounded-lg mb-6 print:rounded-none relative z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-1">{data.fullName || 'Your Name'}</h1>
          <p className="text-indigo-100 font-medium text-base mb-4">{data.targetRole || 'Target Role'}</p>
          
          <div className="flex flex-wrap gap-4 text-xs text-indigo-100">
            {data.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-300" />{data.email}</span>}
            {data.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-300" />{data.phone}</span>}
            {data.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-300" />{data.location}</span>}
            {data.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5 text-emerald-300" />{data.linkedin}</span>}
            {data.github && <span className="flex items-center gap-1.5"><Github className="w-3.5 h-3.5 text-emerald-300" />{data.github}</span>}
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              Professional Profile
            </h2>
            <p className="text-slate-600 leading-relaxed">{data.summary}</p>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Core Technical Skills
            </h2>
            <div className="space-y-2">
              {data.skills.map((cat, idx) => (
                <div key={cat.id || idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-xs font-semibold text-slate-900 mr-2">{cat.category}:</span>
                  <div className="inline-flex flex-wrap gap-1.5 mt-1">
                    {cat.items.map((item, i) => (
                      <span key={i} className="bg-white text-indigo-700 px-2 py-0.5 rounded text-xs font-medium border border-indigo-100 shadow-2xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-600"></span>
              Work Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-indigo-200 pl-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-900 text-base">{exp.role}</h3>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="text-xs font-medium text-emerald-600 mb-2">{exp.company} • {exp.location}</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs leading-relaxed">
                    {exp.highlights.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Key Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.projects.map((proj) => (
                <div key={proj.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 text-xs mb-1 flex justify-between items-center">
                    <span>{proj.title}</span>
                    {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline text-[10px]">Link</a>}
                  </div>
                  <p className="text-slate-600 text-[11px] mb-2">{proj.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {proj.techStack.map((tech, t) => (
                      <span key={t} className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
          {data.education && data.education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Education</h2>
              {data.education.map((edu) => (
                <div key={edu.id} className="text-xs mb-2">
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-600">{edu.institution} | {edu.year}</div>
                  {edu.gpa && <div className="text-emerald-600 font-medium">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          )}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Certifications</h2>
              <ul className="space-y-1">
                {data.certifications.map((cert, c) => (
                  <li key={c} className="text-xs text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (templateId === 'executive-serif') {
    return (
      <div ref={printRef} className="print-resume-container relative overflow-hidden bg-white text-slate-900 p-8 shadow-md rounded-xl max-w-[800px] mx-auto border border-slate-200 print:shadow-none print:p-0 print:border-none print:max-w-none text-sm font-serif">
        {/* Subtle Watermark Background Logo */}
        <div className="absolute right-4 bottom-4 w-64 h-64 opacity-[0.03] pointer-events-none select-none">
          <img src={logoImg} alt="" className="w-full h-full object-contain filter grayscale" referrerPolicy="no-referrer" />
        </div>
        {/* Header */}
        <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight uppercase mb-1">{data.fullName || 'Your Name'}</h1>
          <p className="text-slate-700 font-medium text-base italic mb-3">{data.targetRole || 'Target Role'}</p>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-600 font-sans">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>• {data.phone}</span>}
            {data.location && <span>• {data.location}</span>}
            {data.linkedin && <span>• {data.linkedin}</span>}
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-6">
            <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">Executive Summary</h2>
            <p className="text-slate-800 leading-relaxed text-xs">{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-3">Professional Experience</h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-slate-900 text-sm">{exp.role} <span className="font-normal italic text-slate-700">— {exp.company}</span></h3>
                    <span className="text-xs font-sans text-slate-600">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-sans italic mb-1.5">{exp.location}</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-800 text-xs">
                    {exp.highlights.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">Skills & Expertise</h2>
            <div className="space-y-1 text-xs">
              {data.skills.map((cat, idx) => (
                <div key={cat.id || idx}>
                  <span className="font-bold">{cat.category}: </span>
                  <span className="text-slate-800 font-sans">{cat.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certs */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-300 pt-3">
          {data.education && data.education.length > 0 && (
            <div>
              <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 mb-2">Education</h2>
              {data.education.map((edu) => (
                <div key={edu.id} className="text-xs mb-1">
                  <div className="font-bold">{edu.degree}</div>
                  <div className="text-slate-700">{edu.institution}, {edu.year}</div>
                </div>
              ))}
            </div>
          )}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 mb-2">Certifications</h2>
              <ul className="list-disc list-inside text-xs text-slate-800">
                {data.certifications.map((cert, c) => (
                  <li key={c}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: Modern Clean (Bright Indigo Theme)
  return (
    <div ref={printRef} className="print-resume-container relative overflow-hidden bg-white text-slate-800 p-8 shadow-md rounded-xl max-w-[800px] mx-auto border border-slate-200 print:shadow-none print:p-0 print:border-none print:max-w-none text-sm">
      {/* Subtle Watermark Background Logo */}
      <div className="absolute right-4 bottom-4 w-64 h-64 opacity-[0.03] pointer-events-none select-none">
        <img src={logoImg} alt="" className="w-full h-full object-contain filter grayscale" referrerPolicy="no-referrer" />
      </div>
      {/* Header */}
      <div className="border-b-2 border-indigo-600 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{data.fullName || 'Your Name'}</h1>
            <p className="text-indigo-600 font-semibold text-base mt-0.5">{data.targetRole || 'Target Role'}</p>
          </div>
          <div className="text-right text-xs text-slate-600 space-y-1">
            {data.email && <div className="flex items-center justify-end gap-1"><Mail className="w-3.5 h-3.5 text-indigo-500" />{data.email}</div>}
            {data.phone && <div className="flex items-center justify-end gap-1"><Phone className="w-3.5 h-3.5 text-indigo-500" />{data.phone}</div>}
            {data.location && <div className="flex items-center justify-end gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-500" />{data.location}</div>}
          </div>
        </div>
        
        {(data.linkedin || data.github) && (
          <div className="flex gap-4 text-xs text-indigo-600 font-medium mt-2">
            {data.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{data.linkedin}</span>}
            {data.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" />{data.github}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded w-fit mb-2">Summary</h2>
          <p className="text-slate-600 leading-relaxed text-xs">{data.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded w-fit mb-3">Professional Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900 text-sm">{exp.role}</h3>
                  <span className="text-xs font-medium text-slate-500">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-xs font-semibold text-indigo-600 mb-1">{exp.company} <span className="text-slate-400 font-normal">| {exp.location}</span></div>
                <ul className="list-disc list-outside ml-4 space-y-1 text-slate-600 text-xs leading-relaxed">
                  {exp.highlights.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded w-fit mb-2">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {data.skills.map((cat, idx) => (
              <div key={cat.id || idx} className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="font-bold text-slate-900">{cat.category}: </span>
                <span className="text-slate-600">{cat.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded w-fit mb-2">Projects</h2>
          <div className="space-y-2">
            {data.projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>{proj.title} <span className="font-normal text-slate-500">({proj.techStack.join(', ')})</span></span>
                  {proj.link && <span className="text-indigo-600 text-[11px] font-normal">{proj.link}</span>}
                </div>
                <p className="text-slate-600 mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certs */}
      <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="text-xs mb-1">
                <div className="font-bold text-slate-900">{edu.degree}</div>
                <div className="text-slate-600">{edu.institution} ({edu.year})</div>
              </div>
            ))}
          </div>
        )}
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">Certifications</h2>
            <ul className="list-disc list-inside text-xs text-slate-600">
              {data.certifications.map((cert, c) => (
                <li key={c}>{cert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
