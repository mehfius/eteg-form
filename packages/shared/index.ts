import { z } from "zod";

function validateCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  
  let split = cpf.split('').map(Number);
  let d1 = 0;
  for (let i = 0; i < 9; i++) d1 += split[i] * (10 - i);
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;
  
  let d2 = 0;
  for (let i = 0; i < 10; i++) d2 += split[i] * (11 - i);
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;
  
  return d1 === split[9] && d2 === split[10];
}

export const clientSchema = z.object({
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  cpf: z.string()
    .regex(/^\d{11}$/, "CPF deve conter 11 dígitos numéricos")
    .refine(validateCPF, "CPF inválido"),
  email: z.string().email("E-mail inválido"),
  colorId: z.string().uuid("Selecione uma cor"),
  observations: z.string().optional(),
});

export type ClientInput = z.infer<typeof clientSchema>;

export type ColorOutput = {
  id: string;
  name: string;
  hexCode: string;
};
