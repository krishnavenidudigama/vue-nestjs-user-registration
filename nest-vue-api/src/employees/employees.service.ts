import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Employee } from './employee.entity';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
    ) { }

    // Save a new employee in PostgreSQL
    async create(employeeData: Partial<Employee>): Promise<Employee> {
        const employee =
            this.employeeRepository.create(employeeData);

        return await this.employeeRepository.save(employee);
    }

    // Get all employees from PostgreSQL
    async findAll(): Promise<Employee[]> {
        return await this.employeeRepository.find({
            order: { id: 'DESC' },
        });
    }
}