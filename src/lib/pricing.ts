import { supabaseAdmin } from './supabase-admin';

export interface PricingInput {
  serviceSlug: string;
  rooms?: number;
  bathrooms?: number;
  tier?: 'standard' | 'premium' | 'deep';
  addonIds?: string[];
  zoneSlug?: string;
  date?: string;
  time?: string;
  isRecurring?: boolean;
  isPriority?: boolean;
  propertySizeSqm?: number;
}

export interface PricingResult {
  basePrice: number;
  addonsTotal: number;
  zoneMultiplier: number;
  surgeMultiplier: number;
  tierMultiplier: number;
  recurringDiscount: number;
  priorityFee: number;
  subtotal: number;
  tax: number;
  total: number;
  breakdown: PricingBreakdownItem[];
  currency: string;
}

interface PricingBreakdownItem {
  label: string;
  amount: number;
  type: 'base' | 'addon' | 'multiplier' | 'fee' | 'discount' | 'tax';
}

const TIER_MULTIPLIERS = { standard: 1.0, premium: 1.4, deep: 1.8 };
const TAX_RATE = 0.15; // 15% VAT
const PRIORITY_FEE = 50;
const RECURRING_DISCOUNT = { weekly: 0.15, biweekly: 0.1, monthly: 0.05 };

export async function calculatePrice(input: PricingInput): Promise<PricingResult> {
  const breakdown: PricingBreakdownItem[] = [];

  // Fetch service (DB first, fallback to static)
  type ServiceRecord = { name: string; base_price: number; price_unit: string; min_price: number | null };
  let service: ServiceRecord | null = null;
  const { data: dbService } = await supabaseAdmin
    .from('services_catalog')
    .select('*')
    .eq('slug', input.serviceSlug)
    .eq('is_active', true)
    .single();

  service = (dbService as ServiceRecord | null) ?? STATIC_SERVICES[input.serviceSlug] ?? null;
  if (!service) throw new Error(`Service not found: ${input.serviceSlug}`);

  // Calculate base price
  let basePrice = service.base_price;
  if (service.price_unit === 'per_room' && input.rooms) {
    basePrice = service.base_price * input.rooms;
    if (input.bathrooms) basePrice += (service.base_price * 0.5) * input.bathrooms;
  } else if (service.price_unit === 'per_sqm' && input.propertySizeSqm) {
    basePrice = service.base_price * input.propertySizeSqm;
  }
  if (service.min_price) basePrice = Math.max(basePrice, service.min_price);
  breakdown.push({ label: service.name, amount: basePrice, type: 'base' });

  // Tier multiplier
  const tier = input.tier || 'standard';
  const tierMult = TIER_MULTIPLIERS[tier];
  if (tierMult !== 1.0) {
    const tierExtra = basePrice * (tierMult - 1);
    breakdown.push({ label: `${tier} tier upgrade`, amount: tierExtra, type: 'multiplier' });
  }
  basePrice = basePrice * tierMult;

  // Add-ons
  let addonsTotal = 0;
  if (input.addonIds?.length) {
    const { data: addons } = await supabaseAdmin
      .from('service_addons')
      .select('*')
      .in('id', input.addonIds)
      .eq('is_active', true);
    for (const addon of addons || []) {
      addonsTotal += addon.price;
      breakdown.push({ label: addon.name, amount: addon.price, type: 'addon' });
    }
  }

  // Zone multiplier
  let zoneMult = 1.0;
  if (input.zoneSlug) {
    const { data: zone } = await supabaseAdmin
      .from('service_zones')
      .select('base_price_multiplier, surge_multiplier')
      .eq('slug', input.zoneSlug)
      .single();
    if (zone) {
      zoneMult = zone.base_price_multiplier * zone.surge_multiplier;
    }
  }

  // Time-based surge from pricing rules
  let surgeMult = 1.0;
  if (input.date && input.time) {
    const dayOfWeek = new Date(input.date).getDay(); // 0=Sun
    const { data: rules } = await supabaseAdmin
      .from('pricing_rules')
      .select('*')
      .eq('type', 'time_surge')
      .eq('is_active', true)
      .order('priority', { ascending: false });

    for (const rule of rules || []) {
      const cond = rule.conditions as Record<string, unknown>;
      if (cond.days_of_week && Array.isArray(cond.days_of_week)) {
        if ((cond.days_of_week as number[]).includes(dayOfWeek)) {
          surgeMult = Math.max(surgeMult, rule.multiplier);
        }
      }
    }
  }

  if (zoneMult !== 1.0) {
    breakdown.push({
      label: 'Zone adjustment',
      amount: basePrice * (zoneMult - 1),
      type: 'multiplier',
    });
  }

  // Priority fee
  let priorityFee = 0;
  if (input.isPriority) {
    priorityFee = PRIORITY_FEE;
    breakdown.push({ label: 'Priority booking fee', amount: priorityFee, type: 'fee' });
  }

  // Recurring discount
  let recurringDiscount = 0;

  const subtotalBeforeDiscount =
    (basePrice + addonsTotal) * zoneMult * surgeMult + priorityFee;
  const tax = subtotalBeforeDiscount * TAX_RATE;
  const total = subtotalBeforeDiscount - recurringDiscount + tax;

  breakdown.push({ label: 'VAT (15%)', amount: tax, type: 'tax' });

  return {
    basePrice: Math.round(basePrice * 100) / 100,
    addonsTotal: Math.round(addonsTotal * 100) / 100,
    zoneMultiplier: zoneMult,
    surgeMultiplier: surgeMult,
    tierMultiplier: tierMult,
    recurringDiscount,
    priorityFee,
    subtotal: Math.round(subtotalBeforeDiscount * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
    breakdown,
    currency: 'SAR',
  };
}

export function applyDiscount(total: number, discountAmount: number): number {
  return Math.max(0, total - discountAmount);
}

// Static fallback services (used when DB table is empty)
const STATIC_SERVICES: Record<string, { name: string; base_price: number; price_unit: string; min_price: number | null }> = {
  'standard-cleaning':  { name: 'Standard Cleaning',           base_price: 50,  price_unit: 'per_hour', min_price: 150 },
  'deep-cleaning':      { name: 'Deep Cleaning',               base_price: 250, price_unit: 'flat',     min_price: 250 },
  'move-in-out':        { name: 'Move-in / Move-out Cleaning', base_price: 400, price_unit: 'flat',     min_price: 400 },
  'sofa-steam':         { name: 'Sofa & Carpet Steam Cleaning', base_price: 150, price_unit: 'flat',    min_price: 150 },
  'ac-duct-cleaning':   { name: 'AC Duct & Vent Cleaning',     base_price: 200, price_unit: 'flat',     min_price: 200 },
  'marble-polishing':   { name: 'Marble Polishing',            base_price: 300, price_unit: 'flat',     min_price: 300 },
  'water-tank':         { name: 'Water Tank Disinfection',     base_price: 180, price_unit: 'flat',     min_price: 180 },
  'nano-coating':       { name: 'Nano-Coating Dust Shield',    base_price: 350, price_unit: 'flat',     min_price: 350 },
  'post-construction':  { name: 'Post-Construction Cleaning',  base_price: 500, price_unit: 'flat',     min_price: 500 },
  'dust-storm-recovery':{ name: 'Dust Storm Recovery',         base_price: 220, price_unit: 'flat',     min_price: 220 },
};
