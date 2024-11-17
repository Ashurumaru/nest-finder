import Link from 'next/link';
import Image from 'next/image';

const Logo = () => (
    <div className='flex items-center'>
        <Image
            src='/images/search-svgrepo-com.svg'
            alt='Nest Finder Logo'
            width={32}
            height={32}
            className='h-8 mr-2'
        />

        <Link href='/' className='text-ct-dark-600 text-2xl font-semibold hover:text-blue-600 transition-all ease-in-out duration-300'>
            Nest Finder
        </Link>
    </div>
);

export default Logo;
