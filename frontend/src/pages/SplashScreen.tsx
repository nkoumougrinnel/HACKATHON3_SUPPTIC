import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { StatusBar } from "../components/layout/StatusBar";
import { useUserStore } from "../store/userStore";

export const SplashScreen = () => {
  const navigate = useNavigate();
  const token = useUserStore((s) => s.token);

  useEffect(() => {
    if (token) navigate("/map");
  }, [navigate, token]);

  return (
    <main className="screen flex flex-col bg-songo-mapDark text-white">
      <StatusBar dark />
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[18px] bg-songo-danger">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <path d="M17 3 L20 13 H30 L22 19.5 L25 29 L17 23 L9 29 L12 19.5 L4 13 H14 Z" fill="white" />
          </svg>
        </div>
        <h1 className="text-[30px] font-medium">Songo</h1>
        <p className="mt-2 text-center text-sm text-[#6c7a8f]">Navigation d'urgence intelligente pour secouristes</p>
      </div>
      <div className="px-4 pb-8">
        <button onClick={() => navigate("/type")} className="btn-primary bg-songo-danger text-white">
          Commencer
        </button>
        <Link to="/login" className="mt-4 block text-center text-sm text-slate-300">
          Deja un compte ?
        </Link>
      </div>
    </main>
  );
};
