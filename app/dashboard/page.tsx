"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Baby,
  Heart,
} from "lucide-react";
import { set } from "date-fns";
import { useGetDashboardCardDataQuery, useGetDashboardStatsQuery, useTotalRevenueQuery } from "@/lib/store";

// API data interfaces are defined in the API files

type TimeFilter = "6months" | "1month" | "3months" | "1year";

// Using real API data

export default function DashboardOverview() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("6months");
  const [user, setUser] = useState<TimeFilter>("1month");
  
  const { data: card, isLoading: cardLoading } = useGetDashboardCardDataQuery();
  const cardData = card?.data;


  const { data: stats, isLoading } = useGetDashboardStatsQuery();
  const userData = stats?.data;
  const { data: revenueData } = useTotalRevenueQuery();
  const revenue = revenueData?.data;


  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-gray-600">
              Welcome back! Here`s what`s happening with your platform.
            </p>
          </div>
          <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${cardData?.totalRevenue?.toLocaleString() || '0'}`}
            changeType="increase"
            icon={DollarSign}
          />
          <StatCard
            title="Total Bookings"
            value={cardData?.totalBookings?.toLocaleString() || '0'}
            changeType="increase"
            icon={Calendar}
          />
          <StatCard
            title="Total Parents"
            value={cardData?.totalParents?.toLocaleString() || '0'}
            changeType="increase"
            icon={Users}
          />
          <StatCard
            title="Total Nannies"
            value={cardData?.totalNannies?.toString() || '0'}
            changeType="increase"
            icon={Baby}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6">
          {/* User Distribution Chart */}
          <Card>
            <CardHeader >
              <div className="flex justify-between items-center">
                <div>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Users Overview
                </CardTitle>
                <CardDescription>
                  Monthly distribution of mothers and nannies
                </CardDescription>
              </div>

              <div>
                <Select value={user} onValueChange={(value: TimeFilter) => setUser(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={userData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalParents" fill="#CD671C" name="Mothers" />
                  <Bar dataKey="totalNannies" fill="#F59E0B" name="Nannies" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Revenue & Bookings Trend
              </CardTitle>
              <CardDescription>
                Monthly revenue and booking trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenue || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke="#CD671C"
                    fill="#CD671C"
                    fillOpacity={0.1}
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="totalBookings"
                    stroke="#CD671C"
                    strokeWidth={2}
                    name="Bookings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
