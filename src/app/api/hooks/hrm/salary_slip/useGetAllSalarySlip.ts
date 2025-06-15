import { useQuery } from '@tanstack/react-query';

import {
  useGetAllEmployeeBlue,
  useGetAllEmployeeWhite,
} from '@/app/api/hooks/hrm/employee/useGetAllEmployee';
import AxiosService from '@/services/axiosService';

interface SalarySlip {
  employee_id: number;
  pkid: number;
  month: string;
  year: number;
  status: string;
  gaji_take_home: number;
  benefit_bpjs_kesehatan: number;
  benefit_bpjs_tk_jht: number;
  benefit_bpjs_tk_jkk: number;
  benefit_bpjs_tk_jkm: number;
  benefit_bpjs_tk_jp: number;
  tunjangan_pph: number;
}

interface Employee {
  pkid: number;
  fullname: string;
}

type Item = SalarySlip & {
  fullname: string;
};

const fetchAllSalarySlipsWhite = async () => {
  const { data } = await AxiosService.AxiosServiceHRM.get(`salary_slip/white`); // Adjust endpoint if necessary
  return data.data;
};

const fetchAllSalarySlipsBlue = async () => {
  const { data } = await AxiosService.AxiosServiceHRM.get(`salary_slip/blue`); // Adjust endpoint if necessary
  return data.data;
};

export const useGetAllEmployeeSalarySlipsWhite = () => {
  const {
    data: employees,
    isLoading: isLoadingEmployees,
    error: employeeError,
  } = useGetAllEmployeeWhite();
  const {
    data: salarySlips,
    isLoading: isLoadingSalarySlips,
    error: salarySlipError,
  } = useQuery<SalarySlip[]>({
    queryKey: ['salarySlipsWhite'],
    queryFn: fetchAllSalarySlipsWhite,
  });

  const combinedData: Item[] = [];

  if (employees && Array.isArray(salarySlips)) {
    salarySlips.forEach((salarySlip: SalarySlip) => {
      const employee = employees.data.find(
        (e: Employee) => e.pkid === salarySlip.employee_id,
      );
      if (employee) {
        combinedData.push({
          ...salarySlip,
          fullname: employee.fullname,
        });
      }
    });
  }

  const isLoading = isLoadingEmployees || isLoadingSalarySlips;
  const error = employeeError || salarySlipError;

  return {
    data: combinedData,
    isLoading,
    error,
  };
};

export const useGetAllEmployeeSalarySlipsBlue = () => {
  const {
    data: employees,
    isLoading: isLoadingEmployees,
    error: employeeError,
  } = useGetAllEmployeeBlue();
  const {
    data: salarySlips,
    isLoading: isLoadingSalarySlips,
    error: salarySlipError,
  } = useQuery<SalarySlip[]>({
    queryKey: ['salarySlipsBlue'],
    queryFn: fetchAllSalarySlipsBlue,
  });

  const combinedData: Item[] = [];

  if (employees && Array.isArray(salarySlips)) {
    salarySlips.forEach((salarySlip: SalarySlip) => {
      const employee = employees.data.find(
        (e: Employee) => e.pkid === salarySlip.employee_id,
      );
      if (employee) {
        combinedData.push({
          ...salarySlip,
          fullname: employee.fullname,
        });
      }
    });
  }

  const isLoading = isLoadingEmployees || isLoadingSalarySlips;
  const error = employeeError || salarySlipError;

  return {
    data: combinedData,
    isLoading,
    error,
  };
};
