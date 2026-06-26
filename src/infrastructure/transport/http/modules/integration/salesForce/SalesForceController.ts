import type { RequestHandler } from "express";
import type { TGetUserParamsDto } from "#/application/user/dtos/UserDto.js";
import HttpStatusCode from "../../../constants/httpStatusCode.js";
import ForbiddenError from "#/domain/errors/ForbiddenError.js";
import { inject, injectable } from "tsyringe";
import GetLocation from "#/application/integrations/SalesForce/use-cases/GetLocation.js";
import AddAdditionalInfo from "#/application/integrations/SalesForce/use-cases/AddAdditionalInfo.js";
import type {
  IAddInfoCompositeResponse,
  IAdditionalData,
  IGetInfoResponse,
  ILocations,
} from "#/application/integrations/SalesForce/dtos/SalesForceDto.js";
import GetAdditionalInfo from "#/application/integrations/SalesForce/use-cases/GetAdditionalInfo.js";

@injectable()
export default class SalesForceController {
  constructor(
    @inject(GetLocation)
    private readonly getLocationFromSalesForce: GetLocation,
    @inject(GetAdditionalInfo)
    private readonly getAdditionalInfoFromSalesForce: GetAdditionalInfo,
    @inject(AddAdditionalInfo)
    private readonly addAdditionalInfoFromSalesForce: AddAdditionalInfo,
  ) {}

  getLocation: RequestHandler<never, ILocations> = async (_, res) => {
    const location = await this.getLocationFromSalesForce.execute();
    res.status(HttpStatusCode.Ok).json(location);
  };

  getAdditionalInfo: RequestHandler<TGetUserParamsDto, IGetInfoResponse> =
    async (req, res) => {
      const userId = req.params.userId;
      const additionalInfo =
        await this.getAdditionalInfoFromSalesForce.execute(userId);
      res.status(HttpStatusCode.Ok).json(additionalInfo);
    };

  addAdditionalInfo: RequestHandler<
    TGetUserParamsDto,
    IAddInfoCompositeResponse,
    IAdditionalData
  > = async (req, res) => {
    const userId = req.params.userId;
    const additionalData = req.body;
    const currentUser = req.user;
    if (
      currentUser?.id !== userId //&&
      //!Passport.checkUserRoles(currentUser, ["Admin"])
    )
      throw new ForbiddenError("Insufficient permissions");
    const result = await this.addAdditionalInfoFromSalesForce.execute(
      userId,
      additionalData,
    );
    res.status(HttpStatusCode.Ok).json(result);
  };
}
