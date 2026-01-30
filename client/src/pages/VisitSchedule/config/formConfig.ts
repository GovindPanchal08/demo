export const FORM_CONFIGS = {
  SINGLE: {
    title: "Single Visitor Registration",
    description: "Register a single visitor",
    steps: ["visitor_info", "identity", "facilities", "timing"],
  },
  GROUP: {
    title: "Group Visitor Registration",
    description: "Register multiple visitors as a group",
    steps: ["group_info", "visitor_list", "identity", "facilities", "timing"],
  },
} as const;
