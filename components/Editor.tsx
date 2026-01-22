import React, { useState } from 'react';
import { AppState, DocumentType, TemplateType, WorkExperience, Education, Project, Publication, PhotoConfig, NameConfig } from '../types';
import { generateProfessionalSummary, improveBulletPoints } from '../services/geminiService';
import { THEME_COLORS, DEFAULT_PHOTO_CONFIG, DEFAULT_NAME_CONFIG } from '../constants';
import { 
  ChevronDown, ChevronUp, Sparkles, Plus, Trash2, 
  User, Briefcase, GraduationCap, Code, FileText, BookOpen, Check,
  Circle, Square, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, Bold, Type,
  ArrowUp, ArrowDown
} from 'lucide-react';

interface EditorProps {
  state: AppState;
  onChange: (key: keyof AppState['data'], value: any) => void;
  onStateChange: (key: keyof AppState, value: any) => void;
}

// Reusable UI Components for Consistency
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wide">{children}</label>
);

const StyledInput = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props}
    className="w-full bg-white border border-slate-300 text-slate-900 rounded-md px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
  />
);

const StyledTextArea = ({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea 
    {...props}
    className="w-full bg-white border border-slate-300 text-slate-900 rounded-md px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm resize-none"
  />
);

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 relative ${className}`}>
    {children}
  </div>
);

const SectionButton = ({ 
  icon: Icon, 
  label, 
  isOpen, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  isOpen: boolean, 
  onClick: () => void 
}) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center justify-between p-4 transition-colors duration-200 border-b border-slate-100 ${isOpen ? 'bg-indigo-50/50 text-indigo-900' : 'bg-white hover:bg-slate-50 text-slate-700'}`}
  >
    <div className="flex items-center gap-3 font-semibold">
      <div className={`p-1.5 rounded-md ${isOpen ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
        <Icon size={18} />
      </div>
      {label}
    </div>
    {isOpen ? <ChevronUp size={16} className="text-indigo-400" /> : <ChevronDown size={16} className="text-slate-400" />}
  </button>
);

const Editor: React.FC<EditorProps> = ({ state, onChange, onStateChange }) => {
  const [activeSection, setActiveSection] = useState<string | null>('personal');
  const [aiLoading, setAiLoading] = useState(false);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleAiSummary = async () => {
    setAiLoading(true);
    const lastJob = state.data.experience[0];
    const jobTitle = lastJob ? lastJob.title : 'Professional';
    const experience = `${state.data.experience.length} years of experience`;
    const keywords = state.data.skills.join(', ');
    
    const summary = await generateProfessionalSummary(jobTitle, experience, keywords);
    onChange('summary', summary);
    setAiLoading(false);
  };

  const handleAiImprove = async (index: number, text: string, field: 'experience' | 'projects') => {
    setAiLoading(true);
    const improved = await improveBulletPoints(text);
    const newList = [...state.data[field]];
    // @ts-ignore
    newList[index].description = improved;
    onChange(field, newList);
    setAiLoading(false);
  };

  const handlePhotoConfigChange = (key: keyof PhotoConfig, value: any) => {
    const currentConfig = state.data.photoConfig || DEFAULT_PHOTO_CONFIG;
    onChange('photoConfig', { ...currentConfig, [key]: value });
  };
  
  const handleNameConfigChange = (key: keyof NameConfig, value: any) => {
    const currentConfig = state.data.nameConfig || DEFAULT_NAME_CONFIG;
    onChange('nameConfig', { ...currentConfig, [key]: value });
  };

  const moveItem = (field: 'experience' | 'education' | 'projects' | 'publications', index: number, direction: 'up' | 'down') => {
    const items = [...state.data[field]];
    if (direction === 'up' && index > 0) {
      [items[index], items[index - 1]] = [items[index - 1], items[index]];
      onChange(field, items);
    } else if (direction === 'down' && index < items.length - 1) {
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
      onChange(field, items);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-xl z-10 overflow-hidden">
      
      {/* Configuration Header */}
      <div className="p-5 bg-white border-b border-slate-200 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Document Setup</h2>
          <p className="text-xs text-slate-500">Choose your format, template and theme.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => onStateChange('docType', DocumentType.RESUME)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-md border transition-all ${state.docType === DocumentType.RESUME ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
          >
            Resume (US)
          </button>
          <button 
            onClick={() => onStateChange('docType', DocumentType.ACADEMIC_CV)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-md border transition-all ${state.docType === DocumentType.ACADEMIC_CV ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
          >
            CV (Academic)
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Template</Label>
             <div className="relative">
               <select 
                 value={state.template}
                 onChange={(e) => onStateChange('template', e.target.value)}
                 className="w-full bg-white border border-slate-300 text-slate-900 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none shadow-sm"
               >
                 <option value={TemplateType.MODERN}>Modern</option>
                 <option value={TemplateType.CLASSIC}>Classic</option>
                 <option value={TemplateType.MINIMAL}>Minimal</option>
                 <option value={TemplateType.CREATIVE}>Creative</option>
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                 <ChevronDown size={14} />
               </div>
             </div>
          </div>
          <div>
            <Label>Theme Color</Label>
            <div className="flex flex-wrap gap-2">
               {THEME_COLORS.map(color => (
                 <button
                   key={color.name}
                   onClick={() => onStateChange('themeColor', color.hex)}
                   className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${state.themeColor === color.hex ? 'ring-2 ring-offset-1 ring-indigo-400 scale-110' : 'hover:scale-110'}`}
                   style={{ backgroundColor: color.hex, borderColor: color.hex }}
                   title={color.name}
                 >
                   {state.themeColor === color.hex && <Check size={12} className="text-white" />}
                 </button>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Form Sections */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        
        {/* Personal Info */}
        <div className="border-b border-slate-200 bg-white">
          <SectionButton 
            icon={User} 
            label="Personal Information" 
            isOpen={activeSection === 'personal'} 
            onClick={() => toggleSection('personal')} 
          />
          {activeSection === 'personal' && (
            <div className="p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
              <div>
                <Label>Full Name</Label>
                <StyledInput placeholder="e.g. Alex Mercer" value={state.data.fullName} onChange={e => onChange('fullName', e.target.value)} />
              </div>
              
              {/* Name Typography Config */}
              <div className="bg-slate-50 p-3 rounded-md border border-slate-200 space-y-3">
                 <Label>Name Styling</Label>
                 <div className="flex justify-between items-center bg-white p-1 rounded border border-slate-200 mb-2">
                    <button 
                      onClick={() => handleNameConfigChange('align', 'left')}
                      className={`p-1.5 rounded flex-1 flex justify-center ${state.data.nameConfig?.align === 'left' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                      title="Align Left"
                    >
                      <AlignLeft size={16} />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                    <button 
                      onClick={() => handleNameConfigChange('align', 'center')}
                      className={`p-1.5 rounded flex-1 flex justify-center ${state.data.nameConfig?.align === 'center' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                      title="Align Center"
                    >
                      <AlignCenter size={16} />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                    <button 
                      onClick={() => handleNameConfigChange('align', 'right')}
                      className={`p-1.5 rounded flex-1 flex justify-center ${state.data.nameConfig?.align === 'right' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                      title="Align Right"
                    >
                      <AlignRight size={16} />
                    </button>
                 </div>

                 <div className="flex gap-4">
                    <button 
                      onClick={() => handleNameConfigChange('bold', !state.data.nameConfig?.bold)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded border flex items-center justify-center gap-1.5 transition-colors ${state.data.nameConfig?.bold ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <Bold size={14} /> Bold
                    </button>
                    <button 
                      onClick={() => handleNameConfigChange('uppercase', !state.data.nameConfig?.uppercase)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded border flex items-center justify-center gap-1.5 transition-colors ${state.data.nameConfig?.uppercase ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <Type size={14} /> UPPER
                    </button>
                 </div>

                 <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Size</span>
                      <span>{state.data.nameConfig?.size || 48}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="24" 
                      max="96" 
                      step="2"
                      value={state.data.nameConfig?.size || 48}
                      onChange={(e) => handleNameConfigChange('size', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label>Email</Label>
                   <StyledInput placeholder="alex@example.com" value={state.data.email} onChange={e => onChange('email', e.target.value)} />
                 </div>
                 <div>
                   <Label>Phone</Label>
                   <StyledInput placeholder="+1 555 000 0000" value={state.data.phone} onChange={e => onChange('phone', e.target.value)} />
                 </div>
              </div>
              <div>
                <Label>Location</Label>
                <StyledInput placeholder="City, Country" value={state.data.location} onChange={e => onChange('location', e.target.value)} />
              </div>
              <div>
                <Label>LinkedIn URL</Label>
                <StyledInput placeholder="linkedin.com/in/..." value={state.data.linkedin || ''} onChange={e => onChange('linkedin', e.target.value)} />
              </div>
              <div>
                <Label>Website</Label>
                <StyledInput placeholder="yourwebsite.com" value={state.data.website || ''} onChange={e => onChange('website', e.target.value)} />
              </div>
              
              <div>
                 <Label>Profile Photo</Label>
                 <div className="flex items-center gap-3 mb-4">
                    {state.data.photoUrl && (
                      <img 
                        src={state.data.photoUrl} 
                        alt="Preview" 
                        className="w-10 h-10 object-cover border border-slate-200"
                        style={{ borderRadius: state.data.photoConfig?.shape === 'circle' ? '50%' : state.data.photoConfig?.shape === 'rounded' ? '0.25rem' : '0' }}
                      />
                    )}
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                      <Plus size={16} />
                      {state.data.photoUrl ? 'Change Photo' : 'Upload Photo'}
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => onChange('photoUrl', reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                 </div>

                 {/* Photo Customization Controls */}
                 {state.data.photoUrl && (
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-200 space-y-3">
                        <Label>Photo Style</Label>
                        <div className="flex justify-between items-center bg-white p-1 rounded border border-slate-200">
                          <button 
                            onClick={() => handlePhotoConfigChange('shape', 'circle')}
                            className={`p-1.5 rounded flex-1 flex justify-center ${state.data.photoConfig?.shape === 'circle' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                            title="Circle"
                          >
                            <Circle size={16} />
                          </button>
                          <div className="w-px h-4 bg-slate-200 mx-1"></div>
                          <button 
                            onClick={() => handlePhotoConfigChange('shape', 'rounded')}
                            className={`p-1.5 rounded flex-1 flex justify-center ${state.data.photoConfig?.shape === 'rounded' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                            title="Rounded"
                          >
                            <div className="w-4 h-4 border-2 border-current rounded-md"></div>
                          </button>
                          <div className="w-px h-4 bg-slate-200 mx-1"></div>
                          <button 
                            onClick={() => handlePhotoConfigChange('shape', 'square')}
                            className={`p-1.5 rounded flex-1 flex justify-center ${state.data.photoConfig?.shape === 'square' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                            title="Square"
                          >
                            <Square size={16} />
                          </button>
                        </div>

                        <div>
                           <div className="flex justify-between text-xs text-slate-500 mb-1">
                             <span>Size</span>
                             <span>{state.data.photoConfig?.size || 128}px</span>
                           </div>
                           <input 
                             type="range" 
                             min="64" 
                             max="256" 
                             step="8"
                             value={state.data.photoConfig?.size || 128}
                             onChange={(e) => handlePhotoConfigChange('size', parseInt(e.target.value))}
                             className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                           />
                        </div>

                        <div className="flex gap-4">
                           <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={state.data.photoConfig?.border ?? true}
                                onChange={(e) => handlePhotoConfigChange('border', e.target.checked)}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              Border
                           </label>
                           <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={state.data.photoConfig?.grayscale ?? false}
                                onChange={(e) => handlePhotoConfigChange('grayscale', e.target.checked)}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              Grayscale
                           </label>
                        </div>
                    </div>
                 )}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="border-b border-slate-200 bg-white">
          <SectionButton 
            icon={FileText} 
            label={state.docType === DocumentType.RESUME ? 'Professional Summary' : 'Research Summary'} 
            isOpen={activeSection === 'summary'} 
            onClick={() => toggleSection('summary')} 
          />
          {activeSection === 'summary' && (
            <div className="p-5 relative animate-in slide-in-from-top-2 duration-200">
              <Label>Summary</Label>
              <StyledTextArea 
                value={state.data.summary}
                onChange={(e) => onChange('summary', e.target.value)}
                placeholder="Briefly describe your professional background, key achievements, and career goals..."
                rows={6}
              />
              <div className="mt-2 flex justify-end">
                <button 
                  onClick={handleAiSummary}
                  disabled={aiLoading}
                  className="text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles size={14} /> 
                  {aiLoading ? 'Writing...' : 'Generate with AI'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Experience */}
        <div className="border-b border-slate-200 bg-white">
          <SectionButton 
            icon={Briefcase} 
            label="Work Experience" 
            isOpen={activeSection === 'experience'} 
            onClick={() => toggleSection('experience')} 
          />
          {activeSection === 'experience' && (
            <div className="p-5 bg-slate-50/50 animate-in slide-in-from-top-2 duration-200">
              {state.data.experience.map((exp, idx) => (
                <Card key={exp.id}>
                  <div className="flex justify-between items-start mb-4 border-b border-slate-200 pb-2">
                    <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-xs text-slate-600">{idx + 1}</div>
                      Position
                    </span>
                    <div className="flex items-center gap-1">
                        <button 
                          onClick={() => moveItem('experience', idx, 'up')}
                          disabled={idx === 0}
                          className="text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 p-1 transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button 
                          onClick={() => moveItem('experience', idx, 'down')}
                          disabled={idx === state.data.experience.length - 1}
                          className="text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 p-1 transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown size={16} />
                        </button>
                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                        <button 
                          onClick={() => {
                            const newExp = state.data.experience.filter(e => e.id !== exp.id);
                            onChange('experience', newExp);
                          }} 
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                          title="Remove Position"
                        >
                          <Trash2 size={16} />
                        </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Job Title</Label>
                      <StyledInput 
                        placeholder="e.g. Senior Frontend Engineer" 
                        value={exp.title} 
                        onChange={e => {
                          const n = [...state.data.experience]; n[idx].title = e.target.value; onChange('experience', n);
                        }} 
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <StyledInput 
                        placeholder="e.g. Google" 
                        value={exp.company} 
                        onChange={e => {
                          const n = [...state.data.experience]; n[idx].company = e.target.value; onChange('experience', n);
                        }} 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <StyledInput 
                          placeholder="MM/YYYY" 
                          value={exp.startDate} 
                          onChange={e => {
                            const n = [...state.data.experience]; n[idx].startDate = e.target.value; onChange('experience', n);
                          }} 
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <Label>End Date</Label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3 h-3"
                              checked={exp.current} 
                              onChange={e => {
                                const n = [...state.data.experience]; n[idx].current = e.target.checked; 
                                if(e.target.checked) n[idx].endDate = '';
                                onChange('experience', n);
                              }} 
                            />
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">Current</span>
                          </label>
                        </div>
                        <StyledInput 
                          placeholder="MM/YYYY" 
                          value={exp.endDate} 
                          disabled={exp.current}
                          onChange={e => {
                            const n = [...state.data.experience]; n[idx].endDate = e.target.value; onChange('experience', n);
                          }}
                          className={`${exp.current ? 'bg-slate-100 text-slate-400' : 'bg-white'}`}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <StyledInput 
                        placeholder="e.g. New York, NY" 
                        value={exp.location} 
                        onChange={e => {
                          const n = [...state.data.experience]; n[idx].location = e.target.value; onChange('experience', n);
                        }} 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <Label>Description</Label>
                        <button 
                          onClick={() => handleAiImprove(idx, exp.description, 'experience')}
                          disabled={aiLoading}
                          className="text-[10px] font-medium text-indigo-600 flex items-center gap-1 hover:underline"
                        >
                          <Sparkles size={10} /> Improve
                        </button>
                      </div>
                      <StyledTextArea 
                        rows={5}
                        placeholder="• Achieved X by doing Y..."
                        value={exp.description}
                        onChange={e => {
                           const n = [...state.data.experience]; n[idx].description = e.target.value; onChange('experience', n);
                        }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
              <button 
                onClick={() => onChange('experience', [...state.data.experience, { id: Date.now().toString(), title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }])}
                className="w-full py-3 bg-white border border-dashed border-slate-300 rounded-lg text-slate-500 font-medium text-sm hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Position
              </button>
            </div>
          )}
        </div>

        {/* Education */}
        <div className="border-b border-slate-200 bg-white">
          <SectionButton 
            icon={GraduationCap} 
            label="Education" 
            isOpen={activeSection === 'education'} 
            onClick={() => toggleSection('education')} 
          />
          {activeSection === 'education' && (
             <div className="p-5 bg-slate-50/50 animate-in slide-in-from-top-2 duration-200">
                {state.data.education.map((edu, idx) => (
                   <Card key={edu.id}>
                      <div className="flex justify-between items-start mb-4 border-b border-slate-200 pb-2">
                        <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                          <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-xs text-slate-600">{idx + 1}</div>
                          School
                        </span>
                        <div className="flex items-center gap-1">
                            <button 
                              onClick={() => moveItem('education', idx, 'up')}
                              disabled={idx === 0}
                              className="text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 p-1 transition-colors"
                              title="Move Up"
                            >
                              <ArrowUp size={16} />
                            </button>
                            <button 
                              onClick={() => moveItem('education', idx, 'down')}
                              disabled={idx === state.data.education.length - 1}
                              className="text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 p-1 transition-colors"
                              title="Move Down"
                            >
                              <ArrowDown size={16} />
                            </button>
                            <div className="w-px h-4 bg-slate-200 mx-1"></div>
                            <button onClick={() => onChange('education', state.data.education.filter(e => e.id !== edu.id))} className="text-slate-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Institution</Label>
                          <StyledInput 
                            placeholder="e.g. Stanford University" 
                            value={edu.institution} 
                            onChange={e => {
                              const n = [...state.data.education]; n[idx].institution = e.target.value; onChange('education', n);
                            }} 
                          />
                        </div>
                        <div>
                          <Label>Degree</Label>
                          <StyledInput 
                            placeholder="e.g. B.S. Computer Science" 
                            value={edu.degree} 
                            onChange={e => {
                              const n = [...state.data.education]; n[idx].degree = e.target.value; onChange('education', n);
                            }} 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Year</Label>
                            <StyledInput 
                              placeholder="2023" 
                              value={edu.graduationDate} 
                              onChange={e => {
                                const n = [...state.data.education]; n[idx].graduationDate = e.target.value; onChange('education', n);
                              }} 
                            />
                          </div>
                          <div>
                            <Label>Location</Label>
                            <StyledInput 
                              placeholder="City, State" 
                              value={edu.location} 
                              onChange={e => {
                                const n = [...state.data.education]; n[idx].location = e.target.value; onChange('education', n);
                              }} 
                            />
                          </div>
                        </div>
                      </div>
                   </Card>
                ))}
                <button 
                  onClick={() => onChange('education', [...state.data.education, { id: Date.now().toString(), institution: '', degree: '', location: '', graduationDate: '' }])}
                  className="w-full py-3 bg-white border border-dashed border-slate-300 rounded-lg text-slate-500 font-medium text-sm hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Education
                </button>
             </div>
          )}
        </div>

        {/* Skills */}
        <div className="border-b border-slate-200 bg-white">
           <SectionButton 
            icon={Code} 
            label="Skills" 
            isOpen={activeSection === 'skills'} 
            onClick={() => toggleSection('skills')} 
          />
          {activeSection === 'skills' && (
            <div className="p-5 animate-in slide-in-from-top-2 duration-200">
               <Label>Skills List</Label>
               <StyledTextArea 
                 className="h-32"
                 value={state.data.skills.join(', ')}
                 onChange={(e) => onChange('skills', e.target.value.split(',').map(s => s.trim()))}
                 placeholder="Python, React, Project Management, Public Speaking..."
               />
               <p className="text-xs text-slate-500 mt-2">Separate each skill with a comma.</p>
            </div>
          )}
        </div>
        
        {/* Academic Specifics */}
        {state.docType === DocumentType.ACADEMIC_CV && (
          <div className="border-b border-slate-200 bg-white">
            <SectionButton 
              icon={BookOpen} 
              label="Publications" 
              isOpen={activeSection === 'publications'} 
              onClick={() => toggleSection('publications')} 
            />
            {activeSection === 'publications' && (
              <div className="p-5 bg-slate-50/50 animate-in slide-in-from-top-2 duration-200">
                 {state.data.publications.map((pub, idx) => (
                   <Card key={pub.id} className="mb-2 p-3">
                     <div className="flex gap-2 items-start">
                       <div className="flex-1">
                         <Label>Citation</Label>
                         <StyledTextArea 
                            rows={3} 
                            placeholder="Full citation (e.g., Author, Title, Journal, Year)..." 
                            value={pub.citation} 
                            onChange={e => {
                              const n = [...state.data.publications]; n[idx].citation = e.target.value; onChange('publications', n);
                            }} 
                         />
                       </div>
                       <div className="flex flex-col gap-1">
                          <button 
                              onClick={() => moveItem('publications', idx, 'up')}
                              disabled={idx === 0}
                              className="text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 p-1 transition-colors"
                              title="Move Up"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button 
                              onClick={() => moveItem('publications', idx, 'down')}
                              disabled={idx === state.data.publications.length - 1}
                              className="text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 p-1 transition-colors"
                              title="Move Down"
                            >
                              <ArrowDown size={14} />
                            </button>
                          <button onClick={() => onChange('publications', state.data.publications.filter(p => p.id !== pub.id))} className="text-slate-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                       </div>
                     </div>
                   </Card>
                 ))}
                 <button 
                  onClick={() => onChange('publications', [...state.data.publications, { id: Date.now().toString(), citation: '' }])}
                  className="w-full py-3 mt-2 bg-white border border-dashed border-slate-300 rounded-lg text-slate-500 font-medium text-sm hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Publication
                </button>
              </div>
            )}
          </div>
        )}

        {/* Resume Specifics: Projects */}
        {state.docType === DocumentType.RESUME && (
           <div className="border-b border-slate-200 bg-white">
              <SectionButton 
                icon={Code} 
                label="Projects" 
                isOpen={activeSection === 'projects'} 
                onClick={() => toggleSection('projects')} 
              />
              {activeSection === 'projects' && (
                <div className="p-5 bg-slate-50/50 animate-in slide-in-from-top-2 duration-200">
                   {state.data.projects.map((proj, idx) => (
                      <Card key={proj.id}>
                        <div className="flex justify-between items-start mb-4 border-b border-slate-200 pb-2">
                          <span className="font-bold text-sm text-slate-800 flex items-center gap-2">Project #{idx + 1}</span>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => moveItem('projects', idx, 'up')}
                              disabled={idx === 0}
                              className="text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 p-1 transition-colors"
                              title="Move Up"
                            >
                              <ArrowUp size={16} />
                            </button>
                            <button 
                              onClick={() => moveItem('projects', idx, 'down')}
                              disabled={idx === state.data.projects.length - 1}
                              className="text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 p-1 transition-colors"
                              title="Move Down"
                            >
                              <ArrowDown size={16} />
                            </button>
                            <div className="w-px h-4 bg-slate-200 mx-1"></div>
                            <button onClick={() => onChange('projects', state.data.projects.filter(p => p.id !== proj.id))} className="text-slate-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                        </div>
                        </div>
                        <div className="space-y-4">
                           <div>
                             <Label>Project Name</Label>
                             <StyledInput value={proj.name} onChange={e => {const n = [...state.data.projects]; n[idx].name = e.target.value; onChange('projects', n)}} placeholder="Project Name" />
                           </div>
                           <div>
                             <Label>Role</Label>
                             <StyledInput value={proj.role} onChange={e => {const n = [...state.data.projects]; n[idx].role = e.target.value; onChange('projects', n)}} placeholder="Role (e.g. Lead Dev)" />
                           </div>
                           <div>
                             <Label>Link</Label>
                             <StyledInput value={proj.link || ''} onChange={e => {const n = [...state.data.projects]; n[idx].link = e.target.value; onChange('projects', n)}} placeholder="URL (Optional)" />
                           </div>
                           <div>
                             <div className="flex justify-between items-end mb-1">
                                <Label>Description</Label>
                                <button 
                                  onClick={() => handleAiImprove(idx, proj.description, 'projects')}
                                  disabled={aiLoading}
                                  className="text-[10px] font-medium text-indigo-600 flex items-center gap-1 hover:underline"
                                >
                                  <Sparkles size={10} /> Improve
                                </button>
                              </div>
                             <StyledTextArea value={proj.description} onChange={e => {const n = [...state.data.projects]; n[idx].description = e.target.value; onChange('projects', n)}} placeholder="Project details..." rows={3} />
                           </div>
                        </div>
                      </Card>
                   ))}
                   <button 
                      onClick={() => onChange('projects', [...state.data.projects, { id: Date.now().toString(), name: '', role: '', description: '' }])}
                      className="w-full py-3 mt-2 bg-white border border-dashed border-slate-300 rounded-lg text-slate-500 font-medium text-sm hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={16} /> Add Project
                    </button>
                </div>
              )}
           </div>
        )}

      </div>
    </div>
  );
};

export default Editor;