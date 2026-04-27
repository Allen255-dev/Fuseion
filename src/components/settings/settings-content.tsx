"use client";

import { useState } from "react";
import {
  User,
  Settings,
  Monitor,
  Moon,
  Sun,
  X,
  FileText,
  Database,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "~/lib/utils";
import { UserInterface } from "~/types/user";
import { useRouter } from "next/navigation";
import { logoutAction } from "~/app/(auth)/actions";
import { useActionState } from "react";

interface SettingsContentProps {
  user: UserInterface;
}

type SettingsSection = "general" | "profile" | "data" | "about";

export function SettingsContent({ user }: SettingsContentProps) {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("general");
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [, logoutFormAction, isPending] = useActionState(logoutAction, null);

  const sidebarItems = [
    { id: "general", label: "General", icon: Settings },
    { id: "profile", label: "Profile", icon: User },
    { id: "data", label: "Data", icon: Database },
    { id: "about", label: "About", icon: FileText },
  ];

  const RowItem = ({
    label,
    description,
    value,
    action,
    danger = false,
    onClick,
  }: {
    label: string;
    description?: string;
    value?: React.ReactNode;
    action?: React.ReactNode;
    danger?: boolean;
    onClick?: () => void;
  }) => (
    <div
      className={cn(
        "flex items-center justify-between py-4 border-b border-zinc-800/60 last:border-0 gap-4",
        onClick && "cursor-pointer",
      )}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <p
          className={cn("text-sm", danger ? "text-zinc-200" : "text-zinc-200")}
        >
          {label}
        </p>
        {description && (
          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0 flex items-center gap-2">
        {value && <span className="text-sm text-zinc-400">{value}</span>}
        {action}
      </div>
    </div>
  );

  const OutlineButton = ({
    children,
    danger = false,
    onClick,
    type,
  }: {
    children: React.ReactNode;
    danger?: boolean;
    onClick?: () => void;
    type?: "button" | "submit";
  }) => (
    <button
      type={type ?? "button"}
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full border text-sm font-medium transition-colors",
        danger
          ? "border-red-500/60 text-red-400 hover:bg-red-500/10"
          : "border-zinc-700 text-zinc-300 hover:bg-zinc-800",
      )}
    >
      {children}
    </button>
  );

  const Toggle = ({ enabled }: { enabled: boolean }) => (
    <button
      className={cn(
        "w-11 h-6 rounded-full relative transition-colors duration-300",
        enabled ? "bg-blue-500" : "bg-zinc-700",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300",
          enabled ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Theme */}
            <div className="space-y-3">
              <p className="text-sm text-zinc-200">Theme</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "light", icon: Sun, label: "Light" },
                  { id: "dark", icon: Moon, label: "Dark" },
                  { id: "system", icon: Monitor, label: "System" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2.5 py-4 rounded-xl border transition-all duration-200",
                      theme === t.id
                        ? "bg-zinc-700/60 border-zinc-600 text-white"
                        : "bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/40 hover:text-zinc-200",
                    )}
                  >
                    <t.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between border-t border-zinc-800/60 pt-6">
              <p className="text-sm text-zinc-200">Language</p>
              <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium px-4 py-2 rounded-full transition-colors">
                English
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="animate-in fade-in duration-300 space-y-0">
            <RowItem
              label="Name"
              value={
                <span className="flex items-center gap-1.5">
                  {user.name ?? "—"}
                  {/* Google logo indicator */}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </span>
              }
            />
            <RowItem
              label="Email address"
              value={
                <span className="font-mono text-xs">
                  {user.email
                    ? user.email.replace(
                        /^(.{2})(.+)(@.+)$/,
                        (_, a, b, c) =>
                          a + "*".repeat(Math.min(b.length, 5)) + c,
                      )
                    : "—"}
                </span>
              }
            />
            <RowItem label="Phone number" value="—" />
            <RowItem
              label="Log out of all devices"
              action={
                <form action={logoutFormAction}>
                  <OutlineButton type="submit" danger>
                    {isPending ? "Logging out…" : "Log out"}
                  </OutlineButton>
                </form>
              }
            />
            <RowItem
              label="Delete account"
              action={<OutlineButton danger>Delete</OutlineButton>}
            />
          </div>
        );

      case "data":
        return (
          <div className="animate-in fade-in duration-300 space-y-0">
            <div className="flex items-start justify-between py-4 border-b border-zinc-800/60 gap-6">
              <div className="flex-1">
                <p className="text-sm text-zinc-200">
                  Improve the model for everyone
                </p>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Allow your content to be used to train our models and improve
                  our services. We secure your data privacy.
                </p>
              </div>
              <div className="shrink-0 pt-0.5">
                <Toggle enabled={true} />
              </div>
            </div>
            <RowItem
              label="Shared links"
              action={<OutlineButton>Manage</OutlineButton>}
            />
            <div className="flex items-start justify-between py-4 border-b border-zinc-800/60 gap-6">
              <div className="flex-1">
                <p className="text-sm text-zinc-200">Export data</p>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  This data includes your account information and all chat
                  history. Exporting may take some time. The download link will
                  be valid for 7 days.
                </p>
              </div>
              <div className="shrink-0 pt-0.5">
                <OutlineButton>Export</OutlineButton>
              </div>
            </div>
            <RowItem
              label="Delete all chats"
              action={<OutlineButton danger>Delete all</OutlineButton>}
            />
          </div>
        );

      case "about":
        return (
          <div className="animate-in fade-in duration-300 space-y-0">
            <RowItem
              label="Terms of Use"
              action={<OutlineButton>View</OutlineButton>}
            />
            <RowItem
              label="Privacy Policy"
              action={<OutlineButton>View</OutlineButton>}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-[800px] mx-auto bg-[#1c1c1e] rounded-2xl border border-zinc-800/50 shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <h2 className="text-base font-semibold text-white">Settings</h2>
        <button
          onClick={() => router.push("/")}
          className="text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-zinc-800 p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col md:flex-row pb-8">
        {/* Sidebar */}
        <div className="w-full md:w-52 shrink-0 px-3 py-2 space-y-0.5">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as SettingsSection)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                activeSection === item.id
                  ? "bg-[#2d2d30] text-white font-medium"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 font-normal",
              )}
            >
              <item.icon className="h-[17px] w-[17px] shrink-0" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-zinc-800/60 my-2" />

        {/* Content */}
        <div className="flex-1 px-6 md:px-8 pt-4">{renderSection()}</div>
      </div>
    </div>
  );
}
