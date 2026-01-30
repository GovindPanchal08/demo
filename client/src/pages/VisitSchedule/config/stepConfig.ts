import { User, CreditCard, Clock, Building2 } from "lucide-react";

export const STEP_CONFIGS = {
    visitor_info: { title: "Visitor Info", icon: User },
    group_info: { title: "Group Info", icon: User },
    visitor_list: { title: "Visitor List", icon: User },
    identity: { title: "Identity", icon: CreditCard },
    facilities: { title: "Facilities", icon: Building2 },
    timing: { title: "Timing", icon: Clock },
} as const;
