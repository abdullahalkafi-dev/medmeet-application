import { StatusCodes } from "http-status-codes";
import { JwtPayload, Secret } from "jsonwebtoken";
import { TDoctor } from "./doctor.interface";
import { Doctor } from "./doctor.model";
import unlinkFile from "../../../shared/unlinkFile";
import AppError from "../../errors/AppError";
import { jwtHelper } from "../../../helpers/jwtHelper";
import config from "../../../config";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { Appointment } from "../appointment/appointment.model";

const createDoctorToDB = async (payload: Partial<TDoctor>) => {
  if (!payload.fcmToken) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Please provide fcm token");
  }
  // Validate required fields
  const isExist = await Doctor.findOne({
    $or: [{ email: payload.email }, { doctorId: payload.doctorId }],
  });
  if (isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Doctor already exist");
  }
  // Create doctor first
  const doctor = await Doctor.create(payload);

  return doctor;
};

const loginDoctor = async (
  payload: Partial<TDoctor> & { uniqueId: string },
) => {
  const { uniqueId, password } = payload;
  console.log(payload);
  if (!payload.fcmToken) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Please provide fcm token");
  }
  let doctor = await Doctor.findOne({
    $or: [{ email: uniqueId }, { doctorId: uniqueId }],
  }).select("+password");
  if (!doctor) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Doctor not found");
  }

  const isMatch = await Doctor.isMatchPassword(password!, doctor.password);
  if (!isMatch) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid credentials");
  }
  const accessToken = jwtHelper.createToken(
    {
      id: doctor._id,
      role: doctor.role,
      email: doctor.email,
      approvedStatus: doctor.approvedStatus,
    },
    config.jwt.jwt_secret as Secret,
    "10000d",
  );
  //create token
  const refreshToken = jwtHelper.createToken(
    { id: doctor._id, role: doctor.role, email: doctor.email },
    config.jwt.jwt_refresh_secret as Secret,
    "150000d",
  );

  if (payload.fcmToken) {
    doctor = await Doctor.findOneAndUpdate(
      { email: uniqueId },
      { fcmToken: payload.fcmToken },
    );
  }
  if (!doctor) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Doctor not found");
  }
  const { password: _, ...userWithoutPassword } = doctor.toObject();
  return { accessToken, refreshToken, user: userWithoutPassword };
};
const getDoctorProfileFromDB = async (doctor: JwtPayload) => {
  const { id } = doctor;
  const isExistDoctor = await Doctor.findById(id).populate("specialist").lean();
  if (!isExistDoctor) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Doctor doesn't exist!");
  }

  const appointments = await Appointment.find({ doctor: id })
    .populate({
      path: "user",
      select: "name country image",
    })
    .select("review")
    .lean();
  console.log(appointments);

  const appointmentWithReviews = appointments.filter(
    (review: any) => review.review,
  );

  const result = {
    ...isExistDoctor,

    reviews: appointmentWithReviews?.map((review: any) => ({
      rating: review.review.rating,
      review: review.review.review,
      createdAt: review.review.createdAt,
      _id: review._id,
      name: review.user.name,
      country: review.user.country,
      image: review.user.image,
    })),
  };

  return result;
};

