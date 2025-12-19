import { type FieldErrors, type FieldValues, type ResolverError, type ResolverSuccess } from "react-hook-form";
import { z } from "zod";

export const validateResolver =
  <T extends FieldValues>(schema: z.ZodSchema<T>) =>
  (values: T): ResolverSuccess<T> | ResolverError<T> => {
    const result = schema.safeParse(values);

    if (result.success) {
      return {
        values: values,
        errors: {},
      };
    }

    return {
      values: {} as T,
      errors: Object.fromEntries(
        result.error?.issues.map((issue) => {
          const path = issue.path.join(".");
          return [
            path,
            {
              type: "manual" as const,
              message: issue.message || "Invalid value",
            },
          ];
        }),
      ) as FieldErrors<T>,
    } as ResolverError<T>;
  };
