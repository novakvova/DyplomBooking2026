import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#385b75] text-white px-10 py-16">

      <div className="mx-auto max-w-6xl grid grid-cols-1 gap-10 md:grid-cols-4">

        {/* Загальна інформація */}
        <div>
          <h3 className="mb-5 font-bold text-lg">
            Загальна інформація
          </h3>

          <ul className="space-y-3 text-sm text-white/90">
            <li><Link to="/" className="hover:text-white transition">Про WayGo.com</Link></li>
            <li><Link to="/" className="hover:text-white transition">Як ми працюємо</Link></li>
            <li><Link to="/" className="hover:text-white transition">Ековідповідальність</Link></li>
            <li><Link to="/" className="hover:text-white transition">Вакансії</Link></li>
            <li><Link to="/" className="hover:text-white transition">Для інвесторів</Link></li>
            <li><Link to="/" className="hover:text-white transition">Корпоративні контакти</Link></li>
            <li><Link to="/" className="hover:text-white transition">Рекомендації та скарги щодо вмісту</Link></li>
          </ul>
        </div>


        {/* Правила */}
        <div>
          <h3 className="mb-5 font-bold text-lg">
            Правила та налаштування
          </h3>

          <ul className="space-y-3 text-sm text-white/90">
            <li><Link to="/" className="hover:text-white transition">Положення про конфіденційність</Link></li>
            <li><Link to="/" className="hover:text-white transition">Умови надання послуг</Link></li>
            <li><Link to="/" className="hover:text-white transition">Положення про доступність</Link></li>
            <li><Link to="/" className="hover:text-white transition">Розв'язання суперечок</Link></li>
            <li><Link to="/" className="hover:text-white transition">Заява про протидію сучасному рабству</Link></li>
            <li><Link to="/" className="hover:text-white transition">Заява про права людини</Link></li>
          </ul>
        </div>


        {/* Різне */}
        <div>
          <h3 className="mb-5 font-bold text-lg">
            Різне
          </h3>

          <ul className="space-y-3 text-sm text-white/90">
            <li><Link to="/" className="hover:text-white transition">Оренда автомобілів</Link></li>
            <li><Link to="/" className="hover:text-white transition">Програма лояльності</Link></li>
            <li><Link to="/" className="hover:text-white transition">Готелі</Link></li>
            <li><Link to="/" className="hover:text-white transition">Програма лояльності</Link></li>
            <li><Link to="/" className="hover:text-white transition">Сезонні святкові пропозиції</Link></li>
          </ul>
        </div>


        {/* Підтримка */}
        <div>
          <h3 className="mb-5 font-bold text-lg">
            Підтримка
          </h3>

          <ul className="space-y-3 text-sm text-white/90">
            <li><Link to="/" className="hover:text-white transition">Керуйте своїми подорожами</Link></li>
            <li><Link to="/" className="hover:text-white transition">Зв'язатися зі Службою підтримки</Link></li>
            <li><Link to="/" className="hover:text-white transition">Центр ресурсів з безпеки</Link></li>
          </ul>

          {/* Social icons */}
          <div className="mt-8 flex gap-5">
            <img src="/public/images/fb-logo.svg" alt="Facebook" className="h-6 w-6 cursor-pointer transition hover:opacity-80 lazyloaded"/>
            <img src="/public/images/instagram-logo.svg" alt="Instagram" className="h-6 w-6 cursor-pointer transition hover:opacity-80 lazyloaded"/>
          </div>
        </div>

      </div>


      {/* Bottom */}
      <div className="mx-auto mt-14 max-w-5xl border-t border-white/80 pt-6 text-center text-xs text-white/90">

        <p>
          Всі матеріали тут © 2005–2026 WayGo Company Pte. Ltd.
          Усі права захищені.
        </p>

        <p>
          WayGo є частиною Booking Holdings Inc.,
          світового лідера у сфері онлайн-подорожей та пов'язаних послуг.
        </p>
      </div>
    </footer>
  );
};

export default Footer;