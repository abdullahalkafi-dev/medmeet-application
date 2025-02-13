import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { Medicine } from './medicine.model';
import { QueryBuilder } from '../../builder/QueryBuilder';

const createMedicine = async (payload:  {name:string}) => {
  const isExistMedicine = await Medicine.findOne({
    name: payload.name,
  });
  if (isExistMedicine) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Medicine already exist!');
  }
  const result = await Medicine.create(payload);
  return result;
};

const getAllMedicines = async (query:Record<string,unknown>) => {
 const medicineQuery = new QueryBuilder(Medicine.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();
    const meta = await medicineQuery.countTotal();
    const result = await medicineQuery.modelQuery;
  return { result, meta };
};

const updateMedicine = async (id: string, payload: {name:string}) => {
  const medicine = await Medicine.findById(id);
  if (!medicine) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Medicine not found!');
  }
  const alreadyExistMedicine = await Medicine.findOne({
    name: payload.name,
    _id: { $ne: id },
  });
  if (alreadyExistMedicine) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Medicine already exist!');
  }
  const updatedMedicine = await Medicine.findByIdAndUpdate(
    id,
    { name: payload },
    {
      new: true,
    }
  );
  return updatedMedicine;
};

const deleteMedicine = async (id: string) => {
  const medicine = await Medicine.findById(id);
  if (!medicine) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Medicine not found!');
  }
  await Medicine.findByIdAndDelete(id);
  return medicine;
};
export const MedicineService = {
  createMedicine,
  getAllMedicines,
  deleteMedicine,
  updateMedicine
};
