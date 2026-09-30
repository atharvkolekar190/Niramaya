import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock3,
  Droplets,
  Hand,
  HeartPulse,
  Leaf,
  Search,
  Salad,
  ShieldCheck,
  Stethoscope,
  X
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';

interface WellnessLibraryProps { onBack: () => void; }
type Category = 'General Health' | 'Preventive Care' | 'Nutrition' | 'Physical Activity' | 'Sleep & Wellness' | 'Hygiene' | 'Health Awareness' | 'Traditional / Home Remedies';
interface HealthResource {
  id: string;
  title: string;
  category: Category;
  description: string;
  keywords: string[];
  icon: LucideIcon;
  introduction: string;
  keyInformation: string[];
  practicalTips: string[];
  whenToConsult?: string;
  source?: string;
}

const categories: Array<{ label: string; value: Category | 'All'; icon: LucideIcon }> = [
  { label: 'All', value: 'All', icon: BookOpen },
  { label: 'General Health', value: 'General Health', icon: Stethoscope },
  { label: 'Preventive Care', value: 'Preventive Care', icon: ShieldCheck },
  { label: 'Nutrition', value: 'Nutrition', icon: Salad },
  { label: 'Physical Activity', value: 'Physical Activity', icon: Activity },
  { label: 'Sleep & Wellness', value: 'Sleep & Wellness', icon: Brain },
  { label: 'Hygiene', value: 'Hygiene', icon: Hand },
  { label: 'Health Awareness', value: 'Health Awareness', icon: HeartPulse },
  { label: 'Traditional / Home Remedies', value: 'Traditional / Home Remedies', icon: Leaf }
];

