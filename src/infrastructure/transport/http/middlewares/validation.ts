import type { RequestHandler } from "express";
import type z from "zod";

const validate =
  (schema: z.ZodObject): RequestHandler =>
  async (req, _, next): Promise<void> => {
    const request = await schema.parseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
      cookies: req.cookies,
    });
    if (request.body !== undefined) Object.assign(req.body, request.body);
    if (request.params !== undefined) Object.assign(req.params, request.params);
    if (request.query !== undefined)
      Object.defineProperty(req, "query", {
        value: request.query,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    if (request.cookies !== undefined)
      Object.assign(req.cookies, request.cookies);
    next();
  };

export default validate;
