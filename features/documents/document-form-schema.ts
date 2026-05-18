import { z } from "zod";

export const documentLineFormSchema = z.object({
  description: z.string().min(2),
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().min(0),
  vatRate: z.coerce.number().min(0),
});

export const documentFormSchema = z.object({
  type: z.enum(["quote", "invoice"]),
  number: z.string().min(3),
  clientId: z.string().min(1),
  projectId: z.string().min(1),
  issueDate: z.string().min(10),
  dueDate: z.string().optional(),
  lines: z.array(documentLineFormSchema).min(1),
});

export type DocumentLineFormValues = z.infer<typeof documentLineFormSchema>;
export type DocumentFormValues = z.infer<typeof documentFormSchema>;
