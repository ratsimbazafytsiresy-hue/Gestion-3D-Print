import { z } from "zod";

import { MATERIALS } from "@/lib/domain/constants";
import type { Material } from "@/lib/domain/types";

const materialValues = MATERIALS as [Material, ...Material[]];

export const projectFormSchema = z
  .object({
    clientId: z.string().min(1),
    title: z.string().min(2),
    description: z.string().optional(),
    startDate: z.string().min(10),
    deliveryDate: z.string().min(10),
    estimatedAmount: z.number().min(0),
    material: z.enum(materialValues),
    estimatedPrintTimeMinutes: z.number().int().min(0),
    materialWeightGrams: z.number().int().min(0),
    modelFileName: z.string().optional(),
  })
  .refine((project) => project.deliveryDate >= project.startDate, {
    message: "La date de livraison doit etre posterieure ou egale a la date de debut.",
    path: ["deliveryDate"],
  });

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
