import React, { useState, useRef } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  Palette, 
  Languages, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  Flame, 
  Zap, 
  Check, 
  Sparkles,
  School,
  Save,
  Volume2,
  Trash2,
  Download,
  Upload,
  Camera,
  Link as LinkIcon,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';
import { StudentProfile, LanguagePreference, ColorTheme } from '../types';

interface ProfileSettingsViewProps {
  student: StudentProfile;
  theme: 'light' | 'dark';
  colorTheme?: string;
  onUpdateStudent: (updated: StudentProfile) => void;
  onToggleTheme: () => void;
  onSelectColorTheme?: (color: any) => void;
  onAwardXP: (amount: number, reason?: string) => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
];

const AVAILABLE_SUBJECTS = [
  'Mathematics',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Social Science',
  'English Literature',
  'Hindi Literature',
  'Computer Science',
  'Economics'
];

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  student,
  theme,
  colorTheme,
  onUpdateStudent,
  onToggleTheme,
  onSelectColorTheme,
  onAwardXP,
}) => {
  const [formData, setFormData] = useState<StudentProfile>({ ...student });
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'preferences' | 'theme'>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload from device
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Image size should be less than 8MB');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        setUploadError(null);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try another picture.');
    };
    reader.readAsDataURL(file);
  };

  // Handle custom URL input
  const handleApplyCustomUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customUrlInput.trim()) return;
    setFormData((prev) => ({ ...prev, avatarUrl: customUrlInput.trim() }));
    setCustomUrlInput('');
    setUploadError(null);
  };

  // Notifications state
  const [notifications, setNotifications] = useState({
    dailyStudyReminder: true,
    streakAlert: true,
    examCountdownAlert: true,
    soundEffects: true,
  });

  const handleSubjectToggle = (subj: string) => {
    const exists = formData.subjects.includes(subj);
    let updatedSubjects: string[];
    if (exists) {
      if (formData.subjects.length <= 1) return; // Keep at least 1
      updatedSubjects = formData.subjects.filter((s) => s !== subj);
    } else {
      updatedSubjects = [...formData.subjects, subj];
    }
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudent(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    onAwardXP(20, 'Profile Updated');
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify({
      student: formData,
      exportedAt: new Date().toISOString()
    }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learnpro-backup-${formData.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* ----------------------------------------------------
          Profile Top Summary Banner
      ---------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left z-10">
          <div className="relative group">
            <img
              src={formData.avatarUrl}
              alt={formData.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-blue-500/40 shadow-xl"
            />
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] shadow-md border-2 border-slate-900">
              Lvl {formData.level}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{formData.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-400/30">
                {formData.rankTitle}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {formData.className} • {formData.board} • {formData.school}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{formData.studyStreakDays} Days Streak</span>
              </span>
              <span className="flex items-center gap-1 text-blue-300 font-bold">
                <Zap className="w-3.5 h-3.5 fill-blue-300" />
                <span>{formData.xp.toLocaleString()} Total Points</span>
              </span>
            </div>
          </div>
        </div>

        {/* Save indicator / Action */}
        <div className="z-10 flex flex-col items-center sm:items-end gap-2">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 animate-pulse">
              <Check className="w-4 h-4" />
              <span>Changes Saved!</span>
            </div>
          )}
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>

        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ----------------------------------------------------
          Settings Navigation Tabs
      ---------------------------------------------------- */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 overflow-x-auto">
        {[
          { key: 'profile', label: '👤 Profile & Avatar', icon: User },
          { key: 'academic', label: '🎓 Academic Details', icon: School },
          { key: 'preferences', label: '🌐 Language & Alerts', icon: Languages },
          { key: 'theme', label: '🎨 Theme & Appearance', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ----------------------------------------------------
          Settings Content Sections
      ---------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        
        {/* TAB 1: Profile & Avatar */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Personal Student Information
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your display name, avatar, and study goals.
              </p>
            </div>

            {/* Custom Profile Picture Upload Feature */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Current Avatar with Camera Badge */}
                <div className="relative group shrink-0">
                  <img
                    src={formData.avatarUrl || AVATAR_OPTIONS[0]}
                    alt="Current Profile Picture"
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-500/30 shadow-md bg-slate-200 dark:bg-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform hover:scale-110 cursor-pointer"
                    title="Upload Custom Photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      Profile Picture
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      Custom Upload Enabled
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload your own photo from your phone or computer, or choose from preset avatars.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Your Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, avatarUrl: AVATAR_OPTIONS[0] }));
                        setUploadError(null);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Default</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileUpload}
                className="hidden"
              />

              {/* Upload Error Alert */}
              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
                  {uploadError}
                </div>
              )}

              {/* Custom Image Web URL Option */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Or Paste Direct Image Web URL
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://example.com/my-photo.jpg"
                      className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyCustomUrl()}
                    disabled={!customUrlInput.trim()}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Apply URL
                  </button>
                </div>
              </div>

              {/* Preset Avatars Selection */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  Or pick a preset avatar
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {AVATAR_OPTIONS.map((url, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setFormData({ ...formData, avatarUrl: url });
                        setUploadError(null);
                      }}
                      className={`relative rounded-xl overflow-hidden p-0.5 transition-all cursor-pointer ${
                        formData.avatarUrl === url
                          ? 'ring-3 ring-blue-500 scale-105 shadow-md'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${idx + 1}`} className="w-11 h-11 rounded-lg object-cover" />
                      {formData.avatarUrl === url && (
                        <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Exam / Ambition
                </label>
                <input
                  type="text"
                  value={formData.targetExamGoal}
                  onChange={(e) => setFormData({ ...formData, targetExamGoal: e.target.value })}
                  placeholder="e.g. CBSE 10th Board (95%+ Target)"
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Daily Study Goal (Minutes)
                </label>
                <input
                  type="number"
                  min={15}
                  max={600}
                  step={15}
                  value={formData.dailyTargetMinutes}
                  onChange={(e) => setFormData({ ...formData, dailyTargetMinutes: parseInt(e.target.value) || 60 })}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>
          </form>
        )}

        {/* TAB 2: Academic Details */}
        {activeTab === 'academic' && (
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                School, Class & Enrolled Subjects
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                EduSpark personalizes textbook chapters, question banks, and DPPs based on these settings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Class / Grade
                </label>
                <select
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-bold"
                >
                  {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Education Board
                </label>
                <select
                  value={formData.board}
                  onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-bold"
                >
                  {['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  School Name
                </label>
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            {/* Subjects Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Enrolled Subjects (Click to toggle)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {AVAILABLE_SUBJECTS.map((subj) => {
                  const isSelected = formData.subjects.includes(subj);
                  return (
                    <button
                      type="button"
                      key={subj}
                      onClick={() => handleSubjectToggle(subj)}
                      className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="truncate">{subj}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </form>
        )}

        {/* TAB 3: Preferences & Notifications */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Language & Notification Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure your AI interaction tone, study alarms, and streak notifications.
              </p>
            </div>

            {/* Preferred Language */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                AI Explanation Language
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { lang: 'English', desc: 'Standard formal academic English' },
                  { lang: 'Hinglish', desc: 'Natural Hindi-English mix used by top toppers' },
                  { lang: 'Hindi', desc: 'Pure Hindi explanations with shuddh terminology' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.lang}
                    onClick={() => setFormData({ ...formData, preferredLanguage: item.lang as LanguagePreference })}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      formData.preferredLanguage === item.lang
                        ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-extrabold text-xs mb-1">{item.lang}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Notification Alerts
              </label>

              {[
                { key: 'dailyStudyReminder', label: 'Daily Study Reminders', desc: 'Notify when daily target hours are pending' },
                { key: 'streakAlert', label: 'Streak Protection Alert', desc: 'Warn before midnight if today\'s streak is incomplete' },
                { key: 'examCountdownAlert', label: 'Exam Countdown Warnings', desc: 'Weekly countdown alerts for upcoming board exams' },
                { key: 'soundEffects', label: 'Audio & Celebration Effects', desc: 'Play sounds during level up and quiz completion' },
              ].map((notif) => (
                <div
                  key={notif.key}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{notif.label}</p>
                    <p className="text-[11px] text-slate-400">{notif.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(notifications as any)[notif.key]}
                    onChange={(e) => setNotifications({ ...notifications, [notif.key]: e.target.checked })}
                    className="w-4 h-4 rounded-md text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Theme & Appearance */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Display & Color Mode
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                EduSpark features a unified high-contrast study theme optimized for readability, eye comfort, and focus.
              </p>
            </div>

            {/* Light / Dark Mode Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Interface Mode
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => { if (theme !== 'light') onToggleTheme(); }}
                  className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                    theme === 'light'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-700 font-black shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  <Sun className="w-5 h-5 text-amber-500" />
                  <div className="text-left">
                    <div className="text-xs font-bold">Light Mode</div>
                    <div className="text-[10px] text-slate-400">High contrast daylight</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { if (theme !== 'dark') onToggleTheme(); }}
                  className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                    theme === 'dark'
                      ? 'bg-blue-500/10 border-blue-500 text-blue-400 font-black shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  <Moon className="w-5 h-5 text-blue-400" />
                  <div className="text-left">
                    <div className="text-xs font-bold">Dark Mode</div>
                    <div className="text-[10px] text-slate-400">Eye-safe midnight navy</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Theme Showcase Card */}
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Signature Unified Theme</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Harmonious Indigo & Slate palette applied consistently across all study tools</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200 dark:border-indigo-800/60">
                ACTIVE
              </span>
            </div>

            {/* Data Export */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Export Student Backup</p>
                <p className="text-[11px] text-slate-400">Download your study history, DPP scores, and notes JSON</p>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
