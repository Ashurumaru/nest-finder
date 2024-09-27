import { auth, signOut } from '@/auth';
import Link from 'next/link';
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const Header = async () => {
  const session = await auth();
  const user = session?.user;

  const logoutAction = async () => {
    'use server';
    await signOut();
  };

  return (
      <header className='bg-white h-24 border-b border-gray-200'>
        <nav className='h-full flex flex-col justify-between container mx-auto px-4'>
          <div className='flex justify-between items-center'>
            <Logo />

            <div className='flex items-center space-x-4 mt-2'>
              {user ? (
                  <form action={logoutAction} className='flex items-center'>
                    <Link href='/profile'>
                      <Button variant='primary'>
                        Профиль
                      </Button>
                    </Link>
                    <Button
                        type='submit'
                        variant='danger'>
                      Выйти
                    </Button>
                  </form>
              ) : (
                  <>
                    <Link href='/post-ad'>
                      <Button variant='primary'>
                        + Подать объявление
                      </Button>
                    </Link>
                    <Link href='/login'>
                      <Button variant='secondary'>
                        Войти
                      </Button>
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
                  className='relative text-ct-dark-600 px-4 py-2 border-b-4 border-transparent hover:border-gray-400'>
                Аренда
              </Link>
            </li>
            <li>
              <Link
                  href='/sale'
                  className='relative text-ct-dark-600 px-4 py-2 border-b-4 border-transparent hover:border-gray-400'>
                Продажа
              </Link>
            </li>
            {/*<li>*/}
            {/*  <Link*/}
            {/*      href='/new-buildings'*/}
            {/*      className='relative text-ct-dark-600 px-4 py-2 border-b-4 border-transparent hover:border-gray-400'>*/}
            {/*    Новостройки*/}
            {/*  </Link>*/}
            {/*</li>*/}
            {/*<li>*/}
            {/*  <Link*/}
            {/*      href='/commercial'*/}
            {/*      className='relative text-ct-dark-600 px-4 py-2 border-b-4 border-transparent hover:border-gray-400'>*/}
            {/*    Коммерческая*/}
            {/*  </Link>*/}
            {/*</li>*/}
          </ul>
        </nav>
      </header>
  );
};

export default Header;
