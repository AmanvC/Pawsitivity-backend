import { Document, model, Schema } from "mongoose";

interface IVaccinationDetail extends Document {
  vaccinationName: string;
  veterinaryName?: string;
  vaccinationDate?: Date;
}

const VaccinationDetailSchema = new Schema<IVaccinationDetail>({
  vaccinationName: { type: String, required: true },
  veterinaryName: { type: String },
  vaccinationDate: { type: Date }
});

const Vaccination = model<IVaccinationDetail>("Vaccination", VaccinationDetailSchema);

export default Vaccination;