import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Cross,
  Zap,
  Pill,
  Truck,
  Flag,
  Accessibility,
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  HelpCircle,
  Navigation,
  ExternalLink,
  X,
  Compass,
} from 'lucide-react';
import { CampusResource, ResourceType, ResourceStatus } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface CampusMedicalMapProps {
  initialSelectedId?: string;
  onSelectResource?: (resource: CampusResource) => void;
  compact?: boolean;
}

export const CampusMedicalMap: React.FC<CampusMedicalMapProps> = ({
  initialSelectedId,
  onSelectResource,
  compact = false,
}) => {
  const {
    resources,
    selectedResourceId,
    setSelectedResourceId,
    activeFilterCategory,
    setActiveFilterCategory,
    activeFilterStatus,
    setActiveFilterStatus,
    activeZone,
    setActiveZone,
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showDirections, setShowDirections] = useState(false);
  const [userStartLocation, setUserStartLocation] = useState<'student_center' | 'hostels' | 'library'>(
    'student_center'
  );

  // Selected resource lookup
  const activeResource = useMemo(() => {
    const id = selectedResourceId || initialSelectedId;
    return resources.find((r) => r.id === id) || null;
  }, [resources, selectedResourceId, initialSelectedId]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      // Category filter
      if (activeFilterCategory !== 'all' && res.resource_type !== activeFilterCategory) {
        return false;
      }
      // Status filter
      if (activeFilterStatus !== 'all' && res.status !== activeFilterStatus) {
        return false;
      }
      // Zone filter
      if (activeZone !== 'all' && res.map_coords.zone !== activeZone) {
        return false;
      }
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = res.name.toLowerCase().includes(q);
        const matchBuilding = res.building.toLowerCase().includes(q);
        const matchFloor = res.floor.toLowerCase().includes(q);
        const matchEquip = res.equipment.some((e) =>
          e.equipment_name.toLowerCase().includes(q)
        );
        if (!matchName && !matchBuilding && !matchFloor && !matchEquip) return false;
      }
      return true;
    });
  }, [resources, activeFilterCategory, activeFilterStatus, activeZone, search]);

  const handleMarkerClick = (res: CampusResource) => {
    setSelectedResourceId(res.id);
    if (onSelectResource) onSelectResource(res);
  };

  const getMarkerIcon = (type: ResourceType) => {
    switch (type) {
      case 'medical_centre':
        return HeartPulse;
      case 'first_aid':
        return Cross;
      case 'aed':
        return Zap;
      case 'pharmacy':
        return Pill;
      case 'ambulance_bay':
        return Truck;
      case 'assembly_point':
        return Flag;
      case 'accessible_entrance':
        return Accessibility;
      default:
        return MapPin;
    }
  };

  const getMarkerColor = (type: ResourceType, status: ResourceStatus) => {
    if (status === 'under_maintenance') {
      return {
        bg: 'bg-amberwarn text-navy',
        border: 'border-amberwarn ring-amberwarn/30',
        hex: '#F0AE45',
      };
    }
    if (status === 'unverified') {
      return {
        bg: 'bg-slate-400 text-white',
        border: 'border-slate-400 ring-slate-400/30',
        hex: '#8995A7',
      };
    }

    switch (type) {
      case 'medical_centre':
        return {
          bg: 'bg-emergency text-white',
          border: 'border-emergency ring-emergency/30',
          hex: '#D94343',
        };
      case 'aed':
        return {
          bg: 'bg-amber-500 text-white',
          border: 'border-amber-500 ring-amber-500/30',
          hex: '#F59E0B',
        };
      case 'first_aid':
        return {
          bg: 'bg-medteal text-white',
          border: 'border-medteal ring-medteal/30',
          hex: '#19A999',
        };
      case 'pharmacy':
        return {
          bg: 'bg-emerald-600 text-white',
          border: 'border-emerald-600 ring-emerald-600/30',
          hex: '#059669',
        };
      case 'ambulance_bay':
        return {
          bg: 'bg-navy text-white',
          border: 'border-navy ring-navy/30',
          hex: '#101D32',
        };
      case 'assembly_point':
        return {
          bg: 'bg-medblue text-white',
          border: 'border-medblue ring-medblue/30',
          hex: '#2367D1',
        };
      case 'accessible_entrance':
        return {
          bg: 'bg-indigo-600 text-white',
          border: 'border-indigo-600 ring-indigo-600/30',
          hex: '#4F46E5',
        };
      default:
        return {
          bg: 'bg-medblue text-white',
          border: 'border-medblue ring-medblue/30',
          hex: '#2367D1',
        };
    }
  };

  const startCoords = {
    student_center: { x: 500, y: 530, label: 'Current: Student Center' },
    hostels: { x: 540, y: 780, label: 'Current: Residence Hall' },
    library: { x: 420, y: 200, label: 'Current: Tagore Library' },
  }[userStartLocation];

  return (
    <div className={`relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/60 shadow-elevated flex flex-col ${compact ? 'h-[460px]' : 'h-[640px] lg:h-[720px]'}`}>
      {/* Top Filter and Search Bar */}
      <div className="bg-navy/95 border-b border-slate-700/80 p-3 sm:px-4 z-20 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-mutedgrey" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources, buildings, AEDs, kits..."
              className="w-full pl-9 pr-8 py-1.5 bg-navy-light text-warmwhite text-xs sm:text-sm rounded-lg border border-slate-700 focus:outline-none focus:border-medblue placeholder:text-mutedgrey"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-mutedgrey hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs no-scrollbar">
            {[
              { id: 'all', label: 'All Markers' },
              { id: 'medical_centre', label: 'Medical Centre' },
              { id: 'aed', label: 'AEDs' },
              { id: 'first_aid', label: 'First-Aid' },
              { id: 'pharmacy', label: 'Pharmacy' },
              { id: 'ambulance_bay', label: 'Ambulance' },
              { id: 'assembly_point', label: 'Muster Point' },
              { id: 'accessible_entrance', label: 'Accessible' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilterCategory(cat.id as any)}
                className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-colors font-medium ${
                  activeFilterCategory === cat.id
                    ? 'bg-medblue text-white shadow-sm'
                    : 'bg-navy-light text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Zone Selector */}
          <div className="flex items-center gap-1 shrink-0 text-xs text-slate-300">
            <Compass className="w-3.5 h-3.5 text-medteal shrink-0" />
            <select
              value={activeZone}
              onChange={(e) => setActiveZone(e.target.value as any)}
              className="bg-navy-light text-slate-200 border border-slate-700 rounded-md px-2 py-1 text-xs focus:outline-none"
            >
              <option value="all">Entire Campus</option>
              <option value="Central">Central Zone</option>
              <option value="North">North Zone</option>
              <option value="South">South Zone</option>
              <option value="East">East Zone</option>
              <option value="West">West Zone</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Map Viewport & Overlay */}
      <div className="relative flex-1 bg-[#0c1626] overflow-hidden flex items-center justify-center select-none">
        {/* SVG Campus Map Canvas */}
        <div
          className="w-full h-full relative transition-transform duration-300 ease-out flex items-center justify-center p-2 sm:p-4"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 1000 750"
            className="w-full h-full max-w-5xl max-h-[700px] drop-shadow-2xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Grid pattern */}
              <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#17263c" strokeWidth="0.8" />
              </pattern>
              {/* Pathway stripe */}
              <pattern id="pathwayPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="10" y2="10" stroke="#334764" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Base Campus Terrain */}
            <rect width="1000" height="750" fill="#0E192B" rx="16" />
            <rect width="1000" height="750" fill="url(#campusGrid)" rx="16" />

            {/* Zone Boundaries (Subtle labels) */}
            <g opacity="0.4" className="pointer-events-none">
              <text x="500" y="50" fill="#4B6382" fontSize="12" fontWeight="700" letterSpacing="3" textAnchor="middle">NORTH CAMPUS ZONE</text>
              <text x="500" y="730" fill="#4B6382" fontSize="12" fontWeight="700" letterSpacing="3" textAnchor="middle">SOUTH RESIDENTIAL ZONE</text>
              <text x="920" y="380" fill="#4B6382" fontSize="12" fontWeight="700" letterSpacing="3" textAnchor="middle" transform="rotate(90, 920, 380)">EAST ACADEMIC</text>
              <text x="70" y="380" fill="#4B6382" fontSize="12" fontWeight="700" letterSpacing="3" textAnchor="middle" transform="rotate(-90, 70, 380)">WEST SPORTS</text>
            </g>

            {/* Campus Perimeter Roads / Emergency Vehicle Loops */}
            <g stroke="#1d2e47" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 80 100 L 920 100 L 920 680 L 80 680 Z" />
              <path d="M 500 100 L 500 680" strokeWidth="8" />
              <path d="M 80 380 L 920 380" strokeWidth="8" />
            </g>

            {/* Internal Paved Pedestrian Walkways (Accessible) */}
            <g stroke="#263a56" strokeWidth="6" fill="none" strokeDasharray="6 3">
              <path d="M 220 120 L 380 220 L 480 380 L 620 350 L 750 200" />
              <path d="M 220 500 L 420 480 L 520 530 L 750 480" />
              <path d="M 500 220 L 500 500" />
              <path d="M 380 400 L 200 480" />
              <path d="M 540 600 L 540 700" />
            </g>

            {/* Great Lawn Central Green Space */}
            <g>
              <rect x="360" y="300" width="280" height="150" rx="20" fill="#14322d" opacity="0.7" stroke="#1d4841" strokeWidth="2" />
              <text x="500" y="380" fill="#2fd0a5" fontSize="13" fontWeight="600" opacity="0.6" textAnchor="middle">GREAT LAWN CENTRAL</text>
              {/* Landscaping tree clusters */}
              <circle cx="390" cy="330" r="12" fill="#1b453e" />
              <circle cx="610" cy="330" r="14" fill="#1b453e" />
              <circle cx="410" cy="420" r="10" fill="#1b453e" />
              <circle cx="590" cy="420" r="12" fill="#1b453e" />
            </g>

            {/* Campus Buildings (Architectural Blocks with lighting) */}
            {/* 1. Tagore Central Library */}
            <g className="cursor-pointer hover:opacity-95 transition-opacity">
              <rect x="320" y="140" width="160" height="110" rx="8" fill="#182c48" stroke="#2a456e" strokeWidth="2" />
              <rect x="330" y="150" width="140" height="90" rx="4" fill="#14243b" />
              <text x="400" y="195" fill="#e2e8f0" fontSize="12" fontWeight="700" textAnchor="middle">TAGORE LIBRARY</text>
              <text x="400" y="212" fill="#8995a7" fontSize="10" textAnchor="middle">Floors G - 3</text>
            </g>

            {/* 2. Alan Turing Engineering Hub */}
            <g className="cursor-pointer hover:opacity-95 transition-opacity">
              <rect x="650" y="120" width="170" height="100" rx="8" fill="#182c48" stroke="#2a456e" strokeWidth="2" />
              <rect x="660" y="130" width="150" height="80" rx="4" fill="#14243b" />
              <text x="735" y="172" fill="#e2e8f0" fontSize="12" fontWeight="700" textAnchor="middle">TURING ENGG HUB</text>
              <text x="735" y="189" fill="#8995a7" fontSize="10" textAnchor="middle">Machinery Bay / Labs</text>
            </g>

            {/* 3. Central Medical Centre (Health & Wellness Pavilion) - Highlighted */}
            <g className="cursor-pointer hover:opacity-95 transition-opacity">
              <rect x="350" y="440" width="120" height="90" rx="8" fill="#1f3659" stroke="#2367D1" strokeWidth="2.5" />
              <rect x="358" y="448" width="104" height="74" rx="4" fill="#162b49" />
              <text x="410" y="485" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">MEDICAL CENTRE</text>
              <text x="410" y="502" fill="#60a5fa" fontSize="10" fontWeight="600" textAnchor="middle">Health Pavilion (24/7)</text>
            </g>

            {/* 4. Student Services Center */}
            <g className="cursor-pointer hover:opacity-95 transition-opacity">
              <rect x="490" y="470" width="140" height="100" rx="8" fill="#182c48" stroke="#2a456e" strokeWidth="2" />
              <rect x="500" y="480" width="120" height="80" rx="4" fill="#14243b" />
              <text x="560" y="522" fill="#e2e8f0" fontSize="12" fontWeight="700" textAnchor="middle">STUDENT UNION</text>
              <text x="560" y="539" fill="#8995a7" fontSize="10" textAnchor="middle">Pharmacy & Services</text>
            </g>

            {/* 5. Aryabhata Academic Hall */}
            <g className="cursor-pointer hover:opacity-95 transition-opacity">
              <rect x="580" y="270" width="150" height="90" rx="8" fill="#182c48" stroke="#2a456e" strokeWidth="2" />
              <rect x="590" y="280" width="130" height="70" rx="4" fill="#14243b" />
              <text x="655" y="320" fill="#e2e8f0" fontSize="12" fontWeight="700" textAnchor="middle">ARYABHATA HALL</text>
              <text x="655" y="337" fill="#8995a7" fontSize="10" textAnchor="middle">Lecture Complex</text>
            </g>

            {/* 6. C.V. Raman Science Complex */}
            <g className="cursor-pointer hover:opacity-95 transition-opacity">
              <rect x="710" y="330" width="160" height="100" rx="8" fill="#182c48" stroke="#2a456e" strokeWidth="2" />
              <rect x="720" y="340" width="140" height="80" rx="4" fill="#14243b" />
              <text x="790" y="382" fill="#e2e8f0" fontSize="12" fontWeight="700" textAnchor="middle">RAMAN SCIENCE</text>
              <text x="790" y="399" fill="#8995a7" fontSize="10" textAnchor="middle">Chemistry / Bio Labs</text>
            </g>

            {/* 7. Sports Arena Complex */}
            <g className="cursor-pointer hover:opacity-95 transition-opacity">
              <rect x="130" y="470" width="150" height="110" rx="8" fill="#182c48" stroke="#2a456e" strokeWidth="2" />
              <rect x="140" y="480" width="130" height="90" rx="4" fill="#14243b" />
              <text x="205" y="525" fill="#e2e8f0" fontSize="12" fontWeight="700" textAnchor="middle">SPORTS ARENA</text>
              <text x="205" y="542" fill="#8995a7" fontSize="10" textAnchor="middle">Trauma Hub / Courts</text>
            </g>

            {/* 8. Residential Quarters (Mandela & Kalam Halls) */}
            <g className="cursor-pointer hover:opacity-95 transition-opacity">
              <rect x="420" y="620" width="180" height="80" rx="8" fill="#182c48" stroke="#2a456e" strokeWidth="2" />
              <rect x="430" y="630" width="160" height="60" rx="4" fill="#14243b" />
              <text x="510" y="662" fill="#e2e8f0" fontSize="12" fontWeight="700" textAnchor="middle">MANDELA RESIDENCES</text>
              <text x="510" y="679" fill="#8995a7" fontSize="10" textAnchor="middle">Blocks A, B, C</text>
            </g>

            {/* 9. North Gate Perimeter Staging */}
            <g className="cursor-pointer hover:opacity-95 transition-opacity">
              <rect x="180" y="70" width="110" height="60" rx="6" fill="#182c48" stroke="#2a456e" strokeWidth="1.5" />
              <text x="235" y="105" fill="#cbd5e1" fontSize="11" fontWeight="600" textAnchor="middle">NORTH GATE</text>
            </g>

            {/* Dynamic Walking Route Line if directions enabled */}
            {showDirections && activeResource && (
              <g className="animate-pulse">
                {/* Route path line */}
                <path
                  d={`M ${startCoords.x} ${startCoords.y} Q 500 440, ${
                    (activeResource.map_coords.x * 1000) / 100
                  } ${(activeResource.map_coords.y * 750) / 100}`}
                  fill="none"
                  stroke="#19A999"
                  strokeWidth="5"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                />
                {/* Start Origin Marker */}
                <circle cx={startCoords.x} cy={startCoords.y} r="8" fill="#19A999" />
                <circle cx={startCoords.x} cy={startCoords.y} r="14" fill="#19A999" opacity="0.3" />
                <text
                  x={startCoords.x}
                  y={startCoords.y - 12}
                  fill="#19A999"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  YOU ARE HERE
                </text>
              </g>
            )}

            {/* Interactive Campus Resource Markers */}
            {filteredResources.map((res) => {
              const cx = (res.map_coords.x * 1000) / 100;
              const cy = (res.map_coords.y * 750) / 100;
              const isSelected = activeResource?.id === res.id;
              const { hex } = getMarkerColor(res.resource_type, res.status);

              return (
                <g
                  key={res.id}
                  onClick={() => handleMarkerClick(res)}
                  className="cursor-pointer group"
                  transform={`translate(${cx}, ${cy})`}
                >
                  {/* Outer pulse when selected or medical centre */}
                  {(isSelected || res.resource_type === 'medical_centre') && (
                    <circle
                      r={isSelected ? '28' : '22'}
                      fill={hex}
                      opacity="0.25"
                      className="animate-ping origin-center"
                    />
                  )}

                  {/* Marker Pin Background */}
                  <circle
                    r={isSelected ? '18' : '14'}
                    fill={hex}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? '3' : '2'}
                    className="transition-all duration-200 group-hover:scale-110 drop-shadow-lg"
                  />

                  {/* Marker Label Tag */}
                  <g
                    transform={`translate(0, ${isSelected ? -24 : -18})`}
                    className="opacity-90 group-hover:opacity-100"
                  >
                    <rect
                      x="-50"
                      y="-12"
                      width="100"
                      height="16"
                      rx="4"
                      fill="#0c1626"
                      stroke={hex}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="0"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {res.name.length > 16 ? res.name.substring(0, 14) + '…' : res.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Map Floating Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <div className="bg-navy/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 flex flex-col shadow-lg">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              title="Reset View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle Directions button */}
          <button
            onClick={() => setShowDirections(!showDirections)}
            className={`p-2.5 rounded-xl border font-medium text-xs flex items-center gap-1.5 shadow-lg transition-all ${
              showDirections
                ? 'bg-medteal text-navy border-medteal font-bold'
                : 'bg-navy/90 backdrop-blur-md text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Walking Directions Route"
          >
            <Navigation className="w-4 h-4" />
            <span className="hidden sm:inline">Directions</span>
          </button>
        </div>

        {/* Map Legend Overlay (Bottom Left) */}
        <div className="absolute bottom-3 left-3 bg-navy/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 text-[11px] text-slate-300 hidden md:flex items-center gap-4 z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emergency" />
            <span>Medical Centre</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>AED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-medteal" />
            <span>First-Aid</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Pharmacy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-medblue" />
            <span>Muster Point</span>
          </div>
        </div>

        {/* Active Route Origin Switcher (if directions active) */}
        {showDirections && (
          <div className="absolute top-4 left-4 bg-navy/95 backdrop-blur-md border border-medteal/50 rounded-xl p-3 text-xs text-warmwhite z-10 shadow-lg">
            <div className="font-bold text-medteal flex items-center gap-1.5 mb-1.5">
              <Navigation className="w-3.5 h-3.5" />
              <span>Route Guide Origin</span>
            </div>
            <select
              value={userStartLocation}
              onChange={(e) => setUserStartLocation(e.target.value as any)}
              className="bg-navy-light text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none"
            >
              <option value="student_center">Student Services Center</option>
              <option value="hostels">Mandela Residence Hall</option>
              <option value="library">Tagore Central Library</option>
            </select>
          </div>
        )}
      </div>

      {/* Slide-out / Bottom Resource Detail Panel */}
      {activeResource && (
        <div className="bg-white border-t border-slate-200 p-4 sm:p-5 z-30 shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Title & Metadata */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    activeResource.status === 'available'
                      ? 'bg-mint text-emerald-800'
                      : activeResource.status === 'under_maintenance'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {activeResource.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-mutedgrey font-medium">
                  {activeResource.map_coords.zone} Campus Zone
                </span>
                <span className="text-xs text-mutedgrey">•</span>
                <span className="text-xs text-mutedgrey">
                  Verified: {new Date(activeResource.last_verified_at).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })} by {activeResource.verified_by}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-navy flex items-center gap-2">
                {activeResource.name}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal/80">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-medblue" />
                  {activeResource.building}, {activeResource.floor}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {activeResource.opening_hours}
                </span>
                {activeResource.has_wheelchair_ramp && (
                  <span className="flex items-center gap-1 text-medteal font-semibold">
                    <Accessibility className="w-3.5 h-3.5" />
                    Step-free ramp
                  </span>
                )}
              </div>
            </div>

            {/* Equipment Highlights */}
            <div className="hidden xl:flex flex-col gap-1 max-w-xs text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="font-semibold text-navy text-[11px] uppercase tracking-wider">
                Key Verified Equipment
              </span>
              <ul className="space-y-0.5 text-[11px]">
                {activeResource.equipment.slice(0, 2).map((eq) => (
                  <li key={eq.id} className="flex items-center gap-1.5 truncate">
                    <CheckCircle2 className="w-3 h-3 text-medteal shrink-0" />
                    <span className="truncate">{eq.equipment_name} ({eq.quantity}x)</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              {activeResource.contact_number ? (
                <a
                  href={`tel:${activeResource.contact_number.replace(/[^\d+]/g, '')}`}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-medblue hover:bg-medblue-600 text-white font-semibold text-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {activeResource.contact_number}</span>
                </a>
              ) : (
                <span className="text-xs text-mutedgrey italic py-2">
                  Campus emergency contact not configured
                </span>
              )}

              <Link
                to={`/resources/${activeResource.id}`}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy font-semibold text-xs transition-colors"
              >
                <span>Full Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => setSelectedResourceId(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                title="Close Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

