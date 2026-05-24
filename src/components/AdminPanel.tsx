import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Lock, 
  LogOut, 
  LayoutDashboard,
  Image as ImageIcon,
  Tag as TagIcon,
  Palette,
  Briefcase,
  TrendingUp,
  Settings,
  User as UserIcon,
  Search,
  MessageSquare,
  Activity,
  Clock,
  CheckCircle,
  ExternalLink,
  Users,
  Star,
  Database
} from 'lucide-react';
import { auth, loginWithEmail, logout } from '../lib/firebase';
import { 
  getProjects, 
  createProject, 
  editProject, 
  removeProject, 
  Project, 
  getContactInquiries, 
  ContactEntry,
  subscribeToProjects,
  subscribeToContact,
  getReviews,
  createReview,
  getTeam,
  createTeamMember,
  removeTeamMember,
  getOrders,
  createOrder,
  updateOrder,
  uploadImage,
  Review,
  TeamMember,
  Order 
} from '../lib/db';
import { cn } from '../lib/utils';
import { onAuthStateChanged, User } from 'firebase/auth';

type TabType = 'overview' | 'projects' | 'messages' | 'reviews' | 'team' | 'orders' | 'settings';

export default function AdminPanel() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contactInquiries, setContactInquiries] = useState<ContactEntry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'connecting'>('connecting');
  const [searchQuery, setSearchQuery] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form States
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Web Engineering',
    description: '',
    image: '',
    projectUrl: '',
    tags: '',
    color: '#00aaff'
  });

  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    image: '',
    bio: '',
    github: '',
    linkedin: '',
    twitter: ''
  });

  const [reviewForm, setReviewForm] = useState({
    clientName: '',
    role: '',
    content: '',
    rating: 5,
    service: ''
  });

  const ADMIN_EMAIL = 'mrbadshaff@gmail.com';

  useEffect(() => {
    let unsubProjects: (() => void) | undefined;
    let unsubContacts: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      const isUserAdmin = user?.email === ADMIN_EMAIL;
      setIsAdmin(isUserAdmin);
      
      if (isUserAdmin) {
        unsubProjects = subscribeToProjects(setProjects);
        unsubContacts = subscribeToContact(setContactInquiries);
        loadData();
      } else {
        if (unsubProjects) { unsubProjects(); unsubProjects = undefined; }
        if (unsubContacts) { unsubContacts(); unsubContacts = undefined; }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubProjects) unsubProjects();
      if (unsubContacts) unsubContacts();
    };
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [projData, contactData, reviewData, teamData, orderData] = await Promise.all([
        getProjects(),
        getContactInquiries(),
        getReviews(),
        getTeam(),
        getOrders()
      ]);
      setProjects(projData);
      setContactInquiries(contactData);
      setReviews(reviewData);
      setTeam(teamData);
      setOrders(orderData);
      checkDbStatus();
    } finally {
      setIsLoading(false);
    }
  };

  const checkDbStatus = async () => {
    try {
      const res = await fetch('/api/db-status');
      const data = await res.json();
      setDbStatus(data.status === 'connected' ? 'connected' : 'error');
    } catch {
      setDbStatus('error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'project' | 'team' | 'review') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      if (target === 'project') setProjectForm(prev => ({ ...prev, image: url }));
      if (target === 'team') setTeamForm(prev => ({ ...prev, image: url }));
    } catch (err) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenModal = (item?: any) => {
    if (activeTab === 'projects') {
      if (item) {
        setEditingItem(item);
        setProjectForm({
          title: item.title,
          category: item.category,
          description: item.description,
          image: item.image,
          projectUrl: item.projectUrl || '',
          tags: item.tags.join(', '),
          color: item.color
        });
      } else {
        setEditingItem(null);
        setProjectForm({
          title: '',
          category: 'Web Engineering',
          description: '',
          image: '',
          projectUrl: '',
          tags: '',
          color: '#00aaff'
        });
      }
    } else if (activeTab === 'team') {
      if (item) {
        setEditingItem(item);
        setTeamForm({
          name: item.name,
          role: item.role,
          image: item.image,
          bio: item.bio,
          github: item.socials.github || '',
          linkedin: item.socials.linkedin || '',
          twitter: item.socials.twitter || ''
        });
      } else {
        setEditingItem(null);
        setTeamForm({
          name: '',
          role: '',
          image: '',
          bio: '',
          github: '',
          linkedin: '',
          twitter: ''
        });
      }
    } else if (activeTab === 'reviews') {
      setEditingItem(null);
      setReviewForm({
        clientName: '',
        role: '',
        content: '',
        rating: 5,
        service: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (activeTab === 'projects') {
        const data = {
          ...projectForm,
          tags: projectForm.tags.split(',').map(t => t.trim()).filter(t => t !== '')
        };
        if (editingItem?.id) await editProject(editingItem.id, data);
        else await createProject(data);
      } else if (activeTab === 'team') {
        const data = {
          name: teamForm.name,
          role: teamForm.role,
          image: teamForm.image,
          bio: teamForm.bio,
          socials: {
            github: teamForm.github,
            linkedin: teamForm.linkedin,
            twitter: teamForm.twitter
          }
        };
        await createTeamMember(data);
      } else if (activeTab === 'reviews') {
        await createReview(reviewForm);
      }
      
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      alert('Failed to save. Check console.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this item?')) {
      if (activeTab === 'projects') await removeProject(id);
      if (activeTab === 'team') await removeTeamMember(id);
      await loadData();
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    try {
      await loginWithEmail(loginEmail, loginPassword);
    } catch (error: any) {
      setAuthError('Invalid credentials or access denied.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return (
    <div className="flex items-center justify-center min-h-[600px]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-10 rounded-[2.5rem] w-full max-w-md border-nexus-cyan/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-nexus-cyan/5 blur-[60px] -mr-16 -mt-16" />
        
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-nexus-cyan/10 rounded-2xl flex items-center justify-center mb-6 relative">
            <Lock className="w-8 h-8 text-nexus-cyan" />
            <div className="absolute inset-0 bg-nexus-cyan/20 blur-xl rounded-full" />
          </div>
          <h3 className="text-3xl font-display font-bold">Secure Node</h3>
          <p className="text-white/40 text-sm mt-2">Enter credentials to establish stable link</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Terminal ID</label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-nexus-cyan transition-colors" />
              <input 
                type="email"
                required
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:border-nexus-cyan focus:bg-white/[0.06] transition-all outline-none text-sm"
                placeholder="admin@nexus.io"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Access Key</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-nexus-cyan transition-colors" />
              <input 
                type="password"
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:border-nexus-cyan focus:bg-white/[0.06] transition-all outline-none text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {authError && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-400 text-[10px] uppercase font-bold tracking-widest text-center py-2 bg-red-400/5 rounded-lg border border-red-400/10"
            >
              {authError}
            </motion.p>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-4 flex items-center justify-center gap-3 disabled:opacity-50 group mt-4 overflow-hidden relative"
          >
            <span className="relative z-10">{isLoading ? 'Bypassing...' : 'Establish Connection'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-nexus-cyan to-nexus-teal opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </form>
        
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-mono">Encypted Session Protocol v4.0.2</p>
        </div>
      </motion.div>
    </div>
  );

  if (!isAdmin) return (
    <div className="flex flex-col items-center justify-center p-8 glass rounded-3xl min-h-[400px]">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 relative">
        <Lock className="w-10 h-10 text-red-500" />
        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
      </div>
      <h3 className="text-2xl font-bold mb-2 text-red-500">Access Revoked</h3>
      <p className="text-white/40 text-center mb-8 max-w-sm">
        Credentials <span className="text-nexus-cyan">({currentUser.email})</span> do not carry sufficient Clearance Level 5 permissions for this terminal.
      </p>
      <button onClick={logout} className="btn-secondary flex items-center gap-2">
        <LogOut className="w-4 h-4" /> Switch Identity
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-nexus-dark text-white flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-nexus-charcoal border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded bg-nexus-cyan flex items-center justify-center">
             <LayoutDashboard className="w-5 h-5 text-nexus-dark" />
           </div>
           <span className="font-display font-bold tracking-tighter text-nexus-cyan">TACTICAL COMMAND</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X className="w-6 h-6 text-nexus-cyan" /> : <Activity className="w-6 h-6 text-nexus-cyan" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed inset-y-0 left-0 z-[60] w-[280px] bg-[#080808] border-r border-white/10 flex flex-col lg:sticky lg:h-screen lg:z-40",
              !isSidebarOpen && "hidden lg:flex"
            )}
          >
            <div className="p-6 border-b border-white/5 bg-[#0a0a0a]">
              <h2 className="font-display font-bold text-xl leading-tight uppercase tracking-tighter text-[#4da6ff]">
                TACTICAL COMMAND
              </h2>
              <p className="text-nexus-cyan/40 font-mono text-[9px] tracking-widest mt-1">NODE_STATION_A9</p>
            </div>

            <nav className="flex-1 py-4 overflow-y-auto border-b border-white/5">
              {[
                { id: 'overview', icon: LayoutDashboard, label: 'Tactical Overview' },
                { id: 'projects', icon: Database, label: 'Asset Management' },
                { id: 'orders', icon: TrendingUp, label: 'Active Orders' },
                { id: 'team', icon: Users, label: 'Core Operatives' },
                { id: 'reviews', icon: MessageSquare, label: 'Testimonials' },
                { id: 'messages', icon: Clock, label: 'Sync Requests' },
                { id: 'settings', icon: Settings, label: 'Terminal Control' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as TabType);
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-4 text-sm font-medium transition-all duration-200 border-l-4",
                    activeTab === tab.id 
                      ? "bg-[#7accff] text-[#050505] border-[#7accff]" 
                      : "text-white/60 hover:bg-white/5 hover:text-white border-transparent"
                  )}
                >
                  <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-[#050505]" : "text-white/40")} />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="p-6 bg-[#0a0a0a] space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Node_Health</span>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    dbStatus === 'connected' ? "bg-nexus-cyan animate-pulse" : 
                    dbStatus === 'connecting' ? "bg-nexus-yellow" : "bg-red-500"
                  )} />
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                  <Database className="w-4 h-4 text-nexus-cyan/70" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-white/80 leading-none truncate">MONGODB_CLUSTER</p>
                    <p className={cn("text-[9px] font-mono mt-1", dbStatus === 'connected' ? "text-nexus-cyan font-bold" : "text-red-400 font-bold")}>
                      {dbStatus.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover rounded" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-nexus-cyan" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white/90 truncate">{currentUser.displayName || 'Root_Admin'}</p>
                    <p className="text-[9px] uppercase tracking-widest text-nexus-cyan/40 font-bold">Clearance Lvl 5</p>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="w-full py-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-red-500/70 hover:text-red-400 hover:bg-red-500/5 transition-all border border-red-500/20 rounded"
                >
                  <LogOut className="w-3 h-3" /> Terminate Session
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12">
          <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <header className="flex justify-between items-end">
                <div>
                  <h3 className="text-3xl font-display font-bold">Node Intelligence</h3>
                  <p className="text-white/40 text-sm">Real-time system telemetry and asset metrics.</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-mono text-nexus-cyan mb-1">LOCAL_TIME</p>
                  <p className="font-mono text-lg font-bold">{new Date().toLocaleTimeString()}</p>
                </div>
              </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {[
                  { label: 'Deployed Assets', value: projects.length, icon: Briefcase, color: 'nexus-cyan', trend: `${projects.length} nodes` },
                  { label: 'Active Orders', value: orders.length, icon: TrendingUp, color: 'nexus-yellow', trend: `₹${orders.reduce((acc, o) => acc + o.value, 0).toLocaleString('en-IN')}` },
                  { label: 'Core Team', value: team.length, icon: Users, color: 'nexus-teal', trend: `${team.length} ops` },
                  { label: 'Client Signal', value: reviews.length, icon: Star, color: 'nexus-yellow', trend: `${reviews.length} logs` },
                  { label: 'Sync Requests', value: contactInquiries.length, icon: MessageSquare, color: 'nexus-teal', trend: `${contactInquiries.filter(q => q.status === 'pending').length} pnd` },
                ].map((stat, i) => (
                  <div key={i} className="glass p-6 rounded-3xl relative overflow-hidden group">
                    <div className={cn("absolute -top-10 -right-10 w-24 h-24 blur-[60px] opacity-20", `bg-${stat.color}`)} />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className={cn("p-2 rounded-lg", `bg-${stat.color}/10 text-${stat.color}`)}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] text-white/30 font-mono">{stat.trend}</span>
                      </div>
                      <p className="text-3xl font-bold font-mono mb-1">{stat.value}</p>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 glass p-6 md:p-8 rounded-[2rem]">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="text-lg font-bold">Recent Deployments</h4>
                    <button onClick={() => setActiveTab('projects')} className="text-nexus-cyan text-xs font-bold hover:underline">Manage All</button>
                  </div>
                  <div className="space-y-4">
                    {projects.slice(0, 3).map(p => (
                      <div key={p.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                        <img src={p.image} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-grow">
                          <p className="font-bold text-sm">{p.title}</p>
                          <p className="text-[10px] text-white/40 uppercase">{p.category}</p>
                        </div>
                        <span className="text-[10px] font-mono text-nexus-cyan">ONLINE</span>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <p className="text-white/30 text-sm italic text-center py-8">No assets currently deployed to mainnet.</p>
                    )}
                  </div>
                </div>

                <div className="xl:col-span-4 glass p-6 md:p-8 rounded-[2rem] border-nexus-yellow/20 bg-nexus-yellow/5">
                  <h4 className="text-lg font-bold mb-6">Security Log</h4>
                  <div className="space-y-4 font-mono text-[10px]">
                    <div className="flex gap-2">
                        <span className="text-nexus-cyan">[08:42]</span>
                        <span className="text-white/60">Admin_Sync_Success (UID:6xx)</span>
                    </div>
                    <div className="flex gap-2 text-nexus-yellow">
                        <span className="">[09:15]</span>
                        <span className="text-white/60">Asset_Inventory_Refreshed</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-nexus-cyan">[09:24]</span>
                        <span className="text-white/60">Terminal_Refined_v2.0</span>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                        <p className="text-center text-white/20">Awaiting input...</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h3 className="text-3xl font-display font-bold">Asset Inventory</h3>
                  <p className="text-white/40 text-sm">Deploy and manage project nodes in the ecosystem.</p>
                </div>
                <button 
                  onClick={() => handleOpenModal()}
                  className="btn-primary flex items-center gap-2 py-3 px-6 shadow-[0_0_20px_rgba(0,170,255,0.2)]"
                >
                  <Plus className="w-5 h-5" /> Deploy New Asset
                </button>
              </div>

              <div className="glass p-2 rounded-2xl mb-8 flex items-center gap-4 px-6 border-white/10 focus-within:border-nexus-cyan/50 transition-colors">
                <Search className="w-5 h-5 text-white/20" />
                <input 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Scan project registry by title or category..."
                  className="bg-transparent border-none focus:ring-0 w-full py-4 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                  <div key={project.id} className="relative group rounded-3xl overflow-hidden glass border-white/5 hover:border-nexus-cyan/30 transition-all duration-500">
                    <div className="h-48 overflow-hidden relative">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-nexus-dark via-transparent to-transparent opacity-90" />
                      
                      <div className="absolute top-4 right-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button 
                          onClick={() => handleOpenModal(project)}
                          className="p-3 bg-nexus-dark/90 backdrop-blur-md rounded-xl text-nexus-cyan hover:bg-nexus-cyan hover:text-nexus-dark transition-all shadow-lg"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => project.id && handleDelete(project.id)}
                          className="p-3 bg-nexus-dark/90 backdrop-blur-md rounded-xl text-red-400 hover:bg-red-400 hover:text-white transition-all shadow-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="absolute bottom-4 left-6">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-nexus-cyan font-bold bg-nexus-cyan/10 px-3 py-1 rounded-full backdrop-blur-md">
                          {project.category.replace('Engineering', 'CORE')}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold mb-3">{project.title}</h4>
                      <p className="text-white/50 text-xs leading-relaxed line-clamp-2 mb-6">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-[9px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white/30 font-mono">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProjects.length === 0 && (
                  <div className="col-span-full py-20 text-center glass rounded-3xl border-dashed border-white/10">
                    <Briefcase className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/30">No asset nodes matching the scan criteria.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-display font-bold">Revenue Pipeline</h3>
                  <p className="text-white/40 text-sm">Active project lifecycle and value tracking.</p>
                </div>
                <button
                  onClick={() => {
                    const client = contactInquiries[0] || { name: 'New Client', email: '', phone: '' };
                    createOrder({
                      clientName: client.name,
                      email: client.email,
                      phone: client.phone || '',
                      projectName: 'New Project',
                      value: 50000,
                      status: 'active',
                      startDate: new Date().toISOString()
                    }).then(loadData);
                  }}
                  className="btn-primary flex items-center gap-2 py-3 px-6"
                >
                  <Plus className="w-5 h-5" /> Quick Order
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {orders.map(order => (
                  <div key={order.id} className="glass p-6 rounded-3xl border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-nexus-yellow/10 flex items-center justify-center border border-nexus-yellow/20">
                        <Activity className="w-6 h-6 text-nexus-yellow" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{order.projectName}</h4>
                        <p className="text-xs text-white/40">{order.clientName} // {order.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-8 items-center">
                      <div className="text-center">
                        <p className="text-[10px] uppercase font-mono text-white/20 mb-1">Contract_Value</p>
                        <p className="font-mono font-bold text-nexus-cyan">₹{order.value.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase font-mono text-white/20 mb-1">Status</p>
                        <span className="px-3 py-1 rounded-full bg-nexus-yellow/10 text-nexus-yellow text-[10px] font-bold uppercase tracking-widest border border-nexus-yellow/20">
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 glass rounded-lg text-white/40 hover:text-white transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-display font-bold">Operative Roster</h3>
                  <p className="text-white/40 text-sm">Designate and manage core team operatives.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2 py-3 px-6">
                  <Plus className="w-5 h-5" /> Enlist Operative
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {team.map(member => (
                  <div key={member.id} className="glass p-6 rounded-3xl group border-white/5 hover:border-nexus-cyan/30 transition-all">
                    <div className="flex items-center gap-4 mb-6">
                       <img src={member.image} className="w-16 h-16 rounded-2xl object-cover" />
                       <div>
                         <h4 className="font-bold">{member.name}</h4>
                         <p className="text-nexus-cyan font-mono text-[10px] uppercase tracking-widest">{member.role}</p>
                       </div>
                    </div>
                    <p className="text-xs text-white/50 mb-6 line-clamp-3 italic">"{member.bio}"</p>
                    <div className="flex justify-end gap-2">
                       <button onClick={() => member.id && handleDelete(member.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-display font-bold">Signal Records</h3>
                  <p className="text-white/40 text-sm">Archived client reviews and feedback loops.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {reviews.map(review => (
                  <div key={review.id} className="glass p-6 rounded-3xl border-white/5 relative">
                    <div className="flex items-center gap-1 text-nexus-yellow mb-4">
                       {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-nexus-yellow" />)}
                    </div>
                    <p className="text-sm text-white/70 italic mb-6">"{review.content}"</p>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-nexus-cyan/10 flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-nexus-cyan" />
                       </div>
                       <div>
                         <h4 className="font-bold text-xs">{review.clientName}</h4>
                         <p className="text-[9px] text-white/30 uppercase tracking-widest">{review.service}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <header>
                <h3 className="text-3xl font-display font-bold">Inbound Signals</h3>
                <p className="text-white/40 text-sm">Client sync requests and quotation signals.</p>
              </header>

              <div className="space-y-4">
                {contactInquiries.map((quote) => (
                  <div key={quote.id} className="glass p-6 rounded-3xl border-white/5 hover:border-nexus-cyan/30 transition-all group">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-nexus-cyan/10 flex items-center justify-center text-nexus-cyan">
                            <UserIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold">{quote.name}</h4>
                            <p className="text-xs text-white/40">{quote.email}</p>
                          </div>
                          <span className={cn(
                            "text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full",
                            quote.status === 'pending' ? "bg-nexus-yellow/10 text-nexus-yellow" : "bg-nexus-teal/10 text-nexus-teal"
                          )}>
                            {quote.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-nexus-teal text-xs font-mono">
                          <span className="text-white/20">MOB:</span>
                          {quote.phone}
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed italic">" {quote.message} "</p>
                      </div>
                      <div className="flex flex-col justify-between items-end">
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-mono text-white/20 mb-1">Status</p>
                          <p className="text-sm font-bold text-nexus-yellow uppercase tracking-widest">{quote.status}</p>
                        </div>
                        <div className="flex gap-2">
                          <a href={`mailto:${quote.email}`} className="p-2 glass rounded-lg text-white/40 hover:text-nexus-cyan transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button className="p-2 glass rounded-lg text-white/40 hover:text-nexus-teal transition-colors">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] text-white/20 font-mono">
                        <Clock className="w-3 h-3" />
                        {quote.createdAt ? new Date(quote.createdAt).toLocaleString() : 'N/A'}
                      </div>
                      <p className="text-[10px] font-mono text-nexus-cyan/40">SIG_ID: {quote.id?.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                ))}
                {contactInquiries.length === 0 && (
                  <div className="glass p-12 rounded-3xl text-center border-white/10">
                    <div className="w-16 h-16 bg-nexus-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="w-8 h-8 text-nexus-teal" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Static Silence</h4>
                    <p className="text-white/40 text-sm max-w-sm mx-auto">No inbound signals detected in this sector.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <header>
                <h3 className="text-3xl font-display font-bold">Terminal Control</h3>
                <p className="text-white/40 text-sm">Configure system preferences and security levels.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="glass p-6 md:p-8 rounded-3xl border-white/10">
                  <h4 className="text-nexus-cyan text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Visual Interface</h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Dark Mode Protocols</span>
                      <div className="w-10 h-5 bg-nexus-cyan rounded-full relative"><div className="absolute top-1 right-1 w-3 h-3 bg-nexus-dark rounded-full" /></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Hardware Acceleration</span>
                      <div className="w-10 h-5 bg-nexus-cyan rounded-full relative"><div className="absolute top-1 right-1 w-3 h-3 bg-nexus-dark rounded-full" /></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Neon Overpulse</span>
                      <div className="w-10 h-5 bg-white/10 rounded-full relative"><div className="absolute top-1 left-1 w-3 h-3 bg-white/40 rounded-full" /></div>
                    </div>
                  </div>
                </div>

                <div className="glass p-8 rounded-3xl border-nexus-cyan/20 bg-nexus-cyan/5">
                  <h4 className="text-nexus-cyan text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                    <UserIcon className="w-3 h-3" /> Create New Operator
                  </h4>
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      alert("Please note: To strictly prevent unauthorized access, you must add users manually in the Firebase Console > Authentication tab. This ensures perfect security records.");
                      window.open("https://console.firebase.google.com/", "_blank");
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-[9px] text-white/40 uppercase font-bold">Operator Email</label>
                      <input name="email" type="email" required className="w-full bg-nexus-dark/50 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-nexus-cyan outline-none" placeholder="new-operator@nexus.io" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-white/40 uppercase font-bold">Temporary Access Key</label>
                      <input name="password" type="password" required className="w-full bg-nexus-dark/50 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-nexus-cyan outline-none" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-nexus-cyan text-nexus-dark text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-colors">
                      Authorize Deployment
                    </button>
                  </form>
                </div>

                <div className="md:col-span-2 xl:col-span-1 glass p-8 rounded-3xl border-white/10">
                  <h4 className="text-nexus-yellow text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Security Layer Access Registry</h4>
                  <div className="space-y-4">
                    <p className="text-xs text-white/50 leading-relaxed">Primary Root Account: <span className="text-nexus-cyan font-mono">{ADMIN_EMAIL}</span></p>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-[10px] font-mono space-y-2">
                      <div className="flex justify-between items-center">
                        <p>IDENTITY_VERIFICATION: <span className="text-nexus-teal uppercase">Bypass_Enabled</span></p>
                        <span className="px-2 py-0.5 bg-nexus-teal/20 text-nexus-teal rounded text-[8px]">ROOT</span>
                      </div>
                      <p>TOKEN_STATUS: <span className="text-nexus-teal uppercase">Valid_Session_Active</span></p>
                      <p>CLEARANCE_LVL: <span className="text-nexus-teal uppercase">Tier_5_Executive</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal Tool - Stays common as it is shared by Overview and Projects */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-nexus-dark/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass p-8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-nexus-cyan/30 shadow-[0_0_50px_rgba(0,170,255,0.1)]"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  {editingItem ? 'Protocol Modification' : 'Asset Initialization'}
                  <span className="text-nexus-cyan font-mono text-[10px] bg-nexus-cyan/10 px-2 py-0.5 rounded tracking-tighter">v2.1_BETA</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'projects' && (
                  <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Asset Identifier</label>
                    <input 
                      required
                      value={projectForm.title}
                      onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-nexus-cyan transition-colors"
                      placeholder="e.g., Nexus Hyperdrive"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Category Node</label>
                    <select 
                      value={projectForm.category}
                      onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-nexus-cyan transition-colors appearance-none text-white"
                    >
                      <option>Web Engineering</option>
                      <option>Android App</option>
                      <option>Video Editing</option>
                      <option>Branding/Logo</option>
                      <option>SEO Strategy</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" /> Visual Asset
                  </label>
                  <div className="flex gap-4">
                    <input 
                      type="text"
                      required
                      value={projectForm.image}
                      onChange={e => setProjectForm({ ...projectForm, image: e.target.value })}
                      className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-nexus-cyan transition-colors"
                      placeholder="https://..."
                    />
                    <label className="cursor-pointer glass px-4 py-3 rounded-xl border border-white/10 hover:border-nexus-cyan transition-colors flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-xs uppercase font-bold">{isUploading ? '...' : 'Upload'}</span>
                      <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'project')} />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">
                    <ExternalLink className="w-3 h-3" /> External Reference URL
                  </label>
                  <input 
                    value={projectForm.projectUrl}
                    onChange={e => setProjectForm({ ...projectForm, projectUrl: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-nexus-cyan transition-colors"
                    placeholder="https://nexus-project.io"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Technical Brief</label>
                  <textarea 
                    required
                    rows={3}
                    value={projectForm.description}
                    onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-nexus-cyan transition-colors resize-none"
                    placeholder="Explain the technical node architecture..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">
                      <TagIcon className="w-3 h-3" /> Tech Stack
                    </label>
                    <input 
                      value={projectForm.tags}
                      onChange={e => setProjectForm({ ...projectForm, tags: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-nexus-cyan transition-colors"
                      placeholder="React, AWS, Docker..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">
                      <Palette className="w-3 h-3" /> Brand Vector Code
                    </label>
                    <div className="flex gap-2">
                      <input 
                        value={projectForm.color}
                        onChange={e => setProjectForm({ ...projectForm, color: e.target.value })}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-nexus-cyan transition-colors font-mono"
                        placeholder="#00aaff"
                      />
                      <div className="w-12 h-12 rounded-xl border border-white/10 shadow-lg" style={{ backgroundColor: projectForm.color }} />
                    </div>
                  </div>
                </div>
                </>
                )}

                {activeTab === 'team' && (
                  <>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Operative Name</label>
                      <input required value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-nexus-cyan outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Role Descriptor</label>
                      <input required value={teamForm.role} onChange={e => setTeamForm({...teamForm, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-nexus-cyan outline-none" placeholder="Chief Technologist" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">Visual Asset</label>
                    <div className="flex gap-4">
                      <input type="text" value={teamForm.image} onChange={e => setTeamForm({...teamForm, image: e.target.value})} className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-nexus-cyan outline-none" />
                      <label className="cursor-pointer glass px-4 py-3 rounded-xl border border-white/10 hover:border-nexus-cyan transition-colors flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span className="text-xs uppercase font-bold">{isUploading ? '...' : 'Upload'}</span>
                        <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'team')} />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Archive Bio</label>
                    <textarea rows={3} value={teamForm.bio} onChange={e => setTeamForm({...teamForm, bio: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-nexus-cyan outline-none resize-none" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <input placeholder="GitHub" value={teamForm.github} onChange={e => setTeamForm({...teamForm, github: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs" />
                    <input placeholder="LinkedIn" value={teamForm.linkedin} onChange={e => setTeamForm({...teamForm, linkedin: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs" />
                    <input placeholder="Twitter" value={teamForm.twitter} onChange={e => setTeamForm({...teamForm, twitter: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs" />
                  </div>
                  </>
                )}

                <button 
                  disabled={isLoading || isUploading}
                  type="submit" 
                  className="w-full btn-primary py-4 flex items-center justify-center gap-3 disabled:opacity-50 group"
                >
                  {isLoading ? 'Processing Pulse...' : 'Commit Modifications'}
                  <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

