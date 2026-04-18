import { Home, Sparkles, Building2, Trees, Droplets, Paintbrush, ShieldCheck } from 'lucide-react';

export const servicesData = [
  {
    slug: 'standard-cleaning',
    title: 'Standard Cleaning',
    description: 'Perfect for regular upkeep of your home. We cover all the essentials to keep your living space fresh and tidy.',
    fullDescription: 'Our standard cleaning service is designed for homes that need a regular refresh. Our professional cleaners follow a comprehensive checklist to ensure every room in your house is spotless.',
    Icon: Home,
    color: '#3b82f6',
    features: ['Dusting all surfaces', 'Mopping and vacuuming', 'Kitchen & bathroom sanitization', 'Trash removal', 'Bedroom tidying'],
    pricing: 'Starting from 50 SAR/hr'
  },
  {
    slug: 'deep-cleaning',
    title: 'Deep Cleaning',
    description: 'A thorough, top-to-bottom scrub of your entire home. Ideal for seasonal cleaning or special occasions.',
    fullDescription: 'When your home needs more than just a surface clean, our Deep Cleaning service is the answer. We reach the spots that are often missed, including behind appliances and inside cabinets.',
    Icon: Sparkles,
    color: '#8b5cf6',
    features: ['Inside window cleaning', 'Grout scrubbing', 'Cabinet interior cleaning', 'Upholstery vacuuming', 'Baseboard wiping'],
    pricing: 'Starting from 250 SAR'
  },
  {
    slug: 'move-in-out',
    title: 'Move-in / Move-out',
    description: 'Expert cleaning for your new beginning or making sure you leave your old place in perfect condition.',
    fullDescription: 'Moving is stressful enough. Let us handle the cleaning. Our move-in/out service ensures your new home is sanitized and ready for you, or your old home is left in pristine condition for the next tenants.',
    Icon: Building2,
    color: '#10b981',
    features: ['Empty cabinet cleaning', 'Appliance deep clean', 'Wall washing', 'Full floor restoration', 'Disinfection of all surfaces'],
    pricing: 'Starting from 400 SAR'
  },
  {
    slug: 'sofa-carpet-cleaning',
    title: 'Sofa & Carpet Steam Cleaning',
    description: 'Professional steam cleaning for your upholstery, removing dust mites, allergens, and tough stains.',
    fullDescription: 'Our advanced steam cleaning technology penetrates deep into fabric fibers to remove deep-seated dust and bacteria. Perfect for Riyadh\'s dusty climate.',
    Icon: Droplets,
    color: '#0ea5e9',
    features: ['Deep steam extraction', 'Stain spot treatment', 'Odor neutralization', 'Quick-dry technology', 'Fabric protection'],
    pricing: 'Starting from 150 SAR'
  },
  {
    slug: 'water-tank-cleaning',
    title: 'Water Tank Disinfection',
    description: 'Ensure your family\'s health with our certified water tank cleaning and sterilization service.',
    fullDescription: 'We use municipality-approved sterilization methods to clean and disinfect your ground and roof tanks, ensuring your water remains pure and safe for use.',
    Icon: Droplets,
    color: '#06b6d4',
    features: ['Sludge removal', 'High-pressure washing', 'Chlorination & sterilization', 'Water testing', 'Leakage inspection'],
    pricing: 'Starting from 300 SAR'
  },
  {
    slug: 'ac-vent-cleaning',
    title: 'AC Duct & Vent Cleaning',
    description: 'Improve indoor air quality and AC efficiency with our specialized duct cleaning service.',
    fullDescription: 'Dust and mold in AC vents can cause respiratory issues. We deep clean your entire AC system to ensure you breathe fresh, clean air in your home.',
    Icon: Sparkles,
    color: '#14b8a6',
    features: ['Duct inspection', 'Debris removal', 'Antimicrobial fogging', 'Filter cleaning', 'Efficiency testing'],
    pricing: 'Starting from 200 SAR'
  },
  {
    slug: 'marble-polishing',
    title: 'Marble Polishing & Restoration',
    description: 'Restore the shine and elegance of your marble floors with our diamond-pad polishing system.',
    fullDescription: 'We use the latest Italian diamond-pad technology to remove scratches and stains from your marble floors, restoring them to a mirror-like finish.',
    Icon: Paintbrush,
    color: '#f97316',
    features: ['Scratch removal', 'Diamond pad honing', 'Crystallization', 'Sealing & protection', 'Mirror finish buffing'],
    pricing: 'Contact for Quote'
  },
  {
    slug: 'dust-storm-recovery',
    title: 'Dust Storm (Haboob) Recovery',
    description: 'Specialized emergency cleaning service to restore your home immediately after a Riyadh dust storm.',
    fullDescription: 'Riyadh\'s sandstorms leave a fine layer of silica dust that can damage electronics and affect health. Our Haboob Recovery team uses specialized micro-filter vacuums and wet-wiping techniques to remove every trace of sand from your home.',
    Icon: Trees,
    color: '#d97706',
    features: ['Micro-dust removal', 'External window washing', 'AC filter replacement', 'Outdoor terrace scrubbing', 'Air purification'],
    pricing: 'Priority Pricing'
  },
  {
    slug: 'nano-coating-shield',
    title: 'Nano-Coating Dust Shield',
    description: 'Advanced surface protection that repels dust, sand, and water, keeping your home clean for longer.',
    fullDescription: 'Using cutting-edge nanotechnology, we apply a transparent, non-toxic coating to your windows, marble, and exterior surfaces. This shield prevents dust from sticking, making your home virtually self-cleaning for up to 6 months.',
    Icon: ShieldCheck,
    color: '#6366f1',
    features: ['Dust-repellent technology', 'UV protection for surfaces', 'Mirror-shine finish', '6-month durability', 'Water-resistant coating'],
    pricing: 'Custom Quote'
  },
  {
    slug: 'post-construction',
    title: 'Post-Construction',
    description: 'Removal of dust, debris, and residues after renovation or new construction.',
    fullDescription: 'Construction leaves behind a specific kind of mess. Our team is equipped with industrial tools to remove fine dust, paint splatters, and construction debris, making your new space livable.',
    Icon: Paintbrush,
    color: '#f59e0b',
    features: ['Fine dust removal', 'Paint & sticker removal', 'Window track cleaning', 'Ventilation dusting', 'Deep floor scrubbing'],
    pricing: 'Contact for Quote'
  }
];
