import Link from 'next/link';

const Logo = () => (
    <div className='flex items-center'>
        <img src='/images/search-svgrepo-com.svg' alt='Logo' className='h-8 mr-2' />
        <Link href='/' className='text-ct-dark-600 text-2xl font-semibold'>
            Nest Finder
        </Link>
    </div>
);

export default Logo;
