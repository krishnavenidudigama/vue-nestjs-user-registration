import {
  Controller,
  Post,
  Get,
  Body,
} from '@nestjs/common';

import { EmployeesService } from './employees.service';
import { Employee } from './employee.entity';

@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
  ) {}

  // POST /employees
  // Receives employee data and asks the service to save it.
  @Post()
  create(@Body() employeeData: Partial<Employee>) {
    return this.employeesService.create(employeeData);
  }

  // GET /employees
  // Retrieves all employees.
  @Get()
  findAll() {
    return this.employeesService.findAll();
  }
}