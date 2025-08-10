interface InfoCardProps {
    title: string;
    value: string | number;
    change?: string;
    icon?: JSX.Element;
    color?: string;
  }
  
  const InfoCard = ({ title, value, change, icon, color = 'bg-blue-500' }: InfoCardProps) => {
    return (
      <div className={`p-5 rounded-xl text-white shadow ${color}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {change && <p className="text-xs opacity-70">{change}</p>}
          </div>
          {icon && <div className="text-4xl">{icon}</div>}
        </div>
      </div>
    );
  };
  
  export default InfoCard;
  