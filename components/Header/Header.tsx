import { auth, signOut } from '@/auth';
import Link from 'next/link';
import Logo from "@/components/Header/Logo";

const Header = async () => {
  const session = await auth();
  const user = session?.user;

  const logoutAction = async () => {
    'use server';
    await signOut();
  };

  return (
      <header className='bg-white h-24'>
        <nav className='h-full flex flex-col justify-between container mx-auto px-4'>
          <div className='flex justify-between items-center'>
            <Logo/>

            {/* Иконки и кнопки справа */}
            <div className='flex items-center space-x-4 mt-2'>
              {user ? (
                  <form action={logoutAction} className='flex items-center '>
                    <Link href='/profile' className='bg-blue-500 text-white px-1.5 py-1.5 rounded-lg'>
                      Профиль
                    </Link>
                    <button
                        type='submit'
                        className='bg-red-500 text-white px-1.5 py-1.5 rounded-lg'>
                      Выйти
                    </button>
                  </form>
              ) : (
                  <>
                    <Link href='/post-ad' className='bg-blue-500 text-white px-1.5 py-1.5 rounded-lg'>
                      + Подать объявление
                    </Link>
                    <Link href='/login' className='bg-gray-100 text-blue-500 px-1.5 py-1.5 rounded-lg'>
                      Войти
                    </Link>
                  </>
              )}
            </div>
          </div>

          {/* Нижняя часть с ссылками */}
          <ul className='flex items-center space-x-8 mx-auto pb-2'>
            <li>
              <Link
                  href='/rent'
                  className='relative text-ct-dark-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition hover:underline-button'>
                Аренда
              </Link>
            </li>
            <li>
              <Link
                  href='/sale'
                  className='relative text-ct-dark-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition hover:underline-button'>
                Продажа
              </Link>
            </li>
            <li>
              <Link
                  href='/new-buildings'
                  className='relative text-ct-dark-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition hover:underline-button'>
                Новостройки
              </Link>
            </li>
            <li>
              <Link
                  href='/construction'
                  className='relative text-ct-dark-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition hover:underline-button'>
                Строительство
              </Link>
            </li>
            <li>
              <Link
                  href='/commercial'
                  className='relative text-ct-dark-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition hover:underline-button'>
                Коммерческая
              </Link>
            </li>
          </ul>


        </nav>
      </header>
  );
};

export default Header;
