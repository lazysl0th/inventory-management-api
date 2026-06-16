import type { Prisma } from "@prisma/client";
import type { EnumInventorySortOrder } from "./services/Inventory.js";

export interface Settings {
  response: {
    ok: {
      statusCode: number;
    };
    passwordReset: {
      text: string;
    };
    passwordChange: {
      text: string;
    };
    created: {
      statusCode: number;
    };
    unauthorized: {
      statusCode: number;
      text: string;
    };
    forbidden: {
      statusCode: number;
      text: string;
    };
    insufficientPermission: {
      statusCode: number;
      text: string;
    };
    blocked: {
      statusCode: number;
      text: string;
    };
    notFound: {
      statusCode: number;
      text: string;
    };
    badRequest: {
      statusCode: number;
      text: string;
    };
    conflict: {
      statusCode: number;
      textUser: string;
      textInventory: string;
    };
    logout: {
      text: string;
    };
    internalServerError: {
      statusCode: number;
      text: string;
    };
  };
  crypto: {
    saltRounds: number;
    jwtSecret: string;
  };
  selects: {
    user: {
      id: boolean;
      name: boolean;
      email: boolean;
      googleId: boolean;
      facebookId: boolean;
      status: boolean;
      password: boolean;
      resetPasswordToken: boolean;
      refreshToken: boolean;
      createdAt: boolean;
      roles: {
        select: {
          role: {
            select: {
              id: boolean;
              name: boolean;
            };
          };
        };
      };
    };
    inventory: {
      id: boolean;
      title: boolean;
      description: boolean;
      category: boolean;
      image: boolean;
      ownerId: boolean;
      isPublic: boolean;
      customIdFormat: boolean;
      version: boolean;
      createdAt: boolean;
      updatedAt: boolean;
      token: boolean;
      owner: { select: { id: boolean; name: boolean; email: boolean } };
      //items: boolean;
      tags: boolean;
      fields: boolean;
      allowedUsers: { select: { id: boolean; name: boolean; email: boolean } };
    };
    item: {
      id: boolean;
      inventoryId: boolean;
      customId: boolean;
      ownerId: boolean;
      owner: { select: { id: boolean; name: boolean; email: boolean } };
      version: boolean;
      createdAt: boolean;
      updatedAt: boolean;
      values: { select: { id: boolean; field: boolean; value: boolean } };
    };
    tag: {
      id: boolean;
      name: boolean;
      _count: {
        select: {
          inventories: boolean;
        };
      };
    };
    comment: {
      id: boolean;
      content: boolean;
      userId: boolean;
      user: { select: { id: boolean; name: boolean; email: boolean } };
      inventoryId: boolean;
      createdAt: boolean;
    };
  };
  sortOrder: {
    inventory: Record<
      EnumInventorySortOrder,
      Prisma.InventoryOrderByWithRelationInput
    >;
  };
  url: {
    frontend: string;
    backend: string;
    uri: {
      verifyUser: string;
      resetPasswordUser: string;
      loginUser: string;
      authSuccess: string;
    };
  };
  authSettings: {
    google: {
      clientID: string;
      clientSecret: string;
      callbackURL: string;
    };
    facebook: {
      clientID: string;
      clientSecret: string;
      callbackURL: string;
    };
  };
  integrationSettings: {
    cloudinary: {
      cloudName: string;
      apiKey: string;
      apiSecret: string;
      uploadFolder: string;
    };
    dropbox: {
      grantType: string;
      refreshToken: string;
      clientId: string;
      clientSecret: string;
      redirectUri: string;
      baseUrl: string;
      contentUrl: string;
    };
    salesForce: {
      clientId: string;
      clientSecret: string;
      baseUrl: string;
    };
  };
  emailSetting: {
    clientID: string;
    clientSecret: string;
    redirectURL: string;
    refreshToken: string;
    senderName: string;
    messageTemplate: string;
    messageContentTemplates: {
      verifyUser: {
        subject: string;
        html: string;
        text: string;
      };
      resetPasswordUser: {
        subject: string;
        html: string;
        text: string;
      };
    };
  };
  errorsText: {
    auth: {
      noToken: string;
      tokenExpired: string;
    };
  };
}
