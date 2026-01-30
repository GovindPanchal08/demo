import { Menu, TableOfContents } from "lucide-react";
import {
  CalenderIcon,
  DocsIcon,
  GridIcon,
  ListIcon,
  PageIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";

type NavItem = {
  id: string;
  name: string;
  icon?: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
  }[];
};

export const navItems: NavItem[] = [
  {
    id: "home",
    name: "Dashboard",
    icon: <GridIcon />,
    path: "/",
  },
  {
    id: "pages",
    name: "Pages",
    icon: <PageIcon />,
    path: "/visit-scheduling",
  },

  {
    id: "templates",
    name: "Templates",
    icon: <TableOfContents />,
    path: "/profile",
  },
  {
    id: "facility",
    name: "Facility Management",
    icon: <UserCircleIcon />,
    path: "/facility",
  },
  // {
  //   id: "menu",
  //   name: "Menu Management",
  //   icon: <Menu />,
  //   path: "/menu",
  // },
  // {
  //   id: "role",
  //   name: "Role Management",
  //   icon: <Menu />,
  //   path: "/role",
  // },
  // {
  //   id: "role-assign",
  //   name: "RoleAssign Management",
  //   icon: <Menu />,
  //   path: "/role-assign",
  // },

  // {
  //   id: "setting",
  //   name: "Setting",
  //   icon: <UserCircleIcon />,
  //   path: "/setting",
  // },
  // {
  //   id: "approve",
  //   name: "Approvals",
  //   icon: <UserCircleIcon />,
  //   path: "/approve",
  // },
  // {
  //   id: "role & permission",
  //   name: "Role and Permission",
  //   icon: <UserCircleIcon />,
  //   path: "/role-permission",
  // },
];
