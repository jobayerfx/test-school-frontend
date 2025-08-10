'use client';

const Header = () => {
  return (
    <header className="bg-gray-800 shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-white">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-300">Admin</span>
        <img
          src="/avatar.png"
          alt="User Avatar"
          className="w-8 h-8 rounded-full border"
        />
      </div>
    </header>
  );
};

export default Header;
