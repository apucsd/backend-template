import { PrivacyPolicy } from './pp.model';
const createPrivacyPolicyToDB = async (payload: { content: string }) => {
      const result = await PrivacyPolicy.findOneAndUpdate({}, { content: payload.content }, { new: true, upsert: true });

      return result;
};

const getPrivacyPolicyFromDB = async () => {
      const result = await PrivacyPolicy.find({});
      return result[0];
};

export const PrivacyPolicyService = {
      createPrivacyPolicyToDB,
      getPrivacyPolicyFromDB,
};
