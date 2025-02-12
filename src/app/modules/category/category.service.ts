import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { Category } from './category.model';
import { TCategory } from './category.interface';
import { QueryBuilder } from '../../builder/QueryBuilder';

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
  const category = await Category.findByIdAndUpdate(id, payload, { new: true });
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found!');
  }
  return category;
};

// need-work
// const deleteCategory = async (id: string) => {
//     const category = await Category.findByIdAndDelete(id);
//     if (!category) {
//         throw new AppError(StatusCodes.NOT_FOUND, "Category not found!");
//     }
//     return category;
// };

export const CategoryService = {
  createCategoryToDB,
  getSingleCategory,
  updateCategory,
  getAllCategories
  // deleteCategory
};
