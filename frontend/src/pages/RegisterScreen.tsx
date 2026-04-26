import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { TypeBadge } from "../components/ui/TypeBadge";
import { useUserStore } from "../store/userStore";
import { getTypeTheme } from "../lib/utils";
import type { UserProfile } from "../types";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  matricule: z.string().min(2, "Matricule requis"),
  phone: z.string().regex(/^\+2376\d{8}$/, "Format camerounais requis"),
  vehicle: z.string().min(2, "Immatriculation requise"),
  pin: z.string().regex(/^\d{4}$/, "PIN a 4 chiffres"),
});

type FormValues = z.infer<typeof schema>;

export const RegisterScreen = () => {
  const navigate = useNavigate();
  const userType = useUserStore((s) => s.userType) ?? "ambulance";
  const saveProfile = useUserStore((s) => s.saveProfile);
  const theme = getTypeTheme(userType);
  const { register, handleSubmit, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    const profile: UserProfile = { type: userType, ...values };
    saveProfile(profile);
    navigate("/map");
  };

  return (
    <main className="screen bg-white px-4 pb-8 pt-6">
      <TypeBadge type={userType} />
      <h1 className="mt-4 text-[22px] font-medium text-slate-900">Creer un compte</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
        {[
          { key: "name", label: "Nom complet", placeholder: "Jean Mvondo" },
          { key: "matricule", label: "Matricule", placeholder: "CM-2026-001" },
          { key: "phone", label: "Telephone", placeholder: "+2376XXXXXXXX" },
          { key: "vehicle", label: "Immatriculation vehicule", placeholder: "LT-123-AB" },
        ].map((field) => (
          <label key={field.key} className="block">
            <span className="mb-1 block text-sm text-slate-700">{field.label}</span>
            <input {...register(field.key as keyof FormValues)} className="input-field" placeholder={field.placeholder} />
            <span className="mt-1 block min-h-3 text-[11px] text-songo-danger">{formState.errors[field.key as keyof FormValues]?.message}</span>
          </label>
        ))}
        <label className="block">
          <span className="mb-1 block text-sm text-slate-700">Code PIN</span>
          <input {...register("pin")} className="input-field text-center text-[20px] tracking-[0.5em]" inputMode="numeric" maxLength={4} type="password" />
          <span className="mt-1 block min-h-3 text-[11px] text-songo-danger">{formState.errors.pin?.message}</span>
        </label>
        <button className="btn-primary mt-5 text-white" style={{ background: theme.color }}>
          Enregistrer
        </button>
      </form>
    </main>
  );
};
