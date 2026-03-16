import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { GetCustomersFilterDto } from './dto/get-customers-filter.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const existing = await this.customerRepository.findOne({
      where: {
        phone: createCustomerDto.phone,
      },
    });

    if (existing) {
      throw new ConflictException('Customer already exists');
    }

    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async findAll(filterDto: GetCustomersFilterDto) {
    const {
      search,
      is_business,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = filterDto;

    const query = this.customerRepository.createQueryBuilder('customer');

    if (search) {
      query.andWhere(
        '(LOWER(customer.name) LIKE LOWER(:search) OR customer.phone LIKE :search OR LOWER(customer.email) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    // 2. Filter (Type of Customer)
    if (is_business !== undefined) {
      query.andWhere('customer.is_business = :isBusiness', {
        isBusiness: is_business === 'true',
      });
    }

    // 3. Sorting
    if (sortBy && sortOrder) {
      query.orderBy(`customer.${sortBy}`, sortOrder);
    }

    // 4. Pagination
    query.skip((page - 1) * limit).take(limit);

    // 5. Execution
    const [data, total] = await query.getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findOne({
      where: {
        id,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findOne(id);
    const updatedCustomer = await this.customerRepository.preload({
      id: customer.id,
      ...updateCustomerDto,
    });

    if (!updatedCustomer) {
      throw new NotFoundException(`Customer ${id} not found during update`);
    }

    return this.customerRepository.save(updatedCustomer);
  }

  async remove(id: string) {
    const customer = await this.findOne(id);
    return this.customerRepository.remove(customer);
  }
}