const resources: HealthResource[] = [
  {
    id: 'checkups', title: 'Understanding Regular Health Checkups', category: 'General Health', icon: Stethoscope,
    description: 'Learn how routine visits can help you discuss health goals and keep important records current.', keywords: ['checkup', 'doctor', 'screening', 'records'],
    introduction: 'A regular health checkup is an opportunity to review your health history, ask questions, and discuss appropriate care with a professional.',
    keyInformation: ['Share medicines, allergies, previous diagnoses, and family history.', 'Ask which checks are appropriate for your age and circumstances.', 'Keep copies of reports and follow-up instructions in your digital health record.'],
    practicalTips: ['Write questions before your visit.', 'Bring recent reports and a current medicine list.', 'Note the agreed next steps after the appointment.'],
    source: 'General educational guidance; discuss personal screening needs with a healthcare professional.'
  },
  {
    id: 'when-doctor', title: 'When to Consult a Doctor', category: 'General Health', icon: HeartPulse,
    description: 'Recognise when a new, persistent, or changing concern deserves professional attention.', keywords: ['doctor', 'symptoms', 'care', 'concern'],
    introduction: 'Health concerns can have many causes. A qualified professional can listen to your history, examine you, and recommend appropriate next steps.',
    keyInformation: ['Contact a clinician when a concern persists, worsens, returns often, or affects daily life.', 'Share when the concern started and what makes it better or worse.', 'Seek urgent local medical help for severe or sudden symptoms.'],
    practicalTips: ['Keep a simple timeline of changes.', 'Bring relevant health records.', 'Do not delay care because of information found online.'],
    whenToConsult: 'Contact a healthcare professional for persistent or worsening concerns. For severe or sudden symptoms, contact local emergency services.'
  },
  {
    id: 'organise-records', title: 'Keeping Your Medical Records Organized', category: 'General Health', icon: BookOpen,
    description: 'Practical ways to keep reports, prescriptions, allergies, and care history easy to find.', keywords: ['records', 'reports', 'prescriptions', 'history'],
    introduction: 'Organised health information can help you and your authorised care team have a clearer conversation about your care.',
    keyInformation: ['Record dates, provider names, diagnoses shared with you, and follow-up plans.', 'Keep allergy and medicine information current.', 'Share records only with trusted, authorised people.'],
    practicalTips: ['Use consistent names and dates for documents.', 'Review your record after a consultation.', 'Ask a provider to clarify anything you do not understand.']
  },
  {
    id: 'preventive-checkups', title: 'Importance of Preventive Checkups', category: 'Preventive Care', icon: ShieldCheck,
    description: 'Understand how preventive conversations support informed decisions before a concern becomes harder to manage.', keywords: ['prevention', 'checkup', 'screening', 'wellness'],
    introduction: 'Preventive care includes conversations, vaccinations, screenings, and habits selected with a healthcare professional for your needs.',
    keyInformation: ['Recommendations vary by age, family history, location, and personal risk.', 'A screening is not a diagnosis; follow-up may be needed.', 'Keep a record of completed vaccinations and tests.'],
    practicalTips: ['Ask why a check is recommended.', 'Bring questions about family history or lifestyle.', 'Follow the provider\'s instructions for follow-up.']
  },
  {
    id: 'vaccination', title: 'Vaccination Awareness', category: 'Preventive Care', icon: ShieldCheck,
    description: 'Learn why keeping vaccination information current matters for personal and community health.', keywords: ['vaccination', 'immunisation', 'prevention', 'records'],
    introduction: 'Vaccines are part of preventive care. A healthcare professional can explain recommendations for your age, health, travel, or work.',
    keyInformation: ['Recommendations differ across life stages and health circumstances.', 'Keep an immunisation record and ask about missed or upcoming doses.', 'Discuss allergies, pregnancy, and medical conditions with a clinician.'],
    practicalTips: ['Use an official health provider for vaccine information.', 'Ask what reactions to expect and when to seek advice.', 'Do not rely on social media claims for personal decisions.']
  },
  {
    id: 'prevention-practices', title: 'Everyday Disease Prevention Practices', category: 'Preventive Care', icon: Droplets,
    description: 'Small, practical habits that support health, including hand hygiene, safe food, rest, and care-seeking.', keywords: ['prevention', 'hygiene', 'food', 'rest'],
    introduction: 'Everyday health habits work together with professional care and public health guidance to support wellbeing.',
    keyInformation: ['Wash hands at key times and handle food safely.', 'Choose regular movement, balanced meals, and adequate rest.', 'Stay home or seek advice when unwell, based on professional guidance.'],
    practicalTips: ['Keep soap accessible.', 'Clean frequently touched surfaces when appropriate.', 'Ask for help when a concern does not improve.']
  },
  {
    id: 'balanced-diet', title: 'Balanced Diet Basics', category: 'Nutrition', icon: Salad,
    description: 'An introduction to varied meals with vegetables, pulses, grains, fruits, and appropriate protein.', keywords: ['nutrition', 'diet', 'food', 'healthy eating'],
    introduction: 'A balanced eating pattern can look different across families and cultures. Variety and moderation are useful starting points.',
    keyInformation: ['Include a variety of vegetables, fruits, pulses, grains, and protein foods.', 'Limit highly processed foods and excess salt or added sugar where possible.', 'Personal needs change with age, activity, health conditions, and medicines.'],
    practicalTips: ['Add one more colourful food to a meal.', 'Plan simple meals around available ingredients.', 'Ask a dietitian or clinician about condition-specific needs.'],
    whenToConsult: 'Seek personalised nutrition advice for diabetes, kidney disease, food allergies, pregnancy, or other health conditions.'
  },
  {
    id: 'hydration', title: 'Staying Hydrated', category: 'Nutrition', icon: Droplets,
    description: 'Understand everyday fluid habits and why hydration needs can vary between people.', keywords: ['nutrition', 'water', 'hydration', 'wellness'],
    introduction: 'Fluids support normal body functions. Needs vary with weather, activity, age, health, and medical advice.',
    keyInformation: ['Drink regularly and pay attention to thirst and local conditions.', 'Water is a useful everyday choice for many people.', 'Some medical conditions require personalised fluid guidance.'],
    practicalTips: ['Carry a clean water bottle when practical.', 'Choose water more often than sugary drinks.', 'Ask a clinician about fluid limits if you have been given them.'],
    whenToConsult: 'Discuss persistent dizziness, vomiting, diarrhoea, or unusual thirst with a healthcare professional.'
  },
  {
    id: 'healthy-eating', title: 'Healthy Eating Habits', category: 'Nutrition', icon: Salad,
    description: 'Simple ways to make meals more regular, varied, and mindful without restrictive rules.', keywords: ['nutrition', 'meals', 'healthy', 'habits'],
    introduction: 'Healthy eating is about patterns over time, not perfection. Cultural foods and family routines can fit into a balanced pattern.',
    keyInformation: ['Eat a varied selection of foods in portions that suit your needs.', 'Notice hunger, fullness, and how different foods make you feel.', 'Avoid sudden restrictive changes without professional guidance.'],
    practicalTips: ['Eat without rushing when possible.', 'Keep nutritious snacks available.', 'Plan meals around your household routine and budget.']
  },
  {
    id: 'regular-activity', title: 'Benefits of Regular Physical Activity', category: 'Physical Activity', icon: Activity,
    description: 'Learn how regular movement can support strength, energy, mobility, and overall wellbeing.', keywords: ['exercise', 'movement', 'activity', 'fitness'],
    introduction: 'Physical activity can include walking, household tasks, stretching, sport, or other movement that fits your abilities and routine.',
    keyInformation: ['Any comfortable movement can be a useful starting point.', 'Build gradually and include rest.', 'Your safe activity level depends on your health and circumstances.'],
    practicalTips: ['Choose an activity you enjoy.', 'Break long sitting periods with gentle movement.', 'Stop if you feel unwell or have concerning pain.'],
    whenToConsult: 'Ask a clinician before changing activity significantly if you have a health condition, injury, or new symptoms.'
  },
  {
    id: 'daily-movement', title: 'Simple Daily Movement Habits', category: 'Physical Activity', icon: Activity,
    description: 'Easy ideas for adding comfortable movement to work, home, and travel routines.', keywords: ['movement', 'walking', 'stretching', 'activity'],
    introduction: 'Small movement breaks can help make an active routine feel manageable and sustainable.',
    keyInformation: ['Stand, walk, stretch, or change position regularly when practical.', 'Use household activities as opportunities for movement.', 'Progress at a pace that feels safe for you.'],
    practicalTips: ['Take a short walk after a meal if comfortable.', 'Set a gentle reminder to change position.', 'Invite family members to join a walk or stretch.']
  },
  {
    id: 'active-safely', title: 'Staying Active Safely', category: 'Physical Activity', icon: HeartPulse,
    description: 'General safety reminders for starting or changing a physical activity routine.', keywords: ['exercise', 'safety', 'activity', 'injury'],
    introduction: 'Safe activity is individual. Comfortable pacing, suitable footwear, hydration, and attention to your body can help.',
    keyInformation: ['Start with manageable intensity and increase gradually.', 'Use appropriate clothing, footwear, and surroundings.', 'Stop and seek advice for severe pain, fainting, chest discomfort, or unusual breathlessness.'],
    practicalTips: ['Choose well-lit, safe places to move.', 'Rest between sessions and allow recovery.', 'Ask a professional to tailor activity after illness or injury.']
  },
  {
    id: 'sleep-habits', title: 'Healthy Sleep Habits', category: 'Sleep & Wellness', icon: Clock3,
    description: 'Create a steadier sleep routine with practical ideas for a calmer evening and bedroom.', keywords: ['sleep', 'rest', 'bedtime', 'wellness'],
    introduction: 'Sleep needs vary, but consistent routines and a comfortable environment can support better rest for many people.',
    keyInformation: ['Keep a regular sleep and wake time when possible.', 'Reduce stimulating activities close to bedtime.', 'Notice whether pain, stress, medicines, or other concerns affect sleep.'],
    practicalTips: ['Keep the bedroom comfortable, quiet, and as dark as practical.', 'Choose a relaxing wind-down activity.', 'Use daylight and gentle activity during the day when possible.'],
    whenToConsult: 'Discuss persistent insomnia, loud snoring with breathing pauses, or significant daytime sleepiness with a clinician.'
  },
  {
    id: 'stress', title: 'Managing Everyday Stress', category: 'Sleep & Wellness', icon: Brain,
    description: 'Gentle strategies for recognising stress and making space for support and recovery.', keywords: ['stress', 'mental wellness', 'rest', 'mindfulness'],
    introduction: 'Stress is a common response to change or pressure. Support, rest, routines, and professional care can all play a role.',
    keyInformation: ['Notice changes in mood, sleep, concentration, and daily functioning.', 'Talking with someone trusted can reduce isolation.', 'There is no need to manage persistent distress alone.'],
    practicalTips: ['Try slow breathing or a short quiet break.', 'Keep regular meals, sleep, and gentle movement where possible.', 'Set one small, achievable task at a time.'],
    whenToConsult: 'Seek professional support for persistent distress, inability to function, or thoughts of self-harm. In immediate danger, contact local emergency services.'
  },
  {
    id: 'rest-recovery', title: 'Importance of Rest and Recovery', category: 'Sleep & Wellness', icon: HeartPulse,
    description: 'Understand why recovery time matters after busy periods, activity, illness, or emotional strain.', keywords: ['rest', 'recovery', 'wellness', 'sleep'],
    introduction: 'Rest supports the body and mind. Recovery needs vary and may increase after illness, injury, or demanding activity.',
    keyInformation: ['Balance activity with breaks and adequate sleep.', 'Return to routines gradually after illness or injury.', 'Persistent fatigue can have many causes and deserves attention.'],
    practicalTips: ['Plan short pauses during demanding days.', 'Choose gentle activities while recovering.', 'Track changes in energy to discuss with a clinician if needed.'],
    whenToConsult: 'Discuss unexplained or persistent fatigue, worsening weakness, or reduced daily function with a healthcare professional.'
  },
  {
    id: 'hand-hygiene', title: 'Hand Hygiene', category: 'Hygiene', icon: Hand,
    description: 'Learn key moments for hand cleaning and practical ways to make the habit easier.', keywords: ['hygiene', 'hands', 'washing', 'prevention'],
    introduction: 'Cleaning hands helps reduce the spread of germs, especially before preparing food, eating, and caring for someone.',
    keyInformation: ['Use soap and clean running water when available.', 'Clean all hand surfaces and dry them well.', 'Use appropriate hand sanitiser when soap and water are not available.'],
    practicalTips: ['Keep soap near commonly used sinks.', 'Teach children by demonstrating the habit.', 'Clean hands after coughing, sneezing, using the toilet, and returning home.']
  },
  {
    id: 'food-hygiene', title: 'Food Hygiene', category: 'Hygiene', icon: Salad,
    description: 'Everyday food handling habits that support safer meals at home and on the go.', keywords: ['hygiene', 'food safety', 'cooking', 'kitchen'],
    introduction: 'Food hygiene includes clean hands and surfaces, separating raw and ready-to-eat foods, and storing food appropriately.',
    keyInformation: ['Wash produce as appropriate and use clean utensils.', 'Keep raw foods separate from cooked foods.', 'Follow storage and reheating guidance for perishable foods.'],
    practicalTips: ['Clean spills promptly.', 'Check food condition before eating.', 'Use safe drinking water for cooking and washing food.'],
    whenToConsult: 'Seek medical advice for persistent vomiting, diarrhoea, fever, or signs of dehydration after suspected foodborne illness.'
  },
  {
    id: 'personal-hygiene', title: 'Personal Hygiene Practices', category: 'Hygiene', icon: ShieldCheck,
    description: 'A respectful guide to everyday skin, oral, bathing, clothing, and personal care routines.', keywords: ['hygiene', 'oral care', 'bathing', 'personal care'],
    introduction: 'Personal hygiene routines support comfort, dignity, and wellbeing. Needs differ by age, health, culture, and access to supplies.',
    keyInformation: ['Clean the body and change clothes as needed.', 'Care for teeth and gums regularly.', 'Use safe, suitable products and avoid sharing personal items.'],
    practicalTips: ['Keep personal items clean and dry.', 'Ask a healthcare worker about persistent irritation or pain.', 'Choose gentle products if your skin is sensitive.'],
    whenToConsult: 'Discuss persistent rashes, sores, pain, unusual discharge, or oral problems with a healthcare professional.'
  },
  {
    id: 'common-symptoms', title: 'Understanding Common Health Symptoms', category: 'Health Awareness', icon: HeartPulse,
    description: 'Learn how to describe common concerns clearly without trying to diagnose yourself.', keywords: ['symptoms', 'awareness', 'pain', 'health'],
    introduction: 'Symptoms such as pain, fever, cough, tiredness, or digestive changes can have many causes. Context and professional assessment matter.',
    keyInformation: ['Note when the symptom began, its pattern, and any changes.', 'Record related symptoms, recent exposures, and relevant health history.', 'Online information cannot confirm the cause of a symptom.'],
    practicalTips: ['Use plain words and a simple timeline with a clinician.', 'Bring questions and relevant records.', 'Avoid self-diagnosing based on a single symptom.'],
    whenToConsult: 'Contact a healthcare professional for persistent, worsening, recurrent, or concerning symptoms.'
  },
  {
    id: 'professional-attention', title: 'When a Health Concern Needs Professional Attention', category: 'Health Awareness', icon: Stethoscope,
    description: 'Understand why changes in symptoms, function, or wellbeing may warrant a professional conversation.', keywords: ['symptoms', 'doctor', 'care', 'awareness'],
    introduction: 'A clinician can help interpret symptoms in context and decide what evaluation or support is appropriate.',
    keyInformation: ['New or worsening concerns should not be ignored.', 'Changes affecting eating, sleeping, movement, work, or daily care are worth discussing.', 'Bring a clear timeline and current medicine information.'],
    practicalTips: ['Contact the appropriate healthcare service.', 'Ask what to monitor while waiting for an appointment.', 'Follow up if the concern changes or does not improve.'],
    whenToConsult: 'For severe, sudden, or potentially life-threatening symptoms, contact local emergency services immediately.'
  },
  {
    id: 'first-aid', title: 'Basic First-Aid Awareness', category: 'Health Awareness', icon: ShieldCheck,
    description: 'General awareness about staying calm, protecting from further harm, and seeking appropriate help.', keywords: ['first aid', 'injury', 'safety', 'awareness'],
    introduction: 'First aid is immediate basic help while arranging appropriate medical care. Recognised training is the best way to learn practical skills.',
    keyInformation: ['Check that the area is safe before helping.', 'Call local emergency services for serious injury or danger.', 'Do not move someone unnecessarily after a major injury unless there is immediate danger.'],
    practicalTips: ['Keep important local phone numbers accessible.', 'Learn first aid from a recognised training provider.', 'Keep a basic first-aid kit supplied and within reach.'],
    whenToConsult: 'Professional assessment is appropriate for serious injury, uncontrolled bleeding, breathing problems, burns, or loss of consciousness.'
  },
  {
    id: 'household-wellness', title: 'Common Household Wellness Practices', category: 'Traditional / Home Remedies', icon: Leaf,
    description: 'A cautious overview of familiar comfort practices, with reminders about limits and professional care.', keywords: ['home remedy', 'traditional', 'wellness', 'comfort'],
    introduction: 'Some households use warm fluids, rest, gentle foods, or soothing routines for comfort during minor concerns. These are not guaranteed treatments.',
    keyInformation: ['Comfort practices should be safe, moderate, and appropriate for the person.', 'Check for allergies, interactions, age-related risks, and health conditions.', 'Do not delay professional care for persistent or severe symptoms.'],
    practicalTips: ['Choose simple, hygienic preparations.', 'Stop if a practice causes discomfort or a reaction.', 'Tell your clinician about remedies or supplements you use.'],
    whenToConsult: 'Discuss symptoms with a healthcare professional if they persist, worsen, or affect daily life.'
  },
  {
    id: 'traditional-indian', title: 'Traditional Indian Home Remedies', category: 'Traditional / Home Remedies', icon: Leaf,
    description: 'Learn how to think carefully about traditional wellness practices without treating them as substitutes for medical care.', keywords: ['traditional', 'Indian', 'home remedy', 'wellness'],
    introduction: 'Traditional practices are part of many families and communities. Preparation, interactions, and personal circumstances all matter.',
    keyInformation: ['A familiar remedy is not automatically safe for everyone.', 'Natural ingredients can still cause allergies or interact with medicines.', 'Examples are general wellness information, not treatment instructions.'],
    practicalTips: ['Use trusted, clean ingredients and avoid extreme preparations.', 'Ask a professional before use during pregnancy or for children.', 'Some people traditionally use warm fluids for comfort during minor throat irritation; persistent or severe symptoms should be discussed with a professional.'],
    whenToConsult: 'Do not use a home remedy as a substitute for assessment, prescribed care, or urgent medical attention.'
  },
  {
    id: 'safe-home-practices', title: 'Safe Use of Common Home-Based Practices', category: 'Traditional / Home Remedies', icon: ShieldCheck,
    description: 'A safety-first checklist for deciding whether a household wellness practice is appropriate.', keywords: ['home remedy', 'safety', 'traditional', 'care'],
    introduction: 'Before trying a home-based practice, consider who will use it, what is in it, how it is prepared, and whether it could delay needed care.',
    keyInformation: ['Avoid unknown mixtures, concentrated substances, and practices that can burn or injure.', 'Do not stop prescribed treatment without speaking to a clinician.', 'Use extra caution for children, older adults, pregnancy, and chronic conditions.'],
    practicalTips: ['Ask a pharmacist or clinician about possible interactions.', 'Use a cautious approach only when appropriate.', 'Keep a note of anything used and any reaction.'],
    whenToConsult: 'Seek professional advice before using a home practice for a significant or ongoing health concern.'
  }
];

