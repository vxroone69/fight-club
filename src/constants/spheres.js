export const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const DAY_NAMES = ["M", "T", "W", "T", "F", "S", "S"];
export const SPHERE_COLORS = ["#8B5CF6", "#A78BFA", "#7C3AED", "#6D28D9", "#9333EA"];
export const SPHERE_ICONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
export const MEMBERS_LIST = ["varun", "vineeth", "ashwin"];

export function defaultMember(name) {
  const isVarun = name === "varun";
  return {
    name,
    displayName: name.charAt(0).toUpperCase() + name.slice(1),
    spheres: isVarun
      ? [
          { id: "dsa", label: "DSA", icon: "1", color: "#8B5CF6", desc: "Striver's — 1 problem minimum" },
          { id: "building", label: "Building", icon: "2", color: "#A78BFA", desc: "Personal projects" },
          { id: "fitness", label: "Fitness", icon: "3", color: "#7C3AED", desc: "Gym + Sport + Walk" },
          { id: "deepwork", label: "Deep Work", icon: "4", color: "#6D28D9", desc: "Docs, books, videos" },
          { id: "work", label: "Work", icon: "5", color: "#9333EA", desc: "Code review + internship" },
        ]
      : [],
    logs: {},
    notes: [],
    setupDone: isVarun,
  };
}
