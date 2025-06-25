import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Clock, Eye, Edit, Plus, Users, CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths,
  isToday, getDay, parseISO, addMinutes, isBefore, isAfter
} from "date-fns";

const CalendarView = ({ 
  appointments = [], 
  recurringAvailability = [], 
  availabilityBlocks = [], 
  appointmentTypes = [],
  onDateClick,
  onAppointmentClick 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => 
      isSameDay(parseISO(apt.date), date)
    );
  };

  // Get availability blocks for a specific date
  const getBlocksForDate = (date) => {
    return availabilityBlocks.filter(block => 
      isSameDay(parseISO(block.date), date)
    );
  };

  // Check if date has recurring availability
  const hasRecurringAvailability = (date) => {
    const dayOfWeek = getDay(date);
    return recurringAvailability.some(rule => 
      rule.day_of_week === dayOfWeek && rule.is_active
    );
  };

  // Get status summary for a date
  const getDateStatus = (date) => {
    const dayAppointments = getAppointmentsForDate(date);
    const blocks = getBlocksForDate(date);
    const hasRecurring = hasRecurringAvailability(date);
    
    const confirmedCount = dayAppointments.filter(apt => apt.status === 'confirmed').length;
    const pendingCount = dayAppointments.filter(apt => apt.status === 'pending').length;
    const blockedTime = blocks.filter(block => block.type === 'block').length;
    
    return {
      totalAppointments: dayAppointments.length,
      confirmedCount,
      pendingCount,
      blockedTime,
      hasRecurring,
      isFullyBlocked: blockedTime > 0 && !hasRecurring
    };
  };

  const navigateMonth = (direction) => {
    setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  };

  const getAppointmentTypeColor = (typeId) => {
    const type = appointmentTypes.find(t => t.id === typeId);
    return type?.color || '#3B82F6';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-semibold">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Blocked</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center font-medium text-stone-600 border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const status = getDateStatus(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);
              
              return (
                <div 
                  key={day.toISOString()}
                  className={`min-h-[120px] border-r border-b last:border-r-0 p-2 cursor-pointer hover:bg-stone-50 transition-colors ${
                    !isCurrentMonth ? 'bg-stone-50 text-stone-400' : ''
                  } ${isCurrentDay ? 'bg-amber-50 border-amber-200' : ''}`}
                  onClick={() => onDateClick && onDateClick(day)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${
                      isCurrentDay ? 'text-amber-700' : isCurrentMonth ? 'text-stone-900' : 'text-stone-400'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    
                    {/* Status indicators */}
                    <div className="flex items-center gap-1">
                      {status.hasRecurring && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" title="Available" />
                      )}
                      {status.isFullyBlocked && (
                        <div className="w-2 h-2 bg-red-500 rounded-full" title="Blocked" />
                      )}
                      {status.totalAppointments > 0 && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" title="Has appointments" />
                      )}
                    </div>
                  </div>

                  {/* Appointments for this day */}
                  <div className="space-y-1">
                    {getAppointmentsForDate(day).slice(0, 3).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80"
                        style={{ backgroundColor: getAppointmentTypeColor(appointment.appointment_type_id) }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAppointmentClick && onAppointmentClick(appointment);
                        }}
                        title={`${appointment.customer_name} - ${appointment.start_time}`}
                      >
                        <div className="flex items-center gap-1">
                          {appointment.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                          {appointment.status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
                          {appointment.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                          <span className="truncate">
                            {appointment.start_time} {appointment.customer_name}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {getAppointmentsForDate(day).length > 3 && (
                      <div className="text-xs text-stone-500 font-medium">
                        +{getAppointmentsForDate(day).length - 3} more
                      </div>
                    )}
                  </div>

                  {/* Availability blocks */}
                  {getBlocksForDate(day).length > 0 && (
                    <div className="mt-1">
                      {getBlocksForDate(day).slice(0, 1).map((block) => (
                        <div
                          key={block.id}
                          className="text-xs p-1 bg-red-100 text-red-800 rounded truncate"
                          title={block.reason || 'Blocked time'}
                        >
                          {block.type === 'block' ? '🚫' : '✅'} {block.reason || 'Blocked'}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Calendar Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">This Month</p>
                <p className="text-xl font-semibold">
                  {appointments.filter(apt => {
                    const aptDate = parseISO(apt.date);
                    return aptDate >= monthStart && aptDate <= monthEnd;
                  }).length} Appointments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Pending</p>
                <p className="text-xl font-semibold">
                  {appointments.filter(apt => apt.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Confirmed</p>
                <p className="text-xl font-semibold">
                  {appointments.filter(apt => apt.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Total Types</p>
                <p className="text-xl font-semibold">
                  {appointmentTypes.filter(type => type.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;