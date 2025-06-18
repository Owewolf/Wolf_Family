import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "1 day ago";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export function getFamilyMemberColor(memberId: number): string {
  const colors = {
    1: "bg-forest", // Steven
    2: "bg-rose-500", // Liesel
    3: "bg-pink-500", // Farrah
    4: "bg-blue-500", // Carter
  };
  return colors[memberId as keyof typeof colors] || "bg-gray-500";
}

export function getFamilyMemberInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

export function getFamilyMemberFont(memberId: number): string {
  const fonts = {
    1: "font-steven", // Steven - Red Hat Display
    2: "font-liesel", // Liesel - Unkempt
    3: "font-farrah", // Farrah - Shadows Into Light
    4: "font-carter", // Carter - Cedarville Cursive
  };
  return fonts[memberId as keyof typeof fonts] || "font-roboto";
}
