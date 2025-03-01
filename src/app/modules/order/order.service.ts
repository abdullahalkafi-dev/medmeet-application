import { TOrder } from './order.interface';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { OrderModel } from './order.model';

const createOrderToDB = async (payload: Partial<TOrder>) => {
  const result = await OrderModel.create(payload);
  return result;
};

const getSingleOrder = async (id: string) => {
  const order = await OrderModel.findById(id).populate('appointmentId');
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found!');
  }
  return order;
};

const getAllOrders = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(
    OrderModel.find().populate('appointmentId'),
    query
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();
  return { result, meta };
};

const updateOrder = async (id: string, payload: Partial<TOrder>) => {
  const order = await OrderModel.findById(id);

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found!');
  }

  const updatedOrder = await OrderModel.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return updatedOrder;
};

export const OrderService = {
  createOrderToDB,
  getSingleOrder,
  updateOrder,
  getAllOrders,
};
