import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AddEmployeeModal } from './AddEmployeeModal';
import { EditEmployeeModal } from './EditEmployeeModal';
import { CredentialsCardModal } from './CredentialsCardModal';
import { departmentList } from '../../data/seedData';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Grid,
  List,
  Mail,
  Phone,
  Calendar,
  Building,
  MoreVertical,
  Edit2,
  Eye,
  Key,
  Shield,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const EmployeeManagement = ({ onSelectEmployee }) => {
  const { employees, setCurrentUser, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  // Filter logic
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.loginId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Top Header & Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Employee Directory & Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Manage staff records, onboard new employees with auto-generated Login IDs, and configure roles
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary btn-lg"
          style={{ boxShadow: '0 4px 14px var(--primary-glow)' }}
        >
          <UserPlus size={18} />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-subtle)'
            }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.75rem' }}
              placeholder="Search by name, Login ID (e.g. OIJODO...), role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Department & Status Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              style={{ width: 'auto', fontSize: '0.85rem' }}
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="All">All Departments</option>
              {departmentList.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              className="form-select"
              style={{ width: 'auto', fontSize: '0.85rem' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* View Mode Toggle */}
            <div style={{
              display: 'flex',
              background: 'var(--bg-hover)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '2px'
            }}>
              <button
                onClick={() => setViewMode('grid')}
                className="btn-icon"
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '6px',
                  background: viewMode === 'grid' ? 'var(--bg-card)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-subtle)'
                }}
                title="Grid View"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className="btn-icon"
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '6px',
                  background: viewMode === 'table' ? 'var(--bg-card)' : 'transparent',
                  color: viewMode === 'table' ? 'var(--primary)' : 'var(--text-subtle)'
                }}
                title="Table View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Employee List Count */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <span>Showing <strong>{filteredEmployees.length}</strong> of {employees.length} employees</span>
        <span>Auto-generated Login ID protocol active</span>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid-responsive">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="glass-card glass-card-hover"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              {/* Top Row: Avatar + Status */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={emp.avatar}
                    alt={emp.fullName}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      objectFit: 'cover',
                      border: '2px solid var(--border-subtle)'
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: emp.status === 'Active' ? 'var(--success)' : 'var(--warning)',
                    border: '2px solid var(--bg-card)'
                  }} />
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span className={`badge ${emp.role === 'admin' ? 'badge-primary' : 'badge-info'}`}>
                    {emp.role === 'admin' ? 'HR / Admin' : 'Employee'}
                  </span>
                </div>
              </div>

              {/* Name & Designation */}
              <div style={{ marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.2rem' }}>
                  {emp.fullName}
                </h3>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {emp.designation}
                </div>
              </div>

              {/* Login ID System Badge */}
              <div style={{
                background: 'var(--bg-hover)',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Login ID:</span>
                <code className="font-mono" style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)' }}>
                  {emp.loginId}
                </code>
              </div>

              {/* Info Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building size={14} color="var(--text-subtle)" />
                  <span>{emp.department}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} color="var(--text-subtle)" />
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{emp.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={14} color="var(--text-subtle)" />
                  <span>Joined {emp.joiningDate}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.85rem'
              }}>
                <button
                  onClick={() => setEditingEmployee(emp)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, fontSize: '0.8rem' }}
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1.2, fontSize: '0.8rem' }}
                >
                  <Eye size={14} /> Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-hover)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Employee</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>System Login ID</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Department</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Designation</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Role</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--transition-fast)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={emp.avatar}
                        alt={emp.fullName}
                        style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700 }}>{emp.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <code className="font-mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {emp.loginId}
                    </code>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>{emp.department}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>{emp.designation}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${emp.role === 'admin' ? 'badge-primary' : 'badge-info'}`}>
                      {emp.role === 'admin' ? 'Admin' : 'Employee'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${emp.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setEditingEmployee(emp)}
                        className="btn-icon btn-secondary"
                        style={{ width: '2rem', height: '2rem' }}
                        title="Edit Details"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                        className="btn-icon btn-primary"
                        style={{ width: '2rem', height: '2rem' }}
                        title="View Full Profile"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Employee Modal Wizard */}
      {isAddModalOpen && (
        <AddEmployeeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onCreated={(emp, tempPass) => {
            setCreatedCredentials({ employee: emp, tempPassword: tempPass });
          }}
        />
      )}

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <EditEmployeeModal
          isOpen={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
          employee={editingEmployee}
        />
      )}

      {/* Created Credentials Card Popup */}
      {createdCredentials && (
        <CredentialsCardModal
          isOpen={!!createdCredentials}
          onClose={() => setCreatedCredentials(null)}
          employee={createdCredentials.employee}
          tempPassword={createdCredentials.tempPassword}
        />
      )}
    </div>
  );
};
