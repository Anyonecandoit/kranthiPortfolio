"use client";

import {
  FileText, UserCheck, Compass, Mail, Laptop, CalendarDays, MessageSquareHeart,
  GraduationCap, Code2, Bug, FlaskConical, Database, Braces, Table2, Network,
  Boxes, GitBranch, Rocket, Locate, Repeat, LayoutTemplate, PenLine, Heading1,
  Linkedin, Search, Send, FolderOpen, Mic2, Video, Newspaper, AlignLeft,
  ClipboardList, ListOrdered, CheckSquare, Sun, ShieldAlert, Scale, Grid,
  SpellCheck, RefreshCw, FileSymlink, Palette, Target, Zap, User, Feather,
  Reply, Image, Wand2, Podcast, Captions, PenTool, MonitorPlay, Presentation,
  AudioLines, Wrench, type LucideIcon,
} from "lucide-react";

/** Maps the icon *names* in lib/tools.ts to lucide components. */
const TOOL_ICONS: Record<string, LucideIcon> = {
  FileText, UserCheck, Compass, Mail, Laptop, CalendarDays, MessageSquareHeart,
  GraduationCap, Code2, Bug, FlaskConical, Database, Braces, Table2, Network,
  Boxes, GitBranch, Rocket, Locate, Repeat, LayoutTemplate, PenLine, Heading1,
  Linkedin, Search, Send, FolderOpen, Mic2, Video, Newspaper, AlignLeft,
  ClipboardList, ListOrdered, CheckSquare, Sun, ShieldAlert, Scale, Grid,
  SpellCheck, RefreshCw, FileSymlink, Palette, Target, Zap, User, Feather,
  Reply, Image, Wand2, Podcast, Captions, PenTool, MonitorPlay, Presentation,
  AudioLines,
};

export function ToolIcon({
  name,
  size = 20,
  className,
}: {
  name?: string;
  size?: number;
  className?: string;
}) {
  const Icon = (name && TOOL_ICONS[name]) || Wrench;
  return <Icon className={className} size={size} />;
}
