
import React from 'react';
import { 
  CandidateData, 
  AgeRange, 
  MaritalStatus, 
  Motivation, 
  TimeFrame
} from '../types';

interface CandidateFormProps {
  onSubmit: (data: CandidateData) => void;
  isLoading: boolean;
}

const TRAITS_OPTIONS = [
  { label: "Nyitott az új dolgokra", value: "open" },
  { label: "Magabiztos", value: "confident" },
  { label: "Negatív", value: "negative" },
  { label: "Vállalkozó szellemű", value: "entrepreneur" },
  { label: "Törődő", value: "caring" },
  { label: "Visszahúzódó", value: "introverted" },
  { label: "Pozitív gondolkodású", value: "positive" },
  { label: "Elégedetlen", value: "dissatisfied" },
  { label: "Alkalmazott", value: "employee" }
];

const CandidateForm: React.FC<CandidateFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = React.useState<CandidateData>({
    age: AgeRange.A30_35,
    hasChildren: false,
    maritalStatus: MaritalStatus.SINGLE,
    occupation: '',
    residence: '',
    traits: [],
    motivation: Motivation.FREEDOM,
    timeAvailability: TimeFrame.T5_10,
    salesExperience: false,
    discType: '',
    notes: '',
  });

  const handleLoadTestData = () => {
    setFormData({
      age: AgeRange.A30_35,
      hasChildren: true,
      maritalStatus: MaritalStatus.MARRIED,
      occupation: 'Értékesítési menedzser / Coach',
      residence: 'Budapest',
      traits: ['open', 'positive', 'entrepreneur', 'confident'],
      motivation: Motivation.FREEDOM,
      timeAvailability: TimeFrame.T10_PLUS,
      salesExperience: true,
      discType: 'I',
      notes: 'Ambiciózus, keresi az új kihívásokat. Szeretne kilépni a mókuskerékből és saját vállalkozást építeni, ahol ő osztja be az idejét. Fontos számára a közösség és a szakmai elismerés.',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTraitToggle = (val: string) => {
    setFormData(prev => ({
      ...prev,
      traits: prev.traits.includes(val) 
        ? prev.traits.filter(t => t !== val) 
        : [...prev.traits, val]
    }));
  };

  const inputClasses = "w-full px-5 py-3 rounded-2xl bg-white border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm text-sm font-medium";
  const labelClasses = "block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1";
  const sectionTitleClasses = "text-xl font-black text-[#323d5a] mb-8 flex items-center gap-4";

  const renderPills = <T extends string>(
    label: string, 
    options: T[], 
    currentValue: T, 
    onChange: (val: T) => void
  ) => (
    <div className="flex flex-col">
      <label className={labelClasses}>{label}</label>
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-50/50 rounded-[1.5rem] border border-gray-100">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 min-w-[80px] py-2.5 px-4 rounded-xl text-[11px] font-bold transition-all duration-300 ${
              currentValue === opt
              ? 'bg-white text-blue-500 shadow-md shadow-blue-50 border-white ring-1 ring-blue-50'
              : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="glass-card rounded-[3rem] p-8 md:p-16 animate-fade shadow-2xl">
      <div className="mb-14 text-center md:text-left">
        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">LEADERSHIP PROFILER</span>
        <h2 className="text-4xl font-black text-[#323d5a] tracking-tight leading-tight">Jelölt Elemzése</h2>
        <p className="text-gray-400 mt-2 font-medium">Készítsd elő a tökéletes megkeresést másodpercek alatt.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-14">
        <section>
          <h3 className={sectionTitleClasses}>
            <span className="w-10 h-10 rounded-2xl hub-gradient-bg text-white shadow-lg shadow-blue-100 flex items-center justify-center text-sm font-black italic">01</span>
            Személyes Adatok
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              {renderPills("Életkor", Object.values(AgeRange), formData.age, (v) => setFormData({...formData, age: v}))}
            </div>
            
            <div className="flex flex-col">
              <label className={labelClasses}>Szülő?</label>
              <div className="flex gap-2 p-1.5 bg-gray-50/50 rounded-[1.5rem] border border-gray-100">
                {[true, false].map((opt) => (
                  <button
                    key={opt ? 'igen' : 'nem'}
                    type="button"
                    onClick={() => setFormData({...formData, hasChildren: opt})}
                    className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300 ${
                      formData.hasChildren === opt
                      ? 'bg-white text-blue-600 shadow-md shadow-blue-50'
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {opt ? 'Igen' : 'Nem'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              {renderPills("Státusz", Object.values(MaritalStatus), formData.maritalStatus, (v) => setFormData({...formData, maritalStatus: v}))}
            </div>

            <div>
              <label className={labelClasses}>Jelenlegi szakma</label>
              <input 
                type="text" 
                value={formData.occupation}
                onChange={e => setFormData({...formData, occupation: e.target.value})}
                placeholder="Pl. Marketing menedzser"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Helyszín</label>
              <input 
                type="text" 
                value={formData.residence}
                onChange={e => setFormData({...formData, residence: e.target.value})}
                placeholder="Város"
                className={inputClasses}
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className={sectionTitleClasses}>
            <span className="w-10 h-10 rounded-2xl hub-gradient-bg text-white shadow-lg shadow-blue-100 flex items-center justify-center text-sm font-black italic">02</span>
            Karakterjegyek
          </h3>
          <div className="flex flex-wrap gap-3">
            {TRAITS_OPTIONS.map((trait) => {
              const active = formData.traits.includes(trait.value);
              return (
                <button
                  key={trait.value}
                  type="button"
                  onClick={() => handleTraitToggle(trait.value)}
                  className={`px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-tight transition-all duration-300 border ${
                    active 
                    ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm shadow-blue-50 scale-[1.03]' 
                    : 'bg-white text-gray-400 border-gray-200 hover:border-blue-200 hover:text-blue-500'
                  }`}
                >
                  {trait.label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className={sectionTitleClasses}>
            <span className="w-10 h-10 rounded-2xl hub-gradient-bg text-white shadow-lg shadow-blue-100 flex items-center justify-center text-sm font-black italic">03</span>
            Üzleti Célok
          </h3>
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                {renderPills("Szabad kapacitás", Object.values(TimeFrame), formData.timeAvailability, (v) => setFormData({...formData, timeAvailability: v}))}
              </div>
              
              <div className="flex flex-col">
                <label className={labelClasses}>Legfőbb vonzerő</label>
                <select 
                  value={formData.motivation}
                  onChange={e => setFormData({...formData, motivation: e.target.value as Motivation})}
                  className={`${inputClasses} appearance-none bg-[right_1.25rem_center] bg-no-repeat`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                >
                  {Object.values(Motivation).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label className={labelClasses}>Értékesítési múlt</label>
                <div className="flex gap-2 p-1.5 bg-gray-50/50 rounded-[1.5rem] border border-gray-100">
                  {['Igen', 'Nem'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({...formData, salesExperience: opt === 'Igen'})}
                      className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300 ${
                        (opt === 'Igen' && formData.salesExperience) || (opt === 'Nem' && !formData.salesExperience)
                        ? 'bg-white text-blue-600 shadow-md shadow-blue-50'
                        : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={labelClasses}>Személyiségtípus (DISC)</label>
                <select 
                  value={formData.discType}
                  onChange={e => setFormData({...formData, discType: e.target.value})}
                  className={`${inputClasses} appearance-none bg-[right_1.25rem_center] bg-no-repeat`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                >
                  <option value="">Ha ismered, válaszd ki...</option>
                  <option value="D">D (Domináns) - Határozott, gyors döntéshozó</option>
                  <option value="I">I (Befolyásoló) - Lelkes, társasági</option>
                  <option value="S">S (Stabil) - Megbízható, türelmes</option>
                  <option value="C">C (Elemző) - Precíz, adatvezérelt</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className={labelClasses}>Személyes megjegyzések</label>
              <textarea 
                rows={4}
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                placeholder="Mire figyeljek a megkeresésnél?"
                className={`${inputClasses} resize-none pt-4`}
              />
            </div>
          </div>
        </section>

        <div className="space-y-4 pt-6">
          <button
            disabled={isLoading}
            type="submit"
            className={`w-full py-6 rounded-3xl text-white font-black text-xl shadow-2xl transform transition-all active:scale-[0.97] flex items-center justify-center gap-4 ${
              isLoading ? 'bg-slate-400 cursor-not-allowed' : 'hub-gradient-bg hover:shadow-blue-200'
            }`}
          >
            {isLoading ? 'Stratégia készítése...' : 'Intelligens Elemzés'}
          </button>

          <button 
            type="button" 
            onClick={handleLoadTestData}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-100 text-gray-300 font-bold text-[10px] uppercase tracking-widest hover:border-blue-200 hover:text-blue-400 transition-all flex items-center justify-center gap-2"
          >
            Példa adatok betöltése
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm;
