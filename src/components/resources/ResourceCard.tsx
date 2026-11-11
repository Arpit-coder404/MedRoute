import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Cross,
  Zap,
  Pill,
  Truck,
  Flag,
  Accessibility,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { CampusResource, ResourceType, ResourceStatus } from '../../types';

interface ResourceCardProps {
  resource: CampusResource;
  onLocateOnMap?: (resource: CampusResource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onLocateOnMap }) => {
  const getTypeBadge = (type: ResourceType) => {
    switch (type) {
      case 'medical_centre':
        return {
          label: 'Medical Centre',
          icon: HeartPulse,
          cls: 'bg-red-50 text-emergency border-red-200',
        };
      case 'aed':
        return {
          label: 'AED Unit',
          icon: Zap,
          cls: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'first_aid':
        return {
          label: 'First-Aid Station',
          icon: Cross,
          cls: 'bg-medteal-50 text-medteal-600 border-medteal-200',
        };
      case 'pharmacy':
        return {
          label: 'Dispensary',
          icon: Pill,
          cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'ambulance_bay':
        return {
          label: 'Ambulance Bay',
          icon: Truck,
          cls: 'bg-slate-100 text-navy border-slate-300',
        };
      case 'assembly_point':
        return {
          label: 'Assembly Area',
          icon: Flag,
          cls: 'bg-blue-50 text-medblue border-blue-200',
        };
      case 'accessible_entrance':
        return {
          label: 'Accessible Route',
          icon: Accessibility,
          cls: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      default:
        return {
          label: 'Medical Resource',
          icon: MapPin,
          cls: 'bg-slate-50 text-slate-700 border-slate-200',
        };
    }
  };

  const getStatusBadge = (status: ResourceStatus) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Available
          </span>
        );
      case 'temporarily_unavailable':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            Unavailable
          </span>
        );
      case 'under_maintenance':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Wrench className="w-3 h-3 text-amber-600" />
            Maintenance
          </span>
        );
      case 'unverified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <HelpCircle className="w-3 h-3 text-slate-400" />
            Unverified
          </span>
        );
    }
  };

  const badge = getTypeBadge(resource.resource_type);
  const Icon = badge.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-medblue/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden">
      <div className="p-5 space-y-3.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${badge.cls}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {badge.label}
          </span>
          {getStatusBadge(resource.status)}
        </div>

        {/* Title & Location */}
        <div>
          <Link
            to={`/resources/${resource.id}`}
            className="font-bold text-base text-navy group-hover:text-medblue transition-colors line-clamp-1"
          >
            {resource.name}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-mutedgrey mt-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-medblue shrink-0" />
            <span className="truncate">
              {resource.building} • {resource.floor}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>

        {/* Metadata info */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-charcoal/80">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-500 text-[11px]">
              <Clock className="w-3 h-3 text-slate-400" />
              Hours:
            </span>
            <span className="font-medium text-[11px] text-right truncate max-w-[180px]">
              {resource.opening_hours}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-500 text-[11px]">
              <ShieldCheck className="w-3 h-3 text-medteal" />
              Equipment:
            </span>
            <span className="font-medium text-[11px] text-navy">
              {resource.equipment.length} verified item{resource.equipment.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Accessibility features */}
        {resource.has_wheelchair_ramp && (
          <div className="inline-flex items-center gap-1 text-[11px] font-medium text-medteal bg-medteal-50 px-2 py-0.5 rounded border border-medteal/20">
            <Accessibility className="w-3 h-3" />
            <span>Accessible entrance & ramp</span>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        {resource.contact_number ? (
          <a
            href={`tel:${resource.contact_number.replace(/[^\d+]/g, '')}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-medblue hover:text-medblue-700"
            title={`Direct call to ${resource.contact_number}`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{resource.contact_number}</span>
          </a>
        ) : (
          <span className="text-[11px] text-mutedgrey italic">Contact not configured</span>
        )}

        <div className="flex items-center gap-1">
          {onLocateOnMap && (
            <button
              onClick={() => onLocateOnMap(resource)}
              className="text-xs text-slate-600 hover:text-navy px-2 py-1 rounded hover:bg-slate-200 transition-colors"
              title="Show on map"
            >
              Map
            </button>
          )}

          <Link
            to={`/resources/${resource.id}`}
            className="inline-flex items-center text-xs font-bold text-navy hover:text-medblue transition-colors group-hover:translate-x-0.5"
          >
            <span>View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

