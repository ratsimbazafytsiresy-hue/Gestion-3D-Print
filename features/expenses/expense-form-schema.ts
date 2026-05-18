import { z } from "zod";

export const expenseFormSchema = z.object({
  projectId: z.string().min(1),
  category: z.enum(["matieres", "sous_traitance", "transport", "main_oeuvre", "autres"]),
  date: z.string().min(10),
  amount: z.number().positive(),
  note: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
