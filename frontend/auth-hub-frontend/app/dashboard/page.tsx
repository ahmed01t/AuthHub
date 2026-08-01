"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Lock,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Save,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit3,
  ArrowLeft
} from "lucide-react";

type UserData = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
};

type View = "welcome" | "details" | "update" | "password";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || `${backendUrl}/api/v1`;

export default function DashboardPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<View>("welcome");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch current user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(
        `${apiBaseUrl}/auth/me`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      if (data.success && data.data) {
        setUser({
          id: data.data._id,
          name: data.data.fullname,
          email: data.data.email,
          avatar: data.data.avatar,
          role: data.data.role,
          createdAt: data.data.createdAt,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      // If auth fails, redirect to login
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(
        `${apiBaseUrl}/auth/logout`,
        { method: "POST", credentials: "include" }
      );
    } catch (e) {
      // Silent fail
    }
    router.push("/login");
  };

  const navItems: { id: View; label: string; icon: React.ElementType }[] = [
    { id: "welcome", label: "Dashboard", icon: LayoutDashboard },
    { id: "details", label: "My Details", icon: User },
    { id: "update", label: "Update Account", icon: Settings },
    { id: "password", label: "Change Password", icon: Lock },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${sidebarOpen ? "lg:w-72" : "lg:w-20"} flex flex-col`}
      >
        {/* Logo Area */}
        <div className={`h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800 ${!sidebarOpen && "lg:justify-center lg:px-0"}`}>
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className={`font-bold text-xl text-slate-900 dark:text-white transition-opacity ${!sidebarOpen && "lg:hidden"}`}>
            AuthHub
          </span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="ml-auto lg:hidden text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                } ${!sidebarOpen && "lg:justify-center lg:px-0"}`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
                <span className={`${!sidebarOpen && "lg:hidden"}`}>{item.label}</span>
                {isActive && <ChevronRight className={`w-4 h-4 ml-auto ${!sidebarOpen && "lg:hidden"}`} />}
              </button>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className={`p-4 border-t border-slate-200 dark:border-slate-800 ${!sidebarOpen && "lg:p-2"}`}>
          <div className={`bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-3 ${!sidebarOpen && "lg:hidden"}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors ${!sidebarOpen && "lg:justify-center lg:px-0"}`}
          >
            <LogOut className="w-5 h-5" />
            <span className={`${!sidebarOpen && "lg:hidden"}`}>Logout</span>
          </button>
        </div>

        {/* Collapse Toggle (Desktop) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full items-center justify-center shadow-sm hover:shadow-md transition-shadow"
        >
          <ChevronRight className={`w-3 h-3 text-slate-500 transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 sm:p-8 max-w-5xl mx-auto">
          {activeView === "welcome" && <WelcomeView user={user} setActiveView={setActiveView} />}
          {activeView === "details" && <UserDetailsView user={user} />}
          {activeView === "update" && <UpdateAccountView user={user} onUpdate={fetchUser} />}
          {activeView === "password" && <ChangePasswordView />}
        </div>
      </main>
    </div>
  );
}

// ─── Sub-Components ─────────────────────────────────────────────

function WelcomeView({ user, setActiveView }: { user: UserData | null; setActiveView: (v: View) => void }) {
  const firstName = user?.name?.split(" ")[0] || "User";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const quickActions = [
    { label: "View Profile", icon: User, view: "details" as View, color: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" },
    { label: "Edit Account", icon: Edit3, view: "update" as View, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" },
    { label: "Security", icon: Lock, view: "password" as View, color: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Welcome */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <p className="text-indigo-100 text-lg font-medium mb-1">{greeting},</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{firstName}!</h1>
          <p className="text-indigo-100 max-w-xl text-lg leading-relaxed">
            Welcome back to your AuthHub dashboard. Manage your account, update your profile, and keep your credentials secure.
          </p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => setActiveView(action.view)}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{action.label}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your {action.label.toLowerCase()} settings</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Account Status</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatusItem icon={Shield} label="Account Type" value={user?.role || "Standard"} color="text-indigo-600" />
          <StatusItem icon={Mail} label="Email" value={user?.email || "—"} color="text-emerald-600" />
          <StatusItem icon={Phone} label="Phone" value={user?.phone || "Not set"} color="text-blue-600" />
          <StatusItem icon={Calendar} label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"} color="text-purple-600" />
        </div>
      </div>
    </div>
  );
}

function StatusItem({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">{value}</p>
      </div>
    </div>
  );
}

function UserDetailsView({ user }: { user: UserData | null }) {
  if (!user) return null;

  const details = [
    { label: "Full Name", value: user.name, icon: User },
    { label: "Email Address", value: user.email, icon: Mail },
    { label: "Phone Number", value: user.phone || "Not provided", icon: Phone },
    { label: "Account Role", value: user.role || "User", icon: Shield },
    { label: "User ID", value: user.id, icon: CheckCircle2 },
    { label: "Member Since", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—", icon: Calendar },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Details</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Your personal information</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h3>
              <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 mt-2">
                Active
              </span>
            </div>
          </div>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {details.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-4 p-4 sm:px-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <Icon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="font-medium text-slate-900 dark:text-white truncate">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function UpdateAccountView({ user, onUpdate }: { user: UserData | null; onUpdate: () => void }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/update-profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setMessage({ type: "success", text: "Profile updated successfully!" });
      onUpdate();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Update Account</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Edit your profile information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-xl ${message.type === "success" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"}`}>
            {message.type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

function ChangePasswordView() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    if (formData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");
      setMessage({ type: "success", text: "Password changed successfully!" });
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to change password" });
    } finally {
      setSaving(false);
    }
  };

  const PasswordInput = ({
    label,
    value,
    onChange,
    show,
    toggle,
    placeholder,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    toggle: () => void;
    placeholder: string;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          required
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/30 rounded-xl flex items-center justify-center">
          <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Change Password</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Update your security credentials</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-xl ${message.type === "success" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"}`}>
            {message.type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <PasswordInput
          label="Current Password"
          value={formData.currentPassword}
          onChange={(v) => setFormData({ ...formData, currentPassword: v })}
          show={showPasswords.current}
          toggle={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
          placeholder="Enter current password"
        />

        <PasswordInput
          label="New Password"
          value={formData.newPassword}
          onChange={(v) => setFormData({ ...formData, newPassword: v })}
          show={showPasswords.new}
          toggle={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
          placeholder="Enter new password"
        />

        <PasswordInput
          label="Confirm New Password"
          value={formData.confirmPassword}
          onChange={(v) => setFormData({ ...formData, confirmPassword: v })}
          show={showPasswords.confirm}
          toggle={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
          placeholder="Confirm new password"
        />

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-300">
            <p className="font-semibold mb-1">Password Requirements</p>
            <ul className="space-y-1 text-amber-700 dark:text-amber-400">
              <li>• Minimum 6 characters</li>
              <li>• Include both letters and numbers</li>
              <li>• Avoid common words or patterns</li>
            </ul>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
          {saving ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
