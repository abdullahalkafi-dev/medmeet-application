import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { Category } from './category.model';
import { TCategory } from './category.interface';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { Doctor } from '../doctor/doctor.model';

const createCategoryToDB = async (payload: Partial<TCategory>) => {
  const isExistCategory = await Category.findOne({
    name: payload.name,
  });
  if (isExistCategory) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Category already exist!');
  }
  const result = await Category.create(payload);

  return result;
};

const getSingleCategory = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found!');
  }
  return category;
};
const getAllCategories = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(Category.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await categoryQuery.modelQuery;
  const meta = await categoryQuery.countTotal();
  return { result, meta };
};

const updateCategory = async (id: string, payload: Partial<TCategory>) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found!');
  }
  const alreadyExistCategory = await Category.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (alreadyExistCategory) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Category already exist!');
  }

  const updatedCategory = await Category.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return updatedCategory;
};

const deleteCategory = async (id: string) => {
  const isAnyDoctorHasThisCategory = await Doctor.findOne({
    specialist: id,
  });
  if (isAnyDoctorHasThisCategory) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Category is associated with doctor!'
    );
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found!');
  }
  return category;
};

export const CategoryService = {
  createCategoryToDB,
  getSingleCategory,
  updateCategory,
  getAllCategories,
  deleteCategory
};
