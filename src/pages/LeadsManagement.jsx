import { useNavigate, useSearchParams } from 'react-router-dom';
import { Landmark, Store } from 'lucide-react';

export default function LeadsManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <div className='w-full font-sans'>
      <div className='flex flex-col gap-8 items-center justify-center min-h-[70vh]'>
        <div className='text-center'>
          <h1 className='text-3xl font-black text-[#2B4282] mb-2'>Select Lead System</h1>
          <p className='text-gray-500 font-medium'>Choose a source to manage your leads</p>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl'>
          {/* Branch Card */}
          <div 
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.delete('source');
              navigate('/leads/branch?' + params.toString());
            }}
            className='bg-white border-2 border-transparent hover:border-[#2B4282] rounded-2xl p-8 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col items-center justify-center text-center group'
          >
            <div className='relative w-20 h-20 mb-6 group-hover:scale-105 transition-transform duration-300 mx-auto'>
              <div className='absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-70'></div>
              <div className='absolute inset-0 bg-gradient-to-br from-[#2B4282] to-[#4562B9] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-0 transition-all duration-300 border border-white/20'>
                <Landmark className='w-10 h-10 text-white' strokeWidth={1.5} />
              </div>
              <div className='absolute -bottom-3 -right-3 bg-gradient-to-br from-[#FBBF24] to-[#D97706] w-10 h-10 rounded-full border-[3px] border-white shadow-md flex items-center justify-center transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300 z-10'>
                <span className='text-white font-bold text-[17px] leading-none tracking-tighter'>₹</span>
              </div>
            </div>
            <h2 className='text-2xl font-bold text-gray-800 mb-1'>Branch</h2>
            <p className='text-sm text-gray-500 font-medium mb-2'>Manage leads provided directly by the bank</p>
          </div>

          {/* Merchant Card */}
          <div 
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.delete('source');
              navigate('/leads/merchant?' + params.toString());
            }}
            className='bg-white border-2 border-transparent hover:border-purple-600 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col items-center justify-center text-center group'
          >
            <div className='relative w-20 h-20 mb-6 group-hover:scale-105 transition-transform duration-300 mx-auto'>
              <div className='absolute inset-0 bg-purple-100 rounded-full blur-xl opacity-70'></div>
              <div className='absolute inset-0 bg-gradient-to-br from-[#9333EA] to-[#6B21A8] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-0 transition-all duration-300 border border-white/20'>
                <Store className='w-10 h-10 text-white' strokeWidth={1.5} />
              </div>
              <div className='absolute -bottom-3 -right-3 bg-gradient-to-br from-[#10B981] to-[#047857] w-10 h-10 rounded-full border-[3px] border-white shadow-md flex items-center justify-center transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300 z-10'>
                <span className='text-white font-bold text-[17px] leading-none tracking-tighter'>₹</span>
              </div>
            </div>
            <h2 className='text-2xl font-bold text-gray-800 mb-1'>Merchant</h2>
            <p className='text-sm text-gray-500 font-medium mb-2'>Manage local leads created by you personally</p>
          </div>
        </div>
      </div>
    </div>
  );
}

