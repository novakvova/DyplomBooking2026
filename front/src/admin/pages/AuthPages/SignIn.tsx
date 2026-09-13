import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

// ПРИМІТКА: цей компонент — частина шаблону TailAdmin і НЕ підключений
// в App.tsx. Реальний вхід в адмінку відбувається через
// admin/pages/Login.tsx (роут "/login"), який дійсно викликає authApi.
// SignInForm нижче — статичний макет без onSubmit, він нічого не
// відправляє на бекенд. Якщо плануєте замінити Login.tsx цим дизайном,
// перенесіть логіку з Login.tsx (react-hook-form + authApi.login) сюди.
export default function SignIn() {
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
