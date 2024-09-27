import Link from 'next/link';
import Image from 'next/image';

const Logo = () => (
    <div className='flex items-center'>
        <Image
            src='/images/search-svgrepo-com.svg'
            alt='Logo'
            width={32}
            height={32}
            className='h-8 mr-2'
        />
        <Link href='/' className='text-ct-dark-600 text-2xl font-semibold'>
            Nest Finder
        </Link>
    </div>
);

export default Logo;
