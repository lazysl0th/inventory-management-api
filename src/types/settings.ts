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
  selects: {
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
