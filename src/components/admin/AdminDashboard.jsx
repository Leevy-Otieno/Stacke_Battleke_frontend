// src/components/admin/AdminStatsCard.jsx
const AdminStatsCard = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
          {icon}
        </div>
      </div>
      {trend && (
        <p className="text-sm mt-4 text-green-600 font-medium">
          {trend}
        </p>
      )}
    </div>
  );
};

export default AdminStatsCard;