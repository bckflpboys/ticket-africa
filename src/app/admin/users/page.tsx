'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiMail, FiPhone, FiFilter, FiDownload, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useToast } from '@/contexts/toast';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  createdAt: string;
  role: 'user' | 'admin' | 'organizer' | 'staff' | 'scanner';
  ticketsPurchased: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<User['role'] | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(10);
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter !== 'all' && { role: roleFilter })
      });

      const response = await fetch(`/api/admin/users?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.pagination.pages);
      setTotalUsers(data.pagination.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Failed to load users', 'error');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'badge-primary';
      case 'organizer':
        return 'badge-secondary';
      case 'staff':
        return 'badge-accent';
      case 'scanner':
        return 'badge-info';
      default:
        return 'badge-ghost';
    }
  };

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    try {
      setUpdatingRole(userId);
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      
      showToast('User role updated successfully', 'success');
    } catch (error) {
      console.error('Error updating user role:', error);
      showToast('Failed to update user role', 'error');
    } finally {
      setUpdatingRole(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 pb-6 border-b-2 border-base-300">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-base-content/70">Manage and monitor user accounts, roles, and activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { role: 'user', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', color: 'bg-info/10 text-info border-info/30' },
          { role: 'staff', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', color: 'bg-accent/10 text-accent border-accent/30' },
          { role: 'scanner', icon: 'M7 21h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2ZM12 7v4M12 15h0', color: 'bg-secondary/10 text-secondary border-secondary/30' },
          { role: 'organizer', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', color: 'bg-primary/10 text-primary border-primary/30' }
        ].map(({ role, icon, color }) => {
          const count = users.filter(u => u.role === role).length;
          const percentage = users.length > 0 ? Math.round((count / users.length) * 100) : 0;
          const isIncreasing = true;

          return (
            <div key={role} className={`card bg-base-100 shadow-sm border-2 ${color.split(' ')[2]}`}>
              <div className="card-body p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="stat-title text-base-content/70 capitalize mb-1">{role}s</div>
                    <div className="stat-value text-2xl font-bold">{count}</div>
                    <div className="stat-desc flex items-center gap-1 mt-1">
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${isIncreasing ? 'bg-success/10 text-success border-success/30' : 'bg-error/10 text-error border-error/30'}`}>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d={isIncreasing ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
                        </svg>
                      </span>
                      <span className={isIncreasing ? 'text-success' : 'text-error'}>
                        {percentage}% of total
                      </span>
                    </div>
                  </div>
                  <div className={`rounded-lg p-3 border-2 ${color}`}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={icon} />
                    </svg>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t-2 border-base-200">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-base-content/70">Progress</span>
                    <span className="font-medium">{percentage}%</span>
                  </div>
                  <div className="w-full bg-base-200 rounded-full h-2 border-2 border-base-300">
                    <div 
                      className={`h-2 rounded-full ${color.split(' ')[1].replace('text-', 'bg-')}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions Bar */}
      <div className="bg-base-100 rounded-lg border-2 border-base-300 shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left side - Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-base-content/50" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="input input-bordered w-full pl-10 border-2 border-base-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Right side - Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-3 lg:w-auto">
            <div className="join border-2 border-base-300 rounded-lg">
              <div className="join-item flex items-center bg-base-200 px-3 border-r-2 border-base-300">
                <FiFilter className="w-4 h-4" />
              </div>
              <select 
                className="select select-bordered join-item border-0"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as User['role'] | 'all')}
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="staff">Staff</option>
                <option value="scanner">Scanners</option>
                <option value="organizer">Organizers</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            <div className="join border-2 border-base-300 rounded-lg">
              <button 
                className="btn join-item border-r-2"
                onClick={fetchUsers}
              >
                <FiRefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button className="btn join-item">
                <FiDownload className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || roleFilter !== 'all') && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t-2 border-base-300">
            <div className="text-sm text-base-content/70">Active Filters:</div>
            {searchTerm && (
              <div className="badge badge-outline gap-2 border-2">
                <span>Search: {searchTerm}</span>
                <button 
                  className="hover:text-error"
                  onClick={() => setSearchTerm('')}
                >
                  ×
                </button>
              </div>
            )}
            {roleFilter !== 'all' && (
              <div className="badge badge-outline gap-2 border-2">
                <span>Role: {roleFilter}</span>
                <button 
                  className="hover:text-error"
                  onClick={() => setRoleFilter('all')}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-base-content/70 mt-4 pt-4 border-t-2 border-base-300">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 p-4 bg-base-100 rounded-lg border-2 border-base-300">
        <div className="text-sm text-base-content/70">
          Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
        </div>
        <div className="join">
          <button 
            className="join-item btn btn-sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                className={`join-item btn btn-sm ${currentPage === pageNum ? 'btn-primary' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button 
            className="join-item btn btn-sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-base-100 rounded-lg border-2 border-base-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200/50 border-b-2 border-base-300">
              <tr>
                <th className="border-r-2 border-base-200">User</th>
                <th className="border-r-2 border-base-200">Contact</th>
                <th className="border-r-2 border-base-200">Join Date</th>
                <th className="border-r-2 border-base-200">Role</th>
                <th className="border-r-2 border-base-200">Tickets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-lg font-semibold">No users found</span>
                      <span className="text-base-content/70">Try adjusting your search or filters</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                              <img src={user.image} alt={user.name} />
                            </div>
                          </div>
                        ) : (
                          <div className="avatar placeholder">
                            <div className="w-12 h-12 rounded-full bg-neutral-focus text-neutral-content ring ring-primary ring-offset-base-100 ring-offset-2">
                              <span className="text-xl">{user.name.charAt(0)}</span>
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="font-bold">{user.name}</div>
                          <div className="text-sm opacity-50">Joined {formatDate(user.createdAt)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <a href={`mailto:${user.email}`} className="link link-hover flex items-center gap-2 text-sm">
                          <FiMail className="w-4 h-4" />
                          {user.email}
                        </a>
                        {user.phone && (
                          <a href={`tel:${user.phone}`} className="link link-hover flex items-center gap-2 text-sm">
                            <FiPhone className="w-4 h-4" />
                            {user.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="text-sm">{formatDate(user.createdAt)}</td>
                    <td>
                      <span className={`badge ${getRoleBadgeColor(user.role)} badge-sm capitalize`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="badge badge-ghost badge-sm">{user.ticketsPurchased}</div>
                    </td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <button 
                          className="btn btn-sm btn-ghost"
                          disabled={updatingRole === user._id}
                        >
                          {updatingRole === user._id ? (
                            <span className="loading loading-spinner loading-sm"></span>
                          ) : (
                            'Change Role'
                          )}
                        </button>
                        <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                          {['user', 'staff', 'scanner', 'organizer', 'admin'].map((role) => (
                            <li key={role}>
                              <button 
                                onClick={() => handleRoleChange(user._id, role as User['role'])}
                                disabled={user.role === role}
                                className={user.role === role ? 'bg-base-200' : ''}
                              >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
