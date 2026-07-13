import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await authApi.login(data);

      const isAdmin = response.roles.includes('Admin') || response.roles.includes('Manager');
      if (!isAdmin) {
        toast.error('Доступ лише для Admin та Manager');
        return;
      }

      setAuth(response.token, {
        email: response.email,
        fullName: response.fullName,
        roles: response.roles,
      });

      toast.success(`Ласкаво просимо, ${response.fullName ?? response.email}!`);
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data || 'Невірний email або пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-boxdark">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            🏠 DyplomBooking
          </h1>
          <p className="mt-2 text-gray-500">Адмін панель — вхід</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@booking.com"
              {...register('email', {
                required: "Email обов'язковий",
                pattern: { value: /\S+@\S+\.\S+/, message: 'Невірний формат email' },
              })}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-black outline-none focus:border-primary dark:border-strokedark dark:text-white dark:focus:border-primary"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Пароль
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password', {
                required: "Пароль обов'язковий",
                minLength: { value: 6, message: 'Мінімум 6 символів' },
              })}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-black outline-none focus:border-primary dark:border-strokedark dark:text-white dark:focus:border-primary"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-60"
          >
            {loading ? 'Вхід...' : 'Увійти'}
          </button>

          {/* Google Login */}
          <a
            href="http://localhost:5080/api/auth/google/login"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-stroke py-3 font-medium text-black transition hover:border-primary dark:border-strokedark dark:text-white"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Увійти через Google
          </a>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;
