import { IPackage } from './package.interface';
import { Package } from './package.model';

const createPackageIntoDB = async (payload: IPackage) => {
      const createPackage = await Package.create(payload);
      return createPackage;
};

export const PackageService = {
      createPackageIntoDB,
};
