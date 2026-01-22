import React, { forwardRef, useState, useMemo } from 'react';
import { ResumeData, TemplateType, DocumentType } from '../types';
import { MapPin, Phone, Mail, Linkedin, Globe, ExternalLink } from 'lucide-react';
import { DEFAULT_PHOTO_CONFIG, DEFAULT_NAME_CONFIG } from '../constants';

interface PreviewProps {
  data: ResumeData;
  template: TemplateType;
  type: DocumentType;
  scale: number;
  themeColor: string;
}

// Helper to ensure content has top margin on split pages (Page 2+)
const PrintContentWrapper = ({ children, className = "", topMargin = "20px" }: { children: React.ReactNode, className?: string, topMargin?: string }) => (
  <table className={`w-full border-collapse ${className}`}>
    <thead className="hidden print:table-header-group">
      <tr>
        <td className="p-0 border-0" style={{ height: topMargin, display: 'block' }}></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="p-0 border-0 align-top w-full">
          {children}
        </td>
      </tr>
    </tbody>
  </table>
);

// Helper to normalize skill names to Simple Icons slugs
const getSkillSlug = (name: string): string | null => {
  const clean = name.toLowerCase().trim();
  if (clean.length > 20) return null;

  const aliases: Record<string, string> = {
    'c++': 'cplusplus', 'cpp': 'cplusplus', 'c#': 'csharp', 'csharp': 'csharp',
    '.net': 'dotnet', 'dotnet': 'dotnet', 'vb.net': 'visualbasic', 'golang': 'go',
    'reactjs': 'react', 'react.js': 'react', 'react native': 'react',
    'node.js': 'nodedotjs', 'nodejs': 'nodedotjs', 'angularjs': 'angular',
    'angular.js': 'angular', 'vue.js': 'vuedotjs', 'vuejs': 'vuedotjs',
    'next.js': 'nextdotjs', 'nextjs': 'nextdotjs', 'express.js': 'express',
    'expressjs': 'express', 'aws': 'amazonaws', 'amazon web services': 'amazonaws',
    'gcp': 'googlecloud', 'azure': 'microsoftazure', 'ms azure': 'microsoftazure',
    'flask': 'flask', 'django': 'django', 'ruby on rails': 'rubyonrails',
    'rails': 'rubyonrails', 'postgres': 'postgresql', 'postgresql': 'postgresql',
    'mongo': 'mongodb', 'mssql': 'microsoftsqlserver', 'arduino iot': 'arduino',
    'arduino': 'arduino', 'esp32': 'espressif', 'esp8266': 'espressif',
    'html': 'html5', 'css': 'css3', 'js': 'javascript', 'ts': 'typescript',
    'git': 'git', 'github': 'github', 'gitlab': 'gitlab', 'docker': 'docker',
    'kubernetes': 'kubernetes', 'jenkins': 'jenkins', 'linux': 'linux',
    'ubuntu': 'ubuntu', 'adobe photoshop': 'adobephotoshop', 'photoshop': 'adobephotoshop',
    'adobe illustrator': 'adobeillustrator', 'illustrator': 'adobeillustrator',
    'figma': 'figma', 'tailwind': 'tailwindcss', 'tailwind css': 'tailwindcss',
    'sass': 'sass', 'less': 'less'
  };

  if (aliases[clean]) return aliases[clean];

  const ignoreTerms = [
    'communication', 'leadership', 'teamwork', 'management', 'agile', 'scrum', 'kanban',
    'problem solving', 'critical thinking', 'english', 'spanish', 'french', 'german', 'mandarin',
    'public speaking', 'writing', 'editing', 'research',
    'development', 'programming', 'coding', 'engineering', 'architecture',
    'full stack', 'frontend', 'backend', 'mobile', 'web', 'data science',
    'systems', 'biometrics', 'embedded', 'robotics', 'iot', 'security', 'database'
  ];

  if (ignoreTerms.some(term => clean.includes(term))) {
    return null;
  }

  return clean.replace(/[^a-z0-9]/g, '');
};

