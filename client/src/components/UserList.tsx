import { FiUsers } from "react-icons/fi";

type User = {
  id: number;
  name: string;
  color: string;
};

type UserListProps = {
  users: User[];
  currentUsername: string;
};

export default function UserList({ users, currentUsername }: UserListProps) {
  return (
    <div className="bg-slate-900/30 border-b border-slate-700/50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <FiUsers className="text-purple-400" size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Online Users
            </h3>
            <p className="text-xs text-slate-500">
              {users.length} {users.length === 1 ? 'user' : 'users'}
            </p>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="max-h-48 overflow-y-auto p-3">
        {users.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-slate-500 text-sm">No users online</p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => {
              const isCurrentUser = user.name === currentUsername;
              
              return (
                <div
                  key={user.id}
                  className={`
                    group flex items-center gap-3 px-3 py-2 rounded-lg
                    transition-all duration-200
                    ${isCurrentUser 
                      ? 'bg-purple-500/10 border border-purple-500/30' 
                      : 'bg-slate-800/40 hover:bg-slate-800/60 border border-transparent'
                    }
                  `}
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-3 h-3 rounded-full ring-2 ring-slate-900"
                      style={{ backgroundColor: user.color }}
                    />
                    <div
                      className="absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-20"
                      style={{ backgroundColor: user.color }}
                    />
                  </div>

                  <span className={`text-sm truncate flex-1 ${
                    isCurrentUser ? 'text-purple-300 font-medium' : 'text-slate-300'
                  }`}>
                    {user.name}
                  </span>

                  {isCurrentUser && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded font-medium">
                      YOU
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}