const updateDoctorProfileToDB = async (
  doctorId: JwtPayload,
  payload: Partial<TDoctor>,
): Promise<Partial<TDoctor | null>> => {
  console.log(payload);
  console.log(doctorId);
  const { id } = doctorId;

  const isExistDoctor = await Doctor.isExistDoctorById(id);
  if (!isExistDoctor) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Doctor doesn't exist!");
  }

  if (
    payload.image &&
    isExistDoctor.image &&
    !isExistDoctor.image.includes("default_profile.jpg") &&
    !payload.image.includes(isExistDoctor.image)
  ) {
    unlinkFile(isExistDoctor.image);
  }
  if (payload.professionalIdFront && isExistDoctor.professionalIdFront) {
    unlinkFile(isExistDoctor.professionalIdFront);
  }
  if (payload.professionalIdBack && isExistDoctor.professionalIdBack) {
    unlinkFile(isExistDoctor.professionalIdBack);
  }
  if (payload.medicalLicense && isExistDoctor.medicalLicense) {
    unlinkFile(isExistDoctor.medicalLicense);
  }
  if (payload.dob) {
    const [day, month, year] = (payload.dob as any).split("-");
    payload.dob = new Date(`${year}-${month}-${day}`);
    console.log(payload.dob);
  }
  const updateDoc = await Doctor.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    upsert: true,
  });
  if (
    !updateDoc.isAllFieldsFilled &&
    updateDoc &&
    !!(
      updateDoc.specialist &&
      updateDoc.experience &&
      updateDoc.clinic &&
      updateDoc.clinicAddress &&
      updateDoc.consultationFee &&
      updateDoc.aboutDoctor &&
      updateDoc.professionalIdFront &&
      updateDoc.professionalIdBack &&
      updateDoc.medicalLicense
    )
  ) {
    return await Doctor.findOneAndUpdate(
      { _id: id },
      { isAllFieldsFilled: true },
      { new: true },
    );
  }

  return updateDoc;
};
const getSingleDoctor = async (id: string) => {
  const doctor = await Doctor.findById(id).populate("specialist").lean();

  const appointments = await Appointment.find({ doctor: id })
    .populate({
      path: "user",
      select: "name country image",
    })
    .select("review")
    .lean();
  const TotalPatientsCount =
    new Set(appointments.map((review: any) => review.user._id)).size || 0;

  const withReviewsAppointment = appointments.filter(
    (appointment: any) => appointment.review,
  );

  const reviews = withReviewsAppointment.map((review: any) => ({
    rating: review?.review?.rating,
    review: review?.review?.review,
    createdAt: review?.review?.createdAt,
    _id: review._id,
    name: review.user.name,
    country: review.user.country,
    image: review.user.image,
  }));

  function getRatingPercentages(reviews: any) {
    const ratingCounts: { [key: number]: number } = {};
    reviews.forEach((review: any) => {
      if (ratingCounts[review.rating]) {
        ratingCounts[review.rating] += 1;
      } else {
        ratingCounts[review.rating] = 1;
      }
    });

    // Step 2: Include all ratings from 1 to 5, ensuring missing ones are set to 0
    const totalReviews = reviews.length;
    const ratingPercentages = [];

    // Loop through ratings 1 to 5 and calculate the percentage
    for (let i = 1; i <= 5; i++) {
      const count = ratingCounts[i] || 0; // Default to 0 if not found
      const percentage = totalReviews ? (count / totalReviews) * 100 : 0;
      ratingPercentages.push({
        rating: i,
        percentage: parseFloat(percentage.toFixed(2)),
      });
    }

    return ratingPercentages;
  }

  // Generate the rating percentages
  const ratingPercentage = getRatingPercentages(reviews);

  const result = {
    ...doctor,
    TotalPatientsCount,
    reviews,
    ratingPercentage,
  };
  return result;
};
//get all doctors
const getAllDoctors = async (query: any, req: any) => {
  const user = req.user;

  let dirQuery = {};
  if (user.role === "DOCTOR") {
    dirQuery = { _id: { $ne: req.user.id } };
  }

  const doctorQuery = new QueryBuilder(
    Doctor.find({
      status: "active",
      ...dirQuery,
      verified: true,
      isAllFieldsFilled: true,
    }).populate("specialist"),
    query,
  )
    .search(["name", "country", "clinic"])
    .filter()
    .sort()
    .paginate()
    .fields();

  let result = await doctorQuery.modelQuery;
  const meta = await doctorQuery.countTotal();

  return { result, meta };
};
const updateDoctorApprovedStatus = async (
  id: string,
  payload: { status: string },
) => {
  const doctor = await Doctor.findById(id);
  const status = ["pending", "approved", "rejected"];
  if (!status.includes(payload.status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid status");
  }
  if (!doctor) {
    throw new AppError(StatusCodes.NOT_FOUND, "Doctor not found!");
  }
  const updatedDoctor = await Doctor.findByIdAndUpdate(
    id,
    { approvedStatus: payload.status },
    { new: true },
  );
  return updatedDoctor;
};
const deleteDoctor = async (id: string) => {
  const result = await Doctor.findByIdAndUpdate(
    id,
    { status: "delete" },
    { new: true },
  );
  return result;
};
export const DoctorService = {
  getDoctorProfileFromDB,
  updateDoctorProfileToDB,
  getSingleDoctor,
  createDoctorToDB,
  getAllDoctors,
  loginDoctor,
  updateDoctorApprovedStatus,
  deleteDoctor,
};