const SkillPill = ({ name, color = 'text-slate-700 bg-slate-100 border-slate-200', themeColor }: { name: string, color?: string, themeColor?: string }) => {
  const [error, setError] = useState(false);
  
  const slug = useMemo(() => getSkillSlug(name), [name]);
  const showIcon = !error && slug;
  const iconHex = themeColor ? themeColor.replace('#', '') : '64748b';
  const iconUrl = slug ? `https://cdn.simpleicons.org/${slug}/${iconHex}` : '';

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5 border ${color} break-inside-avoid`}>
      {showIcon && (
        <img 
          src={iconUrl} 
          alt="" 
          className="w-3 h-3 object-contain" 
          onError={() => setError(true)}
        />
      )}
      {name}
    </span>
  );
};

const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ data, template, type, scale, themeColor }, ref) => {
  
  // Helpers
  const photoConfig = data.photoConfig || DEFAULT_PHOTO_CONFIG;
  const nameConfig = data.nameConfig || DEFAULT_NAME_CONFIG;
  
  const getPhotoStyles = (): React.CSSProperties => ({
    width: `${photoConfig.size}px`,
    height: `${photoConfig.size}px`,
    borderRadius: photoConfig.shape === 'circle' ? '50%' : photoConfig.shape === 'rounded' ? '1rem' : '0',
    borderWidth: photoConfig.border ? '4px' : '0',
    borderColor: 'white',
    filter: photoConfig.grayscale ? 'grayscale(100%)' : 'none',
    objectFit: 'cover'
  });
  
  const getNameStyles = (): React.CSSProperties => ({
    fontSize: `${nameConfig.size}px`,
    fontWeight: nameConfig.bold ? 'bold' : 'normal',
    textTransform: nameConfig.uppercase ? 'uppercase' : 'none',
    textAlign: nameConfig.align,
    lineHeight: '1.1',
    display: 'block'
  });

  // --- Templates ---

  // REFACTORED: MODERN TEMPLATE
  const ModernTemplate = () => (
    <div 
      className="modern-template-bg min-h-[297mm] text-slate-800 grid grid-cols-[1fr_2fr]"
      style={{ 
        background: `linear-gradient(to right, #f8fafc 33.333%, white 33.333%)` 
      }}
    >
      <div className="p-8 flex flex-col gap-8 border-r border-slate-200/50">
         <PrintContentWrapper topMargin="20px">
            <div className="text-center break-inside-avoid">
              {data.photoUrl && (
                <img 
                  src={data.photoUrl} 
                  alt={data.fullName} 
                  className="mx-auto mb-4 shadow-md"
                  style={getPhotoStyles()} 
                />
              )}
            </div>

            <div className="break-inside-avoid mb-8">
              <h4 className="font-bold uppercase tracking-wider mb-3 text-slate-800 border-b-2 border-slate-200 pb-1 text-xs">Contact</h4>
              <div className="flex flex-col gap-2.5 text-sm text-slate-600">
                {data.email && <div className="break-all flex items-center gap-2"><Mail size={14} className="shrink-0" style={{ color: themeColor }}/> {data.email}</div>}
                {data.phone && <div className="flex items-center gap-2"><Phone size={14} className="shrink-0" style={{ color: themeColor }}/> {data.phone}</div>}
                {data.location && <div className="flex items-center gap-2"><MapPin size={14} className="shrink-0" style={{ color: themeColor }}/> {data.location}</div>}
                {data.linkedin && <div className="break-all flex items-center gap-2"><Linkedin size={14} className="shrink-0" style={{ color: themeColor }}/> {data.linkedin.replace(/^https?:\/\//, '')}</div>}
                {data.website && <div className="break-all flex items-center gap-2"><Globe size={14} className="shrink-0" style={{ color: themeColor }}/> {data.website.replace(/^https?:\/\//, '')}</div>}
              </div>
            </div>

            {data.skills.length > 0 && (
              <div className="break-inside-avoid mb-8">
                <h4 className="font-bold uppercase tracking-wider mb-3 text-slate-800 border-b-2 border-slate-200 pb-1 text-xs">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <SkillPill key={i} name={skill} themeColor={themeColor} />
                  ))}
                </div>
              </div>
            )}

            {data.education.length > 0 && (
              <div className="break-inside-avoid">
                <h4 className="font-bold uppercase tracking-wider mb-3 text-slate-800 border-b-2 border-slate-200 pb-1 text-xs">Education</h4>
                {data.education.map(edu => (
                  <div key={edu.id} className="mb-4">
                    <div className="font-bold text-sm text-slate-900">{edu.degree}</div>
                    <div className="text-xs font-medium text-slate-600">{edu.institution}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{edu.graduationDate}</div>
                  </div>
                ))}
              </div>
            )}
        </PrintContentWrapper>
      </div>

      <div className="px-10 pb-20">
        <PrintContentWrapper topMargin="30px">
            <div className="mb-8 break-inside-avoid pt-10 print:pt-0">
              <h1 className="text-slate-900 tracking-tight mb-2" style={getNameStyles()}>{data.fullName}</h1>
              <p className="text-xl font-medium" style={{ color: themeColor, textAlign: nameConfig.align }}>{data.experience[0]?.title || 'Professional'}</p>
            </div>

            {data.summary && (
              <div className="mb-8 break-inside-avoid">
                <h3 className="font-bold uppercase tracking-widest text-xs text-slate-400 mb-3">Professional Profile</h3>
                <p className="text-sm leading-relaxed text-slate-700 text-justify">{data.summary}</p>
              </div>
            )}

            {data.experience.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold uppercase tracking-widest text-xs text-slate-400 mb-4 border-b border-slate-100 pb-2 break-inside-avoid">Work Experience</h3>
                {data.experience.map(exp => (
                  <div key={exp.id} className="mb-6 last:mb-0 break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-lg text-slate-800">{exp.title}</h4>
                      <span className="text-xs font-bold text-slate-400 whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm font-semibold mb-2" style={{ color: themeColor }}>{exp.company} <span className="text-slate-300">|</span> {exp.location}</div>
                    <div className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                      {exp.description}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {type === DocumentType.RESUME && data.projects.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold uppercase tracking-widest text-xs text-slate-400 mb-4 border-b border-slate-100 pb-2 break-inside-avoid">Projects</h3>
                {data.projects.map(proj => (
                  <div key={proj.id} className="mb-4 break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <h5 className="font-bold text-sm text-slate-800">{proj.name}</h5>
                      {proj.link && <span className="text-xs" style={{ color: themeColor }}>{proj.link.replace(/^https?:\/\//, '')}</span>}
                    </div>
                    <div className="text-xs text-slate-500 italic mb-1">{proj.role}</div>
                    <p className="text-sm text-slate-600 leading-snug">{proj.description}</p>
                  </div>
                ))}
              </div>
            )}
            
            {type === DocumentType.ACADEMIC_CV && data.publications.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold uppercase tracking-widest text-xs text-slate-400 mb-4 border-b border-slate-100 pb-2 break-inside-avoid">Selected Publications</h3>
                <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-2 marker:text-slate-400">
                  {data.publications.map(pub => (
                    <li key={pub.id} className="pl-1 break-inside-avoid">{pub.citation}</li>
                  ))}
                </ul>
              </div>
            )}
        </PrintContentWrapper>
      </div>
    </div>
  );

  const ClassicTemplate = () => (
    <div className="min-h-[297mm] px-12 pb-20 font-serif text-slate-900 bg-white">
      <PrintContentWrapper topMargin="30px">
          <div className="mb-8 border-b-2 border-black pb-6 pt-12 print:pt-0 break-inside-avoid">
            <h1 className="tracking-wide mb-3 text-slate-900" style={getNameStyles()}>{data.fullName}</h1>
            <div className={`flex gap-4 text-sm flex-wrap text-slate-700 ${nameConfig.align === 'center' ? 'justify-center' : nameConfig.align === 'right' ? 'justify-end' : 'justify-start'}`}>
              {data.location && <span>{data.location}</span>}
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>{data.phone}</span>}
              {data.linkedin && <span>{data.linkedin.replace(/^https?:\/\//, '')}</span>}
            </div>
          </div>

          {data.summary && (
            <div className="mb-6 break-inside-avoid">
              <h3 className="font-bold text-sm uppercase mb-2 border-b border-gray-300 pb-1" style={{ color: themeColor }}>Summary</h3>
              <p className="text-sm leading-relaxed text-justify">{data.summary}</p>
            </div>
          )}

          {data.education.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-sm uppercase mb-3 border-b border-gray-300 pb-1 break-inside-avoid" style={{ color: themeColor }}>Education</h3>
              {data.education.map(edu => (
                <div key={edu.id} className="mb-2 flex justify-between items-baseline break-inside-avoid">
                  <div>
                    <span className="font-bold">{edu.institution}</span>, {edu.location}
                    <div className="italic text-sm">{edu.degree}</div>
                    {type === DocumentType.ACADEMIC_CV && edu.details && <div className="text-sm text-slate-600 mt-1">{edu.details}</div>}
                  </div>
                  <div className="text-sm font-medium">{edu.graduationDate}</div>
                </div>
              ))}
            </div>
          )}

          {data.experience.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-sm uppercase mb-3 border-b border-gray-300 pb-1 break-inside-avoid" style={{ color: themeColor }}>{type === DocumentType.ACADEMIC_CV ? "Academic & Professional Experience" : "Experience"}</h3>
              {data.experience.map(exp => (
                <div key={exp.id} className="mb-5 break-inside-avoid">
                  <div className="flex justify-between font-bold text-base mb-1">
                    <span>{exp.title}, {exp.company}</span>
                    <span className="text-sm font-normal">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-sm italic mb-2 text-slate-600">{exp.location}</div>
                  <ul className="list-disc ml-5 text-sm space-y-1">
                    {exp.description.split('\n').map((line, i) => (
                      line.trim() && <li key={i} className="pl-1">{line.replace(/^[•-]\s*/, '')}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {data.skills.length > 0 && (
            <div className="mb-6 break-inside-avoid">
              <h3 className="font-bold text-sm uppercase mb-3 border-b border-gray-300 pb-1" style={{ color: themeColor }}>Skills</h3>
              <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <SkillPill key={i} name={skill} color="bg-white border-slate-300" themeColor={themeColor} />
                  ))}
                </div>
            </div>
          )}

          {type === DocumentType.RESUME && data.projects.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-sm uppercase mb-3 border-b border-gray-300 pb-1 break-inside-avoid" style={{ color: themeColor }}>Projects</h3>
              {data.projects.map(proj => (
                <div key={proj.id} className="mb-3 break-inside-avoid">
                  <div className="font-bold text-sm">{proj.name} <span className="font-normal italic">- {proj.role}</span></div>
                  <div className="text-sm mt-1">{proj.description}</div>
                </div>
              ))}
            </div>
          )}
      </PrintContentWrapper>
    </div>
  );

  const MinimalTemplate = () => (
    <div className="min-h-[297mm] px-12 pb-20 bg-white text-slate-800 font-sans">
      <PrintContentWrapper topMargin="30px">
          <div className="flex flex-col mb-10 pt-12 print:pt-0 break-inside-avoid" style={{ alignItems: nameConfig.align === 'center' ? 'center' : nameConfig.align === 'right' ? 'flex-end' : 'flex-start' }}>
            <h1 className="tracking-[0.2em] mb-4 text-slate-900" style={{ ...getNameStyles(), letterSpacing: '0.2em' }}>{data.fullName}</h1>
            <div className={`flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 tracking-wider ${nameConfig.align === 'center' ? 'justify-center' : nameConfig.align === 'right' ? 'justify-end' : 'justify-start'}`}>
               {data.location && <div className="flex items-center gap-1.5"><MapPin size={12} /> {data.location}</div>}
               {data.email && <div className="flex items-center gap-1.5"><Mail size={12} /> {data.email}</div>}
               {data.phone && <div className="flex items-center gap-1.5"><Phone size={12} /> {data.phone}</div>}
            </div>
          </div>

          <div className="space-y-8">
            {data.summary && (
              <div className="grid grid-cols-4 gap-4 break-inside-avoid">
                <div className="col-span-1 text-xs font-bold uppercase tracking-widest mt-1" style={{ color: themeColor }}>Profile</div>
                <div className="col-span-3 text-sm leading-relaxed text-slate-700 text-justify">{data.summary}</div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1 text-xs font-bold uppercase tracking-widest mt-1 break-inside-avoid" style={{ color: themeColor }}>Experience</div>
              <div className="col-span-3 space-y-6">
                {data.experience.map(exp => (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-slate-800">{exp.title}</h3>
                      <span className="text-xs text-slate-400">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: themeColor }}>{exp.company}</div>
                    <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {data.education.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1 text-xs font-bold uppercase tracking-widest mt-1 break-inside-avoid" style={{ color: themeColor }}>Education</div>
                <div className="col-span-3 space-y-4">
                  {data.education.map(edu => (
                    <div key={edu.id} className="break-inside-avoid">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{edu.institution}</span>
                        <span className="font-normal text-xs text-slate-400">{edu.graduationDate}</span>
                      </div>
                      <div className="text-sm text-slate-600">{edu.degree}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.skills.length > 0 && (
              <div className="grid grid-cols-4 gap-4 break-inside-avoid">
                <div className="col-span-1 text-xs font-bold uppercase tracking-widest mt-1" style={{ color: themeColor }}>Skills</div>
                <div className="col-span-3 flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                      <SkillPill key={i} name={skill} themeColor={themeColor} />
                  ))}
                </div>
              </div>
            )}
          </div>
      </PrintContentWrapper>
    </div>
  );

  // REFACTORED: CREATIVE TEMPLATE
  const CreativeTemplate = () => (
    <div 
      className="creative-template-bg min-h-[297mm] bg-white font-sans grid grid-cols-[35%_65%]"
      style={{ 
         background: `linear-gradient(to right, ${themeColor} 35%, white 35%)` 
      }}
    >
       <div className="text-white p-8 pb-20 flex flex-col gap-8 border-r-0">
          <PrintContentWrapper topMargin="20px">
              <div className="mb-2 break-inside-avoid">
                {data.photoUrl && (
                  <div className="mx-auto mb-6 flex justify-center">
                    <img 
                       src={data.photoUrl} 
                       alt={data.fullName} 
                       className="shadow-xl" 
                       style={getPhotoStyles()} 
                    />
                  </div>
                )}
                {/* Note: Creative template usually enforces a specific look, but we apply custom styles where possible */}
                <h1 className="leading-tight mb-2" style={{ ...getNameStyles(), textAlign: 'center' }}>{data.fullName}</h1>
                <p className="text-white/80 font-medium text-lg text-center">{data.experience[0]?.title}</p>
              </div>

              <div className="break-inside-avoid mb-8">
                <h4 className="font-bold text-xs uppercase tracking-widest text-white/50 mb-4">Contact</h4>
                <div className="space-y-3 text-sm text-white/90">
                  {data.email && <div className="flex items-center gap-3"><Mail size={16} className="text-white"/> {data.email}</div>}
                  {data.phone && <div className="flex items-center gap-3"><Phone size={16} className="text-white"/> {data.phone}</div>}
                  {data.location && <div className="flex items-center gap-3"><MapPin size={16} className="text-white"/> {data.location}</div>}
                  {data.website && <div className="flex items-center gap-3"><Globe size={16} className="text-white"/> {data.website.replace(/^https?:\/\//, '')}</div>}
                </div>
              </div>

              <div className="break-inside-avoid mb-8">
                <h4 className="font-bold text-xs uppercase tracking-widest text-white/50 mb-4">Education</h4>
                <div className="space-y-4">
                  {data.education.map(edu => (
                    <div key={edu.id}>
                      <div className="font-bold text-white">{edu.degree}</div>
                      <div className="text-sm text-white/80">{edu.institution}</div>
                      <div className="text-xs text-white/60 mt-1">{edu.graduationDate}</div>
                    </div>
                  ))}
                </div>
              </div>

              {data.skills.length > 0 && (
                <div className="break-inside-avoid">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-white/50 mb-4">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill, i) => (
                        <SkillPill key={i} name={skill} color="bg-black/20 border-transparent text-white" themeColor="ffffff" />
                      ))}
                  </div>
                </div>
              )}
          </PrintContentWrapper>
       </div>

       <div className="px-10 pb-20 flex flex-col gap-8">
          <PrintContentWrapper topMargin="30px">
              {data.summary && (
                <div className="bg-slate-50 p-6 rounded-r-xl border-l-4 break-inside-avoid mt-10 print:mt-0" style={{ borderColor: themeColor }}>
                  <p className="text-slate-700 leading-relaxed italic text-justify">"{data.summary}"</p>
                </div>
              )}

              <div className="mt-8">
                <h3 className="flex items-center gap-3 font-bold text-xl uppercase tracking-wider text-slate-800 mb-6 break-inside-avoid">
                  <span className="w-8 h-1" style={{ backgroundColor: themeColor }}></span> Experience
                </h3>
                <div className="border-l-2 border-slate-100 ml-3 pl-8 space-y-8">
                  {data.experience.map(exp => (
                    <div key={exp.id} className="relative break-inside-avoid">
                      <div className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4" style={{ borderColor: themeColor }}></div>
                      <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-lg text-slate-900">{exp.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: themeColor }}>
                        {exp.company} 
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span> 
                        <span className="text-slate-500 font-normal">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                      </div>
                      <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {data.projects.length > 0 && (
                <div className="mt-8">
                  <h3 className="flex items-center gap-3 font-bold text-xl uppercase tracking-wider text-slate-800 mb-6 break-inside-avoid">
                    <span className="w-8 h-1" style={{ backgroundColor: themeColor }}></span> Projects
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {data.projects.map(proj => (
                      <div key={proj.id} className="p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors break-inside-avoid" style={{ borderColor: 'transparent' }}>
                        <div className="flex justify-between font-bold text-slate-800 mb-1">
                            <span>{proj.name}</span>
                            {proj.link && <ExternalLink size={14} style={{ color: themeColor }} />}
                        </div>
                        <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: themeColor }}>{proj.role}</div>
                        <p className="text-sm text-slate-600">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </PrintContentWrapper>
       </div>
    </div>
  );

  const renderTemplate = () => {
    switch (template) {
      case TemplateType.CLASSIC: return <ClassicTemplate />;
      case TemplateType.MINIMAL: return <MinimalTemplate />;
      case TemplateType.CREATIVE: return <CreativeTemplate />;
      case TemplateType.MODERN:
      default: return <ModernTemplate />;
    }
  };

  return (
    <div 
      ref={ref}
      className="a4-page transition-transform duration-200 ease-out"
      style={{ transform: `scale(${scale})` }}
    >
      {renderTemplate()}
    </div>
  );
});

Preview.displayName = "Preview";
export default Preview;