import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useSearchParams } from "react-router-dom";
import { TypewriterEffect } from "@/components/TypewriterEffect";

type AuthMode = "login" | "register" | "forgot-password" | "reset-password";

const Login = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(() => {
    return searchParams.get("type") === "recovery" ? "reset-password" : "login";
  });

  const phrases = [
    "Organize suas finanças com inteligência.",
    "Tenha total previsibilidade financeira.",
    "Seu assistente financeiro pessoal.",
    "Tome decisões baseadas em dados."
  ];

  const renderAuthForm = () => {
    switch (mode) {
      case "login":
        return (
          <LoginForm
            onSwitchToRegister={() => setMode("register")}
            onSwitchToForgot={() => setMode("forgot-password")}
          />
        );
      case "register":
        return <RegisterForm onSwitchToLogin={() => setMode("login")} />;
      case "forgot-password":
        return <ForgotPasswordForm onSwitchToLogin={() => setMode("login")} />;
      case "reset-password":
        return <ResetPasswordForm onSwitchToLogin={() => setMode("login")} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Lado Esquerdo - Visual e Animação */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-mordomo-600 to-mordomo-800 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute top-8 left-8">
          <img
            src="/acert-ai-logo-collapsed.png"
            alt="Logo"
            className="h-10 w-auto opacity-80 brightness-0 invert"
          />
        </div>

        <div className="max-w-xl z-10">
          <TypewriterEffect phrases={phrases} />
          <p className="mt-8 text-lg text-mordomo-100 opacity-90">
            Transforme a gestão do seu dinheiro com a plataforma mais completa do mercado.
          </p>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            {/* Logo visível apenas no mobile ou quando não há sidebar lateral para contexto */}
            <div className="lg:hidden flex justify-center mb-6">
              <img
                src="/acert-ai-logo.png"
                alt="AcertAI"
                className="h-12 w-auto object-contain"
              />
            </div>
            {/* Logo tbm visível no desktop acima do form para manter identidade da marca na área de login */}
            <div className="hidden lg:flex justify-center mb-6">
              <img
                src="/acert-ai-logo.png"
                alt="AcertAI"
                className="h-12 w-auto object-contain"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "login" && "Bem-vindo de volta"}
              {mode === "register" && "Crie sua conta"}
              {mode === "forgot-password" && "Recuperar senha"}
              {mode === "reset-password" && "Redefinir senha"}
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              {mode === "login" && "Acesse sua conta para continuar"}
              {mode === "register" && "Preencha os dados abaixo para começar"}
              {mode === "forgot-password" && "Enviaremos um link para seu e-mail"}
              {mode === "reset-password" && "Digite sua nova senha"}
            </p>
          </div>

          <div className="mt-6">
            {renderAuthForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
