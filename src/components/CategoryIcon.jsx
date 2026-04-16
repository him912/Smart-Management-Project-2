import { 
  Utensils, 
  Plane, 
  Receipt, 
  ShoppingBag, 
  Gamepad2, 
  HeartPulse, 
  MoreHorizontal
} from 'lucide-react';

const ICON_MAP = {
  Food: Utensils,
  Travel: Plane,
  Bills: Receipt,
  Shopping: ShoppingBag,
  Entertainment: Gamepad2,
  Health: HeartPulse,
  Others: MoreHorizontal,
};

export function CategoryIcon({ category, className }) {
  const Icon = ICON_MAP[category] || MoreHorizontal;
  return <Icon className={className} />;
}
