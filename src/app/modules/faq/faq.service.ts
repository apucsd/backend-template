import { TFaq } from './faq.interface';
import { Faq } from './faq.model';

const createFaqToDB = async (payload: TFaq) => {
    const result = await Faq.create(payload);

    return result;
};
const getFaqFromDB = async () => {
    const result = await Faq.find();
    return result;
};
const updateFaqToDB = async (id: string, payload: TFaq) => {
    const result = await Faq.findByIdAndUpdate(id, payload, { new: true });
    return result;
};
const deleteFaqToDB = async (id: string) => {
    const result = await Faq.findByIdAndDelete(id);
    return result;
};

export const FaqServices = {
    createFaqToDB,
    getFaqFromDB,
    updateFaqToDB,
    deleteFaqToDB,
};
