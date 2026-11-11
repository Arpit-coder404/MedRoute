import React, { useState, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Wrench,
  HelpCircle,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Layers,
  Check,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { ResourceType, ResourceStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    resources,
    requests,
    reports,
    verifyResource,
    updateResource,
    addResource,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'management' | 'add'>('analytics');

  // New resource form state
  const [newResName, setNewResName] = useState('');
  const [newResType, setNewResType] = useState<ResourceType>('first_aid');
  const [newResBuilding, setNewResBuilding] = useState('');
  const [newResFloor, setNewResFloor] = useState('Ground Floor');
  const [newResDesc, setNewResDesc] = useState('');
  const [newResZone, setNewResZone] = useState<'North' | 'South' | 'Central' | 'East' | 'West'>('Central');
  const [newResHours, setNewResHours] = useState('24 Hours');
  const [newResContact, setNewResContact] = useState('+1 (555) 010-0000');
  const [newResRamp, setNewResRamp] = useState(true);
  const [newResElevator, setNewResElevator] = useState(true);
  const [addSuccess, setAddSuccess] = useState(false);

  // If role is not admin, show switch banner
  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-navy flex items-center justify-center mx-auto border border-slate-300">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-navy">Campus Health Administration Ops</h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Access to campus readiness analytics, database verifications, and resource provisioning is restricted to safety administrators.
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-navy font-medium max-w-sm mx-auto">
          You are currently viewing as: <strong>{currentUser.full_name} ({currentUser.role})</strong>
        </div>
        <button
          onClick={() => switchUserRole('admin')}
          className="px-6 py-2.5 rounded-xl bg-navy hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
        >
          Switch to Marcus Vance (Safety Director Demo)
        </button>
      </div>
    );
  }

  // Analytics derived from actual stored data
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    resources.forEach((r) => {
      const label = r.resource_type.replace('_', ' ');
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.keys(counts).map((k) => ({ name: k, count: counts[k] }));
  }, [resources]);

  const zoneData = useMemo(() => {
    const zones: Record<string, number> = {
      North: 0,
      Central: 0,
      South: 0,
      East: 0,
      West: 0,
    };
    resources.forEach((r) => {
      zones[r.map_coords.zone] = (zones[r.map_coords.zone] || 0) + 1;
    });
    return Object.keys(zones).map((k) => ({ zone: k, count: zones[k] }));
  }, [resources]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {
      available: 0,
      under_maintenance: 0,
      unverified: 0,
      temporarily_unavailable: 0,
    };
    resources.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return [
      { name: 'Available', value: counts.available, color: '#19A999' },
      { name: 'Under Maintenance', value: counts.under_maintenance, color: '#F0AE45' },
      { name: 'Unverified', value: counts.unverified, color: '#8995A7' },
      { name: 'Unavailable', value: counts.temporarily_unavailable, color: '#D94343' },
    ];
  }, [resources]);

  const requestCategoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach((r) => {
      const cat = r.request_category.replace('_', ' ');
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.keys(counts).map((k) => ({ category: k, total: counts[k] }));
  }, [requests]);

  const totalVerified = resources.filter((r) => r.status === 'available').length;
  const maintenanceCount = resources.filter((r) => r.status === 'under_maintenance').length;
  const pendingReportsCount = reports.filter((r) => r.status !== 'resolved').length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResName.trim() || !newResBuilding.trim()) return;

    addResource({
      name: newResName.trim(),
      resource_type: newResType,
      description: newResDesc.trim() || 'Standard campus medical resource station.',
      building: newResBuilding.trim(),
      floor: newResFloor.trim(),
      location_description: `${newResBuilding}, ${newResFloor}`,
      map_coords: {
        x: Math.floor(20 + Math.random() * 60),
        y: Math.floor(20 + Math.random() * 60),
        zone: newResZone,
      },
      contact_number: newResContact.trim() || undefined,
      opening_hours: newResHours.trim(),
      accessibility_details: 'Certified ADA accessible ramp and clearance.',
      has_wheelchair_ramp: newResRamp,
      has_elevator_access: newResElevator,
      status: 'available',
      last_verified_at: new Date().toISOString(),
      verified_by: `${currentUser.full_name} (Admin)`,
      equipment: [
        {
          id: `eq_${Date.now()}`,
          resource_id: 'pending',
          equipment_name: 'Emergency Trauma & Dressings Kit',
          quantity: 1,
          status: 'operational',
          last_checked_at: new Date().toISOString(),
        },
      ],
    });

    setAddSuccess(true);
    setNewResName('');
    setNewResBuilding('');
    setNewResDesc('');
    setTimeout(() => {
      setAddSuccess(false);
      setActiveTab('management');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-navy uppercase tracking-wider">
              ADMINISTRATION & AUDIT
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-navy text-white font-mono font-bold">
              DIRECTOR CONTROL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-1">
            Campus Readiness & Governance Portal
          </h1>
          <p className="text-xs sm:text-sm text-mutedgrey mt-0.5">
            Real-time analytics computed directly from active database records.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-navy shadow-sm'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            Readiness Analytics
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'management'
                ? 'bg-white text-navy shadow-sm'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            Manage Resources ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'add'
                ? 'bg-medblue text-white shadow-sm'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Facility</span>
          </button>
        </div>
      </div>

      {/* Admin Quick KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-mutedgrey font-bold uppercase tracking-wider">
            Total Facilities
          </div>
          <div className="text-3xl font-black text-navy">{resources.length}</div>
          <div className="text-[11px] text-emerald-700 font-semibold">
            {totalVerified} Active & Verified
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-mutedgrey font-bold uppercase tracking-wider">
            Assistance Logs
          </div>
          <div className="text-3xl font-black text-medblue">{requests.length}</div>
          <div className="text-[11px] text-slate-500">All registered incidents</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-mutedgrey font-bold uppercase tracking-wider">
            Maintenance Holds
          </div>
          <div className="text-3xl font-black text-amber-600">{maintenanceCount}</div>
          <div className="text-[11px] text-slate-500">Require safety repairs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-mutedgrey font-bold uppercase tracking-wider">
            Pending Reports
          </div>
          <div className="text-3xl font-black text-emergency">{pendingReportsCount}</div>
          <div className="text-[11px] text-slate-500">Student discrepancy reports</div>
        </div>
      </div>

      {/* TAB 1: Real Recharts Analytics (Computed from stored data) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <span className="font-semibold text-navy">
              Notice: All telemetry visualised below is computed live from stored database entities.
            </span>
            <span className="text-[10px] text-mutedgrey font-mono">
              Label: Demonstration Campus Telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Facilities by Category */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-medblue" />
                <span>Medical Resources by Category</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis
                      dataKey="name"
                      angle={-25}
                      textAnchor="end"
                      interval={0}
                      tick={{ fontSize: 10, fill: '#8995A7' }}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8995A7' }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" fill="#2367D1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Resource Verification Status */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-medteal" />
                <span>Verification & Operational Status</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={3}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Geographic Coverage by Campus Zone */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-medblue" />
                <span>Resource Distribution by Campus Zone</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={zoneData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="zone" tick={{ fontSize: 11, fill: '#8995A7' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8995A7' }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" fill="#19A999" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Assistance Requests by Category */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-amberwarn" />
                <span>Student Assistance Request Breakdown</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={requestCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#8995A7' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8995A7' }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="total" fill="#F0AE45" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Resource Directory Verification & Admin Editing */}
      {activeTab === 'management' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-navy uppercase tracking-wider">
              Campus Facilities & Verifications Registry
            </h3>
            <span className="text-xs text-mutedgrey font-mono">
              Click "Verify" to renew 30-day certification
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-navy font-bold uppercase tracking-wider text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Resource</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Last Verified</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resources.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-3 font-bold text-navy">{res.name}</td>
                    <td className="py-3.5 px-3 text-slate-600 capitalize">
                      {res.resource_type.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">{res.building}</td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-500">
                      {new Date(res.last_verified_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          res.status === 'available'
                            ? 'bg-mint text-emerald-800'
                            : res.status === 'under_maintenance'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {res.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() =>
                          verifyResource(res.id, `${currentUser.full_name} (Safety Admin)`)
                        }
                        className="px-3 py-1 rounded-lg bg-medteal-50 hover:bg-medteal-100 text-medteal font-bold text-xs inline-flex items-center gap-1 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify Station</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Add New Medical Resource */}
      {activeTab === 'add' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-navy">Provision New Medical Resource</h3>
            <p className="text-xs text-mutedgrey">
              Register an authorized wall AED, eyewash station, or first-aid kit into the campus database.
            </p>
          </div>

          {addSuccess && (
            <div className="p-4 rounded-xl bg-mint text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Medical resource successfully registered and mapped!</span>
            </div>
          )}

          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                Facility Name
              </label>
              <input
                type="text"
                required
                value={newResName}
                onChange={(e) => setNewResName(e.target.value)}
                placeholder="e.g. Student Center 2nd Floor First-Aid Point"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-navy focus:outline-none focus:border-medblue"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                  Resource Type
                </label>
                <select
                  value={newResType}
                  onChange={(e) => setNewResType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-navy bg-white"
                >
                  <option value="first_aid">First-Aid Station</option>
                  <option value="aed">AED Unit</option>
                  <option value="medical_centre">Medical Centre</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="ambulance_bay">Ambulance Bay</option>
                  <option value="accessible_entrance">Accessible Entrance</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                  Campus Zone
                </label>
                <select
                  value={newResZone}
                  onChange={(e) => setNewResZone(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-navy bg-white"
                >
                  <option value="Central">Central</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                  Building
                </label>
                <input
                  type="text"
                  required
                  value={newResBuilding}
                  onChange={(e) => setNewResBuilding(e.target.value)}
                  placeholder="e.g. Aryabhata Hall"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-navy"
                />
              </div>

              <div>
                <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                  Floor / Room
                </label>
                <input
                  type="text"
                  value={newResFloor}
                  onChange={(e) => setNewResFloor(e.target.value)}
                  placeholder="e.g. 2nd Floor, Room 204"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-navy"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                Description & Equipment Notes
              </label>
              <textarea
                rows={3}
                value={newResDesc}
                onChange={(e) => setNewResDesc(e.target.value)}
                placeholder="Include mounted equipment, eyewash nozzles, pad expiry dates..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-navy"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newResRamp}
                  onChange={(e) => setNewResRamp(e.target.checked)}
                  className="rounded text-medteal"
                />
                <span className="text-slate-700">ADA Wheelchair Ramp</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newResElevator}
                  onChange={(e) => setNewResElevator(e.target.checked)}
                  className="rounded text-medteal"
                />
                <span className="text-slate-700">Elevator Direct Access</span>
              </label>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-medblue hover:bg-medblue-600 text-white font-bold shadow-md transition-colors"
              >
                Save & Verify Entry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

