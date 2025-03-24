import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CategoryService } from './category.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createCategoryToDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let image;
    if (req.files && 'image' in req.files && req.files.image[0]) {
      image = `/images/${req.files.image[0].filename}`;
    }

    const categoryData = JSON.parse(req.body.data);
    const data = {
      image,
      ...categoryData,
    };
    console.log(data);
    const category = await CategoryService.createCategoryToDB(data);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Category created successfully',
      data: category,
    });
  }
);
const getSingleCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await CategoryService.getSingleCategory(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Category retrieved successfully',
      data: category,
    });
  }
);
const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await CategoryService.getAllCategories(req.query);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Categories retrieved successfully',
      data: categories.result,
      pagination: categories.meta,
    });
  }
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let image;
    if (req.files && 'image' in req.files && req.files.image[0]) {
      image = `/images/${req.files.image[0].filename}`;
    }

    const categoryData = JSON.parse(req.body.data);
    const data = {
      image,
      ...categoryData,
    };
    console.log(data);
    const result = await CategoryService.updateCategory(id, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Category updated successfully',
      data: result,
    });
  }
);
const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await CategoryService.deleteCategory(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Category deleted successfully',
      data: category,
    });
  }
);

export const CategoryController = {
  createCategoryToDB,
  getSingleCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
