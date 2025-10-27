'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetUsersQuery } from '@/lib/store';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

// User interface based on API response
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'PARENT' | 'NANNY';
  status: 'ACTIVE' | 'INACTIVE';
  profileImage: string;
  verified: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  stripeAccountId?: string;
  countryCode?: string;
  gender?: string;
  kidsManage?: number;
}

const roleColors = {
  PARENT: 'bg-pink-100 text-pink-800',
  NANNY: 'bg-blue-100 text-blue-800',
  ADMIN: 'bg-purple-100 text-purple-800'
};

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  SUSPENDED: 'bg-red-100 text-red-800'
};

// Server-side DataTable component
interface ServerDataTableProps {
  columns: any[];
  data: any[];
  searchKey: string;
  filters: any[];
  onSearch: (value: string) => void;
  onFilter: (value: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isLoading: boolean;
}

function ServerDataTable({
  columns,
  data,
  searchKey,
  filters,
  onSearch,
  onFilter,
  onPageChange,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  isLoading
}: ServerDataTableProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleSearch = (value: string) => {
    setLocalSearchTerm(value);
    onSearch(value);
  };

  const handleFilter = (value: string) => {
    setSelectedFilter(value);
    onFilter(value);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder={`Search ${searchKey}...`}
              value={localSearchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {filters.length > 0 && (
          <Select value={selectedFilter} onValueChange={handleFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {filters[0].label}</SelectItem>
              {filters[0].options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {isLoading ? 'Loading...' : 'No results found.'}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={row._id || index}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {endIndex} of {totalItems} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserManagement() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState('');

  // API query with parameters
  const queryParams = useMemo(() => {
    const params: any = { page, limit };
    if (searchTerm) params.searchTerm = searchTerm;
    if (role) params.role = role;
    return params;
  }, [page, limit, searchTerm, role]);

  const { data: users, isLoading, error } = useGetUsersQuery(queryParams);
  const userData = users?.data?.data || [];
  const meta = users?.data?.meta || { total: 0, limit: 10, page: 1, totalPage: 1 };



  // Handle search with debouncing
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      // The search term is already set in handleSearch
      // This effect is just for potential future debouncing logic
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle role filter
  const handleRoleFilter = (value: string) => {
    setRole(value === 'all' ? '' : value);
    setPage(1); // Reset to first page when filtering
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const columns = [
    {
      key: 'user',
      header: 'User',
      className: '',
      render: (_: any, user: User) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback>
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      className: '',
      render: (value: string) => (
        <Badge className={roleColors[value as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}>
          {value === 'PARENT' ? 'Parent' : value === 'NANNY' ? 'Nanny' : value}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      header: 'Join Date',
      className: '',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'verified',
      header: 'Verified',
      className: 'text-center',
      render: (value: boolean) => (
        <Badge className={value ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
          {value ? 'Verified' : 'Pending'}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      className: '',
      render: (value: string) => (
        <Badge className={statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
          {value === 'ACTIVE' ? 'Active' : value === 'INACTIVE' ? 'Inactive' : value}
        </Badge>
      )
    }
  ];

  const filters = [
    {
      key: 'role',
      label: 'Role',
      options: [
        { value: 'PARENT', label: 'Parents' },
        { value: 'NANNY', label: 'Nannies' }
      ]
    }
  ];

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage and monitor all platform users</p>
          </div>
          <Card>
            <CardContent className="mt-6">
              <LoadingSkeleton />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage and monitor all platform users</p>
          </div>
          <Card>
            <CardContent className="mt-6">
              <div className="text-center py-8">
                <p className="text-red-600">Error loading users. Please try again.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage and monitor all platform users</p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {meta.total.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                Across all roles
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Parents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {userData.filter(u => u.role === 'PARENT' && u.status === 'ACTIVE').length}
              </div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                Currently active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Nannies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {userData.filter(u => u.role === 'NANNY' && u.status === 'ACTIVE').length}
              </div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                Currently active
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className='mt-6'>
            <ServerDataTable
              columns={columns}
              data={userData}
              searchKey="name"
              filters={filters}
              onSearch={handleSearch}
              onFilter={handleRoleFilter}
              onPageChange={handlePageChange}
              currentPage={page}
              totalPages={meta.totalPage}
              totalItems={meta.total}
              itemsPerPage={limit}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}