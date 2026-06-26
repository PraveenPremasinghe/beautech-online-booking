import type { AppointmentRequest, AppointmentTreatment, CustomerDto } from "@/types/api";
import type { Branch, ClientDetails, Professional, Service } from "@/types/booking";

export interface TransformAppointmentInput {
  branch: Branch;
  services: Service[];
  professional: Professional;
  date: string;
  startTime: string;
  customerId: number;
  customer?: CustomerDto;
}

function normalizeStartTime(selectedTime: string): string {
  if (!selectedTime) return "";
  if (selectedTime.includes(":")) {
    const [hours, minutes] = selectedTime.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  }
  return "";
}

export function transformAppointmentData(
  input: TransformAppointmentInput,
): AppointmentRequest {
  const { branch, services, professional, date, startTime, customerId, customer } =
    input;

  let totalAmount = 0;
  const normalizedStart = normalizeStartTime(startTime);

  const treatments: AppointmentTreatment[] = services.map((service) => {
    totalAmount += service.price;

    return {
      id: Number(service.id),
      name: service.name,
      price: service.price,
      category: {
        id: Number(service.categoryId),
        name: "Uncategorized",
      },
      color: "#000000",
      duration: service.durationMinutes,
      combo: false,
      categoryId: Number(service.categoryId),
      comboTreatmentMappings: null,
      employeeId: Number(professional.id),
      startTime: normalizedStart,
    };
  });

  return {
    twoServesSameTime: false,
    walkInCustomer: false,
    waiting: false,
    isRequestedEmployee: false,
    doubleStation: false,
    amount: totalAmount,
    tax: 0,
    discount: 0,
    status: "PENDING",
    treatments,
    otherComboAppointments: [],
    branchId: Number(branch.id),
    date,
    employeeId: Number(professional.id),
    customerId,
    customer,
  };
}

export function clientDetailsToCustomerDto(
  details: ClientDetails,
  customerId: number,
): CustomerDto {
  return {
    id: customerId,
    email: details.email || null,
    mobile: details.phone || null,
    name: `${details.firstName} ${details.lastName}`.trim() || null,
  };
}