function ResourceCard({ resource, onReadMore }: { resource: HealthResource; onReadMore: () => void }) {
  const Icon = resource.icon;
  return <Card className="flex h-full flex-col border-green-100 bg-white shadow-sm transition-shadow hover:shadow-md"><CardHeader><div className="mb-4 flex items-center justify-between gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700"><Icon className="h-5 w-5" aria-hidden="true" /></span><span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">{resource.category}</span></div><CardTitle className="text-xl leading-snug text-gray-900">{resource.title}</CardTitle></CardHeader><CardContent className="flex flex-1 flex-col"><p className="flex-1 leading-relaxed text-gray-600">{resource.description}</p><Button variant="outline" className="mt-6 w-full justify-between" onClick={onReadMore}>Read More<ArrowRight className="h-4 w-4" aria-hidden="true" /></Button></CardContent></Card>;
}

function ResourceDetail({ resource, onBack }: { resource: HealthResource; onBack: () => void }) {
  const Icon = resource.icon;
  return <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6"><Button variant="outline" onClick={onBack} className="mb-8 flex items-center gap-2"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to Wellness Library</Button><article><div className="mb-5 flex items-center gap-3 text-green-700"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100"><Icon className="h-5 w-5" aria-hidden="true" /></span><span className="text-sm font-medium">{resource.category}</span></div><h1 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">{resource.title}</h1><p className="mb-8 text-lg leading-relaxed text-gray-600">{resource.introduction}</p><div className="space-y-8"><section><h2 className="mb-3 text-2xl font-semibold text-gray-900">Key information</h2><ul className="space-y-3 text-gray-600">{resource.keyInformation.map((item) => <li key={item} className="flex items-start gap-3 leading-relaxed"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />{item}</li>)}</ul></section><section><h2 className="mb-3 text-2xl font-semibold text-gray-900">Practical, general tips</h2><ul className="space-y-3 text-gray-600">{resource.practicalTips.map((item) => <li key={item} className="flex items-start gap-3 leading-relaxed"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />{item}</li>)}</ul></section>{resource.whenToConsult && <section className="rounded-xl border border-amber-200 bg-amber-50 p-5"><h2 className="mb-2 text-xl font-semibold text-amber-950">When to consult a doctor</h2><p className="leading-relaxed text-amber-900">{resource.whenToConsult}</p></section>}{resource.source && <p className="border-t border-gray-200 pt-5 text-sm leading-relaxed text-gray-500"><strong>Source / reference:</strong> {resource.source}</p>}</div></article></main>;
}

