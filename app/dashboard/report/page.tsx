'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetReportsQuery, useGetSingleReportQuery, useUpdateReportStatusMutation, useDeleteReportMutation } from '@/lib/store';
import { AlertTriangle, Clock, CheckCircle, XCircle, Eye, Calendar, DollarSign, User, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type ReportStatus = 'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'DISMISSED';
type ReportTopic = 'RUDE_BEHAVIOR' | 'SAFETY_CONCERN' | 'SERVICE_QUALITY' | 'PAYMENT_ISSUE' | 'OTHER';
type DateFilter = 'all' | 'today' | 'week' | 'month';

interface User {
  _id: string;
  name: string;
  role: 'PARENT' | 'NANNY';
  profileImage: string;
}

interface Booking {
  _id: string;
  bookingType: 'HOURLY' | 'FULL_DAY';
  bookingStatus: string;
  totalPayable: number;
  createdAt: string;
  hourlyBooking?: {
    date: string;
    startTime: string;
    endTime: string;
  };
  fullDayBooking?: {
    fullDays: string[];
    hasOverTime: boolean;
    overTimeHours: number;
  };
}

interface Report {
  _id: string;
  reporterId: User;
  reportedUserId: User;
  bookingId: Booking;
  topic: ReportTopic;
  description: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

type StatusColors = Record<ReportStatus, string>;
type ReportTopicLabels = Record<ReportTopic, string>;

const statusColors: StatusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_REVIEW: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
  DISMISSED: 'bg-gray-100 text-gray-800'
};

const reportTopicLabels: ReportTopicLabels = {
  RUDE_BEHAVIOR: 'Rude Behavior',
  SAFETY_CONCERN: 'Safety Concern',
  SERVICE_QUALITY: 'Service Quality',
  PAYMENT_ISSUE: 'Payment Issue',
  OTHER: 'Other'
};

export default function ReportsPage() {
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [updatingReportId, setUpdatingReportId] = useState<string | null>(null);
  
  const { data: reportsData, isLoading, error } = useGetReportsQuery({});
  const { data: reportDetails, isLoading: isLoadingDetails } = useGetSingleReportQuery(selectedReportId || '', { 
    skip: !selectedReportId 
  });
  const [updateReportStatus, { isLoading: isUpdating }] = useUpdateReportStatusMutation();
  const [deleteReport, { isLoading: isDeleting }] = useDeleteReportMutation();
  
  // Enhanced data access with better error handling
  const reports = useMemo(() => {
    if (!reportsData) return [];
    
    // Try multiple possible data paths
    const possibleReports = 
      reportsData?.data?.data ?? 
      reportsData?.data ?? 
      reportsData?.reports ?? 
      reportsData ?? 
      [];
      
    // Ensure it's an array
    return Array.isArray(possibleReports) ? possibleReports : [];
  }, [reportsData]);

  const meta = reportsData?.data?.meta ?? { total: 0, limit: 10, page: 1, totalPage: 1 };
  const reportDetail = (reportDetails?.data?.data || reportDetails?.data) as Report | undefined;
  
  // Enhanced debug logging
  console.log('Raw reportsData:', reportsData);
  console.log('Processed reports:', reports);
  console.log('Reports length:', reports.length);
  
  // Log first report data structure if exists
  if (reports.length > 0) {
    console.log('First report structure:', reports[0]);
    console.log('Reporter name:', reports[0]?.reporterId?.name);
    console.log('Reported user name:', reports[0]?.reportedUserId?.name);
  }
  
  const handleViewDetails = (report: Report) => {
    console.log('Viewing details for report:', report);
    setSelectedReportId(report._id);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = async (status: ReportStatus) => {
    if (!selectedReportId) return;
    
    try {
      await updateReportStatus({ id: selectedReportId, status }).unwrap();
      toast({
        title: "Status updated",
        description: `Report status has been updated to ${status.toLowerCase().replace('_', ' ')}`,
      });
    } catch (error) {
      console.error('Status update error:', error);
      toast({
        title: "Error",
        description: "Failed to update report status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReport = async () => {
    if (!selectedReportId) return;
    
    try {
      await deleteReport(selectedReportId).unwrap();
      setIsDetailsOpen(false);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Report deleted",
        description: "The report has been deleted successfully",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (reportId: string, status: ReportStatus) => {
    setUpdatingReportId(reportId);
    
    try {
      await updateReportStatus({ id: reportId, status }).unwrap();
      toast({
        title: "Status updated",
        description: `Report status has been updated to ${status.toLowerCase().replace('_', ' ')}`,
      });
    } catch (error) {
      console.error('Status update error:', error);
      toast({
        title: "Error",
        description: "Failed to update report status",
        variant: "destructive",
      });
    } finally {
      setUpdatingReportId(null);
    }
  };
  
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <Skeleton className="h-6 w-[80px]" />
          <Skeleton className="h-6 w-[100px]" />
        </div>
      ))}
    </div>
  );

  const columns = [
    {
      key: 'reporter',
      header: 'Reporter',
      className: '',
      render: (_: any, report: Report) => {
        console.log('Rendering reporter for:', report);
        const reporter = report.reporterId || report.reporter;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={reporter?.profileImage} alt={reporter?.name} />
              <AvatarFallback>
                {reporter?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{reporter?.name || 'Unknown'}</p>
              <p className="text-sm text-gray-500">{reporter?.role || 'N/A'}</p>
            </div>
          </div>
        );
      }
    },
    {
      key: 'reportedUser',
      header: 'Reported User',
      className: 'font-medium',
      render: (_: any, report: Report) => {
        const reportedUser = report.reportedUserId || report.reportedUser;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={reportedUser?.profileImage} alt={reportedUser?.name} />
              <AvatarFallback>{reportedUser?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{reportedUser?.name || 'Unknown'}</div>
              <div className="text-sm text-gray-500">{reportedUser?.role || 'N/A'}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'topic',
      header: 'Report Topic',
      className: '',
      render: (value: ReportTopic) => reportTopicLabels[value as keyof ReportTopicLabels] || value
    },
    {
      key: 'createdAt',
      header: 'Date',
      className: '',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'bookingId',
      header: 'Booking Type',
      className: '',
      render: (_: any, report: Report) => (
        <Badge className="bg-blue-100 text-blue-800">
          {report.bookingId?.bookingType || 'N/A'}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      className: '',
      render: (value: ReportStatus) => (
        <div className="flex items-center space-x-2">
          {value === 'PENDING' && <Clock className="h-4 w-4 text-yellow-500" />}
          {value === 'IN_REVIEW' && <AlertTriangle className="h-4 w-4 text-blue-500" />}
          {value === 'RESOLVED' && <CheckCircle className="h-4 w-4 text-green-500" />}
          {value === 'DISMISSED' && <XCircle className="h-4 w-4 text-gray-500" />}
          <Badge className={statusColors[value as keyof StatusColors] || 'bg-gray-100 text-gray-800'}>
            {value.replace('_', ' ').charAt(0).toUpperCase() + value.replace('_', ' ').slice(1).toLowerCase()}
          </Badge>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      className: '',
      render: (_: any, report: Report) => (
        <div className="flex items-center space-x-2">
          <Select 
            disabled={updatingReportId === report._id}
            onValueChange={(value) => handleStatusUpdate(report._id, value as ReportStatus)}
            defaultValue={report.status}
          >
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Update Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_REVIEW">In Review</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="DISMISSED">Dismissed</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewDetails(report)}
            className="h-8 px-2"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'PENDING', label: 'Pending' },
        { value: 'IN_REVIEW', label: 'In Review' },
        { value: 'RESOLVED', label: 'Resolved' },
        { value: 'DISMISSED', label: 'Dismissed' }
      ]
    },
    {
      key: 'topic',
      label: 'Topic',
      options: [
        { value: 'RUDE_BEHAVIOR', label: 'Rude Behavior' },
        { value: 'SAFETY_CONCERN', label: 'Safety Concern' },
        { value: 'SERVICE_QUALITY', label: 'Service Quality' },
        { value: 'PAYMENT_ISSUE', label: 'Payment Issue' },
        { value: 'OTHER', label: 'Other' }
      ]
    }
  ];

  // Enhanced error handling and debugging
  if (error) {
    console.error('Query error:', error);
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">Review and manage user reports</p>
          </div>
        </div>

        <Card>
          <CardContent className='mt-6'>
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">Error loading reports. Please try again.</p>
                <p className="text-sm text-gray-500 mt-2">Error details: {JSON.stringify(error)}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No reports found.</p>
                <p className="text-sm text-gray-500 mt-2">Reports will appear here when they are submitted.</p>
                {reportsData && (
                  <p className="text-xs text-gray-400 mt-2">
                    Raw data structure: {JSON.stringify(Object.keys(reportsData))}
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Showing {reports.length} of {meta.total} reports
                  </p>
                </div>
                <DataTable
                  columns={columns}
                  data={reports}
                  searchKey="description" // Changed from nested path to simple field
                  filters={filters}
                  itemsPerPage={10}
                  onViewDetails={handleViewDetails}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Report Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {isLoadingDetails ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <div className="flex space-x-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ) : reportDetail ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Report Details</DialogTitle>
                <DialogDescription>
                  Report ID: {reportDetail._id}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Status</h3>
                  <div className="flex items-center space-x-2">
                    {reportDetail.status === 'PENDING' && <Clock className="h-4 w-4 text-yellow-500" />}
                    {reportDetail.status === 'IN_REVIEW' && <AlertTriangle className="h-4 w-4 text-blue-500" />}
                    {reportDetail.status === 'RESOLVED' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {reportDetail.status === 'DISMISSED' && <XCircle className="h-4 w-4 text-gray-500" />}
                    <Badge className={statusColors[reportDetail.status as keyof StatusColors] || 'bg-gray-100 text-gray-800'}>
                      {reportDetail.status.replace('_', ' ').charAt(0).toUpperCase() + reportDetail.status.replace('_', ' ').slice(1).toLowerCase()}
                    </Badge>
                  </div>
                </div>
                
                <Separator />
                
                {/* Topic */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Topic</h3>
                  <p>{reportTopicLabels[reportDetail.topic as keyof ReportTopicLabels] || reportDetail.topic}</p>
                </div>
                
                {/* Description */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <Card className="bg-gray-50">
                    <CardContent className="pt-4">
                      <p className="whitespace-pre-wrap">{reportDetail.description}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Separator />
                
                {/* Reporter & Reported User */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Reporter</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={reportDetail.reporterId?.profileImage} alt={reportDetail.reporterId?.name} />
                          <AvatarFallback>
                            {reportDetail.reporterId?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{reportDetail.reporterId?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{reportDetail.reporterId?.role || 'N/A'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Reported User</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={reportDetail.reportedUserId?.profileImage} alt={reportDetail.reportedUserId?.name} />
                          <AvatarFallback>
                            {reportDetail.reportedUserId?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{reportDetail.reportedUserId?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{reportDetail.reportedUserId?.role || 'N/A'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Separator />
                
                {/* Booking Details */}
                {reportDetail.bookingId && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Booking Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <p className="text-sm font-medium">Booking Type</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            {reportDetail.bookingId.bookingType}
                          </Badge>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <p className="text-sm font-medium">Total Amount</p>
                          </div>
                          <p>${reportDetail.bookingId.totalPayable?.toFixed(2)}</p>
                        </CardContent>
                      </Card>
                      
                      {reportDetail.bookingId.bookingType === 'HOURLY' && reportDetail.bookingId.hourlyBooking && (
                        <Card className="md:col-span-2">
                          <CardContent className="pt-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <p className="text-sm font-medium">Booking Time</p>
                            </div>
                            <p>
                              {new Date(reportDetail.bookingId.hourlyBooking.date).toLocaleDateString()} | 
                              {reportDetail.bookingId.hourlyBooking.startTime} - {reportDetail.bookingId.hourlyBooking.endTime}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                      
                      {reportDetail.bookingId.bookingType === 'FULL_DAY' && reportDetail.bookingId.fullDayBooking && 
                       reportDetail.bookingId.fullDayBooking.fullDays.length > 0 && (
                        <Card className="md:col-span-2">
                          <CardContent className="pt-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <p className="text-sm font-medium">Full Days</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {reportDetail.bookingId.fullDayBooking.fullDays.map((day, index) => (
                                <Badge key={index} variant="outline">
                                  {new Date(day).toLocaleDateString()}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                )}
                
                <Separator />
                
                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <p>Created At:</p>
                    <p className="font-medium">{new Date(reportDetail.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p>Updated At:</p>
                    <p className="font-medium">{new Date(reportDetail.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex gap-2">
                  <Select 
                    disabled={isUpdating}
                    onValueChange={(value) => handleStatusChange(value as ReportStatus)}
                    defaultValue={reportDetail.status}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_REVIEW">In Review</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="DISMISSED">Dismissed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={isDeleting}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the report.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteReport}>
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading report details. Please try again.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}