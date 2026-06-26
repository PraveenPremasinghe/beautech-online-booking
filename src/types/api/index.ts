export interface ApiBranch {
  id: number;
  name: string;
  imageUrl?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  description?: string | null;
  isActive?: boolean;
}

export interface ApiCategory {
  id: number;
  name: string;
  description?: string | null;
  sortOrder?: number;
}

export interface ApiTreatment {
  id: number;
  name: string;
  price: number;
  duration: number;
  categoryId: number;
  category?: { id: number; name: string } | null;
  color?: string | null;
  combo?: boolean;
  imageUrl?: string | null;
  description?: string | null;
}

export interface ApiEmployee {
  id: number;
  name: string;
  gender?: string | null;
  branchId?: number | null;
  mobile?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  town?: string | null;
  note?: string | null;
}

export interface ApiTimeSlot {
  id?: number | string;
  startTime: string;
  endTime: string;
  price?: number;
}

export interface CustomerDto {
  id: number | null;
  email: string | null;
  mobile: string | null;
  name?: string | null;
  code?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  [key: string]: unknown;
}

export interface AppointmentTreatment {
  id: number;
  name: string;
  price: number;
  category: { id: number; name: string };
  color?: string;
  duration: number;
  combo: boolean;
  categoryId: number;
  comboTreatmentMappings?: unknown;
  employeeId: number;
  startTime: string;
}

export interface AppointmentRequest {
  twoServesSameTime: boolean;
  walkInCustomer: boolean;
  waiting: boolean;
  isRequestedEmployee: boolean;
  doubleStation: boolean;
  amount: number;
  tax: number;
  discount: number;
  status: string;
  treatments: AppointmentTreatment[];
  otherComboAppointments: unknown[];
  branchId: number;
  date: string;
  employeeId: string | number;
  customerId: number;
  customer?: CustomerDto;
}

export interface CreateAppointmentResponse {
  id?: number | string;
  data?: { id?: number | string };
}

export interface AppointmentsListRequest {
  page: number;
  perPage: number;
  filter: { customerId: number };
}

export interface ApiOnlineAppointment {
  id: number | string;
  status?: string;
  amount?: number;
  total?: number;
  startTime?: string;
  endTime?: string;
  date?: string;
  treatments?: Array<{
    id: number;
    name: string;
    price?: number;
    duration?: number;
    startTime?: string;
    endTime?: string;
  }>;
  customer?: CustomerDto;
  treatment?: unknown;
  branch?: { id?: number; name?: string };
  [key: string]: unknown;
}

export interface BookingAuthStateResponse {
  state: string;
}
