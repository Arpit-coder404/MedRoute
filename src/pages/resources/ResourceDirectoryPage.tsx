import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  MapPin,
  Building,
  CheckCircle2,
  Accessibility,
  X,
  Compass,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ResourceCard } from '../../components/resources/ResourceCard';
import { ResourceType, ResourceStatus } from '../../types';

export const ResourceDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { resources, setSelectedResourceId } = useAppStore();

  const typeParam = searchParams.get('type') as ResourceType | null;

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>(typeParam || 'all');
  const [selectedStatus, setSelectedStatus] = useState<ResourceStatus | 'all'>('all');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [onlyAccessible, setOnlyAccessible] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'alpha' | 'verified' | 'type'>('verified');

  // Unique buildings
  const buildings = useMemo(() => {
    const list = Array.from(new Set(resources.map((r) => r.building)));
    return list.sort();
  }, [resources]);

  // Filtered & sorted resources
  const filteredList = useMemo(() => {
    return resources
      .filter((res) => {
        // Type
        if (selectedType !== 'all' && res.resource_type !== selectedType) return false;
        // Status
        if (selectedStatus !== 'all' && res.status !== selectedStatus) return false;
        // Building
        if (selectedBuilding !== 'all' && res.building !== selectedBuilding) return false;
        // Accessibility
        if (onlyAccessible && !res.has_wheelchair_ramp) return false;
        // Search
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = res.name.toLowerCase().includes(q);
          const matchBuilding = res.building.toLowerCase().includes(q);
          const matchDesc = res.description.toLowerCase().includes(q);
          const matchEquip = res.equipment.some((e) =>
            e.equipment_name.toLowerCase().includes(q)
          );
          if (!matchName && !matchBuilding && !matchDesc && !matchEquip) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'alpha') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'verified') {
          return new Date(b.last_verified_at).getTime() - new Date(a.last_verified_at).getTime();
        }
        if (sortBy === 'type') {
          return a.resource_type.localeCompare(b.resource_type);
        }
        return 0;
      });
  }, [resources, selectedType, selectedStatus, selectedBuilding, onlyAccessible, search, sortBy]);

  const handleLocateOnMap = (res: any) => {
    setSelectedResourceId(res.id);
    navigate('/map');
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedBuilding('all');
    setOnlyAccessible(false);
    setSearchParams({});
  };

  const hasActiveFilters =
    search || selectedType !== 'all' || selectedStatus !== 'all' || selectedBuilding !== 'all' || onlyAccessible;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Directory Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-medblue uppercase tracking-wider">
              CENTRAL REGISTRY
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
              {filteredList.length} of {resources.length} Facilities
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-1">
            Campus Medical Resource Directory
          </h1>
          <p className="text-xs sm:text-sm text-mutedgrey mt-0.5">
            Verified first-aid kits, defibrillators, medical suites, and accessible entrances with current inventory checks.
          </p>
        </div>

        <button
          onClick={() => navigate('/map')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors self-start md:self-auto"
        >
          <Compass className="w-4 h-4 text-medteal" />
          <span>Switch to Campus Map</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-mutedgrey" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by facility name, building, equipment (e.g., AED, cold compress, oxygen)..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 text-navy text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-medblue focus:bg-white"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Resource Type */}
          <div>
            <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
              Resource Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                const val = e.target.value as any;
                setSelectedType(val);
                if (val === 'all') {
                  searchParams.delete('type');
                  setSearchParams(searchParams);
                } else {
                  setSearchParams({ type: val });
                }
              }}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-navy focus:outline-none focus:border-medblue"
            >
              <option value="all">All Resource Types</option>
              <option value="medical_centre">Medical Centre</option>
              <option value="first_aid">First-Aid Station</option>
              <option value="aed">AED Unit</option>
              <option value="pharmacy">Dispensary / Pharmacy</option>
              <option value="ambulance_bay">Ambulance Staging Bay</option>
              <option value="assembly_point">Emergency Muster Point</option>
              <option value="accessible_entrance">Accessible Entrance</option>
            </select>
          </div>

          {/* Building */}
          <div>
            <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
              Building
            </label>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-navy focus:outline-none focus:border-medblue"
            >
              <option value="all">All Buildings</option>
              {buildings.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
              Availability Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-navy focus:outline-none focus:border-medblue"
            >
              <option value="all">Any Status</option>
              <option value="available">Available</option>
              <option value="temporarily_unavailable">Temporarily Unavailable</option>
              <option value="under_maintenance">Under Maintenance</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-navy focus:outline-none focus:border-medblue"
            >
              <option value="verified">Recently Verified First</option>
              <option value="alpha">Alphabetical (A - Z)</option>
              <option value="type">By Category</option>
            </select>
          </div>

          {/* Accessibility toggle & Clear */}
          <div className="flex flex-col justify-end">
            <div className="flex items-center justify-between gap-2 h-9">
              <label className="flex items-center gap-1.5 text-xs text-navy font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyAccessible}
                  onChange={(e) => setOnlyAccessible(e.target.checked)}
                  className="rounded text-medteal focus:ring-medteal border-slate-300"
                />
                <Accessibility className="w-3.5 h-3.5 text-medteal" />
                <span>Ramp / ADA</span>
              </label>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-emergency hover:underline font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-mutedgrey mx-auto" />
          <h3 className="text-base font-bold text-navy">No Matching Medical Resources Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, clearing filters, or switching to the Campus Map.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-medblue text-white text-xs font-semibold rounded-lg hover:bg-medblue-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              onLocateOnMap={handleLocateOnMap}
            />
          ))}
        </div>
      )}
    </div>
  );
};

