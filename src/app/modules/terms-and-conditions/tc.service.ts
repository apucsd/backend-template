import { TC } from './tc.interface';
import { TermsAndConditions } from './tc.model';

const createTermsAndConditionsToDB = async (payload: TC) => {
      console.log(payload);
      const result = await TermsAndConditions.findOneAndReplace(
            {},
            { content: payload.content },
            {
                  new: true,
                  upsert: true,
            }
      );

      return result;
};

const getTermsAndConditionsFromDB = async () => {
      const result = await TermsAndConditions.find();
      return result[0];
};

export const TermsAndConditionsService = {
      createTermsAndConditionsToDB,
      getTermsAndConditionsFromDB,
};