export default function WellnessLibrary({ onBack }: WellnessLibraryProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [selectedResource, setSelectedResource] = useState<HealthResource | null>(null);
  const filteredResources = useMemo(() => {
    const term = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesCategory = activeCategory === 'All' || resource.category === activeCategory;
      const searchableText = [resource.title, resource.description, resource.category, ...resource.keywords].join(' ').toLowerCase();
      return matchesCategory && (!term || searchableText.includes(term));
    });
  }, [activeCategory, query]);

  return <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50"><header className="sticky top-0 z-20 border-b border-green-100 bg-white/90 backdrop-blur-sm"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6"><Button variant="outline" onClick={onBack} className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to Niramaya</Button><div className="flex items-center gap-2 text-right"><BookOpen className="h-5 w-5 text-green-600" aria-hidden="true" /><span className="font-semibold text-gray-900">Wellness Library</span></div></div></header>{selectedResource ? <ResourceDetail resource={selectedResource} onBack={() => setSelectedResource(null)} /> : <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14"><section className="mb-10 max-w-3xl"><div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-700"><BookOpen className="h-4 w-4" aria-hidden="true" />Niramaya learning library</div><h1 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Niramaya Wellness Library</h1><p className="text-lg leading-relaxed text-gray-600">Explore reliable health information, preventive care tips, healthy lifestyle guidance, and everyday wellness resources. This educational section does not diagnose conditions or replace professional medical advice.</p></section><section className="mb-8 rounded-2xl border border-green-100 bg-white p-4 shadow-sm sm:p-6" aria-label="Search and filter wellness library"><label htmlFor="resource-search" className="mb-2 block text-sm font-medium text-gray-700">Search wellness resources</label><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" /><Input id="resource-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by topic, such as sleep or nutrition" className="h-11 pl-10 pr-10" />{query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"><X className="h-4 w-4" /></button>}</div><div className="mt-5 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Resource categories">{categories.map(({ label, value, icon: Icon }) => <button key={value} type="button" aria-pressed={activeCategory === value} onClick={() => setActiveCategory(value)} className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${activeCategory === value ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50'}`}><Icon className="h-4 w-4" aria-hidden="true" />{label}</button>)}</div></section><div className="mb-5 flex items-center justify-between gap-4"><p className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">{filteredResources.length}</span> resource{filteredResources.length === 1 ? '' : 's'}</p>{(query || activeCategory !== 'All') && <button type="button" onClick={() => { setQuery(''); setActiveCategory('All'); }} className="text-sm font-medium text-green-700 hover:text-green-800">Clear filters</button>}</div>{filteredResources.length > 0 ? <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-label="Wellness resource cards">{filteredResources.map((resource) => <ResourceCard key={resource.id} resource={resource} onReadMore={() => setSelectedResource(resource)} />)}</section> : <Card className="border-dashed border-gray-300 bg-white"><CardContent className="py-14 text-center"><BookOpen className="mx-auto mb-4 h-10 w-10 text-gray-400" aria-hidden="true" /><h2 className="mb-2 text-xl font-semibold text-gray-900">No resources found</h2><p className="mb-5 text-gray-600">Try a different search term or choose another category.</p><Button variant="outline" onClick={() => { setQuery(''); setActiveCategory('All'); }}>Show all resources</Button></CardContent></Card>}<aside className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900"><strong>Important:</strong> These resources are for general education and awareness. For personal advice, diagnosis, treatment, or urgent concerns, contact a qualified healthcare professional.</aside></main>}</div>;
}
