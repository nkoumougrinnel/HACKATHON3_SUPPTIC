import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

interface LoginForm {
  phone: string;
  pin: string;
}

export const LoginScreen = () => {
  const navigate = useNavigate();
  const validatePin = useUserStore((s) => s.validatePin);
  const { register, handleSubmit, setError, formState } = useForm<LoginForm>();

  const onSubmit = (v: LoginForm) => {
    if (!validatePin(v.phone, v.pin)) {
      setError("pin", { message: "Identifiants invalides" });
      return;
    }
    navigate("/map");
  };

  return (
    <main className="screen bg-white px-4 pb-8 pt-10">
      <h1 className="text-[22px] font-medium">Connexion</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm text-slate-700">Telephone</span>
          <input {...register("phone")} className="input-field" placeholder="+2376XXXXXXXX" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-slate-700">PIN</span>
          <input {...register("pin")} className="input-field text-center text-[20px] tracking-[0.5em]" type="password" maxLength={4} />
          <span className="mt-1 block min-h-3 text-[11px] text-songo-danger">{formState.errors.pin?.message}</span>
        </label>
        <button className="btn-primary bg-songo-danger text-white">Se connecter</button>
      </form>
      <Link to="/register" className="mt-4 block text-center text-sm text-slate-600">
        S'inscrire
      </Link>
    </main>
  );
};
