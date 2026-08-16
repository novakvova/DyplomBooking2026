import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { profileApi, paymentsApi, PaymentStatus, PaymentStatusLabel, PaymentStatusColor } from '../api/api';
import apiClient from '../api/client';
import Footer from '../components/Footer/Footer';

type Section = 'personal' | 'security' | 'travelers' | 'payment' | 'transactions' | 'notifications' | 'privacy' | 'support' | 'complaint' | 'requests';

interface EditField {
  field: string;
  label: string;
  value: string;
  type?: string;
}

const ProfilePage = () => {
  const { isAuthenticated, _hasHydrated, user, setAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [section, setSection] = useState<Section>('personal');
  const [editField, setEditField] = useState<EditField | null>(null);
  const [editValue, setEditValue] = useState('');

  const { data: payments, isLoading: loadingPayments } = useQuery({
    queryKey: ['my-payments'],
    queryFn: paymentsApi.getMy,
    enabled: isAuthenticated && section === 'transactions',
  });

  const { data: bookings } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: profileApi.getMyBookings,
    enabled: isAuthenticated && section === 'payment',
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { fullName?: string }) => {
      const { data: updated } = await apiClient.put('/profile', data);
      return updated;
    },
    onSuccess: (updated) => {
      setAuth(localStorage.getItem('waygo_token') ?? '', {
        email: updated.email,
        fullName: updated.fullName,
        roles: updated.roles,
      });
      toast.success('Збережено');
      setEditField(null);
    },
    onError: () => toast.error('Помилка збереження'),
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      await apiClient.post('/profile/change-password', data);
    },
    onSuccess: () => { toast.success('Пароль змінено'); pwForm.reset(); },
    onError: () => toast.error('Невірний поточний пароль'),
  });

  const pwForm = useForm<{ currentPassword: string; newPassword: string; confirmPassword: string }>();

  if (!_hasHydrated) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/" replace />;

  const menuItems = [
    {
      group: 'Особисті дані та безпека',
      icon: '👤',
      items: [
        { key: 'personal', label: 'Персональні дані' },
        { key: 'security', label: 'Налаштування безпеки' },
        { key: 'travelers', label: 'Інші мандрівники' },
      ],
    },
    {
      group: 'Інформація про оплату',
      icon: '💳',
      items: [
        { key: 'payment', label: 'Способи оплати' },
        { key: 'transactions', label: 'Історія транзакцій' },
      ],
    },
    {
      group: 'Налаштування сповіщень',
      icon: '🔔',
      items: [
        { key: 'notifications', label: 'Канали зв\'язку та сповіщення' },
        { key: 'privacy', label: 'Приватність профілю' },
      ],
    },
    {
      group: 'Допомога та звернення',
      icon: '📞',
      items: [
        { key: 'support', label: 'Центр підтримки 24/7' },
        { key: 'complaint', label: 'Написати звернення / заяву' },
        { key: 'requests', label: 'Мої запити та скарги' },
      ],
    },
  ];

  const personalFields = [
    { field: 'fullName', label: "Ім'я та прізвище", value: user?.fullName ?? '', type: 'text' },
    { field: 'email', label: 'Електронна пошта', value: user?.email ?? '', type: 'email' },
    { field: 'phone', label: 'Номер телефону', value: '', type: 'tel' },
    { field: 'birthday', label: 'Дата народження', value: '', type: 'date' },
    { field: 'citizenship', label: 'Громадянство', value: '', type: 'text' },
    { field: 'address', label: 'Адреса проживання', value: '', type: 'text' },
  ];

  const handleEdit = (f: typeof personalFields[0]) => {
    setEditField(f);
    setEditValue(f.value);
  };

  const handleSave = () => {
    if (!editField) return;
    if (editField.field === 'fullName') {
      updateMutation.mutate({ fullName: editValue });
    } else {
      toast('Це поле поки не підтримується API', { icon: 'ℹ️' });
      setEditField(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-8 text-2xl font-bold text-slate-900">Мій акаунт</h1>

        <div className="flex gap-10">

          {/* ── Ліва панель ── */}
          <aside className="w-72 shrink-0">
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-300 text-xl font-bold text-white">
                {user?.fullName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="truncate font-semibold text-slate-800">{user?.fullName ?? 'Користувач'}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((group) => (
                <div key={group.group} className="overflow-hidden rounded-2xl border border-slate-200">
                  {/* Group header */}
                  <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-700">{group.group}</span>
                    <span>{group.icon}</span>
                  </div>
                  {/* Group items */}
                  {group.items.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setSection(item.key as Section)}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition ${
                        section === item.key
                          ? 'bg-slate-100 font-medium text-slate-900'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}

              {/* Logout */}
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="mt-2 w-full rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                Вийти з акаунту
              </button>
            </nav>
          </aside>

          {/* ── Головна частина ── */}
          <main className="flex-1">

            {/* ── Персональні дані ── */}
            {section === 'personal' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900">Персональні дані</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Керуйте вашою особистою інформацією, контактами та статусом підтвердження профілю.
                </p>

                {/* Avatar + verification */}
                <div className="mt-6 flex items-start gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-slate-300 text-4xl font-bold text-white">
                      {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <button className="text-xs font-medium text-slate-600 underline hover:text-slate-900">
                      Змінити
                    </button>
                  </div>
                  <div className="flex flex-1 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
                    <span className="font-medium text-slate-800">Верифікація особи</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-400">Не верифіковано</span>
                      <button className="rounded-lg bg-slate-800 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700">
                        Розпочати
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fields */}
                <div className="mt-8 divide-y divide-slate-100">
                  {personalFields.map((f) => (
                    <div key={f.field} className="flex items-center justify-between py-4">
                      {editField?.field === f.field ? (
                        <div className="flex flex-1 items-center gap-4">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-slate-500 mb-1">{f.label}</p>
                            <input
                              type={f.type}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              autoFocus
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleSave}
                              disabled={updateMutation.isPending}
                              className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-60"
                            >
                              Зберегти
                            </button>
                            <button
                              onClick={() => setEditField(null)}
                              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            >
                              Скасувати
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700">{f.label}</p>
                            {f.value ? (
                              <p className="mt-0.5 text-sm text-slate-500">{f.value}</p>
                            ) : (
                              <p className="mt-0.5 text-sm italic text-slate-300">{f.label}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleEdit(f)}
                            className="text-sm font-medium text-slate-600 underline hover:text-slate-900"
                          >
                            Редагувати
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Безпека ── */}
            {section === 'security' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900">Налаштування безпеки</h2>
                <p className="mt-1 text-sm text-slate-500">Змінити пароль або налаштування входу</p>

                <div className="mt-8 max-w-md rounded-2xl border border-slate-200 p-6">
                  <h3 className="mb-4 font-semibold text-slate-800">Змінити пароль</h3>
                  <form
                    onSubmit={pwForm.handleSubmit((data) => {
                      if (data.newPassword !== data.confirmPassword) {
                        toast.error('Паролі не співпадають');
                        return;
                      }
                      changePasswordMutation.mutate(data);
                    })}
                    className="space-y-4"
                  >
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Поточний пароль</label>
                      <input type="password" {...pwForm.register('currentPassword', { required: true })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Новий пароль</label>
                      <input type="password" {...pwForm.register('newPassword', { required: true, minLength: 6 })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Підтвердіть пароль</label>
                      <input type="password" {...pwForm.register('confirmPassword', { required: true })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                    </div>
                    <button type="submit" disabled={changePasswordMutation.isPending}
                      className="w-full rounded-xl bg-slate-800 py-3 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60">
                      {changePasswordMutation.isPending ? 'Збереження...' : 'Змінити пароль'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ── Транзакції ── */}
            {section === 'transactions' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900">Історія транзакцій</h2>
                <p className="mt-1 mb-6 text-sm text-slate-500">Всі ваші платежі та повернення коштів</p>

                {loadingPayments && (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />)}
                  </div>
                )}

                {payments?.length === 0 && (
                  <div className="rounded-2xl bg-slate-50 p-12 text-center text-slate-400">💳 Транзакцій ще немає</div>
                )}

                {payments && payments.length > 0 && (
                  <div className="divide-y divide-slate-100">
                    {payments.map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between py-4">
                        <div>
                          <p className="font-mono text-sm font-medium text-slate-800">{p.transactionId}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {new Date(p.createdAt).toLocaleDateString('uk', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${PaymentStatusColor[p.status as PaymentStatus]}`}>
                            {PaymentStatusLabel[p.status as PaymentStatus]}
                          </span>
                          <span className="font-bold text-slate-800">{p.amount?.toLocaleString()} ₴</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Бронювання ── */}
            {section === 'payment' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900">Мої бронювання</h2>
                <p className="mt-1 mb-6 text-sm text-slate-500">Всі ваші активні та минулі бронювання</p>

                {bookings?.length === 0 && (
                  <div className="rounded-2xl bg-slate-50 p-12 text-center text-slate-400">🏠 Бронювань ще немає</div>
                )}

                {bookings && bookings.length > 0 && (
                  <div className="divide-y divide-slate-100">
                    {bookings.map((b: any) => (
                      <div key={b.id} className="flex items-start justify-between py-4">
                        <div>
                          <p className="font-semibold text-slate-800">{b.housingTitle}</p>
                          <p className="text-sm text-slate-500 mt-0.5">
                            📅 {new Date(b.checkIn).toLocaleDateString('uk')} → {new Date(b.checkOut).toLocaleDateString('uk')}
                          </p>
                          <p className="text-sm text-slate-500">👥 {b.guestsCount} гостей</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                            b.status === 1 ? 'bg-green-100 text-green-700' :
                            b.status === 2 ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {b.status === 0 ? 'Очікує' : b.status === 1 ? 'Підтверджено' : b.status === 2 ? 'Скасовано' : 'Завершено'}
                          </span>
                          <p className="mt-1 font-bold text-slate-800">{b.totalPrice?.toLocaleString()} ₴</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Заглушки для інших секцій ── */}
            {['travelers', 'notifications', 'privacy', 'support', 'complaint', 'requests'].includes(section) && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="text-6xl mb-4">🚧</div>
                <p className="text-lg font-medium">Розділ у розробці</p>
                <p className="text-sm mt-1">Цей функціонал буде доступний незабаром</p>
              </div>
            )}

          </main>
        </div>
      </div>
      <Footer />   
    </div>
  );

};

export default ProfilePage;
